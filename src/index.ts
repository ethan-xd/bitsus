import { Blockchain, Transaction } from './blockchain';
const ECLib = require('elliptic').ec;
const ec = new ECLib('secp256k1');
import { pkToWallet, walletToPk } from './func/convertBase';

let blockchain = new Blockchain(45, 100);

//let key0 = ec.genKeyPair();
let key0 = ec.keyFromPrivate('1');
let key1 = ec.genKeyPair();
let key2 = ec.genKeyPair();
let key3 = ec.genKeyPair();

let k0w = pkToWallet(key0.getPublic('hex'));
let k1w = pkToWallet(key1.getPublic('hex'));
let k2w = pkToWallet(key2.getPublic('hex'));
let k3w = pkToWallet(key3.getPublic('hex'));

let transfers = [
    new Transaction(20, k0w, k1w),
    //new Transaction(200, "jeff", "dave"), // invalid transfer because no balance. will invalidate block.
];

let block = blockchain.addBlock(k0w, transfers);

console.log("Mining...");
block.mine(blockchain.difficulty);

console.log("heckin valid? ", blockchain.verifyBlockchain());

console.log(`${k0w}: ${blockchain.getWalletBalance(k0w)}`);
console.log(`${k1w}: ${blockchain.getWalletBalance(k1w)}`);
console.log(`${k2w}: ${blockchain.getWalletBalance(k2w)}`);
console.log(`${k3w}: ${blockchain.getWalletBalance(k3w)}`);


/***************************************************************/


let jeffTransfers = [
    new Transaction(20, k0w, k1w),
    new Transaction(50, k2w, k3w),
    new Transaction(40, k2w, k0w),
    new Transaction(10, k2w, k1w)
];

let jeffBlock = blockchain.addBlock(k2w, jeffTransfers);

console.log("key2 is Mining...");
jeffBlock.mine(blockchain.difficulty);

console.log("heckin valid? ", blockchain.verifyBlockchain());

console.log(`${k0w}: ${blockchain.getWalletBalance(k0w)}`);
console.log(`${k1w}: ${blockchain.getWalletBalance(k1w)}`);
console.log(`${k2w}: ${blockchain.getWalletBalance(k2w)}`);
console.log(`${k3w}: ${blockchain.getWalletBalance(k3w)}`);