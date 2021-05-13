module.exports = {
    emojis: {
        approved: '834540175756886046',
        infinity: '<a:Loading:828508900558766120>',
        starboard: {
            tier0: ':star:',
            tier1: '🌟',
            tier2: '💫',
            tier3: '🌠'
        },
        perms: {
            granted: '<:Approved2:834628295168360510>',
            notSpecified: '<:Unspecified2:834628295471136778>',
            denied: '<:Denied2:834628295303495681>'
        },
        covid: {
            cases: '<:FoxxieCovidCases:841065027590815775>',
            tests: '<:FoxxieCovidTests:841075782791987210>',
            deaths: '<:FoxxieCovidDeaths:841076695859724348>',
            recoveries: '<:FoxxieCovidRecoveries:841073567071207425>',
        },
        weather: {
            temperature: '<:FoxxieWeatherTemperature:842190330119061504>',
            date: '<:FoxxieWeatherDate:842190329298157570>',
            humidity: '<:FoxxieWeatherHumidity:842192123423883306>',
            winds: '<:FoxxieWeatherWinds:842192124425797642>',
            feels: '<:FoxxieWeatherFeelsLike:842192125193486376>',
            timezone: '<:FoxxieWeatherTimezone:842265551253405696>',
            dayCurrent: '<:FoxxieWeatherDay:842265551032418304>'
        },
        discordBadges: {
            discordStaff: '<:BadgeDiscordStaff:825973261086490665>',
            discordPartner: '<:BadgeDiscordPartner:825973261132759060>',
            discordHypesquad: '<:BadgeHypesquadEvents:825973261224902666>',
            discordNitro: '<:BadgeNitro:825973261124370492>',
            discordBooster: '<:BadgeBooster:825973260914131015>',
            discordEarly: '<:BadgeEarlySupporter:825973261250330664>',
            discordBug1: '<:BadgeBughunter1:825973261258981426>',
            discordBug2: '<:BadgeBughunter2:825973261300793374>',
            discordBravery: '<:BadgeBravery:825973261283360788>',
            discordBrilliance: '<:BadgeBrilliance:825973261330153482>',
            discordBalance: '<:BadgeBalance:825973261225558036>',
            discordEarlyDev: '<:BadgeEarlyVerifiedBotDev:825973261154123786>',
            discordBot: '<:BadgeBot:825973261355450387>',
            discordVerified: '<:BadgeVerifiedBot:825973261233946664>'
        },
        secretCommands: {
            ari: '<:PEeveeUwu:823587300591271966>',
            amber: '<a:SRFoxPounce:828023705496977428>',
            dei: '<:Sad:818539455900155914>',
            ashlee: '<:DDLCYuriYandere:824675761809260555>',
            rain: '<:PMewBlush:816772472984174622>',
            ruff: '<:PUmbreonCoffee:816751699552894977>',
            sami: ':beverage_box::bug:',
            strax: '<a:DogBoop:824675769313132585>',
            reese: [
                '<:RuffAngel:830699134331256863>',
                '<:PVulpixAngel:816747766406578234>',
                '<:RuffTired:831894529262092298>'
            ]
        }
    },
    reactions: {
        success: '834540175756886046',
        lock: '841080112195436594',
        unlock: '841079503580561498'
    },
    poll: {
		1: '1️⃣',
		2: '2️⃣',
		3: '3️⃣',
		4: '4️⃣',
		5: '5️⃣',
		6: '6️⃣',
		7: '7️⃣',
		8: '8️⃣',
		9: '9️⃣',
		10: '🔟'
	},
    color: {
        TCS_STARBOARD: '#FFF59F'
    },
    badges: [
        {
            icon: `<:FoxxieBadgeDev:840164062976671774>`, // 1
            name: `Developer Ruff`
        },
        {
            icon: '<:FoxxieBadgeContributor:837646894687584317>', // 2
            name: 'Foxxie Contributor',
        },
        {
            icon: '<:FoxxieBadgeFokushi:835668026048380968>', // 4
            name: 'Sister Bot',
        },
        {
            icon: '<:FoxxieBadgeCutie:837650462278025226>', // 8
            name: 'My Cutiepie Tall Boy',
        },
        {
            icon: '<:FoxxieBadgeFriend:840468912965287996>',
            name: 'Ruff\'s Friends'
        }
    ],
    regexes: {
		imgur: {
			image: /^https?:\/\/i\.imgur\.com\/(\w+)\.(?:jpg|png)$/i,
			album: /^https?:\/\/imgur\.com(?:\/a)?\/(\w+)$/i
		},
		discord: {
            invite: /(https?:\/\/)?(.*?@)?(www\.)?((discord|invite)\.(gg|li|me|io)|discord(app)?\.com\/invite)\/(\s).+/ui,
			cdn: /^https:\/\/cdn.discordapp.com\/attachments\/(?:\d){17,19}\/(?:\d){17,19}\/(?:.+?)(?:.png|.jpg)$/i
		},
        covid: {
            usStates: /^(AL|Alabama|AK|Alaska|AZ|Arizona|AR|Arkansas|CA|California|CO|Colorado|CT|Connecticut|DE|Delaware|FL|Florida|GA|Georgia|HI|Hawaii|ID|Idaho|IL|Illinois|IN|Indiana|IA|Iowa|KS|Kansas|KY|Kentucky|LA|Louisiana|ME|Maine|MD|Maryland|MA|Massachusetts|MI|Michigan|MN|Minnesota|MS|Mississippi|MO|Missouri|MT|Montana|NE|Nebraska|NV|Nevada|NH|New Hampshire|NJ|New Jersey|NM|New Mexico|NY|New York|NC|North Carolina|ND|North Dakota|OH|Ohio|OK|Oklahoma|OR|Oregon|PA|Pennsylvania|RI|Rhode Island|SC|South Carolina|SD|South Dakota|TN|Tennessee|TX|Texas|UT|Utah|VT|Vermont|VA|Virginia|WA|Washington|WV|West Virginia|WI|Wisconsin|WY|Wyoming)$/i,
            continents: /^(North America|Asia|South America|Europe|Africa|Australia\/Oceania|)$/i
        },
		cancel: /^(?:cancel|stop|end)$/i,
		emoji: /uwu/gi,
        starboard: /((https?:\/\/)?(www\.|cdn\.|media\.)?(discord\.(gg|io|me|li)|discordapp\.(com|net|org|i(com|net|org))\/)(attachments|avatars|emojis)\/?(\.(png|jpeg|gif))?|https?:\/\/i\.imgur\.com\/(\w+)\.(?:jpg|png))/gi

	},

    flags: {
        async: /\-async\s*|-a\s*/gi,
        channel: /\-channel\s*|-c\s*/gi,
        depth: /\-depth\s*|-d\s*/gi,
        dev: /\-dev\s*|-d\s*/gi,
        pinned: /\-pinned\s*|-p\s*/gi,
        purge: /\-purge\s*|-p\s*/gi,
        silent: /\-silent\s*|-s\s*/gi,
        soft: /\-soft\s*|-s\s*/gi,
    },
    credits: {
        additionalHelp: '**sug4r#1537**, **straxer#1771**, **snowwhite4hunnind#9675**',
        developer: '**Ruffpuff#0029**',
        spanishTranslation: '**Raindrop#9280**',
    },
    discrims: [
        '0001',
        '1337',
        '9999',
        '6969',
        '0420',
        '1234',
        '0002',
        '1010',
        '2021',
        '1111',
        '0009',
        '4200',
        '2222',
        '3333',
        '4444',
        '5555',
        '6666',
        '7777',
        '8888',
        '1212',
        '2121',
        '2020',
        '3030',
        '4040',
        '6695',
        '0017',
        '0116',
        '2066',
        '7054',
        '1982',
        '2006'
    ],
    justinName: 'Justin Giraffe-Whore-Blobfish-Anglerfish-Femboy-Filbert-Party Pooper-Short Spaghetti Dick-Lil Bitch-Jiu-Jutsu-Yandere-Tsundere-Sex Slave-Justie-Vuccum-Stalker-Canadian Murderer-Monsieur Casanova Fairness Know It All Wholesome Cutie Pie-Witch-Pendejo-Dennis'
}

module.exports.zws = '\u200B';