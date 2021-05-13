const alphabet = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';

module.exports.toUpperCaseFirst = String.prototype.toUpperCaseFirst = function() {
    return this.charAt(0).toUpperCase() + this.slice(1)
}

exports.base32 = int => {
	if (int === 0) {
		return alphabet[0];
	}

	let res = '';
	while (int > 0) {
		res = alphabet[int % 32] + res;
		int = Math.floor(int / 32);
	}
	return res;
};