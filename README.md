# AES шифрование

Зашифровать на стороне сервера с помощью средств javax и расшифровать на стороне клиента получилось с помощью [window.crypto](https://developer.mozilla.org/ru/docs/Web/API/Window/crypto).

[Демо](https://andrey-pavlenko.github.io/js-crypto/)

В демо используется AES-CBC-256.

Для шифрования и расшифровки нужен ключ и [IV вектор иницализации](https://ru.wikipedia.org/wiki/%D0%A0%D0%B5%D0%B6%D0%B8%D0%BC_%D1%88%D0%B8%D1%84%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D1%8F#Initialization_vector_(IV)).

Ключ &ndash; последовательность байт. Для AES-128 &ndash; 16 байт, для AES-256 &ndash; 32 байта.

IV &ndash; 16 байт.

Сейчас ключ получается из строки с помощью [SubtleCrypto.digest()](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest)

*Для тестирования:*  
**Browser** &ndash; шифрование/расшифровка в браузере.  
**Server** &ndash; шифрование/расшифровка в на сервере.

Код агентства &ndash; 32 символа. Это hex-строка которая состоит из 16 байт.

