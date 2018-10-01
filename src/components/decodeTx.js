const binary = require('ripple-binary-codec')
const signedTX = ''
var decoded = (binary.decode(signedTX))
console.log(decoded)
if (decoded.Memos) {
  console.log(decoded.Memos)
}
