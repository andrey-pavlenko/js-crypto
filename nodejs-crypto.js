const { encryptAesCbc, decryptAesCbc } = require('./nodejs-aes-cbc-256');

console.info(encryptAesCbc('123', 'resolve'));
console.info(decryptAesCbc(encryptAesCbc('123', 'resolve'), 'resolve'));

console.info(
  decryptAesCbc(
    'Opedg4gMvO1Qng5kijFXZA7NqCoNYN53qoQxyoNoL0YqAKtGt250V25Zv6s94/ZJ39SFt6inSQmq3G9Zkjas4Q==',
    'resolve'
  )
);
