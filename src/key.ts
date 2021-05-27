import { pkToWallet, walletToPk } from './func/convertBase';

const ECLib = require('elliptic').ec;
let ec = new ECLib('secp256k1');

let key = ec.genKeyPair();
let pk = key.getPublic('hex');
let sk = key.getPrivate('hex');
let wallet = String(pkToWallet(pk));

console.log("New private key:",sk);
console.log(" The public key:",pk);

console.log(" base 62 encode:",wallet);
console.log(" base 62 decode:",walletToPk(String(wallet)));

let message = "123456789";

let transactionHash = "300c5bb78a203ef5dca111ec147a66c1f3d0421dfed88fb5ea6d81224c5a52bf";

let signature = key.sign(transactionHash, 'hex');

console.log(key.verify(transactionHash, signature));