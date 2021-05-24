import * as crypto from "crypto";

function sha256(m: string) {
    return crypto.createHash("sha256").update(m).digest("hex");
}

class Transaction {
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

    mine() {
        let hash = this.getHash();
        while (!hash.startsWith("0000")) {
            this.nonce++;
            hash = this.getHash();
        }

        return hash;
    };
}

let transactions = [
    new Transaction(100, "1234cb4a18c14f9fe1c33ce7736d2a0042f1ce3ba97b332348dbf9fa0b5989be", "abc1cb175766a299f0d63d225122a189229941b3e8fab65bd8565d0077093df6"),
    new Transaction(100, "66551390e365dd59a383a0161d5368c21f857907722fc0b123f0d3c3c1d341d1", "de4dd1f7d3ff82891b39fb5e2eb9771813127d199c0644db78ae2eac06050403"),
];

let block = new Block(
    0,
    new Date().getTime(),
    "3af1c6df81549b5dada40fdb11c2c6b3f05f1af2a8b484c1da5f95b9b53f1f2e",
    transactions,
    "0000000000000000000000000000000000000000000000000000000000000000"
);

console.log(block.mine());
console.log(block);