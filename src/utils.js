import crypto from 'crypto'

function s4 () {
  return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1)
}

export function generateGuid () {
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4()
}

export const guid = generateGuid()
export const deviceId = 'android-' + guid

export function generateSignature (text) {
  return crypto.createHmac('sha256', 'b4a23f5e39b5929e0666ac5de94c89d1618a2916').update(text).digest('hex')
}
