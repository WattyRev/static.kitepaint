/* eslint-disable no-console */

const Client = require("ssh2-sftp-client");
const fs = require("fs");
const path = require("path");

// Get environment variables. Supported variables:
// SFTP_HOST, SFTP_USER, SFTP_PASS, SFTP_PATH, SFTP_BUNDLE, SFTP_VERBOSE
const host = process.env.SFTP_HOST;
const user = process.env.SFTP_USER;
const password = process.env.SFTP_PASS;
const remoteDirectory = process.env.SFTP_PATH;
const localDirectory = process.env.SFTP_BUNDLE || "build";
const verbose = !!process.env.SFTP_VERBOSE;

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
    const remoteItem = remoteList.find(remoteItem => remoteItem.name === item);
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
    const shouldAlwaysUpload = !![".html"].find(
      search => localPath.indexOf(search) > -1
    );
    if (!shouldAlwaysUpload && remoteItemSize === localItemSize) {
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
  .then(async () => {
    console.log("Connected to SFTP.");
    await uploadContents(client, localDirectory, remoteDirectory);
    return client.end();
  })
  .catch(error => {
    console.error("An error occurred.", error);
    client.end();
    process.exit(1);
  });
