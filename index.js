const fs = require('fs');
const os = require('os');
const path = require('path');
const packageData = require('./package.json');

const FileTransport = function(options) {
  this.options = options || {};
  this.dir = options.dir || os.homedir();
  this.ext = options.ext || null;
  this.useSubject = options.useSubject || false;
  this.name = 'File';
  this.version = packageData.version;
};

FileTransport.prototype.send = function(mail, cb) {
  var fname = mail.data.to;

  if (this.useSubject) {
    fname = `${fname} - ${mail.data.subject}`;
  }

  if (this.ext) {
    fname = `${fname}.${this.ext}`;
  }

  fs.writeFileSync(path.join(this.dir, fname), mail.data.html);
  return cb();
};

module.exports = function(options) {
  return new FileTransport(options);
};
