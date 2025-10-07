import CryptoJS from 'crypto-js';

export const encryptData = (data, secretKey) => {
  try {
    const ciphertext = CryptoJS.AES.encrypt(data, secretKey).toString();
    return ciphertext;
  } catch (error) {
    console.error('Encryption error:', error);
    return '';
  }
};

export const decryptData = (ciphertext, secretKey) => {
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
    const plaintext = bytes.toString(CryptoJS.enc.Utf8);
    return plaintext;
  } catch (error) {
    console.error('Decryption error:', error);
    return '';
  }
};
