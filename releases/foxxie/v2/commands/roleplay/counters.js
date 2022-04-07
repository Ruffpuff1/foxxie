const db = require('quick.db');
const { foxColor } = require('../../config.json');
const Discord = require('discord.js');
module.exports = {
	name: 'counters',
	aliases: ['count', 'cnt'],
	description: 'Get information on how many times someone has performed a roleplay command.',
	usage: '(user)',
	guildOnly: true,
	execute(client, message, args) {
		let mentionMember = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;

		if (mentionMember) {
			const blushGiven = db.get(`Users_${mentionMember.user.id}_Blushgiven`) || '0';
			const blushGot = db.get(`rp_blushGot_${mentionMember.user.id}`) || '0';

			const bonkGiven = db.get(`Users_${mentionMember.user.id}_Bonkgiven`) || '0';
			const bonkGot = db.get(`rp_bonkGot_${mentionMember.user.id}`) || '0';

			const boopGiven = db.get(`Users_${mentionMember.user.id}_Boopgiven`) || '0';
			const boopGot = db.get(`rp_boopGot_${mentionMember.user.id}`) || '0';

			const cryGiven = db.get(`Users_${mentionMember.user.id}_Crygiven`) || '0';
			const cryGot = db.get(`rp_cryGot_${mentionMember.user.id}`) || '0';

			const cuddleGiven = db.get(`Users_${mentionMember.user.id}_Cuddlegiven`) || '0';
			const cuddleGot = db.get(`rp_cuddleGot_${mentionMember.user.id}`) || '0';

			const dabGiven = db.get(`Users_${mentionMember.user.id}_Dabgiven`) || '0';
			const dabGot = db.get(`rp_dabGot_${mentionMember.user.id}`) || '0';

			const facepalmGiven = db.get(`Users_${mentionMember.user.id}_Facepalmgiven`) || '0';
			const facepalmGot = db.get(`rp_facepalmGot_${mentionMember.user.id}`) || '0';

			const glompGiven = db.get(`Users_${mentionMember.user.id}_Glompgiven`) || '0';
			const glompGot = db.get(`rp_glompGot_${mentionMember.user.id}`) || '0';

			const HFGiven = db.get(`Users_${mentionMember.user.id}_Highfivegiven`) || '0';
			const HFGot = db.get(`rp_HFGot_${mentionMember.user.id}`) || '0';

			const hugGiven = db.get(`Users_${mentionMember.user.id}_Huggiven`) || '0';
			const hugGot = db.get(`rp_hugGot_${mentionMember.user.id}`) || '0';

			const killGiven = db.get(`Users_${mentionMember.user.id}_Killgiven`) || '0';
			const killGot = db.get(`rp_killGot_${mentionMember.user.id}`) || '0';

			const kissGiven = db.get(`Users_${mentionMember.user.id}_Kissgiven`) || '0';
			const kissGot = db.get(`rp_kissGot_${mentionMember.user.id}`) || '0';

			const lurkGiven = db.get(`Users_${mentionMember.user.id}_Lurkgiven`) || '0';
			const lurkGot = db.get(`rp_lurkGot_${mentionMember.user.id}`) || '0';

			const nomGiven = db.get(`Users_${mentionMember.user.id}_Nomgiven`) || '0';
			const nomGot = db.get(`rp_nomGot_${mentionMember.user.id}`) || '0';

			const panicGiven = db.get(`Users_${mentionMember.user.id}_Panicgiven`) || '0';
			const panicGot = db.get(`rp_panicGot_${mentionMember.user.id}`) || '0';

			const patGiven = db.get(`Users_${mentionMember.user.id}_Patgiven`) || '0';
			const patGot = db.get(`rp_patGot_${mentionMember.user.id}`) || '0';

			const peckGiven = db.get(`Users_${mentionMember.user.id}_Peckgiven`) || '0';
			const peckGot = db.get(`rp_peckGot_${mentionMember.user.id}`) || '0';

			const shootGiven = db.get(`Users_${mentionMember.user.id}_Shootgiven`) || '0';
			const shootGot = db.get(`rp_shootGot_${mentionMember.user.id}`) || '0';

			const shrugGiven = db.get(`Users_${mentionMember.user.id}_Shruggiven`) || '0';
			const shrugGot = db.get(`rp_shrugGot_${mentionMember.user.id}`) || '0';

			const sipGiven = db.get(`Users_${mentionMember.user.id}_Sipgiven`) || '0';
			const sipGot = db.get(`rp_sipGot_${mentionMember.user.id}`) || '0';

			const slapGiven = db.get(`Users_${mentionMember.user.id}_Slapgiven`) || '0';
			const slapGot = db.get(`rp_slapGot_${mentionMember.user.id}`) || '0';

			const stabGiven = db.get(`Users_${mentionMember.user.id}_Stabgiven`) || '0';
			const stabGot = db.get(`rp_stabGot_${mentionMember.user.id}`) || '0';

			const stareGiven = db.get(`Users_${mentionMember.user.id}_Staregiven`) || '0';
			const stareGot = db.get(`rp_stareGot_${mentionMember.user.id}`) || '0';

			const teaseGiven = db.get(`Users_${mentionMember.user.id}_Teasegiven`) || '0';
			const teaseGot = db.get(`rp_teaseGot_${mentionMember.user.id}`) || '0';

			const waveGiven = db.get(`Users_${mentionMember.user.id}_Wavegiven`) || '0';
			const waveGot = db.get(`rp_waveGot_${mentionMember.user.id}`) || '0';

			const counterEmbed = new Discord.MessageEmbed().setColor(foxColor).setDescription(`
Here are **${mentionMember.user.tag}\'s** roleplay command counts.
(Yes we keep track)
\`\`\`yaml
Type     | Gotten | Given  | Type     | Gotten | Given
---------+--------+--------+----------+--------+--------
Blush    |   ${blushGot}    |   ${blushGiven}    | Nom      |   ${nomGot}    |   ${nomGiven}
Bonk     |   ${bonkGot}    |   ${bonkGiven}    | Panic    |   ${panicGot}    |   ${panicGiven}
Boop     |   ${boopGot}    |   ${boopGiven}    | Pat      |   ${patGot}    |   ${patGiven}
Cry      |   ${cryGot}    |   ${cryGiven}    | Peck     |   ${peckGot}    |   ${peckGiven}
Cuddle   |   ${cuddleGot}    |   ${cuddleGiven}    | Shoot    |   ${shootGot}    |   ${shootGiven}
Dab      |   ${dabGot}    |   ${dabGiven}    | Shrug    |   ${shrugGot}    |   ${shrugGiven}
Facepalm |   ${facepalmGot}    |   ${facepalmGiven}    | Sip      |   ${sipGot}    |   ${sipGiven}
Glomp    |   ${glompGot}    |   ${glompGiven}    | Slap     |   ${slapGot}    |   ${slapGiven}
Highfive |   ${HFGot}    |   ${HFGiven}    | Stab     |   ${stabGot}    |   ${stabGiven}
Hug      |   ${hugGot}    |   ${hugGiven}    | Stare    |   ${stareGot}    |   ${stareGiven}
Kill     |   ${killGot}    |   ${killGiven}    | Tease    |   ${teaseGot}    |   ${teaseGiven}
Kiss     |   ${kissGot}    |   ${kissGiven}    | Wave     |   ${waveGot}    |   ${waveGiven}
Lurk     |   ${lurkGot}    |   ${lurkGiven}    |          |        |       \`\`\``);

			message.channel.send(counterEmbed);
		}
	}
};
