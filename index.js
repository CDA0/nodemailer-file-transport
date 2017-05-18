const fs = require('fs');
const os = require('os');
const path = require('path');
const packageData = require('./package.json');

const FileTransport = function(options) {
  this.options = options || {};
  this.dir = options.dir || os.homedir();
  this.name = 'File';
  this.version = packageData.version;
};

FileTransport.prototype.send = function(mail, cb) {
  fs.writeFileSync(path.join(this.dir, mail.data.to), mail.data.html);
  return cb();
};

module.exports = function(options) {
  return new FileTransport(options);
};
