/* global describe, it */
'use strict';

const nodemailer = require('nodemailer');
const fileTransport = require('../index');

require('chai').should();

describe('mock-transport', () => {
  it('should store configuration options so that they can be asserted against', () => {
    const transport = fileTransport({
      foo: 'bar'
    });
    transport.options.foo.should.equal('bar');
  });

  it('should only use email as filename as default', () => {
    const transport = fileTransport();
    const fname = transport.createFilename('receiver@address.com', 'hello');
    fname.should.equal('receiver@address.com');
  });

  it('should append the email subject', () => {
    const transport = fileTransport({ useSubject: true });
    const fname = transport.createFilename('receiver@address.com', 'hello');
    fname.should.equal('receiver@address.com - hello');
  });

  it('should add a file extension to the filename', () => {
    const transport = fileTransport({ ext: 'html' });
    const fname = transport.createFilename('receiver@address.com', 'hello');
    fname.should.equal('receiver@address.com.html');
  });

  it('should append the email subject and add a file extension to the filename', () => {
    const transport = fileTransport({ useSubject: true, ext: 'html' });
    const fname = transport.createFilename('receiver@address.com', 'hello');
    fname.should.equal('receiver@address.com - hello.html');
  });

  it('should store emails sent with nodemailer, so that they can be asserted against', () => {
    const transport = fileTransport({
      foo: 'bar'
    });

    const transporter = nodemailer.createTransport(transport);

    transporter.sendMail({
      from: 'sender@address.com',
      to: 'receiver@address.com',
      subject: 'hello',
      text: 'hello world!'
    });

    transport.sentMail.length.should.equal(1);
    transport.sentMail[0].data.to.should.equal('receiver@address.com');
    transport.sentMail[0].message.content.should.equal('hello world!');
  });

  it('should return an error and not send an email if there is no `to` in the mail data object', () => {
    const transport = fileTransport({
      foo: 'bar'
    });

    const transporter = nodemailer.createTransport(transport);

    transporter.sendMail({
      from: 'sender@address.com',
      subject: 'hello',
      text: 'hello world!'
    });

    transport.sentMail.length.should.equal(0);
  });

  it('should return an error and not send an email if the `to` email address is invalid', () => {
    const transport = fileTransport({
      foo: 'bar'
    });

    const transporter = nodemailer.createTransport(transport);

    transporter.sendMail({
      to: 'lolbad@email',
      from: 'sender@address.com',
      subject: 'hello',
      text: 'hello world!'
    });

    transport.sentMail.length.should.equal(0);
  });

  it('should allow "to" to be an array of addresses', () => {
    const transport = fileTransport({
      foo: 'bar'
    });
    const transporter = nodemailer.createTransport(transport);
    const to = ['receiver@address.com', 'receiver2@address.com'];
    transporter.sendMail({
      from: 'sender@address.com',
      to: to,
      subject: 'hello',
      text: 'hello world!'
    });
    transport.sentMail.length.should.equal(1);
    transport.sentMail[0].data.to.should.eql(to);
    transport.sentMail[0].message.content.should.equal('hello world!');
  });

  it('should not send an email if "to" is array and element isn\'t valid', () => {
    const transport = fileTransport({
      foo: 'bar'
    });
    const transporter = nodemailer.createTransport(transport);
    const to = ['receiver@address.com', 34];
    transporter.sendMail({
      from: 'sender@address.com',
      to: to,
      subject: 'hello',
      text: 'hello world!'
    });
    transport.sentMail.length.should.equal(0);
  });
});