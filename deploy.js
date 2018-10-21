const Client = require("ssh2-sftp-client");
const fs = require("fs");
const path = require("path");

// Get command line arguments by name. Supported arguments:
// host, user, pass, path, dist, verbose
const args = process.argv.slice(2).reduce((accumulatedArguments, arg) => {
    const split = arg.split("=");
    accumulatedArguments[split[0]] = split[1];
    return accumulatedArguments;
}, {});
const host = args.host;
const user = args.user;
const password = args.pass;
const remoteDirectory = args.path;
const localDirectory = args.dist || "dist";
const verbose = !!args.verbose;

// Create the FTP client
const client = new Client();

// Recursively upload a folder's contents
async function uploadContents(client, folderToUpload, uploadTo) {
    // Get the items in the current local directory
    if (verbose) {
        console.log(`Reading contents of local directory: ${folderToUpload}`);
    }
    const items = fs.readdirSync(folderToUpload);

    // Get the items in the remote directory
    if (verbose) {
        console.log(`Reading contents of remote directory: ${uploadTo}`);
    }
    const remoteList = await client.list(uploadTo);

    const uploadPromises = items.map(async item => {
        if (verbose) {
            console.log(`Reading details of remote file ${item}`);
        }
        const remoteItem = remoteList.find(
            remoteItem => remoteItem.name === item
        );
        const remotePath = `${uploadTo}/${item}`;
        const localPath = path.join(folderToUpload, item);

        if (verbose) {
            console.log(`Reading stats of local item ${localPath}`);
        }
        const localItemStats = fs.lstatSync(localPath);
        const isDirectory = localItemStats.isDirectory();

        if (isDirectory) {
            const directoryExists = !!remoteItem;
            if (!directoryExists) {
                console.log(`Creating directory ${item}`);
                await client.mkdir(remotePath);
            }
            return uploadContents(client, localPath, remotePath);
        }

        const remoteItemSize = remoteItem ? remoteItem.size : 0;
        const localItemSize = localItemStats.size;
        if (remoteItemSize === localItemSize) {
            console.log(`No changes made to ${localPath}. Skipping upload.`);
            return new Promise(resolve => resolve());
        }

        console.log(`Uploading ${localPath} ...`);
        return client.put(localPath, remotePath).then(() => {
            console.log(`Uploaded ${localPath}.`);
            return new Promise(resolve => resolve());
        });
    });
    return Promise.all(uploadPromises);
}

client
    .connect({
        host,
        port: "2222",
        username: user,
        password
    })
    .then(async data => {
        console.log("Connected to SFTP.");
        await uploadContents(client, localDirectory, remoteDirectory);
        return client.end();
    })
    .catch(error => {
        console.error("An error occurred.", error);
        client.end();
        process.exit(1);
    });
