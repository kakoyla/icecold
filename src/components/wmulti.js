const RippleCodec = require('ripple-binary-codec')
const RippleKeypairs = require('ripple-keypairs')
const RippleAPI = require('ripple-lib').RippleAPI
const api = new RippleAPI()

const Transaction = JSON.stringify({
  TransactionType: 'Payment',
  Account: 'rhHNv2pgHF6ZjncxW9wEopgRn4msDM8oxQ',
  Destination: 'rsAW8cc8EXkmogYse6zz3Z9NU2QEep5q3p',
  Amount: '1000000000',
  Fee: '1000',
  Sequence: 8
})

let s = []
s.push(api.sign(Transaction, RippleKeypairs.deriveKeypair('shE1GS3XGJAErhNF4xFVftjsC36ZR'), {
  signAs: 'rsAW8cc8EXkmogYse6zz3Z9NU2QEep5q3p'
}).signedTransaction)
s.push(api.sign(Transaction, RippleKeypairs.deriveKeypair('ssPpqpaqWkq7F7yDnS5aY16S7Qu1V'), {
  signAs: 'rwvtzZdHqQNtrLv8GAMDwqWM8m6qUHZrnf'
}).signedTransaction)

let MultiSignedTransactionBinary = api.combine(s)
let MultiSignedTransaction = RippleCodec.decode(MultiSignedTransactionBinary.signedTransaction)

console.log(MultiSignedTransactionBinary)
console.log(MultiSignedTransaction)

console.log('-'.repeat(40))

let MultiSignedTransactionBinaryFinal = api.combine([
  MultiSignedTransactionBinary.signedTransaction,
  api.sign(Transaction, RippleKeypairs.deriveKeypair('shwxKJsHuTct5EcqcLRAx7o7mPMxn'), {
    signAs: 'rKjLE3Dwynih1TD4ejKf9Psa7uz1DxwJkT'
  }).signedTransaction
])
let MultiSignedTransactionFinal = RippleCodec.decode(MultiSignedTransactionBinaryFinal.signedTransaction)

console.log(MultiSignedTransactionBinaryFinal)
console.log(MultiSignedTransactionFinal)
