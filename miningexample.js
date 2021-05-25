const crypto = require("crypto");

function sha256(m) {
    return crypto.createHash("sha256").update(m).digest("hex");
}

function average(a) {
	let total = 0;
	for (let i = 0; i < a.length; i++) total += a[i];
	return total / a.length;
}

function difficultyString(d, full) {
	return "0".repeat(Math.floor(d / 15)) + (15 - Math.floor(d % 15)).toString(16) + (full ? "f".repeat(63 - Math.floor(d / 15)) : "");
}

console.log(difficultyString(45, false));

function newDifficulty(d, t) {	
	increaseBelow = 10000;
	decreaseAbove = 20000;

	if (t < increaseBelow) { // Increase 
		if (d >= 870) return 870;
		else return ++d;
	} else if (t > decreaseAbove) { // Decrease
		if (d <= 45) return 45;
		else return --d;
	} else return d;
}

let difficulty = 45;

let data = Math.floor(Math.random() * 100000);
let nonce = 0;

let start = new Date().getTime();

let times = [0,0,0,0,0,0,0,0,0,0];

while (true) {
	hash = sha256(sha256(String(data) + String(nonce)));

	if (hash.startsWith(difficultyString(difficulty, false))) {
		let time = new Date().getTime() - start;
		
		times.push(time);
		times.shift();
		
		console.log(data + "," + nonce + "\n\nDiff: " + difficultyString(difficulty, true) + " ... " + difficulty + "\nHash: " + hash + "\n\nIn: " + time + "ms\nAv: " + Math.round(average(times)) + "ms\n------\n")
		
		data += 1;
		nonce = 0;
		
		difficulty = newDifficulty(difficulty, time);
		
		start = new Date().getTime();
	} else {
		nonce += 1;
	}
}