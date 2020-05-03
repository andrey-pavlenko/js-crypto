const crypto = require('crypto');

function makeBuffer(string, size) {
  const buffer = Buffer.alloc(size);
  Buffer.from(string, 'utf-8').copy(buffer);
  return buffer;
}

function encryptAesCbc(string, key, iv) {
  const keyBytes = makeBuffer(key, 32);
  const ivBytes = makeBuffer(iv || '', 16);
  const cipher = crypto.createCipheriv('aes-256-cbc', keyBytes, ivBytes);

  let encrypted = cipher.update(string, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  return encrypted;
}

function decryptAesCbc(base64, key, iv) {
  const keyBytes = makeBuffer(key, 32);
  const ivBytes = makeBuffer(iv || '', 16);

  const decipher = crypto.createDecipheriv('aes-256-cbc', keyBytes, ivBytes);
  let decrypted = decipher.update(base64, 'base64');
  decrypted += decipher.final();
  return decrypted;
}

module.exports = {
  encryptAesCbc,
  decryptAesCbc
};