const CryptoJS = require('crypto-js')
const default_key = CryptoJS.enc.Utf8.parse('001f2e3d4c5b6a79')
const default_iv = CryptoJS.enc.Utf8.parse(`001f4c5b6a792e3d`)
const default_mode = CryptoJS.mode.CBC
const default_padding = CryptoJS.pad.Pkcs7
function decrypt(word, key, iv) {
  if (!key)key = default_key
  if (!iv)iv = default_iv
  const encryptedHexStr = CryptoJS.enc.Hex.parse(word)
  const srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr)
  const decrypt = CryptoJS.AES.decrypt(srcs, key, { iv, mode: default_mode, padding: default_padding })
  const decryptedStr = decrypt.toString(CryptoJS.enc.Utf8)
  return decryptedStr.toString()
}

function encrypt(word, key, iv) {
  if (!key)key = default_key
  if (!iv)iv = default_iv
  const srcs = CryptoJS.enc.Utf8.parse(word)
  const encrypted = CryptoJS.AES.encrypt(srcs, key, { iv, mode: default_mode, padding: default_padding })
  return encrypted.ciphertext.toString()
}

export default {
  decrypt,
  encrypt
}
