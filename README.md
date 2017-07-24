# nodemailer-file-transport
[![Build Status](https://travis-ci.org/CDA0/nodemailer-file-transport.png)](https://travis-ci.org/CDA0/nodemailer-file-transport)
A file transport for nodemailer

```js
const transport = fileTransport({
  dir: './emails',
  ext: 'html',
  useSubject: true
});

const transporter = nodemailer.createTransport(transport);
```