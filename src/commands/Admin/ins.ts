import { StarboardData } from '#lib/Database/Models/starboard';
import { FoxxieCommand } from '#lib/structures';
import { Collection, Message, SnowflakeUtil } from 'discord.js';

const DATA = [
	{
		_id: {
			$oid: '64e6d98bb385a39812161918'
		},
		enabled: true,
		userId: '432129282710700033',
		messageId: '1144122958558797834',
		channelId: '1140389111237181561',
		guildId: '1117671374052397136',
		starMessageId: null,
		stars: 2,
		lastUpdated: 1692850571216
	},
	{
		_id: {
			$oid: '64e6d990b385a39812161919'
		},
		enabled: true,
		userId: '432129282710700033',
		messageId: '1144122975478620200',
		channelId: '1140389111237181561',
		guildId: '1117671374052397136',
		starMessageId: null,
		stars: 2,
		lastUpdated: 1692850576714
	},
	{
		_id: {
			$oid: '64e6f8e18f2b39b8090f91d5'
		},
		enabled: true,
		userId: '727649973180694638',
		messageId: '1140385444643745995',
		channelId: '1117671374832545828',
		guildId: '1117671374052397136',
		starMessageId: '1144156621057044520',
		stars: 2,
		lastUpdated: 1692858593148
	},
	{
		_id: {
			$oid: '64e6f8fd8f2b39b8090f91d6'
		},
		enabled: true,
		userId: '440228126925258753',
		messageId: '1140502830923382967',
		channelId: '1117671374832545828',
		guildId: '1117671374052397136',
		starMessageId: '1144156737717420193',
		stars: 1,
		lastUpdated: 1692858621092
	},
	{
		_id: {
			$oid: '64e6f90b8f2b39b8090f91d7'
		},
		enabled: true,
		userId: '486396074282450946',
		messageId: '1140502286980882454',
		channelId: '1117671374832545828',
		guildId: '1117671374052397136',
		starMessageId: '1144156800250290252',
		stars: 2,
		lastUpdated: 1692858635402
	},
	{
		_id: {
			$oid: '64e6f9258f2b39b8090f91d8'
		},
		enabled: true,
		userId: '440228126925258753',
		messageId: '1140501830502195263',
		channelId: '1117671374832545828',
		guildId: '1117671374052397136',
		starMessageId: '1144156906387144734',
		stars: 2,
		lastUpdated: 1692858661287
	},
	{
		_id: {
			$oid: '64e6f92f8f2b39b8090f91d9'
		},
		enabled: true,
		userId: '852428177816551454',
		messageId: '1140490224565243904',
		channelId: '1117671374832545828',
		guildId: '1117671374052397136',
		starMessageId: '1144156948925792276',
		stars: 2,
		lastUpdated: 1692858671395
	},
	{
		_id: {
			$oid: '64e6f9398f2b39b8090f91da'
		},
		enabled: true,
		userId: '486396074282450946',
		messageId: '1140490096076923060',
		channelId: '1117671374832545828',
		guildId: '1117671374052397136',
		starMessageId: '1144156994312347704',
		stars: 2,
		lastUpdated: 1692858681633
	},
	{
		_id: {
			$oid: '64e6f9408f2b39b8090f91db'
		},
		enabled: true,
		userId: '486396074282450946',
		messageId: '1140487699434831902',
		channelId: '1117671374832545828',
		guildId: '1117671374052397136',
		starMessageId: '1144157024456806460',
		stars: 2,
		lastUpdated: 1692858688962
	},
	{
		_id: {
			$oid: '64e6f96f8f2b39b8090f91dc'
		},
		enabled: true,
		userId: '486396074282450946',
		messageId: '1140398165116330087',
		channelId: '1117671374832545828',
		guildId: '1117671374052397136',
		starMessageId: '1144157220632789012',
		stars: 2,
		lastUpdated: 1692858735580
	},
	{
		_id: {
			$oid: '64e6f9778f2b39b8090f91dd'
		},
		enabled: true,
		userId: '440228126925258753',
		messageId: '1140533233222684672',
		channelId: '1117671374832545828',
		guildId: '1117671374052397136',
		starMessageId: '1144157249619636254',
		stars: 2,
		lastUpdated: 1692858743121
	},
	{
		_id: {
			$oid: '64e6f98b8f2b39b8090f91de'
		},
		enabled: true,
		userId: '486396074282450946',
		messageId: '1140538041656692747',
		channelId: '1117671374832545828',
		guildId: '1117671374052397136',
		starMessageId: '1144157337247023105',
		stars: 2,
		lastUpdated: 1692858763301
	},
	{
		_id: {
			$oid: '64e6f9948f2b39b8090f91df'
		},
		enabled: true,
		userId: '440228126925258753',
		messageId: '1140541101439197194',
		channelId: '1117671374832545828',
		guildId: '1117671374052397136',
		starMessageId: '1144157374106574888',
		stars: 1,
		lastUpdated: 1692858772788
	},
	{
		_id: {
			$oid: '64e6f99e8f2b39b8090f91e0'
		},
		enabled: true,
		userId: '440228126925258753',
		messageId: '1140543740361052231',
		channelId: '1117671374832545828',
		guildId: '1117671374052397136',
		starMessageId: '1144157413688225822',
		stars: 1,
		lastUpdated: 1692858782218
	},
	{
		_id: {
			$oid: '64e6f9a38f2b39b8090f91e1'
		},
		enabled: true,
		userId: '852428177816551454',
		messageId: '1140544068154294304',
		channelId: '1117671374832545828',
		guildId: '1117671374052397136',
		starMessageId: '1144157436014510130',
		stars: 2,
		lastUpdated: 1692858787427
	},
	{
		_id: {
			$oid: '64e6f9a98f2b39b8090f91e2'
		},
		enabled: true,
		userId: '852428177816551454',
		messageId: '1140544485265248326',
		channelId: '1117671374832545828',
		guildId: '1117671374052397136',
		starMessageId: '1144157461889175562',
		stars: 2,
		lastUpdated: 1692858793083
	},
	{
		_id: {
			$oid: '64e6f9ae8f2b39b8090f91e3'
		},
		enabled: true,
		userId: '727005722671317054',
		messageId: '1140546185048887347',
		channelId: '1117671374832545828',
		guildId: '1117671374052397136',
		starMessageId: '1144157485201104947',
		stars: 3,
		lastUpdated: 1692858798874
	},
	{
		_id: {
			$oid: '64e6f9b88f2b39b8090f91e4'
		},
		enabled: true,
		userId: '852428177816551454',
		messageId: '1140546226614435910',
		channelId: '1117671374832545828',
		guildId: '1117671374052397136',
		starMessageId: '1144157523235045466',
		stars: 2,
		lastUpdated: 1692858808334
	},
	{
		_id: {
			$oid: '64e6f9be8f2b39b8090f91e5'
		},
		enabled: true,
		userId: '852428177816551454',
		messageId: '1140550488702582875',
		channelId: '1117671374832545828',
		guildId: '1117671374052397136',
		starMessageId: '1144157550263156806',
		stars: 2,
		lastUpdated: 1692858814504
	},
	{
		_id: {
			$oid: '64e6f9c48f2b39b8090f91e6'
		},
		enabled: true,
		userId: '852428177816551454',
		messageId: '1140550162582876210',
		channelId: '1117671374832545828',
		guildId: '1117671374052397136',
		starMessageId: '1144157575017934858',
		stars: 2,
		lastUpdated: 1692858820703
	},
	{
		_id: {
			$oid: '64e6f9c98f2b39b8090f91e7'
		},
		enabled: true,
		userId: '852428177816551454',
		messageId: '1140549870411849748',
		channelId: '1117671374832545828',
		guildId: '1117671374052397136',
		starMessageId: '1144157596715069511',
		stars: 2,
		lastUpdated: 1692858825795
	},
	{
		_id: {
			$oid: '64e6f9f28f2b39b8090f91e9'
		},
		enabled: true,
		userId: '852428177816551454',
		messageId: '1140552042377654353',
		channelId: '1117671374832545828',
		guildId: '1117671374052397136',
		starMessageId: '1144157769293893662',
		stars: 2,
		lastUpdated: 1692858866981
	},
	{
		_id: {
			$oid: '64e6f9fc8f2b39b8090f91ea'
		},
		enabled: true,
		userId: '852428177816551454',
		messageId: '1140554581135347783',
		channelId: '1117671374832545828',
		guildId: '1117671374052397136',
		starMessageId: '1144157809093652492',
		stars: 2,
		lastUpdated: 1692858876497
	},
	{
		_id: {
			$oid: '64e6fa038f2b39b8090f91eb'
		},
		enabled: true,
		userId: '852428177816551454',
		messageId: '1140555193096876072',
		channelId: '1117671374832545828',
		guildId: '1117671374052397136',
		starMessageId: '1144157842929098863',
		stars: 2,
		lastUpdated: 1692858883812
	},
	{
		_id: {
			$oid: '64e6fa098f2b39b8090f91ec'
		},
		enabled: true,
		userId: '486396074282450946',
		messageId: '1140555712385253417',
		channelId: '1117671374832545828',
		guildId: '1117671374052397136',
		starMessageId: '1144157865188261898',
		stars: 2,
		lastUpdated: 1692858889305
	},
	{
		_id: {
			$oid: '64e6fa108f2b39b8090f91ed'
		},
		enabled: true,
		userId: '486396074282450946',
		messageId: '1140556480215531520',
		channelId: '1117671374832545828',
		guildId: '1117671374052397136',
		starMessageId: '1144157893550157884',
		stars: 2,
		lastUpdated: 1692858896040
	},
	{
		_id: {
			$oid: '64e6fa158f2b39b8090f91ee'
		},
		enabled: true,
		userId: '852428177816551454',
		messageId: '1140556537987858443',
		channelId: '1117671374832545828',
		guildId: '1117671374052397136',
		starMessageId: '1144157915582832640',
		stars: 2,
		lastUpdated: 1692858901864
	},
	{
		_id: {
			$oid: '64e6fa1c8f2b39b8090f91ef'
		},
		enabled: true,
		userId: '733163699912835082',
		messageId: '1140834337198186547',
		channelId: '1117671374832545828',
		guildId: '1117671374052397136',
		starMessageId: '1144157941340061807',
		stars: 1,
		lastUpdated: 1692858908093
	},
	{
		_id: {
			$oid: '64e6fa288f2b39b8090f91f0'
		},
		enabled: true,
		userId: '852428177816551454',
		messageId: '1140853809900429403',
		channelId: '1117671374832545828',
		guildId: '1117671374052397136',
		starMessageId: '1144157992883863612',
		stars: 2,
		lastUpdated: 1692858920171
	},
	{
		_id: {
			$oid: '64e6fa3c8f2b39b8090f91f1'
		},
		enabled: true,
		userId: '713246081286406194',
		messageId: '1143202740089147563',
		channelId: '1117671374832545828',
		guildId: '1117671374052397136',
		starMessageId: '1144158077508128818',
		stars: 1,
		lastUpdated: 1692858940489
	},
	{
		_id: {
			$oid: '64e6fa448f2b39b8090f91f2'
		},
		enabled: true,
		userId: '852428177816551454',
		messageId: '1143258531177435219',
		channelId: '1117671374832545828',
		guildId: '1117671374052397136',
		starMessageId: '1144158113239400498',
		stars: 2,
		lastUpdated: 1692858948421
	},
	{
		_id: {
			$oid: '64e6fa4a8f2b39b8090f91f3'
		},
		enabled: true,
		userId: '713246081286406194',
		messageId: '1143990888469639270',
		channelId: '1117671374832545828',
		guildId: '1117671374052397136',
		starMessageId: '1144158138996629537',
		stars: 2,
		lastUpdated: 1692858954760
	},
	{
		_id: {
			$oid: '64e6fa508f2b39b8090f91f4'
		},
		enabled: true,
		userId: '693601025793196032',
		messageId: '1143996980767494246',
		channelId: '1117671374832545828',
		guildId: '1117671374052397136',
		starMessageId: '1144158163097092206',
		stars: 2,
		lastUpdated: 1692858960902
	},
	{
		_id: {
			$oid: '64e6fa568f2b39b8090f91f5'
		},
		enabled: true,
		userId: '852428177816551454',
		messageId: '1143997084698152991',
		channelId: '1117671374832545828',
		guildId: '1117671374052397136',
		starMessageId: '1144158185528238170',
		stars: 2,
		lastUpdated: 1692858966254
	},
	{
		_id: {
			$oid: '64e6fa598f2b39b8090f91f6'
		},
		enabled: true,
		userId: '486396074282450946',
		messageId: '1143997458825891891',
		channelId: '1117671374832545828',
		guildId: '1117671374052397136',
		starMessageId: '1144158208664023073',
		stars: 2,
		lastUpdated: 1692858969337
	},
	{
		_id: {
			$oid: '64e6fa618f2b39b8090f91f7'
		},
		enabled: true,
		userId: '693601025793196032',
		messageId: '1143997889819975701',
		channelId: '1117671374832545828',
		guildId: '1117671374052397136',
		starMessageId: '1144158232407986279',
		stars: 2,
		lastUpdated: 1692858977389
	},
	{
		_id: {
			$oid: '64e6fa648f2b39b8090f91f8'
		},
		enabled: true,
		userId: '852428177816551454',
		messageId: '1144000109797986497',
		channelId: '1117671374832545828',
		guildId: '1117671374052397136',
		starMessageId: '1144158244160417803',
		stars: 1,
		lastUpdated: 1692858980176
	},
	{
		_id: {
			$oid: '64e6fa6d8f2b39b8090f91f9'
		},
		enabled: true,
		userId: '727649973180694638',
		messageId: '1143998175569526835',
		channelId: '1117671374832545828',
		guildId: '1117671374052397136',
		starMessageId: '1144158281804296222',
		stars: 2,
		lastUpdated: 1692858989190
	},
	{
		_id: {
			$oid: '64e6fa728f2b39b8090f91fa'
		},
		enabled: true,
		userId: '440228126925258753',
		messageId: '1144122384513761361',
		channelId: '1117671374832545828',
		guildId: '1117671374052397136',
		starMessageId: '1144158305816694815',
		stars: 2,
		lastUpdated: 1692858994933
	},
	{
		_id: {
			$oid: '64e6fad48f2b39b8090f91fb'
		},
		enabled: true,
		userId: '852428177816551454',
		messageId: '1144115695945269278',
		channelId: '1117671374832545828',
		guildId: '1117671374052397136',
		starMessageId: '1144158721816141925',
		stars: 2,
		lastUpdated: 1692859092107
	},
	{
		_id: {
			$oid: '64e7002b8f2b39b8090f91fd'
		},
		enabled: true,
		userId: '681705152310411282',
		messageId: '1144129646338785314',
		channelId: '1117671374832545828',
		guildId: '1117671374052397136',
		starMessageId: '1144164448144203786',
		stars: 2,
		lastUpdated: 1692860459328
	},
	{
		_id: {
			$oid: '64e75d4ce172e3e0b02ab0c2'
		},
		enabled: true,
		userId: '486396074282450946',
		messageId: '1144139776878977036',
		channelId: '1117671374832545828',
		guildId: '1117671374052397136',
		starMessageId: '1144264447280549928',
		stars: 2,
		lastUpdated: 1692884300914
	},
	{
		_id: {
			$oid: '64e8b09ef83c1e154d772cc5'
		},
		enabled: true,
		userId: '486396074282450946',
		messageId: '1144528773597896775',
		channelId: '1117679394257895424',
		guildId: '1117671374052397136',
		starMessageId: '1144628845295706162',
		stars: 2,
		lastUpdated: 1692971166845
	},
	{
		_id: {
			$oid: '64e8b5c0f83c1e154d772cc6'
		},
		enabled: true,
		userId: '733163699912835082',
		messageId: '1144293163725496341',
		channelId: '1117679394257895424',
		guildId: '1117671374052397136',
		starMessageId: '1144634296519368735',
		stars: 1,
		lastUpdated: 1692972480023
	},
	{
		_id: {
			$oid: '64e9288ff83c1e154d772cc7'
		},
		enabled: true,
		userId: '852428177816551454',
		messageId: '1144757198149386240',
		channelId: '1117671374832545828',
		guildId: '1117671374052397136',
		starMessageId: '1144757573506048062',
		stars: 2,
		lastUpdated: 1693001871464
	},
	{
		_id: {
			$oid: '64e98c7bf83c1e154d772cc8'
		},
		enabled: true,
		userId: '440228126925258753',
		messageId: '1144864453016424458',
		channelId: '1117671374832545828',
		guildId: '1117671374052397136',
		starMessageId: '1144864862011412551',
		stars: 1,
		lastUpdated: 1693027451000
	},
	{
		_id: {
			$oid: '64e9918ff83c1e154d772cc9'
		},
		enabled: true,
		userId: '486396074282450946',
		messageId: '1144867948096401478',
		channelId: '1117671374832545828',
		guildId: '1117671374052397136',
		starMessageId: '1144870317387423844',
		stars: 2,
		lastUpdated: 1693028751721
	},
	{
		_id: {
			$oid: '64ec4141f83c1e154d772cd2'
		},
		enabled: true,
		userId: '733163699912835082',
		messageId: '1145608676757999616',
		channelId: '1145593489216786532',
		guildId: '1117671374052397136',
		starMessageId: '1145608724749230080',
		stars: 2,
		lastUpdated: 1693204801724
	},
	{
		_id: {
			$oid: '64eec43ff83c1e154d772cd3'
		},
		enabled: true,
		userId: '1050970332443447297',
		messageId: '1146298834750812201',
		channelId: '1145593489216786532',
		guildId: '1117671374052397136',
		starMessageId: '1146299133414604872',
		stars: 2,
		lastUpdated: 1693369407936
	},
	{
		_id: {
			$oid: '64eec445f83c1e154d772cd4'
		},
		enabled: true,
		userId: '443921113530105857',
		messageId: '1146298637387845673',
		channelId: '1145593489216786532',
		guildId: '1117671374052397136',
		starMessageId: '1146299155262734432',
		stars: 2,
		lastUpdated: 1693369413327
	},
	{
		_id: {
			$oid: '64f562e14dfd8d3fd646578b'
		},
		enabled: true,
		userId: '852428177816551454',
		messageId: '1148111739641155684',
		channelId: '1117671374832545828',
		guildId: '1117671374052397136',
		starMessageId: '1148118731340402688',
		stars: 2,
		lastUpdated: 1693803233669
	},
	{
		_id: {
			$oid: '64fa9287b8426d7e01ecbce2'
		},
		enabled: true,
		userId: '440228126925258753',
		messageId: '1149543505341980802',
		channelId: '1145593489216786532',
		guildId: '1117671374052397136',
		starMessageId: '1149544280889761853',
		stars: 1,
		lastUpdated: 1694143111403
	},
	{
		_id: {
			$oid: '64fbe4e84f108596c0cb21bc'
		},
		enabled: true,
		userId: '727005722671317054',
		messageId: '1149907562376994927',
		channelId: '1119500335807995935',
		guildId: '1117671374052397136',
		starMessageId: '1149907617997660210',
		stars: 3,
		lastUpdated: 1694229736672
	},
	{
		_id: {
			$oid: '64fbe5414f108596c0cb21bd'
		},
		enabled: true,
		userId: '681705152310411282',
		messageId: '1149907867781042206',
		channelId: '1119500335807995935',
		guildId: '1117671374052397136',
		starMessageId: '1149907987469709313',
		stars: 3,
		lastUpdated: 1694229825691
	},
	{
		_id: {
			$oid: '650125459e15e625ce65900f'
		},
		enabled: true,
		userId: '486396074282450946',
		messageId: '1151309962270752810',
		channelId: '1145593489216786532',
		guildId: '1117671374052397136',
		starMessageId: '1151351109865181275',
		stars: 4,
		lastUpdated: 1694573893026
	},
	{
		_id: {
			$oid: '65013dce9e15e625ce659010'
		},
		enabled: true,
		userId: '852428177816551454',
		messageId: '1151368267265474640',
		channelId: '1145593489216786532',
		guildId: '1117671374052397136',
		starMessageId: '1151377456440295524',
		stars: 3,
		lastUpdated: 1694580174561
	},
	{
		_id: {
			$oid: '65037be67710ef1f5f6dbf4c'
		},
		enabled: true,
		userId: '440228126925258753',
		messageId: '1151993791578898442',
		channelId: '1145593489216786532',
		guildId: '1117671374052397136',
		starMessageId: '1151993884616957973',
		stars: 2,
		lastUpdated: 1694727142516
	},
	{
		_id: {
			$oid: '650fc1ff557727e8f52a3cf7'
		},
		enabled: true,
		userId: '727005722671317054',
		messageId: '1155348266641272882',
		channelId: '1117671374832545828',
		guildId: '1117671374052397136',
		starMessageId: '1155367685551566848',
		stars: 2,
		lastUpdated: 1695531519301
	},
	{
		_id: {
			$oid: '653ec802d6f2c95b3f9432c2'
		},
		enabled: true,
		userId: '733163699912835082',
		messageId: '1168033403787022416',
		channelId: '1117679394257895424',
		guildId: '1117671374052397136',
		starMessageId: '1168293403457490975',
		stars: 3,
		lastUpdated: 1698613250613
	},
	{
		_id: {
			$oid: '653ee76ad6f2c95b3f9e9dec'
		},
		enabled: true,
		userId: '852428177816551454',
		messageId: '1168320788026376192',
		channelId: '1145593489216786532',
		guildId: '1117671374052397136',
		starMessageId: '1168327123614834718',
		stars: 2,
		lastUpdated: 1698621290068
	},
	{
		_id: {
			$oid: '65472282d6f2c95b3f2eedf0'
		},
		enabled: true,
		userId: '681705152310411282',
		messageId: '1170589552759541790',
		channelId: '1119500335807995935',
		guildId: '1117671374052397136',
		starMessageId: '1170589598624268420',
		stars: 1,
		lastUpdated: 1699160706145
	},
	{
		_id: {
			$oid: '65472754d6f2c95b3f2eedf1'
		},
		enabled: true,
		userId: '486396074282450946',
		messageId: '1170594726685188106',
		channelId: '1119500335807995935',
		guildId: '1117671374052397136',
		starMessageId: '1170594785313173537',
		stars: 1,
		lastUpdated: 1699161940882
	},
	{
		_id: {
			$oid: '654a52c5d6f2c95b3fc68a91'
		},
		enabled: true,
		userId: '486396074282450946',
		messageId: '1171361988417425418',
		channelId: '1145593489216786532',
		guildId: '1117671374052397136',
		starMessageId: '1171466052182491136',
		stars: 3,
		lastUpdated: 1699369669042
	},
	{
		_id: {
			$oid: '654bd020d6f2c95b3f162128'
		},
		enabled: true,
		userId: '733163699912835082',
		messageId: '1171835483756699678',
		channelId: '1117679394257895424',
		guildId: '1117671374052397136',
		starMessageId: '1171875532862931038',
		stars: 2,
		lastUpdated: 1699467296072
	},
	{
		_id: {
			$oid: '654d3beed6f2c95b3f5c15ff'
		},
		enabled: true,
		userId: '486396074282450946',
		messageId: '1172265873558478990',
		channelId: '1145593489216786532',
		guildId: '1117671374052397136',
		starMessageId: '1172266162671845436',
		stars: 3,
		lastUpdated: 1699560430244
	},
	{
		_id: {
			$oid: '65586f5fd6f2c95b3f94bff0'
		},
		enabled: true,
		userId: '764260116521287712',
		messageId: '1175344901790117958',
		channelId: '1145593489216786532',
		guildId: '1117671374052397136',
		starMessageId: '1175345056908070975',
		stars: 2,
		lastUpdated: 1700294495730
	},
	{
		_id: {
			$oid: '655876f9d6f2c95b3f94bff1'
		},
		enabled: true,
		userId: '764260116521287712',
		messageId: '1175344922417709136',
		channelId: '1145593489216786532',
		guildId: '1117671374052397136',
		starMessageId: '1175353219430494228',
		stars: 3,
		lastUpdated: 1700296441921
	},
	{
		_id: {
			$oid: '655bc7d9d6f2c95b3f40a212'
		},
		enabled: true,
		userId: '727649973180694638',
		messageId: '1176264268367274144',
		channelId: '1119500335807995935',
		guildId: '1117671374052397136',
		starMessageId: '1176264689378930750',
		stars: 3,
		lastUpdated: 1700513753315
	},
	{
		_id: {
			$oid: '655bd95cd6f2c95b3f473a03'
		},
		enabled: true,
		userId: '727649973180694638',
		messageId: '1176271636341735534',
		channelId: '1119500335807995935',
		guildId: '1117671374052397136',
		starMessageId: '1176283493110648962',
		stars: 2,
		lastUpdated: 1700518236391
	},
	{
		_id: {
			$oid: '655be24ed6f2c95b3f473a05'
		},
		enabled: true,
		userId: '764260116521287712',
		messageId: '1176292700954316810',
		channelId: '1117679394257895424',
		guildId: '1117671374052397136',
		starMessageId: '1176293099522248825',
		stars: 1,
		lastUpdated: 1700520526792
	},
	{
		_id: {
			$oid: '655be533d6f2c95b3f4873be'
		},
		enabled: true,
		userId: '727649973180694638',
		messageId: '1176294506488934491',
		channelId: '1119500335807995935',
		guildId: '1117671374052397136',
		starMessageId: '1176296207157575801',
		stars: 2,
		lastUpdated: 1700521267727
	},
	{
		_id: {
			$oid: '655c5a3fd6f2c95b3f60836a'
		},
		enabled: true,
		userId: '764260116521287712',
		messageId: '1176421690557870100',
		channelId: '1119500335807995935',
		guildId: '1117671374052397136',
		starMessageId: '1176421883718139974',
		stars: 3,
		lastUpdated: 1700551231343
	},
	{
		_id: {
			$oid: '655c5cbad6f2c95b3f60836b'
		},
		enabled: true,
		userId: '764260116521287712',
		messageId: '1176419427600838716',
		channelId: '1119500335807995935',
		guildId: '1117671374052397136',
		starMessageId: '1176424547558371340',
		stars: 2,
		lastUpdated: 1700551866513
	},
	{
		_id: {
			$oid: '655d744bd6f2c95b3f9824e4'
		},
		enabled: true,
		userId: '764260116521287712',
		messageId: '1176703441045815306',
		channelId: '1149953027231449149',
		guildId: '1117671374052397136',
		starMessageId: '1176724731282587770',
		stars: 2,
		lastUpdated: 1700623435904
	},
	{
		_id: {
			$oid: '6564ecf2d6f2c95b3f0fcb96'
		},
		enabled: true,
		userId: '733163699912835082',
		messageId: '1178778243030077451',
		channelId: '1145593489216786532',
		guildId: '1117671374052397136',
		starMessageId: '1178778422948941855',
		stars: 2,
		lastUpdated: 1701113074067
	},
	{
		_id: {
			$oid: '6564ed20d6f2c95b3f0fcb97'
		},
		enabled: true,
		userId: '486396074282450946',
		messageId: '1178777874476584990',
		channelId: '1145593489216786532',
		guildId: '1117671374052397136',
		starMessageId: '1178778616792883251',
		stars: 2,
		lastUpdated: 1701113120299
	},
	{
		_id: {
			$oid: '6568ba33d6f2c95b3fd2b577'
		},
		enabled: true,
		userId: '486396074282450946',
		messageId: '1179823187995926579',
		channelId: '1117680749668225074',
		guildId: '1117671374052397136',
		starMessageId: '1179823449741467758',
		stars: 2,
		lastUpdated: 1701362227817
	},
	{
		_id: {
			$oid: '65701abed6f2c95b3f4606dc'
		},
		enabled: true,
		userId: '727005722671317054',
		messageId: '1181849300263784458',
		channelId: '1145593489216786532',
		guildId: '1117671374052397136',
		starMessageId: '1181851255916744704',
		stars: 1,
		lastUpdated: 1701845694513
	},
	{
		_id: {
			$oid: '657146a3d6f2c95b3f88ed97'
		},
		enabled: true,
		userId: '486396074282450946',
		messageId: '1182157183014682644',
		channelId: '1145593489216786532',
		guildId: '1117671374052397136',
		starMessageId: '1182173263070253117',
		stars: 1,
		lastUpdated: 1701922467025
	},
	{
		_id: {
			$oid: '65716087d6f2c95b3f8d0e69'
		},
		enabled: true,
		userId: '486396074282450946',
		messageId: '1182173364731793479',
		channelId: '1144155849053454397',
		guildId: '1117671374052397136',
		starMessageId: '1182201063470805033',
		stars: 1,
		lastUpdated: 1701929095150
	},
	{
		_id: {
			$oid: '65721aa3d6f2c95b3fb17ddf'
		},
		enabled: true,
		userId: '440228126925258753',
		messageId: '1182400859968110672',
		channelId: '1145593489216786532',
		guildId: '1117671374052397136',
		starMessageId: '1182400898639593512',
		stars: 1,
		lastUpdated: 1701976739543
	},
	{
		_id: {
			$oid: '65721dabd6f2c95b3fb17de0'
		},
		enabled: true,
		userId: '486396074282450946',
		messageId: '1182400693886275705',
		channelId: '1145593489216786532',
		guildId: '1117671374052397136',
		starMessageId: '1182404154291925074',
		stars: 1,
		lastUpdated: 1701977515797
	},
	{
		_id: {
			$oid: '65721db9d6f2c95b3fb17de1'
		},
		enabled: true,
		userId: '486396074282450946',
		messageId: '1182402520560181339',
		channelId: '1145593489216786532',
		guildId: '1117671374052397136',
		starMessageId: '1182404212810854551',
		stars: 1,
		lastUpdated: 1701977529738
	},
	{
		_id: {
			$oid: '65721ed2d6f2c95b3fb17df7'
		},
		enabled: true,
		userId: '440228126925258753',
		messageId: '1182404612091826257',
		channelId: '1145593489216786532',
		guildId: '1117671374052397136',
		starMessageId: '1182405391250899074',
		stars: 2,
		lastUpdated: 1701977810694
	},
	{
		_id: {
			$oid: '65721f0bd6f2c95b3fb17df8'
		},
		enabled: true,
		userId: '440228126925258753',
		messageId: '1182405581076705421',
		channelId: '1145593489216786532',
		guildId: '1117671374052397136',
		starMessageId: '1182405628065493002',
		stars: 1,
		lastUpdated: 1701977867129
	},
	{
		_id: {
			$oid: '65721f25d6f2c95b3fb17df9'
		},
		enabled: true,
		userId: '486396074282450946',
		messageId: '1182405700417233006',
		channelId: '1145593489216786532',
		guildId: '1117671374052397136',
		starMessageId: '1182405739457826868',
		stars: 1,
		lastUpdated: 1701977893601
	},
	{
		_id: {
			$oid: '6577c652d6f2c95b3fdf8bcb'
		},
		enabled: true,
		userId: '486396074282450946',
		messageId: '1183958361637654560',
		channelId: '1145593489216786532',
		guildId: '1117671374052397136',
		starMessageId: '1183959632419495946',
		stars: 1,
		lastUpdated: 1702348370625
	},
	{
		_id: {
			$oid: '657a64a1d6f2c95b3f71ad14'
		},
		enabled: true,
		userId: '852428177816551454',
		messageId: '1184674910656798762',
		channelId: '1145593489216786532',
		guildId: '1117671374052397136',
		starMessageId: '1184679372431573013',
		stars: 2,
		lastUpdated: 1702519969996
	},
	{
		_id: {
			$oid: '657b6ab2d6f2c95b3fa47e33'
		},
		enabled: true,
		userId: '727005722671317054',
		messageId: '1184960719997898773',
		channelId: '1145593489216786532',
		guildId: '1117671374052397136',
		starMessageId: '1184960762893041675',
		stars: 1,
		lastUpdated: 1702587058757
	},
	{
		_id: {
			$oid: '657e224bd6f2c95b3f354edf'
		},
		enabled: true,
		userId: '852428177816551454',
		messageId: '1185707296005836890',
		channelId: '1145593489216786532',
		guildId: '1117671374052397136',
		starMessageId: '1185707655751278693',
		stars: 1,
		lastUpdated: 1702765131861
	},
	{
		_id: {
			$oid: '657fe46fd6f2c95b3f94e575'
		},
		enabled: true,
		userId: '852428177816551454',
		messageId: '1186166375794888764',
		channelId: '1145593489216786532',
		guildId: '1117671374052397136',
		starMessageId: '1186190989526835262',
		stars: 1,
		lastUpdated: 1702880367674
	},
	{
		_id: {
			$oid: '657fe474d6f2c95b3f94e576'
		},
		enabled: true,
		userId: '852428177816551454',
		messageId: '1186172404330930267',
		channelId: '1145593489216786532',
		guildId: '1117671374052397136',
		starMessageId: '1186191010741620796',
		stars: 1,
		lastUpdated: 1702880372696
	},
	{
		_id: {
			$oid: '657fe479d6f2c95b3f94e577'
		},
		enabled: true,
		userId: '675077363457065020',
		messageId: '1186190710110699600',
		channelId: '1145593489216786532',
		guildId: '1117671374052397136',
		starMessageId: '1186191032707199007',
		stars: 1,
		lastUpdated: 1702880377993
	},
	{
		_id: {
			$oid: '657fe47ed6f2c95b3f94e578'
		},
		enabled: true,
		userId: '675077363457065020',
		messageId: '1186190878650400768',
		channelId: '1145593489216786532',
		guildId: '1117671374052397136',
		starMessageId: '1186191053389307975',
		stars: 1,
		lastUpdated: 1702880382881
	},
	{
		_id: {
			$oid: '657fe889d6f2c95b3f94e579'
		},
		enabled: true,
		userId: '675077363457065020',
		messageId: '1186193730185740328',
		channelId: '1145593489216786532',
		guildId: '1117671374052397136',
		starMessageId: '1186195394254872637',
		stars: 1,
		lastUpdated: 1702881417830
	},
	{
		_id: {
			$oid: '657fe890d6f2c95b3f94e57a'
		},
		enabled: true,
		userId: '733163699912835082',
		messageId: '1186194007085285386',
		channelId: '1145593489216786532',
		guildId: '1117671374052397136',
		starMessageId: '1186195421857595482',
		stars: 1,
		lastUpdated: 1702881424412
	},
	{
		_id: {
			$oid: '657ff2fbd6f2c95b3f977a66'
		},
		enabled: true,
		userId: '486396074282450946',
		messageId: '1186206469251678288',
		channelId: '1145593489216786532',
		guildId: '1117671374052397136',
		starMessageId: '1186206606044708917',
		stars: 3,
		lastUpdated: 1702884091009
	},
	{
		_id: {
			$oid: '657ff3d4d6f2c95b3f977a67'
		},
		enabled: true,
		userId: '486396074282450946',
		messageId: '1186207205058433145',
		channelId: '1145593489216786532',
		guildId: '1117671374052397136',
		starMessageId: '1186207516909129778',
		stars: 2,
		lastUpdated: 1702884308072
	},
	{
		_id: {
			$oid: '6580059ed6f2c95b3f9f4760'
		},
		enabled: true,
		userId: '486396074282450946',
		messageId: '1186221228894212146',
		channelId: '1145593489216786532',
		guildId: '1117671374052397136',
		starMessageId: '1186226620126740530',
		stars: 2,
		lastUpdated: 1702888862582
	},
	{
		_id: {
			$oid: '6583f15ed6f2c95b3f6d73db'
		},
		enabled: true,
		userId: '486396074282450946',
		messageId: '1187304193770405898',
		channelId: '1145593489216786532',
		guildId: '1117671374052397136',
		starMessageId: '1187304386423177277',
		stars: 2,
		lastUpdated: 1703145822140
	},
	{
		_id: {
			$oid: '6587b7dad6f2c95b3f34896c'
		},
		enabled: true,
		userId: '486396074282450946',
		messageId: '1188330709748822067',
		channelId: '1145593489216786532',
		guildId: '1117671374052397136',
		starMessageId: '1188342143627038750',
		stars: 3,
		lastUpdated: 1703393242765
	},
	{
		_id: {
			$oid: '658a2118d6f2c95b3fb66159'
		},
		enabled: true,
		userId: '486396074282450946',
		messageId: '1189003915430219806',
		channelId: '1145593489216786532',
		guildId: '1117671374052397136',
		starMessageId: '1189004901485924395',
		stars: 1,
		lastUpdated: 1703551256568
	},
	{
		_id: {
			$oid: '658a2129d6f2c95b3fb6615a'
		},
		enabled: true,
		userId: '675077363457065020',
		messageId: '1189004110108831864',
		channelId: '1145593489216786532',
		guildId: '1117671374052397136',
		starMessageId: '1189004974185791589',
		stars: 1,
		lastUpdated: 1703551273888
	},
	{
		_id: {
			$oid: '658b4504d6f2c95b3ff88524'
		},
		enabled: true,
		userId: '486396074282450946',
		messageId: '1189313564838735984',
		channelId: '1149953027231449149',
		guildId: '1117671374052397136',
		starMessageId: '1189318351261024289',
		stars: 2,
		lastUpdated: 1703625988799
	},
	{
		_id: {
			$oid: '658b527bd6f2c95b3ffa3289'
		},
		enabled: true,
		userId: '727005722671317054',
		messageId: '1189331618809258034',
		channelId: '1145593489216786532',
		guildId: '1117671374052397136',
		starMessageId: '1189332805684039822',
		stars: 2,
		lastUpdated: 1703629435009
	},
	{
		_id: {
			$oid: '658e86bcd6f2c95b3fa69642'
		},
		enabled: true,
		userId: '486396074282450946',
		messageId: '1190213482117869588',
		channelId: '1145593489216786532',
		guildId: '1117671374052397136',
		starMessageId: '1190213549306429482',
		stars: 3,
		lastUpdated: 1703839420648
	},
	{
		_id: {
			$oid: '659139f4d6f2c95b3f3d9f48'
		},
		enabled: true,
		userId: '486396074282450946',
		messageId: '1190955632883413062',
		channelId: '1119500335807995935',
		guildId: '1117671374052397136',
		starMessageId: '1190955738881867877',
		stars: 2,
		lastUpdated: 1704016372452
	},
	{
		_id: {
			$oid: '659263b4d6f2c95b3f8094f9'
		},
		enabled: true,
		userId: '486396074282450946',
		messageId: '1191221230892748831',
		channelId: '1145593489216786532',
		guildId: '1117671374052397136',
		starMessageId: '1191275446030061588',
		stars: 2,
		lastUpdated: 1704092596554
	},
	{
		_id: {
			$oid: '6597982fd6f2c95b3fa668b5'
		},
		enabled: true,
		userId: '440228126925258753',
		messageId: '1192706097417556099',
		channelId: '1119500335807995935',
		guildId: '1117671374052397136',
		starMessageId: '1192706186710089728',
		stars: 1,
		lastUpdated: 1704433711691
	},
	{
		_id: {
			$oid: '659799b3d6f2c95b3fa668b6'
		},
		enabled: true,
		userId: '440228126925258753',
		messageId: '1192707753836294184',
		channelId: '1119500335807995935',
		guildId: '1117671374052397136',
		starMessageId: '1192707811533148232',
		stars: 1,
		lastUpdated: 1704434099079
	},
	{
		_id: {
			$oid: '659911d465913dd003a90054'
		},
		enabled: true,
		userId: '727005722671317054',
		messageId: '1192747551548522607',
		channelId: '1119500335807995935',
		guildId: '1117671374052397136',
		starMessageId: '1193111681467949186',
		stars: 1,
		lastUpdated: 1704530388881
	},
	{
		_id: {
			$oid: '659911d965913dd003a90055'
		},
		enabled: true,
		userId: '727005722671317054',
		messageId: '1192747587560816672',
		channelId: '1119500335807995935',
		guildId: '1117671374052397136',
		starMessageId: '1193111697687318658',
		stars: 1,
		lastUpdated: 1704530393007
	},
	{
		_id: {
			$oid: '659a1ff0f69ea93de94a662b'
		},
		enabled: true,
		userId: '486396074282450946',
		messageId: '1193401618536861757',
		channelId: '1145593489216786532',
		guildId: '1117671374052397136',
		starMessageId: '1193401715253317696',
		stars: 2,
		lastUpdated: 1704599536303
	},
	{
		_id: {
			$oid: '659a203cf69ea93de94a662c'
		},
		enabled: true,
		userId: '486396074282450946',
		messageId: '1193401812326301767',
		channelId: '1145593489216786532',
		guildId: '1117671374052397136',
		starMessageId: '1193402025279488092',
		stars: 1,
		lastUpdated: 1704599612619
	},
	{
		_id: {
			$oid: '659a209ff69ea93de94a662d'
		},
		enabled: true,
		userId: '440228126925258753',
		messageId: '1193402260433162362',
		channelId: '1145593489216786532',
		guildId: '1117671374052397136',
		starMessageId: '1193402439446044814',
		stars: 2,
		lastUpdated: 1704599711267
	},
	{
		_id: {
			$oid: '659a21b3f69ea93de94a662e'
		},
		enabled: true,
		userId: '486396074282450946',
		messageId: '1193403520217522276',
		channelId: '1145593489216786532',
		guildId: '1117671374052397136',
		starMessageId: '1193403596520300564',
		stars: 1,
		lastUpdated: 1704599987161
	},
	{
		_id: {
			$oid: '659ad6355e3a67f165118301'
		},
		enabled: true,
		userId: '681705152310411282',
		messageId: '1193512329783033867',
		channelId: '1117679394257895424',
		guildId: '1117671374052397136',
		starMessageId: '1193597415199088811',
		stars: 1,
		lastUpdated: 1704646197068
	},
	{
		_id: {
			$oid: '659cbbcc5e3a67f1658379dd'
		},
		enabled: true,
		userId: '727005722671317054',
		messageId: '1194118742481830019',
		channelId: '1192703592424026192',
		guildId: '1117671374052397136',
		starMessageId: '1194118823025065996',
		stars: 3,
		lastUpdated: 1704770508828
	},
	{
		_id: {
			$oid: '659ed3f25e3a67f165f6d6d8'
		},
		enabled: true,
		userId: '733163699912835082',
		messageId: '1194526575497064500',
		channelId: '1117679394257895424',
		guildId: '1117671374052397136',
		starMessageId: '1194694500816273502',
		stars: 1,
		lastUpdated: 1704907762698
	},
	{
		_id: {
			$oid: '659f86fd5e3a67f1651c1dce'
		},
		enabled: true,
		userId: '693601025793196032',
		messageId: '1194884881327599627',
		channelId: '1145593489216786532',
		guildId: '1117671374052397136',
		starMessageId: '1194886745058193528',
		stars: 1,
		lastUpdated: 1704953597332
	},
	{
		_id: {
			$oid: '659f87035e3a67f1651c1dcf'
		},
		enabled: true,
		userId: '693601025793196032',
		messageId: '1194885186161221672',
		channelId: '1145593489216786532',
		guildId: '1117671374052397136',
		starMessageId: '1194886770937040896',
		stars: 1,
		lastUpdated: 1704953603499
	},
	{
		_id: {
			$oid: '659f87085e3a67f1651c1dd0'
		},
		enabled: true,
		userId: '440228126925258753',
		messageId: '1194886678909833277',
		channelId: '1145593489216786532',
		guildId: '1117671374052397136',
		starMessageId: '1194886793301086230',
		stars: 1,
		lastUpdated: 1704953608885
	},
	{
		_id: {
			$oid: '659f87115e3a67f1651c1dd1'
		},
		enabled: true,
		userId: '693601025793196032',
		messageId: '1194886518125383750',
		channelId: '1145593489216786532',
		guildId: '1117671374052397136',
		starMessageId: '1194886827832791111',
		stars: 1,
		lastUpdated: 1704953617052
	},
	{
		_id: {
			$oid: '659f87485e3a67f1651c1dd2'
		},
		enabled: true,
		userId: '486396074282450946',
		messageId: '1194886923668426772',
		channelId: '1145593489216786532',
		guildId: '1117671374052397136',
		starMessageId: '1194887060285313093',
		stars: 1,
		lastUpdated: 1704953672489
	},
	{
		_id: {
			$oid: '659f87545e3a67f1651c1dd3'
		},
		enabled: true,
		userId: '486396074282450946',
		messageId: '1194887050546135040',
		channelId: '1145593489216786532',
		guildId: '1117671374052397136',
		starMessageId: '1194887111082516552',
		stars: 1,
		lastUpdated: 1704953684518
	},
	{
		_id: {
			$oid: '659f8c6b5e3a67f1651c1dd4'
		},
		enabled: true,
		userId: '440228126925258753',
		messageId: '1194892521415913533',
		channelId: '1145593489216786532',
		guildId: '1117671374052397136',
		starMessageId: '1194892576386465833',
		stars: 2,
		lastUpdated: 1704954987632
	},
	{
		_id: {
			$oid: '659f8f1f5e3a67f1651c1dd5'
		},
		enabled: true,
		userId: '727649973180694638',
		messageId: '1194895417129840681',
		channelId: '1145593489216786532',
		guildId: '1117671374052397136',
		starMessageId: '1194895480329617490',
		stars: 2,
		lastUpdated: 1704955679964
	},
	{
		_id: {
			$oid: '65a0a03c5e3a67f16557666e'
		},
		enabled: true,
		userId: '727005722671317054',
		messageId: '1195188614875852970',
		channelId: '1145593489216786532',
		guildId: '1117671374052397136',
		starMessageId: '1195188730256957512',
		stars: 2,
		lastUpdated: 1705025596316
	},
	{
		_id: {
			$oid: '65a0b5495e3a67f165598c0f'
		},
		enabled: true,
		userId: '727005722671317054',
		messageId: '1195202624178372770',
		channelId: '1145593489216786532',
		guildId: '1117671374052397136',
		starMessageId: '1195211332627222549',
		stars: 2,
		lastUpdated: 1705030985093
	},
	{
		_id: {
			$oid: '65a243dd5e3a67f165aacd42'
		},
		enabled: true,
		userId: '727005722671317054',
		messageId: '1195639262268366919',
		channelId: '1192601026373636208',
		guildId: '1117671374052397136',
		starMessageId: '1195639303980732436',
		stars: 2,
		lastUpdated: 1705133021273
	},
	{
		_id: {
			$oid: '65a2ff465e3a67f165cb618b'
		},
		enabled: true,
		userId: '440228126925258753',
		messageId: '1195838860496744458',
		channelId: '1145593489216786532',
		guildId: '1117671374052397136',
		starMessageId: '1195840532929323079',
		stars: 1,
		lastUpdated: 1705180998123
	},
	{
		_id: {
			$oid: '65a63eb55e3a67f1657c465e'
		},
		enabled: true,
		userId: '440228126925258753',
		messageId: '1196733236114624544',
		channelId: '1117679394257895424',
		guildId: '1117671374052397136',
		starMessageId: '1196733278225436722',
		stars: 2,
		lastUpdated: 1705393845138
	},
	{
		_id: {
			$oid: '65a63f335e3a67f1657c465f'
		},
		enabled: true,
		userId: '486396074282450946',
		messageId: '1196733768950632560',
		channelId: '1117679394257895424',
		guildId: '1117671374052397136',
		starMessageId: '1196733810008662067',
		stars: 1,
		lastUpdated: 1705393971942
	},
	{
		_id: {
			$oid: '65ab69405e3a67f165cb0ecc'
		},
		enabled: true,
		userId: '832415994000965692',
		messageId: '1198153278156980324',
		channelId: '1119500335807995935',
		guildId: '1117671374052397136',
		starMessageId: '1198153349313331241',
		stars: 1,
		lastUpdated: 1705732416479
	},
	{
		_id: {
			$oid: '65ac89325e3a67f165cb0ecd'
		},
		enabled: true,
		userId: '727005722671317054',
		messageId: '1198462405253013514',
		channelId: '1145593489216786532',
		guildId: '1117671374052397136',
		starMessageId: '1198462529500880918',
		stars: 1,
		lastUpdated: 1705806130846
	},
	{
		_id: {
			$oid: '65addb1b5e3a67f165cb0ed0'
		},
		enabled: true,
		userId: '733163699912835082',
		messageId: '1198805490914836622',
		channelId: '1117679394257895424',
		guildId: '1117671374052397136',
		starMessageId: '1198825356254261318',
		stars: 2,
		lastUpdated: 1705892635387
	},
	{
		_id: {
			$oid: '65addbd85e3a67f165cb0ed1'
		},
		enabled: true,
		userId: '486396074282450946',
		messageId: '1198826117835001906',
		channelId: '1117679394257895424',
		guildId: '1117671374052397136',
		starMessageId: '1198826150231818261',
		stars: 1,
		lastUpdated: 1705892824697
	},
	{
		_id: {
			$oid: '65af5af45e3a67f165cb0ed2'
		},
		enabled: true,
		userId: '486396074282450946',
		messageId: '1199232848171905116',
		channelId: '1145593489216786532',
		guildId: '1117671374052397136',
		starMessageId: '1199237509905920112',
		stars: 1,
		lastUpdated: 1705990900530
	},
	{
		_id: {
			$oid: '65b035845e3a67f165cb0ed3'
		},
		enabled: true,
		userId: '974772830052962386',
		messageId: '1199452982786400317',
		channelId: '1145593489216786532',
		guildId: '1117671374052397136',
		starMessageId: '1199472187799769179',
		stars: 1,
		lastUpdated: 1706046852088
	},
	{
		_id: {
			$oid: '65b035895e3a67f165cb0ed4'
		},
		enabled: true,
		userId: '974772830052962386',
		messageId: '1199453058736853023',
		channelId: '1145593489216786532',
		guildId: '1117671374052397136',
		starMessageId: '1199472210327375972',
		stars: 1,
		lastUpdated: 1706046857226
	},
	{
		_id: {
			$oid: '65b308fa5e3a67f165cb0ed5'
		},
		enabled: true,
		userId: '681705152310411282',
		messageId: '1200248612081377300',
		channelId: '1145593489216786532',
		guildId: '1117671374052397136',
		starMessageId: '1200248999395983400',
		stars: 1,
		lastUpdated: 1706232058340
	},
	{
		_id: {
			$oid: '65b4d7fb5e3a67f165cb0ed7'
		},
		enabled: true,
		userId: '733163699912835082',
		messageId: '1200711431465738270',
		channelId: '1145593489216786532',
		guildId: '1117671374052397136',
		starMessageId: '1200746147698982985',
		stars: 1,
		lastUpdated: 1706350587649
	},
	{
		_id: {
			$oid: '65b5f1dd5e3a67f165cb0ed8'
		},
		enabled: true,
		userId: '440228126925258753',
		messageId: '1201037640917598320',
		channelId: '1145593489216786532',
		guildId: '1117671374052397136',
		starMessageId: '1201048817127137340',
		stars: 2,
		lastUpdated: 1706422749744
	},
	{
		_id: {
			$oid: '65b9e6dd5e3a67f165cb0ed9'
		},
		enabled: true,
		userId: '440228126925258753',
		messageId: '1202044073868005376',
		channelId: '1117679394257895424',
		guildId: '1117671374052397136',
		starMessageId: '1202136515170533386',
		stars: 1,
		lastUpdated: 1706682077221
	},
	{
		_id: {
			$oid: '65b9e6e25e3a67f165cb0eda'
		},
		enabled: true,
		userId: '440228126925258753',
		messageId: '1202134182114119762',
		channelId: '1117679394257895424',
		guildId: '1117671374052397136',
		starMessageId: '1202136536783790090',
		stars: 1,
		lastUpdated: 1706682082316
	},
	{
		_id: {
			$oid: '65b9e6ec5e3a67f165cb0edb'
		},
		enabled: true,
		userId: '440228126925258753',
		messageId: '1201940567165259806',
		channelId: '1145593489216786532',
		guildId: '1117671374052397136',
		starMessageId: '1202136579318226965',
		stars: 1,
		lastUpdated: 1706682092483
	},
	{
		_id: {
			$oid: '65b9e9a15e3a67f165cb0edc'
		},
		enabled: true,
		userId: '733163699912835082',
		messageId: '1202139415972155402',
		channelId: '1117679394257895424',
		guildId: '1117671374052397136',
		starMessageId: '1202139484091859025',
		stars: 1,
		lastUpdated: 1706682785071
	},
	{
		_id: {
			$oid: '65b9e9aa5e3a67f165cb0edd'
		},
		enabled: true,
		userId: '486396074282450946',
		messageId: '1202139369281179658',
		channelId: '1117679394257895424',
		guildId: '1117671374052397136',
		starMessageId: '1202139524122300560',
		stars: 1,
		lastUpdated: 1706682794604
	},
	{
		_id: {
			$oid: '65b9ea165e3a67f165cb0ede'
		},
		enabled: true,
		userId: '733163699912835082',
		messageId: '1202139786530263070',
		channelId: '1117679394257895424',
		guildId: '1117671374052397136',
		starMessageId: '1202139977635606558',
		stars: 1,
		lastUpdated: 1706682902592
	},
	{
		_id: {
			$oid: '65baf5f95e3a67f165cb0edf'
		},
		enabled: true,
		userId: '727649973180694638',
		messageId: '1202422807338680320',
		channelId: '1117671374832545828',
		guildId: '1117671374052397136',
		starMessageId: '1202427617232420884',
		stars: 3,
		lastUpdated: 1706751481339
	},
	{
		_id: {
			$oid: '65c1dbd15e3a67f165cb0ee0'
		},
		enabled: true,
		userId: '486396074282450946',
		messageId: '1204322645961609306',
		channelId: '1119500335807995935',
		guildId: '1117671374052397136',
		starMessageId: '1204323677135708171',
		stars: 1,
		lastUpdated: 1707203537215
	},
	{
		_id: {
			$oid: '65c3e9e35e3a67f165cb0ee1'
		},
		enabled: true,
		userId: '486396074282450946',
		messageId: '1204886338063564810',
		channelId: '1145593489216786532',
		guildId: '1117671374052397136',
		starMessageId: '1204888543084810250',
		stars: 3,
		lastUpdated: 1707338211818
	},
	{
		_id: {
			$oid: '65c472b05e3a67f165cb0ee2'
		},
		enabled: true,
		userId: '852428177816551454',
		messageId: '1205019598097743872',
		channelId: '1145593489216786532',
		guildId: '1117671374052397136',
		starMessageId: '1205035429192138773',
		stars: 1,
		lastUpdated: 1707373232161
	},
	{
		_id: {
			$oid: '65c475bd5e3a67f165cb0ee3'
		},
		enabled: true,
		userId: '486396074282450946',
		messageId: '1205035553834147850',
		channelId: '1144155849053454397',
		guildId: '1117671374052397136',
		starMessageId: '1205038708114464798',
		stars: 1,
		lastUpdated: 1707374013931
	},
	{
		_id: {
			$oid: '65c5c0f35e3a67f165cb0ee4'
		},
		enabled: true,
		userId: '852428177816551454',
		messageId: '1205392912343498782',
		channelId: '1117671374832545828',
		guildId: '1117671374052397136',
		starMessageId: '1205394342076751953',
		stars: 1,
		lastUpdated: 1707458803698
	},
	{
		_id: {
			$oid: '65c5c0fd5e3a67f165cb0ee5'
		},
		enabled: true,
		userId: '727649973180694638',
		messageId: '1205391851914264597',
		channelId: '1117671374832545828',
		guildId: '1117671374052397136',
		starMessageId: '1205394385387393084',
		stars: 1,
		lastUpdated: 1707458813973
	},
	{
		_id: {
			$oid: '65c5c1565e3a67f165cb0ee6'
		},
		enabled: true,
		userId: '486396074282450946',
		messageId: '1205394724521775125',
		channelId: '1117671374832545828',
		guildId: '1117671374052397136',
		starMessageId: '1205394755895435324',
		stars: 1,
		lastUpdated: 1707458902296
	},
	{
		_id: {
			$oid: '65c5c1675e3a67f165cb0ee7'
		},
		enabled: true,
		userId: '733163699912835082',
		messageId: '1205394723909533728',
		channelId: '1117679394257895424',
		guildId: '1117671374052397136',
		starMessageId: '1205394828641308713',
		stars: 1,
		lastUpdated: 1707458919680
	},
	{
		_id: {
			$oid: '65c5c1fe5e3a67f165cb0ee8'
		},
		enabled: true,
		userId: '486396074282450946',
		messageId: '1205395283849256962',
		channelId: '1117671374832545828',
		guildId: '1117671374052397136',
		starMessageId: '1205395462366957568',
		stars: 1,
		lastUpdated: 1707459070695
	},
	{
		_id: {
			$oid: '65c5c2335e3a67f165cb0ee9'
		},
		enabled: true,
		userId: '852428177816551454',
		messageId: '1205395579987955722',
		channelId: '1117679394257895424',
		guildId: '1117671374052397136',
		starMessageId: '1205395685609054218',
		stars: 1,
		lastUpdated: 1707459123967
	},
	{
		_id: {
			$oid: '65c5c2455e3a67f165cb0eea'
		},
		enabled: true,
		userId: '486396074282450946',
		messageId: '1205395637261176892',
		channelId: '1117679394257895424',
		guildId: '1117671374052397136',
		starMessageId: '1205395760867442742',
		stars: 1,
		lastUpdated: 1707459141942
	},
	{
		_id: {
			$oid: '65c5c2f45e3a67f165cb0eeb'
		},
		enabled: true,
		userId: '440228126925258753',
		messageId: '1205396378830897162',
		channelId: '1117671374832545828',
		guildId: '1117671374052397136',
		starMessageId: '1205396493247320124',
		stars: 1,
		lastUpdated: 1707459316483
	},
	{
		_id: {
			$oid: '65c5c30a5e3a67f165cb0eec'
		},
		enabled: true,
		userId: '486396074282450946',
		messageId: '1205396456471662602',
		channelId: '1117671374832545828',
		guildId: '1117671374052397136',
		starMessageId: '1205396584779612212',
		stars: 1,
		lastUpdated: 1707459338415
	},
	{
		_id: {
			$oid: '65c5c3205e3a67f165cb0eed'
		},
		enabled: true,
		userId: '440228126925258753',
		messageId: '1205396550650568734',
		channelId: '1117671374832545828',
		guildId: '1117671374052397136',
		starMessageId: '1205396677574533140',
		stars: 1,
		lastUpdated: 1707459360441
	},
	{
		_id: {
			$oid: '65c5c3255e3a67f165cb0eee'
		},
		enabled: true,
		userId: '486396074282450946',
		messageId: '1205396394739892245',
		channelId: '1117671374832545828',
		guildId: '1117671374052397136',
		starMessageId: '1205396697962913792',
		stars: 1,
		lastUpdated: 1707459365220
	},
	{
		_id: {
			$oid: '65c5c3755e3a67f165cb0eef'
		},
		enabled: true,
		userId: '852428177816551454',
		messageId: '1205396416130846821',
		channelId: '1117679394257895424',
		guildId: '1117671374052397136',
		starMessageId: '1205397033775665185',
		stars: 1,
		lastUpdated: 1707459445530
	},
	{
		_id: {
			$oid: '65c5c38d5e3a67f165cb0ef0'
		},
		enabled: true,
		userId: '486396074282450946',
		messageId: '1205396929517723678',
		channelId: '1117671374832545828',
		guildId: '1117671374052397136',
		starMessageId: '1205397135252525067',
		stars: 1,
		lastUpdated: 1707459469543
	},
	{
		_id: {
			$oid: '65c5c4225e3a67f165cb0ef1'
		},
		enabled: true,
		userId: '486396074282450946',
		messageId: '1205397654960611339',
		channelId: '1117671374832545828',
		guildId: '1117671374052397136',
		starMessageId: '1205397758991663164',
		stars: 1,
		lastUpdated: 1707459618345
	},
	{
		_id: {
			$oid: '65c5c4d45e3a67f165cb0ef2'
		},
		enabled: true,
		userId: '486396074282450946',
		messageId: '1205398409167765504',
		channelId: '1145593489216786532',
		guildId: '1117671374052397136',
		starMessageId: '1205398504365891624',
		stars: 1,
		lastUpdated: 1707459796021
	},
	{
		_id: {
			$oid: '65c5c57d5e3a67f165cb0ef3'
		},
		enabled: true,
		userId: '440228126925258753',
		messageId: '1205399173596188772',
		channelId: '1145593489216786532',
		guildId: '1117671374052397136',
		starMessageId: '1205399215388229672',
		stars: 1,
		lastUpdated: 1707459965563
	},
	{
		_id: {
			$oid: '65c5c5a05e3a67f165cb0ef4'
		},
		enabled: true,
		userId: '440228126925258753',
		messageId: '1205399282270605332',
		channelId: '1145593489216786532',
		guildId: '1117671374052397136',
		starMessageId: '1205399360951685190',
		stars: 1,
		lastUpdated: 1707460000206
	},
	{
		_id: {
			$oid: '65c5c5be5e3a67f165cb0ef5'
		},
		enabled: true,
		userId: '974772830052962386',
		messageId: '1205399342169722910',
		channelId: '1145593489216786532',
		guildId: '1117671374052397136',
		starMessageId: '1205399488840339456',
		stars: 1,
		lastUpdated: 1707460030762
	},
	{
		_id: {
			$oid: '65c5cd005e3a67f165cb0ef6'
		},
		enabled: true,
		userId: '486396074282450946',
		messageId: '1205407194812780637',
		channelId: '1192703592424026192',
		guildId: '1117671374052397136',
		starMessageId: '1205407279810215937',
		stars: 2,
		lastUpdated: 1707461888293
	},
	{
		_id: {
			$oid: '65c668a45e3a67f165cb0ef7'
		},
		enabled: true,
		userId: '727005722671317054',
		messageId: '1205573621494579261',
		channelId: '1145593489216786532',
		guildId: '1117671374052397136',
		starMessageId: '1205574400322174976',
		stars: 2,
		lastUpdated: 1707501732929
	},
	{
		_id: {
			$oid: '65c7d6885e3a67f165cb0ef8'
		},
		enabled: true,
		userId: '486396074282450946',
		messageId: '1205785528830525492',
		channelId: '1145593489216786532',
		guildId: '1117671374052397136',
		starMessageId: '1205967270598156308',
		stars: 1,
		lastUpdated: 1707595400492
	},
	{
		_id: {
			$oid: '65c7d6e75e3a67f165cb0ef9'
		},
		enabled: true,
		userId: '486396074282450946',
		messageId: '1205967309911367721',
		channelId: '1144155849053454397',
		guildId: '1117671374052397136',
		starMessageId: '1205967668658704445',
		stars: 1,
		lastUpdated: 1707595495381
	},
	{
		_id: {
			$oid: '65c7fcef5e3a67f165cb0efa'
		},
		enabled: true,
		userId: '486396074282450946',
		messageId: '1206008441378840576',
		channelId: '1145593489216786532',
		guildId: '1117671374052397136',
		starMessageId: '1206008503425048697',
		stars: 1,
		lastUpdated: 1707605231134
	},
	{
		_id: {
			$oid: '65c839da5e3a67f165cb0efb'
		},
		enabled: true,
		userId: '486396074282450946',
		messageId: '1206073780414451782',
		channelId: '1145593489216786532',
		guildId: '1117671374052397136',
		starMessageId: '1206073916607561818',
		stars: 1,
		lastUpdated: 1707620826848
	},
	{
		_id: {
			$oid: '65c9ba3f5e3a67f165cb0efc'
		},
		enabled: true,
		userId: '486396074282450946',
		messageId: '1206486141633699880',
		channelId: '1145593489216786532',
		guildId: '1117671374052397136',
		starMessageId: '1206486654538350622',
		stars: 1,
		lastUpdated: 1707719231261
	},
	{
		_id: {
			$oid: '65d638725e3a67f165cb0efd'
		},
		enabled: true,
		userId: '852428177816551454',
		messageId: '1209886715834142800',
		channelId: '1145593489216786532',
		guildId: '1117671374052397136',
		starMessageId: '1209920696004644884',
		stars: 1,
		lastUpdated: 1708537970551
	},
	{
		_id: {
			$oid: '65dfa65c5e3a67f165cb0efe'
		},
		enabled: true,
		userId: '733163699912835082',
		messageId: '1212510221876863057',
		channelId: '1145593489216786532',
		guildId: '1117671374052397136',
		starMessageId: '1212512617713762417',
		stars: 1,
		lastUpdated: 1709155932876
	},
	{
		_id: {
			$oid: '65dfa73e5e3a67f165cb0eff'
		},
		enabled: true,
		userId: '440228126925258753',
		messageId: '1212509544232656978',
		channelId: '1145593489216786532',
		guildId: '1117671374052397136',
		starMessageId: '1212513565911818310',
		stars: 1,
		lastUpdated: 1709156158912
	},
	{
		_id: {
			$oid: '65e010755e3a67f165cb0f00'
		},
		enabled: true,
		userId: '440228126925258753',
		messageId: '1212621140497924137',
		channelId: '1145593489216786532',
		guildId: '1117671374052397136',
		starMessageId: '1212626538835480616',
		stars: 1,
		lastUpdated: 1709183093741
	},
	{
		_id: {
			$oid: '65e135bf5e3a67f165cb0f01'
		},
		enabled: true,
		userId: '681705152310411282',
		messageId: '1212941265818230784',
		channelId: '1145593489216786532',
		guildId: '1117671374052397136',
		starMessageId: '1212941453035307110',
		stars: 1,
		lastUpdated: 1709258175165
	},
	{
		_id: {
			$oid: '65e4326d5e3a67f165cb0f02'
		},
		enabled: true,
		userId: '440228126925258753',
		messageId: '1213762484381417493',
		channelId: '1145593489216786532',
		guildId: '1117671374052397136',
		starMessageId: '1213762523971457035',
		stars: 1,
		lastUpdated: 1709453933811
	},
	{
		_id: {
			$oid: '65f664815e3a67f165cb0f04'
		},
		enabled: true,
		userId: '733163699912835082',
		messageId: '1218750302392422520',
		channelId: '1117679394257895424',
		guildId: '1117671374052397136',
		starMessageId: '1218764095059398766',
		stars: 1,
		lastUpdated: 1710646401195
	},
	{
		_id: {
			$oid: '65f664865e3a67f165cb0f05'
		},
		enabled: true,
		userId: '733163699912835082',
		messageId: '1218750306750562375',
		channelId: '1117679394257895424',
		guildId: '1117671374052397136',
		starMessageId: '1218764116575912058',
		stars: 1,
		lastUpdated: 1710646406314
	},
	{
		_id: {
			$oid: '65fe60285e3a67f165cb0f06'
		},
		enabled: true,
		userId: '733163699912835082',
		messageId: '1220779034976190478',
		channelId: '1117679394257895424',
		guildId: '1117671374052397136',
		starMessageId: '1220958450033496174',
		stars: 2,
		lastUpdated: 1711169576186
	},
	{
		_id: {
			$oid: '65fe602e5e3a67f165cb0f07'
		},
		enabled: true,
		userId: '998409917767618711',
		messageId: '1220882054057558098',
		channelId: '1117679394257895424',
		guildId: '1117671374052397136',
		starMessageId: '1220958477531349052',
		stars: 1,
		lastUpdated: 1711169582754
	},
	{
		_id: {
			$oid: '6603ad6c5e3a67f165cb0f0a'
		},
		enabled: true,
		userId: '733163699912835082',
		messageId: '1222406926168621077',
		channelId: '1117679394257895424',
		guildId: '1117671374052397136',
		starMessageId: '1222415804671463435',
		stars: 1,
		lastUpdated: 1711517036580
	},
	{
		_id: {
			$oid: '660759c25e3a67f165cb0f0b'
		},
		enabled: true,
		userId: '727005722671317054',
		messageId: '1223393402440257649',
		channelId: '1145593489216786532',
		guildId: '1117671374052397136',
		starMessageId: '1223425483836883024',
		stars: 2,
		lastUpdated: 1711757762859
	},
	{
		_id: {
			$oid: '6607a2b65e3a67f165cb0f0c'
		},
		enabled: true,
		userId: '727005722671317054',
		messageId: '1223503770458001459',
		channelId: '1119500335807995935',
		guildId: '1117671374052397136',
		starMessageId: '1223503815333122059',
		stars: 1,
		lastUpdated: 1711776438542
	},
	{
		_id: {
			$oid: '660efca15e3a67f165cb0f0d'
		},
		enabled: true,
		userId: '733163699912835082',
		messageId: '1225338073705877554',
		channelId: '1117679394257895424',
		guildId: '1117671374052397136',
		starMessageId: '1225524509659103292',
		stars: 1,
		lastUpdated: 1712258209632
	},
	{
		_id: {
			$oid: '660efca65e3a67f165cb0f0e'
		},
		enabled: true,
		userId: '733163699912835082',
		messageId: '1225338078680322048',
		channelId: '1117679394257895424',
		guildId: '1117671374052397136',
		starMessageId: '1225524530613715137',
		stars: 1,
		lastUpdated: 1712258214634
	},
	{
		_id: {
			$oid: '660f56525e3a67f165cb0f0f'
		},
		enabled: true,
		userId: '681705152310411282',
		messageId: '1225620565017100348',
		channelId: '1117679394257895424',
		guildId: '1117671374052397136',
		starMessageId: '1225620812929695845',
		stars: 1,
		lastUpdated: 1712281170121
	},
	{
		_id: {
			$oid: '660f819b5e3a67f165cb0f10'
		},
		enabled: true,
		userId: '733163699912835082',
		messageId: '1225667231388532809',
		channelId: '1145593489216786532',
		guildId: '1117671374052397136',
		starMessageId: '1225667292235300884',
		stars: 1,
		lastUpdated: 1712292251661
	},
	{
		_id: {
			$oid: '660f81b55e3a67f165cb0f11'
		},
		enabled: true,
		userId: '486396074282450946',
		messageId: '1225666950500192297',
		channelId: '1145593489216786532',
		guildId: '1117671374052397136',
		starMessageId: '1225667401421422683',
		stars: 1,
		lastUpdated: 1712292277676
	},
	{
		_id: {
			$oid: '660f81ba5e3a67f165cb0f12'
		},
		enabled: true,
		userId: '852428177816551454',
		messageId: '1225667045333532712',
		channelId: '1145593489216786532',
		guildId: '1117671374052397136',
		starMessageId: '1225667422762172436',
		stars: 1,
		lastUpdated: 1712292282789
	},
	{
		_id: {
			$oid: '660f81c65e3a67f165cb0f13'
		},
		enabled: true,
		userId: '733163699912835082',
		messageId: '1225667082838872126',
		channelId: '1145593489216786532',
		guildId: '1117671374052397136',
		starMessageId: '1225667473588883468',
		stars: 1,
		lastUpdated: 1712292294975
	},
	{
		_id: {
			$oid: '66101ef25e3a67f165cb0f14'
		},
		enabled: true,
		userId: '486396074282450946',
		messageId: '1225667092116672622',
		channelId: '1145593489216786532',
		guildId: '1117671374052397136',
		starMessageId: '1225836236061671476',
		stars: 1,
		lastUpdated: 1712332530988
	},
	{
		_id: {
			$oid: '66105aac5e3a67f165cb0f15'
		},
		enabled: true,
		userId: '486396074282450946',
		messageId: '1225670463246700594',
		channelId: '1145593489216786532',
		guildId: '1117671374052397136',
		starMessageId: '1225900362964271206',
		stars: 1,
		lastUpdated: 1712347820053
	},
	{
		_id: {
			$oid: '6611c91c5e3a67f165cb0f16'
		},
		enabled: true,
		userId: '727005722671317054',
		messageId: '1226279050046345277',
		channelId: '1145593489216786532',
		guildId: '1117671374052397136',
		starMessageId: '1226293824838434848',
		stars: 1,
		lastUpdated: 1712441628741
	},
	{
		_id: {
			$oid: '6611c9315e3a67f165cb0f17'
		},
		enabled: true,
		userId: '727649973180694638',
		messageId: '1226119574743941171',
		channelId: '1121249234906251324',
		guildId: '1117671374052397136',
		starMessageId: '1226293913531187294',
		stars: 1,
		lastUpdated: 1712441649816
	},
	{
		_id: {
			$oid: '661206ce5e3a67f165cb0f18'
		},
		enabled: true,
		userId: '733163699912835082',
		messageId: '1226334602600382524',
		channelId: '1117679394257895424',
		guildId: '1117671374052397136',
		starMessageId: '1226360068920971297',
		stars: 1,
		lastUpdated: 1712457422537
	},
	{
		_id: {
			$oid: '66141b935e3a67f165cb0f19'
		},
		enabled: true,
		userId: '974772830052962386',
		messageId: '1226932026448416920',
		channelId: '1117679394257895424',
		guildId: '1117671374052397136',
		starMessageId: '1226932125043785829',
		stars: 1,
		lastUpdated: 1712593811234
	},
	{
		_id: {
			$oid: '661843a15e3a67f165cb0f1a'
		},
		enabled: true,
		userId: '733163699912835082',
		messageId: '1228054125472649276',
		channelId: '1117679394257895424',
		guildId: '1117671374052397136',
		starMessageId: '1228074647342419968',
		stars: 1,
		lastUpdated: 1712866209675
	},
	{
		_id: {
			$oid: '661843a65e3a67f165cb0f1b'
		},
		enabled: true,
		userId: '733163699912835082',
		messageId: '1228054145974669352',
		channelId: '1117679394257895424',
		guildId: '1117671374052397136',
		starMessageId: '1228074667617685646',
		stars: 1,
		lastUpdated: 1712866214697
	},
	{
		_id: {
			$oid: '661c65f45e3a67f165cb0f1c'
		},
		enabled: true,
		userId: '440228126925258753',
		messageId: '1229088342373830757',
		channelId: '1145593489216786532',
		guildId: '1117671374052397136',
		starMessageId: '1229211015036669993',
		stars: 1,
		lastUpdated: 1713137140966
	},
	{
		_id: {
			$oid: '661c93875e3a67f165cb0f1d'
		},
		enabled: true,
		userId: '733163699912835082',
		messageId: '1229211250362286110',
		channelId: '1117679394257895424',
		guildId: '1117671374052397136',
		starMessageId: '1229259947569709168',
		stars: 1,
		lastUpdated: 1713148807406
	},
	{
		_id: {
			$oid: '661c938c5e3a67f165cb0f1e'
		},
		enabled: true,
		userId: '733163699912835082',
		messageId: '1229211256830034001',
		channelId: '1117679394257895424',
		guildId: '1117671374052397136',
		starMessageId: '1229259968323260547',
		stars: 1,
		lastUpdated: 1713148812501
	},
	{
		_id: {
			$oid: '661fe6e05e3a67f165cb0f1f'
		},
		enabled: true,
		userId: '733163699912835082',
		messageId: '1230166476112003163',
		channelId: '1117679394257895424',
		guildId: '1117671374052397136',
		starMessageId: '1230174075054325792',
		stars: 1,
		lastUpdated: 1713366752480
	},
	{
		_id: {
			$oid: '661fe6e55e3a67f165cb0f20'
		},
		enabled: true,
		userId: '733163699912835082',
		messageId: '1230166512464035940',
		channelId: '1117679394257895424',
		guildId: '1117671374052397136',
		starMessageId: '1230174096629825637',
		stars: 1,
		lastUpdated: 1713366757577
	},
	{
		_id: {
			$oid: '6626acb85e3a67f165cb0f21'
		},
		enabled: true,
		userId: '733163699912835082',
		messageId: '1232030921788751953',
		channelId: '1117679394257895424',
		guildId: '1117671374052397136',
		starMessageId: '1232035777131839638',
		stars: 1,
		lastUpdated: 1713810616765
	},
	{
		_id: {
			$oid: '6626acbd5e3a67f165cb0f22'
		},
		enabled: true,
		userId: '733163699912835082',
		messageId: '1232030940172128337',
		channelId: '1117679394257895424',
		guildId: '1117671374052397136',
		starMessageId: '1232035798543765584',
		stars: 1,
		lastUpdated: 1713810621873
	},
	{
		_id: {
			$oid: '662f2bc05e3a67f165cb0f23'
		},
		enabled: true,
		userId: '727005722671317054',
		messageId: '1234369748280807478',
		channelId: '1145593489216786532',
		guildId: '1117671374052397136',
		starMessageId: '1234371199186894940',
		stars: 1,
		lastUpdated: 1714367424725
	},
	{
		_id: {
			$oid: '6630309f5e3a67f165cb0f24'
		},
		enabled: true,
		userId: '733163699912835082',
		messageId: '1234641167501496433',
		channelId: '1117679394257895424',
		guildId: '1117671374052397136',
		starMessageId: '1234651307042934875',
		stars: 1,
		lastUpdated: 1714434207688
	},
	{
		_id: {
			$oid: '663030a45e3a67f165cb0f25'
		},
		enabled: true,
		userId: '733163699912835082',
		messageId: '1234641176477433856',
		channelId: '1117679394257895424',
		guildId: '1117671374052397136',
		starMessageId: '1234651328379355216',
		stars: 1,
		lastUpdated: 1714434212777
	},
	{
		_id: {
			$oid: '66325ffe5e3a67f165cb0f26'
		},
		enabled: true,
		userId: '974772830052962386',
		messageId: '1235251872546164756',
		channelId: '1117679394257895424',
		guildId: '1117671374052397136',
		starMessageId: '1235251928552968202',
		stars: 1,
		lastUpdated: 1714577406990
	},
	{
		_id: {
			$oid: '6632631d5e3a67f165cb0f27'
		},
		enabled: true,
		userId: '733163699912835082',
		messageId: '1235253742581059715',
		channelId: '1117679394257895424',
		guildId: '1117671374052397136',
		starMessageId: '1235255276157014190',
		stars: 1,
		lastUpdated: 1714578205243
	},
	{
		_id: {
			$oid: '6632a0955e3a67f165cb0f28'
		},
		enabled: true,
		userId: '852428177816551454',
		messageId: '1235321197940707369',
		channelId: '1145593489216786532',
		guildId: '1117671374052397136',
		starMessageId: '1235321276961128519',
		stars: 1,
		lastUpdated: 1714593941035
	},
	{
		_id: {
			$oid: '6634d6d75e3a67f165cb0f29'
		},
		enabled: true,
		userId: '733163699912835082',
		messageId: '1235846431911182398',
		channelId: '1117679394257895424',
		guildId: '1117671374052397136',
		starMessageId: '1235929293146558514',
		stars: 1,
		lastUpdated: 1714738903305
	},
	{
		_id: {
			$oid: '6634d6dc5e3a67f165cb0f2a'
		},
		enabled: true,
		userId: '733163699912835082',
		messageId: '1235846463465066558',
		channelId: '1117679394257895424',
		guildId: '1117671374052397136',
		starMessageId: '1235929314181255168',
		stars: 1,
		lastUpdated: 1714738908345
	},
	{
		_id: {
			$oid: '66352b0b5e3a67f165cb0f2b'
		},
		enabled: true,
		userId: '733163699912835082',
		messageId: '1236002629633572934',
		channelId: '1117679394257895424',
		guildId: '1117671374052397136',
		starMessageId: '1236019706406899752',
		stars: 1,
		lastUpdated: 1714760459497
	},
	{
		_id: {
			$oid: '66352b105e3a67f165cb0f2c'
		},
		enabled: true,
		userId: '733163699912835082',
		messageId: '1236002639217426452',
		channelId: '1117679394257895424',
		guildId: '1117671374052397136',
		starMessageId: '1236019727457980427',
		stars: 1,
		lastUpdated: 1714760464534
	},
	{
		_id: {
			$oid: '66352b115e3a67f165cb0f2d'
		},
		enabled: true,
		userId: '486396074282450946',
		messageId: '1235935196319318086',
		channelId: '1149953027231449149',
		guildId: '1117671374052397136',
		starMessageId: '1236019730201186435',
		stars: 1,
		lastUpdated: 1714760465131
	},
	{
		_id: {
			$oid: '6637703d5e3a67f165cb0f2e'
		},
		enabled: true,
		userId: '733163699912835082',
		messageId: '1236355556210376874',
		channelId: '1117679394257895424',
		guildId: '1117671374052397136',
		starMessageId: '1236643760809578608',
		stars: 1,
		lastUpdated: 1714909245677
	},
	{
		_id: {
			$oid: '663770435e3a67f165cb0f2f'
		},
		enabled: true,
		userId: '733163699912835082',
		messageId: '1236355584446431313',
		channelId: '1117679394257895424',
		guildId: '1117671374052397136',
		starMessageId: '1236643783349768242',
		stars: 1,
		lastUpdated: 1714909251079
	},
	{
		_id: {
			$oid: '663770475e3a67f165cb0f30'
		},
		enabled: true,
		userId: '974772830052962386',
		messageId: '1236356519168311389',
		channelId: '1117679394257895424',
		guildId: '1117671374052397136',
		starMessageId: '1236643803348205641',
		stars: 1,
		lastUpdated: 1714909255916
	},
	{
		_id: {
			$oid: '663873e55e3a67f165cb0f31'
		},
		enabled: true,
		userId: '486396074282450946',
		messageId: '1236896063491674132',
		channelId: '1145593489216786532',
		guildId: '1117671374052397136',
		starMessageId: '1236922563548942366',
		stars: 1,
		lastUpdated: 1714975717446
	},
	{
		_id: {
			$oid: '663873ea5e3a67f165cb0f32'
		},
		enabled: true,
		userId: '733163699912835082',
		messageId: '1236854384294498366',
		channelId: '1145593489216786532',
		guildId: '1117671374052397136',
		starMessageId: '1236922585183162438',
		stars: 1,
		lastUpdated: 1714975722596
	},
	{
		_id: {
			$oid: '66391e045e3a67f165cb0f33'
		},
		enabled: true,
		userId: '733163699912835082',
		messageId: '1237074019992338453',
		channelId: '1117679394257895424',
		guildId: '1117671374052397136',
		starMessageId: '1237105227937874040',
		stars: 1,
		lastUpdated: 1715019268032
	},
	{
		_id: {
			$oid: '66391e095e3a67f165cb0f34'
		},
		enabled: true,
		userId: '733163699912835082',
		messageId: '1237074035091832854',
		channelId: '1117679394257895424',
		guildId: '1117671374052397136',
		starMessageId: '1237105248984633405',
		stars: 1,
		lastUpdated: 1715019273039
	},
	{
		_id: {
			$oid: '6639381b5e3a67f165cb0f35'
		},
		enabled: true,
		userId: '440228126925258753',
		messageId: '1237130682778783774',
		channelId: '1117679394257895424',
		guildId: '1117671374052397136',
		starMessageId: '1237133243573080114',
		stars: 1,
		lastUpdated: 1715025947458
	},
	{
		_id: {
			$oid: '663ace825e3a67f165cb0f37'
		},
		enabled: true,
		userId: '733163699912835082',
		messageId: '1237536208637399151',
		channelId: '1117679394257895424',
		guildId: '1117671374052397136',
		starMessageId: '1237569613261312010',
		stars: 1,
		lastUpdated: 1715129986131
	},
	{
		_id: {
			$oid: '663ace875e3a67f165cb0f38'
		},
		enabled: true,
		userId: '733163699912835082',
		messageId: '1237536220125593600',
		channelId: '1117679394257895424',
		guildId: '1117671374052397136',
		starMessageId: '1237569635046654045',
		stars: 1,
		lastUpdated: 1715129991239
	},
	{
		_id: {
			$oid: '663ad91a5e3a67f165cb0f39'
		},
		enabled: true,
		userId: '486396074282450946',
		messageId: '1237578093967704074',
		channelId: '1145593489216786532',
		guildId: '1117671374052397136',
		starMessageId: '1237580989769842738',
		stars: 1,
		lastUpdated: 1715132698486
	},
	{
		_id: {
			$oid: '664048415e3a67f165cb0f3a'
		},
		enabled: true,
		userId: '440228126925258753',
		messageId: '1239074537656684596',
		channelId: '1119500335807995935',
		guildId: '1117671374052397136',
		starMessageId: '1239074727612645449',
		stars: 1,
		lastUpdated: 1715488833333
	},
	{
		_id: {
			$oid: '664049d75e3a67f165cb0f3b'
		},
		enabled: true,
		userId: '486396074282450946',
		messageId: '1239076278833774593',
		channelId: '1145593489216786532',
		guildId: '1117671374052397136',
		starMessageId: '1239076432546631733',
		stars: 1,
		lastUpdated: 1715489239829
	},
	{
		_id: {
			$oid: '66404a265e3a67f165cb0f3c'
		},
		enabled: true,
		userId: '486396074282450946',
		messageId: '1239076546476642334',
		channelId: '1145593489216786532',
		guildId: '1117671374052397136',
		starMessageId: '1239076763523485756',
		stars: 1,
		lastUpdated: 1715489318762
	},
	{
		_id: {
			$oid: '66404a445e3a67f165cb0f3d'
		},
		enabled: true,
		userId: '486396074282450946',
		messageId: '1239076793693241375',
		channelId: '1145593489216786532',
		guildId: '1117671374052397136',
		starMessageId: '1239076888115150870',
		stars: 1,
		lastUpdated: 1715489348452
	},
	{
		_id: {
			$oid: '66404ca45e3a67f165cb0f3e'
		},
		enabled: true,
		userId: '486396074282450946',
		messageId: '1239079397793726535',
		channelId: '1145593489216786532',
		guildId: '1117671374052397136',
		starMessageId: '1239079438101250129',
		stars: 1,
		lastUpdated: 1715489956370
	},
	{
		_id: {
			$oid: '664050505e3a67f165cb0f3f'
		},
		enabled: true,
		userId: '733163699912835082',
		messageId: '1239083289000804416',
		channelId: '1145593489216786532',
		guildId: '1117671374052397136',
		starMessageId: '1239083381988261888',
		stars: 1,
		lastUpdated: 1715490896623
	},
	{
		_id: {
			$oid: '6640505b5e3a67f165cb0f40'
		},
		enabled: true,
		userId: '486396074282450946',
		messageId: '1239081338443665521',
		channelId: '1145593489216786532',
		guildId: '1117671374052397136',
		starMessageId: '1239083427492532264',
		stars: 1,
		lastUpdated: 1715490907571
	},
	{
		_id: {
			$oid: '664050605e3a67f165cb0f41'
		},
		enabled: true,
		userId: '733163699912835082',
		messageId: '1239081610746265642',
		channelId: '1145593489216786532',
		guildId: '1117671374052397136',
		starMessageId: '1239083448644272139',
		stars: 1,
		lastUpdated: 1715490912679
	},
	{
		_id: {
			$oid: '664050655e3a67f165cb0f42'
		},
		enabled: true,
		userId: '486396074282450946',
		messageId: '1239082398004547604',
		channelId: '1145593489216786532',
		guildId: '1117671374052397136',
		starMessageId: '1239083470488080396',
		stars: 1,
		lastUpdated: 1715490917777
	},
	{
		_id: {
			$oid: '6640506a5e3a67f165cb0f43'
		},
		enabled: true,
		userId: '486396074282450946',
		messageId: '1239083427492401273',
		channelId: '1145593489216786532',
		guildId: '1117671374052397136',
		starMessageId: '1239083491879288872',
		stars: 1,
		lastUpdated: 1715490922891
	},
	{
		_id: {
			$oid: '664052d65e3a67f165cb0f44'
		},
		enabled: true,
		userId: '727005722671317054',
		messageId: '1239086064455647363',
		channelId: '1145593489216786532',
		guildId: '1117671374052397136',
		starMessageId: '1239086090279977023',
		stars: 1,
		lastUpdated: 1715491542426
	},
	{
		_id: {
			$oid: '664052eb5e3a67f165cb0f45'
		},
		enabled: true,
		userId: '727005722671317054',
		messageId: '1239086150463783003',
		channelId: '1145593489216786532',
		guildId: '1117671374052397136',
		starMessageId: '1239086179173928981',
		stars: 1,
		lastUpdated: 1715491563622
	},
	{
		_id: {
			$oid: '664443915e3a67f165cb0f46'
		},
		enabled: true,
		userId: '440228126925258753',
		messageId: '1240166077351202828',
		channelId: '1117679394257895424',
		guildId: '1117671374052397136',
		starMessageId: '1240169206666760214',
		stars: 1,
		lastUpdated: 1715749777546
	},
	{
		_id: {
			$oid: '664ad1905e3a67f165cb0f47'
		},
		enabled: true,
		userId: '727649973180694638',
		messageId: '1241970762013737070',
		channelId: '1119500335807995935',
		guildId: '1117671374052397136',
		starMessageId: '1241970939475005440',
		stars: 1,
		lastUpdated: 1716179344029
	},
	{
		_id: {
			$oid: '664c16b15e3a67f165cb0f48'
		},
		enabled: true,
		userId: '764260116521287712',
		messageId: '1242229344781336707',
		channelId: '1145593489216786532',
		guildId: '1117671374052397136',
		starMessageId: '1242320046961987645',
		stars: 1,
		lastUpdated: 1716262577732
	},
	{
		_id: {
			$oid: '664c3dce5e3a67f165cb0f49'
		},
		enabled: true,
		userId: '713246081286406194',
		messageId: '1242326958214479922',
		channelId: '1145593489216786532',
		guildId: '1117671374052397136',
		starMessageId: '1242362041646317589',
		stars: 1,
		lastUpdated: 1716272590080
	},
	{
		_id: {
			$oid: '664d88975e3a67f165cb0f4a'
		},
		enabled: true,
		userId: '733163699912835082',
		messageId: '1242669164188139550',
		channelId: '1117679394257895424',
		guildId: '1117671374052397136',
		starMessageId: '1242717219041972285',
		stars: 1,
		lastUpdated: 1716357271031
	},
	{
		_id: {
			$oid: '664d8df25e3a67f165cb0f4b'
		},
		enabled: true,
		userId: '440228126925258753',
		messageId: '1242717184887754844',
		channelId: '1117679394257895424',
		guildId: '1117671374052397136',
		starMessageId: '1242722971689422938',
		stars: 1,
		lastUpdated: 1716358642514
	},
	{
		_id: {
			$oid: '664ea62d5e3a67f165cb0f4c'
		},
		enabled: true,
		userId: '733163699912835082',
		messageId: '1243020652345167944',
		channelId: '1117679394257895424',
		guildId: '1117671374052397136',
		starMessageId: '1243023867589689345',
		stars: 1,
		lastUpdated: 1716430381750
	},
	{
		_id: {
			$oid: '6657205e5e3a67f165cb0f4d'
		},
		enabled: true,
		userId: '727649973180694638',
		messageId: '1245267124868350013',
		channelId: '1121249234906251324',
		guildId: '1117671374052397136',
		starMessageId: '1245354093904531546',
		stars: 1,
		lastUpdated: 1716985950912
	},
	{
		_id: {
			$oid: '66580ca95e3a67f165cb0f4e'
		},
		enabled: true,
		userId: '727005722671317054',
		messageId: '1245589363866468463',
		channelId: '1121249234906251324',
		guildId: '1117671374052397136',
		starMessageId: '1245607810004160573',
		stars: 1,
		lastUpdated: 1717046441566
	},
	{
		_id: {
			$oid: '66580cae5e3a67f165cb0f4f'
		},
		enabled: true,
		userId: '727005722671317054',
		messageId: '1245589400587468861',
		channelId: '1121249234906251324',
		guildId: '1117671374052397136',
		starMessageId: '1245607830728343636',
		stars: 1,
		lastUpdated: 1717046446490
	},
	{
		_id: {
			$oid: '665aa2515e3a67f165cb0f51'
		},
		enabled: true,
		userId: '733163699912835082',
		messageId: '1246314206915989514',
		channelId: '1145593489216786532',
		guildId: '1117671374052397136',
		starMessageId: '1246318257850548294',
		stars: 1,
		lastUpdated: 1717215825549
	},
	{
		_id: {
			$oid: '665aaad45e3a67f165cb0f52'
		},
		enabled: true,
		userId: '440228126925258753',
		messageId: '1246313963868913724',
		channelId: '1145593489216786532',
		guildId: '1117671374052397136',
		starMessageId: '1246327396945100840',
		stars: 1,
		lastUpdated: 1717218004470
	},
	{
		_id: {
			$oid: '665bb0e45e3a67f165cb0f53'
		},
		enabled: true,
		userId: '852428177816551454',
		messageId: '1246603897406230620',
		channelId: '1145593489216786532',
		guildId: '1117671374052397136',
		starMessageId: '1246608783694630983',
		stars: 1,
		lastUpdated: 1717285092303
	},
	{
		_id: {
			$oid: '665d27005e3a67f165cb0f54'
		},
		enabled: true,
		userId: '486396074282450946',
		messageId: '1246995437085265962',
		channelId: '1121249234906251324',
		guildId: '1117671374052397136',
		starMessageId: '1247010479075885067',
		stars: 1,
		lastUpdated: 1717380864012
	},
	{
		_id: {
			$oid: '665d657d5e3a67f165cb0f55'
		},
		enabled: true,
		userId: '727005722671317054',
		messageId: '1247072839475925115',
		channelId: '1145593489216786532',
		guildId: '1117671374052397136',
		starMessageId: '1247077578775334992',
		stars: 2,
		lastUpdated: 1717396861765
	},
	{
		_id: {
			$oid: '6665160b5e3a67f165cb0f58'
		},
		enabled: true,
		userId: '733163699912835082',
		messageId: '1249083410522308710',
		channelId: '1117679394257895424',
		guildId: '1117671374052397136',
		starMessageId: '1249191298729115718',
		stars: 1,
		lastUpdated: 1717900811863
	},
	{
		_id: {
			$oid: '666540cb5e3a67f165cb0f59'
		},
		enabled: true,
		userId: '486396074282450946',
		messageId: '1249207616798986300',
		channelId: '1145593489216786532',
		guildId: '1117671374052397136',
		starMessageId: '1249237197706756157',
		stars: 1,
		lastUpdated: 1717911755001
	},
	{
		_id: {
			$oid: '6666728f40927e66645e8ec2'
		},
		enabled: true,
		userId: '440228126925258753',
		messageId: '1249417336138498138',
		channelId: '1145593489216786532',
		guildId: '1117671374052397136',
		starMessageId: '1249565510991876128',
		stars: 1,
		lastUpdated: 1717990031057
	},
	{
		_id: {
			$oid: '6666927c40927e66645e8ec3'
		},
		enabled: true,
		userId: '486396074282450946',
		messageId: '1249565708384206858',
		channelId: '1144155849053454397',
		guildId: '1117671374052397136',
		starMessageId: '1249599793853108287',
		stars: 1,
		lastUpdated: 1717998204696
	},
	{
		_id: {
			$oid: '6666930c40927e66645e8ec4'
		},
		enabled: true,
		userId: '440228126925258753',
		messageId: '1249600354132164718',
		channelId: '1119500335807995935',
		guildId: '1117671374052397136',
		starMessageId: '1249600519627079680',
		stars: 2,
		lastUpdated: 1717998348762
	},
	{
		_id: {
			$oid: '6666937540927e66645e8ec5'
		},
		enabled: true,
		userId: '440228126925258753',
		messageId: '1249600721406529627',
		channelId: '1119500335807995935',
		guildId: '1117671374052397136',
		starMessageId: '1249600838822002771',
		stars: 2,
		lastUpdated: 1717998453823
	},
	{
		_id: {
			$oid: '6666a00640927e66645eb47f'
		},
		enabled: true,
		userId: '727649973180694638',
		messageId: '1249614276847468627',
		channelId: '1119500335807995935',
		guildId: '1117671374052397136',
		starMessageId: '1249614328903106632',
		stars: 1,
		lastUpdated: 1718001670166
	},
	{
		_id: {
			$oid: '6666abdc40927e66646ef3bb'
		},
		enabled: true,
		userId: '733163699912835082',
		messageId: '1249626994568859648',
		channelId: '1119500335807995935',
		guildId: '1117671374052397136',
		starMessageId: '1249627047114969128',
		stars: 2,
		lastUpdated: 1718004700787
	},
	{
		_id: {
			$oid: '6666ae3b40927e66646ef3bc'
		},
		enabled: true,
		userId: '733163699912835082',
		messageId: '1249629518361002004',
		channelId: '1119500335807995935',
		guildId: '1117671374052397136',
		starMessageId: '1249629586849927203',
		stars: 1,
		lastUpdated: 1718005307969
	},
	{
		_id: {
			$oid: '6666b07840927e66646ef3bd'
		},
		enabled: true,
		userId: '764260116521287712',
		messageId: '1249631900126023721',
		channelId: '1119500335807995935',
		guildId: '1117671374052397136',
		starMessageId: '1249631989477408768',
		stars: 1,
		lastUpdated: 1718005880711
	},
	{
		_id: {
			$oid: '6667c5e040927e6664b1741c'
		},
		enabled: true,
		userId: '727649973180694638',
		messageId: '1249929810197614634',
		channelId: '1145593489216786532',
		guildId: '1117671374052397136',
		starMessageId: '1249929849577930773',
		stars: 2,
		lastUpdated: 1718076896205
	},
	{
		_id: {
			$oid: '6668d5c840927e6664fb0677'
		},
		enabled: true,
		userId: '486396074282450946',
		messageId: '1250220024430461031',
		channelId: '1145593489216786532',
		guildId: '1117671374052397136',
		starMessageId: '1250221808637051011',
		stars: 3,
		lastUpdated: 1718146504556
	},
	{
		_id: {
			$oid: '666b4c5940927e6664aa5c19'
		},
		enabled: true,
		userId: '486396074282450946',
		messageId: '1250791526599098369',
		channelId: '1145593489216786532',
		guildId: '1117671374052397136',
		starMessageId: '1250898875519209595',
		stars: 1,
		lastUpdated: 1718307929959
	},
	{
		_id: {
			$oid: '666b4c6240927e6664aa5c1a'
		},
		enabled: true,
		userId: '486396074282450946',
		messageId: '1250758246898204715',
		channelId: '1145593489216786532',
		guildId: '1117671374052397136',
		starMessageId: '1250898912051466270',
		stars: 1,
		lastUpdated: 1718307938607
	},
	{
		_id: {
			$oid: '666b9d2b40927e6664c9f3f2'
		},
		enabled: true,
		userId: '486396074282450946',
		messageId: '1250957055293001810',
		channelId: '1145593489216786532',
		guildId: '1117671374052397136',
		starMessageId: '1250985655106932747',
		stars: 1,
		lastUpdated: 1718328619712
	},
	{
		_id: {
			$oid: '666d1fa840927e666433a505'
		},
		enabled: true,
		userId: '832415994000965692',
		messageId: '1251385136780411021',
		channelId: '1119500335807995935',
		guildId: '1117671374052397136',
		starMessageId: '1251400640509251696',
		stars: 1,
		lastUpdated: 1718427560013
	},
	{
		_id: {
			$oid: '666d38f240927e66643cac1f'
		},
		enabled: true,
		userId: '486396074282450946',
		messageId: '1251427688044957738',
		channelId: '1119500335807995935',
		guildId: '1117671374052397136',
		starMessageId: '1251427796769570817',
		stars: 3,
		lastUpdated: 1718434034550
	},
	{
		_id: {
			$oid: '666d3f7440927e66643cac20'
		},
		enabled: true,
		userId: '440228126925258753',
		messageId: '1251433966892879903',
		channelId: '1119500335807995935',
		guildId: '1117671374052397136',
		starMessageId: '1251434784933150790',
		stars: 1,
		lastUpdated: 1718435700588
	},
	{
		_id: {
			$oid: '666d3f7a40927e66643cac21'
		},
		enabled: true,
		userId: '733163699912835082',
		messageId: '1251428352162664448',
		channelId: '1119500335807995935',
		guildId: '1117671374052397136',
		starMessageId: '1251434807896834079',
		stars: 1,
		lastUpdated: 1718435706128
	},
	{
		_id: {
			$oid: '666d3f7e40927e66643cac22'
		},
		enabled: true,
		userId: '733163699912835082',
		messageId: '1251428532115214358',
		channelId: '1119500335807995935',
		guildId: '1117671374052397136',
		starMessageId: '1251434827639554100',
		stars: 1,
		lastUpdated: 1718435710917
	},
	{
		_id: {
			$oid: '666d43f440927e66643cac23'
		},
		enabled: true,
		userId: '733163699912835082',
		messageId: '1251438173947433010',
		channelId: '1119500335807995935',
		guildId: '1117671374052397136',
		starMessageId: '1251439615454347315',
		stars: 1,
		lastUpdated: 1718436852419
	},
	{
		_id: {
			$oid: '666d43f940927e66643cac24'
		},
		enabled: true,
		userId: '733163699912835082',
		messageId: '1251438191102267392',
		channelId: '1119500335807995935',
		guildId: '1117671374052397136',
		starMessageId: '1251439636786577448',
		stars: 1,
		lastUpdated: 1718436857360
	},
	{
		_id: {
			$oid: '666d43ff40927e66643cac25'
		},
		enabled: true,
		userId: '733163699912835082',
		messageId: '1251439587717414982',
		channelId: '1119500335807995935',
		guildId: '1117671374052397136',
		starMessageId: '1251439662812102728',
		stars: 1,
		lastUpdated: 1718436863594
	},
	{
		_id: {
			$oid: '666d446740927e66643cac26'
		},
		enabled: true,
		userId: '733163699912835082',
		messageId: '1251439924272435251',
		channelId: '1119500335807995935',
		guildId: '1117671374052397136',
		starMessageId: '1251440098109689897',
		stars: 1,
		lastUpdated: 1718436967485
	},
	{
		_id: {
			$oid: '666e660a40927e66649660bb'
		},
		enabled: true,
		userId: '733163699912835082',
		messageId: '1251686293763522642',
		channelId: '1121249234906251324',
		guildId: '1117671374052397136',
		starMessageId: '1251751093814427709',
		stars: 1,
		lastUpdated: 1718511114570
	},
	{
		_id: {
			$oid: '666ffa4840927e666407d3d0'
		},
		enabled: true,
		userId: '852428177816551454',
		messageId: '1252167428016967680',
		channelId: '1145593489216786532',
		guildId: '1117671374052397136',
		starMessageId: '1252185145700651070',
		stars: 1,
		lastUpdated: 1718614600589
	},
	{
		_id: {
			$oid: '66738a1640927e66640cd6fc'
		},
		enabled: true,
		userId: '733163699912835082',
		messageId: '1253157196301209703',
		channelId: '1117679394257895424',
		guildId: '1117671374052397136',
		starMessageId: '1253164189346959391',
		stars: 1,
		lastUpdated: 1718848022805
	},
	{
		_id: {
			$oid: '66738a1c40927e66640cd6fd'
		},
		enabled: true,
		userId: '486396074282450946',
		messageId: '1253160084687552602',
		channelId: '1145593489216786532',
		guildId: '1117671374052397136',
		starMessageId: '1253164214852386930',
		stars: 1,
		lastUpdated: 1718848028972
	},
	{
		_id: {
			$oid: '6673964140927e66640efa83'
		},
		enabled: true,
		userId: '440228126925258753',
		messageId: '1253164309752844351',
		channelId: '1145593489216786532',
		guildId: '1117671374052397136',
		starMessageId: '1253177253983162422',
		stars: 1,
		lastUpdated: 1718851137731
	},
	{
		_id: {
			$oid: '6673bc6440927e66641cdf2e'
		},
		enabled: true,
		userId: '764260116521287712',
		messageId: '1253218139731132416',
		channelId: '1149953027231449149',
		guildId: '1117671374052397136',
		starMessageId: '1253218203514048593',
		stars: 1,
		lastUpdated: 1718860900751
	},
	{
		_id: {
			$oid: '6675e89e40927e6664c1be78'
		},
		enabled: true,
		userId: '440228126925258753',
		messageId: '1253813625899192372',
		channelId: '1119500335807995935',
		guildId: '1117671374052397136',
		starMessageId: '1253815444821901324',
		stars: 1,
		lastUpdated: 1719003294264
	},
	{
		_id: {
			$oid: '6675e8a340927e6664c1be79'
		},
		enabled: true,
		userId: '440228126925258753',
		messageId: '1253809306198085663',
		channelId: '1119500335807995935',
		guildId: '1117671374052397136',
		starMessageId: '1253815466473033760',
		stars: 1,
		lastUpdated: 1719003299359
	},
	{
		_id: {
			$oid: '667b837540927e6664ead984'
		},
		enabled: true,
		userId: '440228126925258753',
		messageId: '1255334771526205440',
		channelId: '1117679394257895424',
		guildId: '1117671374052397136',
		starMessageId: '1255356093740224522',
		stars: 1,
		lastUpdated: 1719370613520
	},
	{
		_id: {
			$oid: '668564ba40927e6664ead985'
		},
		enabled: true,
		userId: '733163699912835082',
		messageId: '1257970177169948682',
		channelId: '1117679394257895424',
		guildId: '1117671374052397136',
		starMessageId: '1258071875649536163',
		stars: 1,
		lastUpdated: 1720018106388
	},
	{
		_id: {
			$oid: '668564bf40927e6664ead986'
		},
		enabled: true,
		userId: '733163699912835082',
		messageId: '1257970185214623815',
		channelId: '1117679394257895424',
		guildId: '1117671374052397136',
		starMessageId: '1258071898047123648',
		stars: 1,
		lastUpdated: 1720018111748
	},
	{
		_id: {
			$oid: '6688cd9340927e6664ead987'
		},
		enabled: true,
		userId: '764260116521287712',
		messageId: '1259008976667021335',
		channelId: '1149953027231449149',
		guildId: '1117671374052397136',
		starMessageId: '1259009088772243467',
		stars: 2,
		lastUpdated: 1720241555415
	},
	{
		_id: {
			$oid: '6688e32940927e6664ead988'
		},
		enabled: true,
		userId: '764260116521287712',
		messageId: '1259032220937486357',
		channelId: '1149953027231449149',
		guildId: '1117671374052397136',
		starMessageId: '1259032268710744075',
		stars: 3,
		lastUpdated: 1720247081956
	},
	{
		_id: {
			$oid: '6690777c40927e6664ead989'
		},
		enabled: true,
		userId: '486396074282450946',
		messageId: '1261083545388978297',
		channelId: '1119500335807995935',
		guildId: '1117671374052397136',
		starMessageId: '1261115673103433819',
		stars: 1,
		lastUpdated: 1720743804323
	},
	{
		_id: {
			$oid: '6690d16940927e6664ead98c'
		},
		enabled: true,
		userId: '486396074282450946',
		messageId: '1261198290230313090',
		channelId: '1145593489216786532',
		guildId: '1117671374052397136',
		starMessageId: '1261212233049047050',
		stars: 1,
		lastUpdated: 1720766825940
	},
	{
		_id: {
			$oid: '6691b43140927e6664ead98d'
		},
		enabled: true,
		userId: '486396074282450946',
		messageId: '1261433563572867153',
		channelId: '1145593489216786532',
		guildId: '1117671374052397136',
		starMessageId: '1261455734307295375',
		stars: 2,
		lastUpdated: 1720824881177
	},
	{
		_id: {
			$oid: '6691fa5a40927e6664ead98e'
		},
		enabled: true,
		userId: '733163699912835082',
		messageId: '1261525360571580497',
		channelId: '1145593489216786532',
		guildId: '1117671374052397136',
		starMessageId: '1261531069862379584',
		stars: 1,
		lastUpdated: 1720842842625
	},
	{
		_id: {
			$oid: '6694cc4040927e6664ead98f'
		},
		enabled: true,
		userId: '852428177816551454',
		messageId: '1262280025701351505',
		channelId: '1145593489216786532',
		guildId: '1117671374052397136',
		starMessageId: '1262306201928994917',
		stars: 1,
		lastUpdated: 1721027648456
	},
	{
		_id: {
			$oid: '6696b2fe40927e6664ead990'
		},
		enabled: true,
		userId: '733163699912835082',
		messageId: '1262625452577521729',
		channelId: '1149953027231449149',
		guildId: '1117671374052397136',
		starMessageId: '1262828839185154139',
		stars: 1,
		lastUpdated: 1721152254848
	},
	{
		_id: {
			$oid: '6696b30740927e6664ead991'
		},
		enabled: true,
		userId: '713246081286406194',
		messageId: '1262625842903908443',
		channelId: '1149953027231449149',
		guildId: '1117671374052397136',
		starMessageId: '1262828874044149863',
		stars: 1,
		lastUpdated: 1721152263244
	},
	{
		_id: {
			$oid: '669fb21c40927e6664ead992'
		},
		enabled: true,
		userId: '486396074282450946',
		messageId: '1265159025939714189',
		channelId: '1145593489216786532',
		guildId: '1117671374052397136',
		starMessageId: '1265301791453479027',
		stars: 1,
		lastUpdated: 1721741852638
	},
	{
		_id: {
			$oid: '66a5c6ee40927e6664ead993'
		},
		enabled: true,
		userId: '483307716614553601',
		messageId: '1266971899938996287',
		channelId: '1145593489216786532',
		guildId: '1117671374052397136',
		starMessageId: '1266973411909963776',
		stars: 1,
		lastUpdated: 1722140398023
	},
	{
		_id: {
			$oid: '66a5c6f340927e6664ead994'
		},
		enabled: true,
		userId: '483307716614553601',
		messageId: '1266971944599683083',
		channelId: '1145593489216786532',
		guildId: '1117671374052397136',
		starMessageId: '1266973435976876042',
		stars: 1,
		lastUpdated: 1722140403773
	},
	{
		_id: {
			$oid: '66a5e6b040927e6664ead995'
		},
		enabled: true,
		userId: '486396074282450946',
		messageId: '1266976487983288382',
		channelId: '1145593489216786532',
		guildId: '1117671374052397136',
		starMessageId: '1267007514977763402',
		stars: 1,
		lastUpdated: 1722148528809
	},
	{
		_id: {
			$oid: '66aa5be240927e6664ead996'
		},
		enabled: true,
		userId: '727649973180694638',
		messageId: '1268139659930763347',
		channelId: '1145593489216786532',
		guildId: '1117671374052397136',
		starMessageId: '1268232862432497818',
		stars: 1,
		lastUpdated: 1722440674380
	},
	{
		_id: {
			$oid: '66ae25c740927e6664ead997'
		},
		enabled: true,
		userId: '486396074282450946',
		messageId: '1265739575918329968',
		channelId: '1149953027231449149',
		guildId: '1117671374052397136',
		starMessageId: '1269274278818349128',
		stars: 1,
		lastUpdated: 1722688967449
	},
	{
		_id: {
			$oid: '66af232a40927e6664ead998'
		},
		enabled: true,
		userId: '733163699912835082',
		messageId: '1269506279613792347',
		channelId: '1149953027231449149',
		guildId: '1117671374052397136',
		starMessageId: '1269546352715497502',
		stars: 1,
		lastUpdated: 1722753834917
	},
	{
		_id: {
			$oid: '66af233040927e6664ead999'
		},
		enabled: true,
		userId: '733163699912835082',
		messageId: '1269506292628586506',
		channelId: '1149953027231449149',
		guildId: '1117671374052397136',
		starMessageId: '1269546374165168261',
		stars: 1,
		lastUpdated: 1722753840042
	},
	{
		_id: {
			$oid: '66b4471640927e6664ead99a'
		},
		enabled: true,
		userId: '486396074282450946',
		messageId: '1270958912753106974',
		channelId: '1145593489216786532',
		guildId: '1117671374052397136',
		starMessageId: '1270959312872931381',
		stars: 1,
		lastUpdated: 1723090710866
	},
	{
		_id: {
			$oid: '66b4498640927e6664ead99b'
		},
		enabled: true,
		userId: '486396074282450946',
		messageId: '1270961223017431071',
		channelId: '1145593489216786532',
		guildId: '1117671374052397136',
		starMessageId: '1270961928986165310',
		stars: 1,
		lastUpdated: 1723091334627
	},
	{
		_id: {
			$oid: '66b44b5940927e6664ead99c'
		},
		enabled: true,
		userId: '486396074282450946',
		messageId: '1270962681347707001',
		channelId: '1144155849053454397',
		guildId: '1117671374052397136',
		starMessageId: '1270963885331185685',
		stars: 1,
		lastUpdated: 1723091801053
	},
	{
		_id: {
			$oid: '66b5498d40927e6664ead99d'
		},
		enabled: true,
		userId: '733163699912835082',
		messageId: '1271228112230682746',
		channelId: '1149953027231449149',
		guildId: '1117671374052397136',
		starMessageId: '1271236834747486219',
		stars: 1,
		lastUpdated: 1723156877210
	},
	{
		_id: {
			$oid: '66b6b2d040927e6664ead99e'
		},
		enabled: true,
		userId: '733163699912835082',
		messageId: '1271612167636123760',
		channelId: '1149953027231449149',
		guildId: '1117671374052397136',
		starMessageId: '1271624738153697302',
		stars: 1,
		lastUpdated: 1723249360605
	},
	{
		_id: {
			$oid: '66b6b2d540927e6664ead99f'
		},
		enabled: true,
		userId: '733163699912835082',
		messageId: '1271612176142176370',
		channelId: '1149953027231449149',
		guildId: '1117671374052397136',
		starMessageId: '1271624759477796998',
		stars: 1,
		lastUpdated: 1723249365670
	},
	{
		_id: {
			$oid: '66ffd9f3affb2a7fc289606a'
		},
		enabled: true,
		userId: '727005722671317054',
		messageId: '1287160485522706452',
		channelId: '1145593489216786532',
		guildId: '1117671374052397136',
		starMessageId: '1291732847153123341',
		stars: 1,
		lastUpdated: 1728043507460
	},
	{
		_id: {
			$oid: '66ffda3caffb2a7fc289606b'
		},
		enabled: true,
		userId: '486396074282450946',
		messageId: '1291119244901220373',
		channelId: '1145593489216786532',
		guildId: '1117671374052397136',
		starMessageId: '1291733152175489066',
		stars: 1,
		lastUpdated: 1728043580144
	},
	{
		_id: {
			$oid: '66ffda43affb2a7fc289606c'
		},
		enabled: true,
		userId: '733163699912835082',
		messageId: '1291119375436484701',
		channelId: '1145593489216786532',
		guildId: '1117671374052397136',
		starMessageId: '1291733182990778368',
		stars: 1,
		lastUpdated: 1728043587423
	},
	{
		_id: {
			$oid: '66ffda5caffb2a7fc289606d'
		},
		enabled: true,
		userId: '486396074282450946',
		messageId: '1291590697618636811',
		channelId: '1145593489216786532',
		guildId: '1117671374052397136',
		starMessageId: '1291733287659765882',
		stars: 1,
		lastUpdated: 1728043612372
	},
	{
		_id: {
			$oid: '66ffda8caffb2a7fc289606e'
		},
		enabled: true,
		userId: '733163699912835082',
		messageId: '1291591652888023042',
		channelId: '1145593489216786532',
		guildId: '1117671374052397136',
		starMessageId: '1291733487669350424',
		stars: 1,
		lastUpdated: 1728043660134
	}
] as const;

export class UserCommand extends FoxxieCommand {
	public async messageRun(_: Message): Promise<void> {
		let index = 1;

		const sorted = new Collection(DATA.map((e) => [e.messageId, e])).sort(
			(a, b) => SnowflakeUtil.timestampFrom(a.starMessageId || '0') - SnowflakeUtil.timestampFrom(b.starMessageId || '0')
		);

		for (const entry of sorted.values()) {
			if (!entry.starMessageId || !entry.messageId) continue;
			// @ts-ignore
			const resolved: StarboardData = {
				enabled: entry.enabled,
				guildId: entry.guildId,
				userId: entry.userId,
				messageId: entry.messageId,
				channelId: entry.channelId,
				starMessageId: entry.starMessageId,
				starChannelId: `1144155849053454397`,
				stars: entry.stars,
				id: index
			};

			index++;

			const created = await this.container.prisma.starboard.create({ data: resolved });
			console.log(created);
		}
	}
}
