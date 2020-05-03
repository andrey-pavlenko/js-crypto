# AES шифрование

Зашифровать на стороне сервера с помощью средств javax и расшифровать на стороне клиента получилось с помощью [window.crypto](https://developer.mozilla.org/ru/docs/Web/API/Window/crypto).

[Демо](https://andrey-pavlenko.github.io/js-crypto/)

В демо используется AES-CBC-256.

Для шифрования и расшифровки нужен ключ и [IV вектор иницализации](https://ru.wikipedia.org/wiki/%D0%A0%D0%B5%D0%B6%D0%B8%D0%BC_%D1%88%D0%B8%D1%84%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D1%8F#Initialization_vector_(IV)).

Ключ &ndash; последовательность байт. Для AES-128 &ndash; 16 байт, для AES-256 &ndash; 32 байта.

IV &ndash; 16 байт.

В демо ключ и IV генерируются путем наложения на пустой массив байт цифровых значений введенных символов.

Наложение слова &laquo;password&raquo; на массив заполненный нулями:

| 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 |10 |11 |12 |13 |14 |15 | 
|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
|p  |a  |s  | s | w | o | r | d |00 |00 |00 |00 |00 |00 |00 |00 |
|112|97 |115|115|119|111|114|100|00 |00 |00 |00 |00 |00 |00 |00 |


Код агентства &ndash; 32 символа. Это hex-строка которая состоит из 16 байт.

Файл [nodejs-crypto.js](https://github.com/andrey-pavlenko/js-crypto/blob/master/nodejs-crypto.js) &ndash; расшифровка в среде Node.js.

Online-расшифровщики тоже расшифровывают, только нужен ключ из 32 байт (символов) и чтобы зашифрованный текст можно было ввести в base64. Например:   
https://www.devglan.com/online-tools/aes-encryption-decryption  
https://encode-decode.com/aes256-encrypt-online/

[CryptoJS](https://cryptojs.gitbook.io/docs/#ciphers) использует passphrase как ключ. Эту passphrase он превращает в 32-байтный ключ с помощью какого-то hash алгоритма.

