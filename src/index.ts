import { Blockchain, Transaction } from './blockchain';
import { ec } from "elliptic";
import { pkToWallet, walletToPk } from './func/convertBase';

const secp = new ec('secp256k1');

let blockchain = new Blockchain(45, 100);

/*
 * Keypairs
 */

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

/*
 * Test transaction
 */

let myTransaction = new Transaction(20, k0w, k1w);
myTransaction.signTransaction(key0.getPrivate('hex'));

console.log("myTransaction, signature valid and cute?", myTransaction.verifySignature());

/*
 * Test block
 */

let block = blockchain.addBlock(k0w, [myTransaction]);

console.log("Mining block 1...");
block.mine(blockchain.difficulty);

console.log("block heckin valid and cute?", blockchain.verifyBlock(1));

console.log(`${k0w}: ${blockchain.getWalletBalance(k0w)}`);
console.log(`${k1w}: ${blockchain.getWalletBalance(k1w)}`);
console.log(`${k2w}: ${blockchain.getWalletBalance(k2w)}`);
console.log(`${k3w}: ${blockchain.getWalletBalance(k3w)}`);

/*
 * Duplicate previously done transaction from block 3 into block 3 (Should make block invalid)
 */
let transactions = [
    new Transaction(20, k0w, k1w),
    new Transaction(40, k1w, k3w)
];

transactions[0].signTransaction(key0.getPrivate('hex'));
transactions[1].signTransaction(key1.getPrivate('hex'));

let block2 = blockchain.addBlock(k2w, transactions);

console.log("\n\nMining block 2...");
block2.mine(blockchain.difficulty);

console.log("Block 2 before duplication. Valid?", blockchain.verifyBlock(2));

console.log(`${k0w}: ${blockchain.getWalletBalance(k0w)}`);
console.log(`${k1w}: ${blockchain.getWalletBalance(k1w)}`);
console.log(`${k2w}: ${blockchain.getWalletBalance(k2w)}`);
console.log(`${k3w}: ${blockchain.getWalletBalance(k3w)}`);

block2.transactions.push(block2.transactions[0]);
block2.mine(blockchain.difficulty);

console.log("Remined with duplicated transaction from same block...should not be valid. is it valid?", blockchain.verifyBlock(2));

console.log(`${k0w}: ${blockchain.getWalletBalance(k0w)}`);
console.log(`${k1w}: ${blockchain.getWalletBalance(k1w)}`);
console.log(`${k2w}: ${blockchain.getWalletBalance(k2w)}`);
console.log(`${k3w}: ${blockchain.getWalletBalance(k3w)}`);


/*
 * Duplicate previously done transaction from block 1 into block 2 (Should make block invalid)
 */
transactions = [block2.transactions[0]];

let block3 = blockchain.addBlock(k2w, transactions);

console.log("\n\nMining block 3...");
block3.mine(blockchain.difficulty);

console.log("Duplicated transaction from block 2...should not be valid. is it valid?", blockchain.verifyBlock(3));

console.log(`${k0w}: ${blockchain.getWalletBalance(k0w)}`);
console.log(`${k1w}: ${blockchain.getWalletBalance(k1w)}`);
console.log(`${k2w}: ${blockchain.getWalletBalance(k2w)}`);
console.log(`${k3w}: ${blockchain.getWalletBalance(k3w)}`);