import { Blockchain, Transaction } from './blockchain';

let blockchain = new Blockchain(45, 100);

blockchain.addBlock().mine(blockchain.difficulty);
blockchain.addBlock().mine(blockchain.difficulty);

console.log(blockchain.getLatestBlock());
console.log(blockchain.getLatestBlock().getHash());

console.log(blockchain.verifyBlockchain());

console.log("after editing block...")
blockchain.chain[1].transactions = [new Transaction(100, "you", "me")];

console.log(blockchain.verifyBlockchain());