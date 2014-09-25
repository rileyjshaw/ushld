var profanities = require('./profanities.js');

function shuffle (array) {
    var counter = array.length, temp, index;

    // While there are elements in the array
    while (counter > 0) {
        // Pick a random index
        index = Math.floor(Math.random() * counter);

        // Decrease counter by 1
        counter--;

        // And swap the last element with it
        temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }

    return array;
}

// Check if an integer will result in a base32 string with a forbidden character
function isDuplicate (num) {
	var remainder = 0;
	while (num > 1) {
		remainder = num % 36;
		if (notOkay.some(function(charCode) {
			return remainder === charCode;
		})) return true;
		num = Math.floor(num / 36);
	}
	return false;
}

// Check if the code is blacklisted
function isProfane (code) {
	var cur, len = code.length;
	if (len) {
		cur = profanities;
		for (var i = 0, _len = code.length; i < _len; i++) {
			cur = cur[code[i]];
			if (!cur) return isProfane(code.slice(1));
			else if (cur === true) return true;
		}
	}
	return false;
}

// Add generatedPerStep codes to the code bank
function populationStep () {
	do {
		if (numCodesInExponentSet === oldNumCodes) {
			oldNumCodes = Math.pow(32, exponent++);
			numCodesInExponentSet = Math.pow(32, exponent);
		}
		var upper = numCodesInExponentSet;
		var lower = Math.max(oldNumCodes, numCodesInExponentSet - generatedPerStep);
		var code;
		for (; numCodesInExponentSet > lower; numCodesInExponentSet--) {
			if (!isDuplicate(numCodesInExponentSet)) {
				code = numCodesInExponentSet.toString('36');
				if (!isProfane(code.split(''))) codes.push(numCodesInExponentSet);
			}
		}
	} while (codes.length < regenLimit);

	// shuffle the whole array, fuck it.
	shuffle(codes);
}

function getCode () {
	if (codes.length < regenLimit) populationStep();
	return codes.pop();
}

// really starts at 3 after populationStep initializes...
var exponent = 2;
var numCodesInExponentSet = 0;
var oldNumCodes = 0;

// generate 10000 new codes per step
var generatedPerStep = 10000;

// create new codes when there are only 1000 left
var regenLimit = 1000;

// array to store codes in
var codes = [];

// forbidden characters
var notOkay = ['i', 'l', 'o', 's'];

// normalize the characters to base36
notOkay = notOkay.map(function (char) {
	return char.charCodeAt() - 87;
});

populationStep();

module.exports = getCode;
