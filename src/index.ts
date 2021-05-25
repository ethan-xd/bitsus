import { Blockchain, Transaction } from './blockchain';

let blockchain = new Blockchain(45, 100);

let myAddress = "123";

let transfer = new Transaction(20, myAddress, "fart"); // Send 20 from me to fart

let block = blockchain.addBlock(myAddress, [transfer]);

console.log("Mining...");
block.mine(blockchain.difficulty);

console.log(`My wallet balance: ${blockchain.getWalletBalance(myAddress)}`);
console.log(`Friends balance: ${blockchain.getWalletBalance("fart")}`);