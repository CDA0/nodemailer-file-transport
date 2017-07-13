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

FileTransport.prototype.createAttachmentFilename = function(to, subject, attachmentName) {
  let fname = to;

  if (this.useSubject) {
    fname = `${fname} - ${subject}`;
  }

  fname = `${fname} - ${attachmentName}`;

  return fname;
};

FileTransport.prototype.saveEmailToFile = function(to, subject, html, attachments) {
  const fname = this.createFilename(to, subject);
  const err = validate(fname);

  if (err) {
    return err;
  }

  fs.writeFileSync(path.join(this.dir, fname), html);

  if (attachments && attachments.length) {
    attachments.forEach(a => {
      const aFname = this.createAttachmentFilename(to, subject, a.filename);
      fs.writeFileSync(path.join(this.dir, aFname), a.content);
    });
  }

  return;
};

FileTransport.prototype.send = function(mail, cb) {
  let err;
  const data = mail.data;

  if (!data.to) {
    return cb(new Error('No destination address'));
  }

  if (Array.isArray(data.to)) {
    for (let i = 0; i < data.to.length; i++) {
      err = this.saveEmailToFile(data.to[i], data.subject, data.html, data.attachments);
      if (err) break;
    }
  } else {
    err = this.saveEmailToFile(data.to, data.subject, data.html, data.attachments);
  }

  if (err) {
    return cb(err);
  }

  this.sentMail.push(mail);

  return cb();
};

module.exports = function(options) {
  return new FileTransport(options);
};
