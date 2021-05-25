import * as crypto from "crypto";

let chars = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"];

function sha256(m: string) {
    return crypto.createHash("sha256").update(m).digest("hex");
}

function difficultyString(difficulty: number, full: boolean) {
    return "0".repeat(Math.floor(difficulty / 15)) +
        chars[15 - Math.floor(difficulty % 15)] +
        (full ? "f".repeat(63 - Math.floor(difficulty / 15)) : "");
}

function newDifficulty(difficulty: number, time: number) {
    const increaseBelow = 10000;
    const decreaseAbove = 20000;

    const upperBound = 870;
    const lowerBound = 45;

    if (time < increaseBelow) { // Increase
        if (difficulty >= upperBound) return upperBound;
        else return ++difficulty;
    } else if (time > decreaseAbove) { // Decrease
        if (difficulty <= lowerBound) return lowerBound;
        else return --difficulty;
    } else return difficulty;
}

export class Transaction {
    public amount: number;
    public fromAddress: string;
    public toAddress: string;

    constructor(amount: number, fromAddress: string, toAddress: string) {
        this.amount = amount;
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
    }
}

class Block {
    public nonce: number;
    public timestamp: number;
    public coinbase: string;
    public transactions: Transaction[];
    public previousHash: string;

    constructor(nonce: number, timestamp: number, coinbase: string, transactions: Transaction[], previousHash: string) {
        this.nonce = nonce;
        this.timestamp = timestamp;
        this.coinbase = coinbase;
        this.transactions = transactions;
        this.previousHash = previousHash;
    }

    getHash() {
        let str = String(this.nonce) + String(this.timestamp) + this.coinbase + this.getTransactionHash() + this.previousHash;

        return sha256(sha256(str));
    }

    getTransactionHash() {
        let str = "";

        this.transactions.forEach(tx => {
            str += String(tx.amount) + tx.fromAddress + tx.toAddress;
        });

        return sha256(sha256(str));
    }

    mine(difficulty: number) {
        let hash = this.getHash();

        while (!hash.startsWith(difficultyString(difficulty, false))) {
            this.nonce++;
            hash = this.getHash();
        }

        return hash;
    };
}

export class Blockchain {
    public chain: Block[];
    public transactionPool: Transaction[];
    public difficulty: number;
    public coinbase: number;

    constructor(difficulty: number, coinbase: number) {
        this.difficulty = difficulty;
        this.coinbase = coinbase;

        this.chain = [this.createGenesisBlock()];
        this.transactionPool = [];
    }

    addBlock(nonce: number = 0, timestamp: number = new Date().getTime(), coinbase = "0000000000000000000000000000000000000000000000000000000000000000", transactions: Transaction[] = [], previousHash: string = this.getLatestBlock().getHash()) {
        let block = new Block(
            nonce,
            timestamp,
            coinbase,
            transactions,
            previousHash
        );

        this.chain.push(block);

        return block;
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    verifyBlockchain() {
        for (let i = this.chain.length - 1; i > 0; i--) {
            if (this.chain[i].previousHash != this.chain[i - 1].getHash()) return false;
        }

        return true;
    }

    private createGenesisBlock() {
        let block = new Block(
            0,
            new Date().getTime(),
            "0000000000000000000000000000000000000000000000000000000009e7e515",
            [],
            "0000000000000000000000000000000000000000000000000000000000000000"
        );

        block.mine(this.difficulty);

        return block;
    }
}