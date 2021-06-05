const alphabet = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
const zws = String.fromCharCode(8203);
let sensitivePattern;
const TOTITLECASE = /[A-Za-zÀ-ÖØ-öø-ÿ]\S*/g;
const REGEXPESC = /[-/\\^$*+?.()|[\]{}]/g;

class Util {

	constructor() {
		throw new Error('This class may not be initiated with new');
	}

	static codeBlock(lang, expression) {
		return `\`\`\`${lang}\n${expression || zws}\`\`\``;
	}

	static clean(text) {
		return text.replace(sensitivePattern, '「ｒｅｄａｃｔｅｄ」').replace(/`/g, `\`${zws}`).replace(/@/g, `@${zws}`);
	}

	static toTitleCase(str) {
		return str.replace(TOTITLECASE, (txt) => Util.titleCaseVariants[txt] || txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
	}

	static isFunction(input) {
		return typeof input === 'function';
	}

	static isThenable(input) {
		if (!input) return false;
		return input instanceof Promise || (input !== Promise.prototype && Util.isFunction(input.then) && Util.isFunction(input.catch));
	}

	static base32(int) {
		if (int === 0) {
			return alphabet[0];
		}
	
		let res = '';
		while (int > 0) {
			res = alphabet[int % 32] + res;
			int = Math.floor(int / 32);
		}
		return res;
	}
}

Util.titleCaseVariants = {
	textchannel: 'TextChannel',
	voicechannel: 'VoiceChannel',
	categorychannel: 'CategoryChannel',
	guildmember: 'GuildMember'
};

module.exports = Util;