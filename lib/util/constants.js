module.exports = {
    emojis: {
        approved: '834540175756886046',
        infinity: '<a:Loading:828508900558766120>',
        categories: {
            admin: ':desktop:',
            fun: ':partying_face:',
            moderation: ':shield:',
            roleplay: ':smile:',
            secret: ':revolving_hearts:',
            settings: ':wrench:',
            utility: ':flashlight:'
        },
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
            DISCORD_EMPLOYEE: '<:BadgeDiscordStaff:825973261086490665>',
            DISCORD_PARTNER: '<:BadgeDiscordPartner:825973261132759060>',
            HYPESQUAD_EVENTS: '<:BadgeHypesquadEvents:825973261224902666>',
            NITRO: '<:BadgeNitro:825973261124370492>',
            BOOSTER: '<:BadgeBooster:825973260914131015>',
            EARLY_SUPPORTER: '<:BadgeEarlySupporter:825973261250330664>',
            BUGHUNTER_LEVEL_1: '<:BadgeBughunter1:825973261258981426>',
            BUGHUNTER_LEVEL_2: '<:BadgeBughunter2:825973261300793374>',
            HOUSE_BRAVERY: '<:BadgeBravery:825973261283360788>',
            HOUSE_BRILLIANCE: '<:BadgeBrilliance:825973261330153482>',
            HOUSE_BALANCE: '<:BadgeBalance:825973261225558036>',
            EARLY_VERIFIED_DEVELOPER: '<:BadgeEarlyVerifiedBotDev:825973261154123786>',
            BOT: '<:BadgeBot:825973261355450387>',
            VERIFIED_BOT: '<:BadgeVerifiedBot:825973261233946664>'
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
        yes: '834628295168360510',
        no: '834628295303495681',
        success: '834540175756886046',
        lock: '841080112195436594',
        unlock: '841079503580561498'
    },
    color: {
        TCS_STARBOARD: '#FFF59F',
        BAD: '#c2ae4c',
        VERY_BAD: '#c27d4c',
        SUPER_BAD: '#8b0000',
    },
    badges: [
        {
            icon: `<:FoxxieBadgeDev:840164062976671774>`, // 1
            name: `Developer Ruff`
        },
        {
            icon: '<:FoxxieBadgeContributor:853009950578442261>', // 2
            name: 'Foxxie Contributor',
        },
        {
            icon: '<:FoxxieBadgeCutie:837650462278025226>', // 8
            name: 'My Cutiepie Tall Boy',
        }
    ],
    regexes: {
		cancel: /^(?:cancel|stop|end)$/i,
		emoji: /uwu/gi,
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
        additionalHelp: '**sug4r#1537**, **straxer#1771**, **snowwhite4hunnind#9675**, **ArEo#1245**',
        developer: '**Ruffpuff#0029**',
        spanishTranslation: '**Raindrop#9280**',
    },
    justinName: 'Justin Giraffe-Whore-Blobfish-Anglerfish-Femboy-Filbert-Party Pooper-Short Spaghetti Dick-Lil Bitch-Jiu-Jutsu-Yandere-Tsundere-Sex Slave-Justie-Vuccum-Stalker-Canadian Murderer-Monsieur Casanova Fairness Know It All Wholesome Cutie Pie-Witch-Pendejo-Dennis'
}

module.exports.noop = () => { };