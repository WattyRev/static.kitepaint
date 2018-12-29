/* eslint-disable no-undef, no-console */

var connect = require("connect");
var serveStatic = require("serve-static");
// eslintdisable
connect()
  .use(serveStatic(__dirname))
  .listen(3001, function() {
    console.log("Embed server running at: http://localhost:3001");
  });
