'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const userValidate = require('npm-user-validate');
const packageData = require('./package.json');

const FileTransport = function(options) {
  this.options = options || {};
  this.dir = this.options.dir || os.homedir();
  this.ext = this.options.ext || null;
  this.useSubject = this.options.useSubject || false;
  this.sentMail = [];
  this.name = 'File';
  this.version = packageData.version;
};

function validate (addr) {
  try {
    var err = userValidate.email(addr);
    if (err != null) return err;
  } catch (_err) {
    return new Error('Error validating address.');
  }
  return null;
}

FileTransport.prototype.createFilename = function(to, subject) {
  let fname = to;

  if (this.useSubject) {
    fname = `${fname} - ${subject}`;
  }

  if (this.ext) {
    fname = `${fname}.${this.ext}`;
  }

  return fname;
};

FileTransport.prototype.send = function(mail, cb) {
  let fname;
  let err;

  if (!mail.data.to) {
    return cb(new Error('No destination address'));
  }

  if (Array.isArray(mail.data.to)) {
    for (var i = 0; i < mail.data.to.length; i++) {
      fname = this.createFilename(mail.data.to[i], mail.data.subject);
      err = validate(fname);
      if (err) {
        return cb(err);
      }
      fs.writeFileSync(path.join(this.dir, fname), mail.data.html);
    }
  } else {
    fname = this.createFilename(mail.data.to);
    err = validate(fname);
    if (err) {
      return cb(err);
    }
    fs.writeFileSync(path.join(this.dir, fname), mail.data.html);
  }

  this.sentMail.push(mail);

  return cb();
};

module.exports = function(options) {
  return new FileTransport(options);
};
