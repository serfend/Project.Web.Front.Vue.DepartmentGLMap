import JsEncrypt from 'jsencrypt'
const prefix = '-----BEGIN PUBLIC KEY-----'
const append = '-----END PUBLIC KEY-----'
let key
let rsaDate = new Date()

async function getKey () {
  if (key && new Date() - rsaDate < 600 * 1000) return key
  const data = {
    model: `-----BEGIN PUBLIC KEY-----
MDwwDQYJKoZIhvcNAQEBBQADKwAwKAIhAMAzLFxkrkcYL2wch21CM2kQVFpY9+7+
/AvKr1rzQczdAgMBAAE=
-----END PUBLIC KEY-----`
  }
  key = data.model
  rsaDate = new Date()
  return key
}

async function encrypt (raw, method = 'encrypt') {
  debugger
  await getKey()
  const jse = new JsEncrypt()
  jse.setPublicKey(`${prefix}${key}${append}`)
  const password = jse[method](raw)
  return password
}

export default {
  encrypt
}
