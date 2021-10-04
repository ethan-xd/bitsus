import { Blockchain, Transaction } from './blockchain';
import { ec } from "elliptic";
import { pkToWallet, walletToPk } from './func/convertBase';

const secp = new ec('secp256k1');

let blockchain = new Blockchain(45, 100);



let key0 = secp.keyFromPrivate('1');
let key1 = secp.genKeyPair();
let key2 = secp.genKeyPair();
let key3 = secp.genKeyPair();

let k0w = pkToWallet(key0.getPublic('hex'));
let k1w = pkToWallet(key1.getPublic('hex'));
let k2w = pkToWallet(key2.getPublic('hex'));
let k3w = pkToWallet(key3.getPublic('hex'));



console.log("PRVKEY: 1");
console.log("PUBKEY:", key0.getPublic('hex'));
console.log("WALLET:", pkToWallet(key0.getPublic('hex')));

let myTransaction = new Transaction(20, k0w, k1w);
myTransaction.signTransaction(key0.getPrivate('hex'));

console.log("myTransaction, signature valid and cute?", myTransaction.verifySignature());



let block = blockchain.addBlock(k0w, [myTransaction]);

console.log("Mining block 1...");
block.mine(blockchain.difficulty);

console.log("block heckin valid and cute?", blockchain.verifyBlockchain());

console.log(`${k0w}: ${blockchain.getWalletBalance(k0w)}`);
console.log(`${k1w}: ${blockchain.getWalletBalance(k1w)}`);
console.log(`${k2w}: ${blockchain.getWalletBalance(k2w)}`);
console.log(`${k3w}: ${blockchain.getWalletBalance(k3w)}`);


/***************************************************************/


let transactions = [
    new Transaction(20, k0w, k1w),
    new Transaction(40, k1w, k3w)
];

transactions[0].signTransaction(key0.getPrivate('hex'));
transactions[1].signTransaction(key1.getPrivate('hex'));


let jeffBlock = blockchain.addBlock(k2w, transactions);

console.log("Mining block 2...");
jeffBlock.mine(blockchain.difficulty);

console.log("block heckin valid and cute?", blockchain.verifyBlockchain());

console.log(`${k0w}: ${blockchain.getWalletBalance(k0w)}`);
console.log(`${k1w}: ${blockchain.getWalletBalance(k1w)}`);
console.log(`${k2w}: ${blockchain.getWalletBalance(k2w)}`);
console.log(`${k3w}: ${blockchain.getWalletBalance(k3w)}`);

// Duplicate previously done transaction from block 2 into block 2
jeffBlock.transactions.push(jeffBlock.transactions[0]);
jeffBlock.mine(blockchain.difficulty);

console.log("Remined with duplicated transaction...should not be valid. is it valid?", blockchain.verifyBlockchain());

console.log(`${k0w}: ${blockchain.getWalletBalance(k0w)}`);
console.log(`${k1w}: ${blockchain.getWalletBalance(k1w)}`);
console.log(`${k2w}: ${blockchain.getWalletBalance(k2w)}`);
console.log(`${k3w}: ${blockchain.getWalletBalance(k3w)}`);