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
			blushGiven = db.get(`Users_${mentionMember.user.id}_Blushgiven`) || '0';
			blushGot = db.get(`rp_blushGot_${mentionMember.user.id}`) || '0';

			bonkGiven = db.get(`Users_${mentionMember.user.id}_Bonkgiven`) || '0';
			bonkGot = db.get(`rp_bonkGot_${mentionMember.user.id}`) || '0';

			boopGiven = db.get(`Users_${mentionMember.user.id}_Boopgiven`) || '0';
			boopGot = db.get(`rp_boopGot_${mentionMember.user.id}`) || '0';

			cryGiven = db.get(`Users_${mentionMember.user.id}_Crygiven`) || '0';
			cryGot = db.get(`rp_cryGot_${mentionMember.user.id}`) || '0';

			cuddleGiven = db.get(`Users_${mentionMember.user.id}_Cuddlegiven`) || '0';
			cuddleGot = db.get(`rp_cuddleGot_${mentionMember.user.id}`) || '0';

			dabGiven = db.get(`Users_${mentionMember.user.id}_Dabgiven`) || '0';
			dabGot = db.get(`rp_dabGot_${mentionMember.user.id}`) || '0';

			facepalmGiven = db.get(`Users_${mentionMember.user.id}_Facepalmgiven`) || '0';
			facepalmGot = db.get(`rp_facepalmGot_${mentionMember.user.id}`) || '0';

			glompGiven = db.get(`Users_${mentionMember.user.id}_Glompgiven`) || '0';
			glompGot = db.get(`rp_glompGot_${mentionMember.user.id}`) || '0';

			HFGiven = db.get(`Users_${mentionMember.user.id}_Highfivegiven`) || '0';
			HFGot = db.get(`rp_HFGot_${mentionMember.user.id}`) || '0';

			hugGiven = db.get(`Users_${mentionMember.user.id}_Huggiven`) || '0';
			hugGot = db.get(`rp_hugGot_${mentionMember.user.id}`) || '0';

			killGiven = db.get(`Users_${mentionMember.user.id}_Killgiven`) || '0';
			killGot = db.get(`rp_killGot_${mentionMember.user.id}`) || '0';

			kissGiven = db.get(`Users_${mentionMember.user.id}_Kissgiven`) || '0';
			kissGot = db.get(`rp_kissGot_${mentionMember.user.id}`) || '0';

			lurkGiven = db.get(`Users_${mentionMember.user.id}_Lurkgiven`) || '0';
			lurkGot = db.get(`rp_lurkGot_${mentionMember.user.id}`) || '0';

			nomGiven = db.get(`Users_${mentionMember.user.id}_Nomgiven`) || '0';
			nomGot = db.get(`rp_nomGot_${mentionMember.user.id}`) || '0';

			panicGiven = db.get(`Users_${mentionMember.user.id}_Panicgiven`) || '0';
			panicGot = db.get(`rp_panicGot_${mentionMember.user.id}`) || '0';

			patGiven = db.get(`Users_${mentionMember.user.id}_Patgiven`) || '0';
			patGot = db.get(`rp_patGot_${mentionMember.user.id}`) || '0';

			peckGiven = db.get(`Users_${mentionMember.user.id}_Peckgiven`) || '0';
			peckGot = db.get(`rp_peckGot_${mentionMember.user.id}`) || '0';

			shootGiven = db.get(`Users_${mentionMember.user.id}_Shootgiven`) || '0';
			shootGot = db.get(`rp_shootGot_${mentionMember.user.id}`) || '0';

			shrugGiven = db.get(`Users_${mentionMember.user.id}_Shruggiven`) || '0';
			shrugGot = db.get(`rp_shrugGot_${mentionMember.user.id}`) || '0';

			sipGiven = db.get(`Users_${mentionMember.user.id}_Sipgiven`) || '0';
			sipGot = db.get(`rp_sipGot_${mentionMember.user.id}`) || '0';

			slapGiven = db.get(`Users_${mentionMember.user.id}_Slapgiven`) || '0';
			slapGot = db.get(`rp_slapGot_${mentionMember.user.id}`) || '0';

			stabGiven = db.get(`Users_${mentionMember.user.id}_Stabgiven`) || '0';
			stabGot = db.get(`rp_stabGot_${mentionMember.user.id}`) || '0';

			stareGiven = db.get(`Users_${mentionMember.user.id}_Staregiven`) || '0';
			stareGot = db.get(`rp_stareGot_${mentionMember.user.id}`) || '0';

			teaseGiven = db.get(`Users_${mentionMember.user.id}_Teasegiven`) || '0';
			teaseGot = db.get(`rp_teaseGot_${mentionMember.user.id}`) || '0';

			waveGiven = db.get(`Users_${mentionMember.user.id}_Wavegiven`) || '0';
			waveGot = db.get(`rp_waveGot_${mentionMember.user.id}`) || '0';

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
