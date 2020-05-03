(async function () {

  function fromBase64(string, type = Uint8Array) {
    const binaryString = atob(string);
    const len = binaryString.length;
    const bytes = new type(len);
    for (let index = 0; index < len; index++) {
      bytes[index] = binaryString.charCodeAt(index);
    }
    return bytes;
  }

  function toBase64(array) {
    let binaryString = '';
    const len = array.length;
    for (let index = 0; index < len; index++) {
      binaryString += String.fromCharCode(array[index]);
    }
    return btoa(binaryString);
  }

  function setArrayString(array, string) {
    const encoder = new TextEncoder();
    array.set(encoder.encode(string));
    return array;
  }

  /**
   * @param {string} text 
   * @param {CryptoKey} key 
   * @param {string} iv
   * @returns {ArrayBuffer}
   */
  async function encrypt(text, key, iv) {
    const textBytes = new TextEncoder().encode(text);
    const ivBytes = new Uint8Array(16);
    if (iv) {
      setArrayString(ivBytes, iv);
    }
    const encrypted = await window.crypto.subtle.encrypt(
      {
        name: 'AES-CBC',
        iv: ivBytes,
      },
      key,
      textBytes
    );
    return new Uint8Array(encrypted);
  }

  /**
   * @param {ArrayBuffer} array 
   * @param {CryptoKey} key 
   * @param {string} iv 
   * @returns {ArrayBuffer}
   */
  async function decrypt(array, key, iv) {
    const ivBytes = new Uint8Array(16);
    if (iv) {
      setArrayString(ivBytes, iv);
    }
    const decrypted = await window.crypto.subtle.decrypt(
      {
        name: 'AES-CBC',
        iv: ivBytes,
      },
      key,
      array
    );
    return decrypted;
  }

  /**
   * @param {string} password 
   * @returns {CryptoKey}
   */
  async function makeKey(password) {
    return await window.crypto.subtle.importKey(
      'raw',
      setArrayString(new Uint8Array(32), password),
      'AES-CBC',
      true, ['encrypt', 'decrypt']
    );
  }

  // === DOM ============

  document.querySelector('#browser form.encrypt').addEventListener('submit', async function (event) {
    event.preventDefault();
    event.target.output_encrypted.value = '';
    const data = {
      text: event.target.input_text.value,
      key: event.target.input_key.value,
      iv: event.target.input_iv.value
    }
    try {
      const key = await makeKey(data.key);
      const encrypted = await encrypt(data.text, key, data.iv);
      event.target.output_encrypted.value = toBase64(encrypted);
    } catch (e) {
      logError(e);
    }
  });
  
  document.querySelector('#browser form.decrypt').addEventListener('submit', async function (event) {
    event.preventDefault();
    event.target.output_text.value = '';
    const data = {
      base64: event.target.input_encrypted.value,
      key: event.target.input_key.value,
      iv: event.target.input_iv.value,
    };
    try {
      const key = await makeKey(data.key);
      const decrypted = await decrypt(fromBase64(data.base64), key, data.iv);
      event.target.output_text.value = new TextDecoder().decode(decrypted);
    } catch (e) {
      logError(e);
    }
  });
  
  function logError(error) {
    let container = document.querySelector('.errors');
    if (container == null) {
      console.error('No container found');
      console.error(error);
      return;
    }

    let errorElement = document.createElement('div');
    errorElement.classList.add('error');
    errorElement.innerText = `${new Date()
      .toLocaleString()
      .replace(/^.*(\d{2}):(\d{2}):\d{2}/, '$1:$2')} - ${
      error.constructor.name
    }: ${error.message}`;
    container.appendChild(errorElement);
    setTimeout(() => { 
      container.removeChild(errorElement);
      errorElement = container = undefined;
    }, 20000);
  }

  /**
   * @param {encrypt | decrypt} action 
   * @param {string} input - string | base64
   * @param {string} key 
   * @param {string} iv 
   * @returns {string}
   */
  async function postToServer(action, input, key, iv) {
    const formData = new FormData();
    formData.append('action', action);
    formData.append('input', input);
    formData.append('key', key);
    formData.append('iv', iv);
    const response = await fetch('https://qui-quo.ru/test/crypt', {
      method: 'post',
      body: formData
    });
    const result = await response.text();
    if (response.status >= 400) {
      throw new Error(`Ошибка ${response.status}: ${result}`);
    }
    return result
  }

  document.querySelector('#server form.encrypt').addEventListener('submit', async function (event) {
    event.preventDefault();
    event.target.output_encrypted.value = '';
    try {
      const result = await postToServer(
        'encrypt',
        event.target.input_text.value,
        event.target.input_key.value,
        event.target.input_iv.value,
      );
      event.target.output_encrypted.value = result;
    } catch (e) {
      logError(e);
    }
  });

  document.querySelector('#server form.decrypt').addEventListener('submit', async function (event) {
    event.preventDefault();
    event.target.output_text.value = '';
    try {
      const result = await postToServer(
        'decrypt',
        event.target.input_encrypted.value,
        event.target.input_key.value,
        event.target.input_iv.value
      );
      event.target.output_text.value = result;
    } catch (e) {
      logError(e);
    }
  });

 })();