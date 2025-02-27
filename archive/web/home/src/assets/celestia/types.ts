export interface Villager {
    key: string;
    keyJp: string;
    gender: `${GenderEnum}`;
    species: `${SpeciesEnum}`;
    personality: `${PersonalitiesEnum}`;
    favoriteSaying?: string;
    catchphrase?: string;
    description?: string;
    games: `${GamesEnum}`[];
    art: string;
    coffeeRequest?: Coffee;
    siblings?: string;
    skill?: string;
    goal?: string;
    song?: `${KKSliderSongs}`;
}

export interface Coffee {
    beans: `${CoffeeBeansEnum}`;
    milk: `${CoffeeMilkEnum}`;
    sugar: `${CoffeeSugarEnum}`;
}

export enum GamesEnum {
    DoubutsuNoMori = 'dnm',
    AnimalCrossing = 'ac',
    WildWorld = 'ww',
    CityFolk = 'cf',
    NewLeaf = 'nl',
    HappyHomeDesigner = 'hhd',
    AmiiboFestival = 'af',
    PocketCamp = 'pc',
    NewHorizons = 'nh',
    HappyHomeParadise = 'hhp'
}

export enum GenderEnum {
    Male = 'Male',
    Female = 'Female'
}

export enum CoffeeBeansEnum {
    Blend = 'Blend',
    BlueMountain = 'Blue Moutain',
    Kilimanjaro = 'Kilimanjaro',
    Mocha = 'Mocha'
}

export enum CoffeeMilkEnum {
    ALittleBit = 'A little bit',
    Lots = 'Lots',
    NoneAtAll = 'None at all',
    TheRegularAmount = 'The regular amount'
}

export enum CoffeeSugarEnum {
    OneSpoonful = '1 spoonful',
    TwoSpoonfuls = '2 spoonfuls',
    ThreeSpoonfuls = '3 spoonfuls',
    NoneAtAll = 'None at all'
}

export enum PersonalitiesEnum {
    Normal = 'Normal',
    Peppy = 'Peppy',
    Snooty = 'Snooty',
    Sisterly = 'Sisterly',
    Cranky = 'Cranky',
    Jock = 'Jock',
    Lazy = 'Lazy',
    Smug = 'Smug'
}

export enum AmiiboSeriesEnum {
    One = '1',
    Two = '2',
    Three = '3',
    Four = '4',
    Five = '5',
    Camper = 'Camper',
    Sanrio = 'Sanrio'
}

export enum MonthsEnum {
    January = 'January',
    February = 'February',
    March = 'March',
    April = 'April',
    May = 'May',
    June = 'June',
    July = 'July',
    August = 'August',
    September = 'September',
    October = 'October',
    November = 'November',
    December = 'December'
}

export enum StarSignEnum {
    Aquarius = 'Aquarius',
    Aries = 'Aries',
    Cancer = 'Cancer',
    Capricorn = 'Capricorn',
    Gemini = 'Gemini',
    Leo = 'Leo',
    Pisces = 'Pisces',
    Sagittarius = 'Sagittarius',
    Scorpio = 'Scorpio',
    Taurus = 'Taurus',
    Virgo = 'Virgo',
    Libra = 'Libra'
}

/** SpeciesEnum of villagers */
export enum SpeciesEnum {
    Alligator = 'alligator',
    Anteater = 'anteater',
    Bear = 'bear',
    Bird = 'bird',
    Bull = 'bull',
    Cat = 'cat',
    Chicken = 'chicken',
    Cow = 'cow',
    Cub = 'cub',
    Deer = 'deer',
    Dog = 'dog',
    Duck = 'duck',
    Eagle = 'eagle',
    Elephant = 'elephant',
    Frog = 'frog',
    Goat = 'goat',
    Gorilla = 'gorilla',
    Hamster = 'hamster',
    Hippo = 'hippo',
    Horse = 'horse',
    Kangaroo = 'kangaroo',
    Koala = 'Koala',
    Lion = 'lion',
    Monkey = 'monkey',
    Mouse = 'mouse',
    Octopus = 'octopus',
    Ostrich = 'ostrich',
    Penguin = 'penguin',
    Pig = 'pig',
    Rabbit = 'rabbit',
    Rhino = 'rhino',
    Sheep = 'sheep',
    Squirrel = 'squirrel',
    Tiger = 'tiger',
    Wolf = 'wolf'
}

export enum KKSliderSongs {
    AgentKK = 'agentKK',
    AlohaKK = 'alohaKK',
    AnimalCity = 'animalCity',
    BubblegumKK = 'bubblegumKK',
    CafeKK = 'cafeKK',
    Chillwave = 'chillwave',
    ComradeKK = 'comradeKK',
    DJKK = 'djKK',
    Drivin = 'drvin',
    Farewell = 'farewell',
    ForestLife = 'forestLife',
    GoKKRider = 'goKKRider',
    HypnoKK = 'hypnoKK',
    ILoveYou = 'iLoveYou',
    ImperialKK = 'imperialKK',
    KKAdventure = 'KKAdventure',
    KKAria = 'kKAria',
    KKBallad = 'kKBallad',
    KKBashment = 'kKBashment',
    KKBazaar = 'kKBazaar',
    KKBirthday = 'kKBirthday',
    KKBlues = 'kKBlues',
    KKBossa = 'kKBossa',
    KKBreak = 'kKBreak',
    KKCalypso = 'kKCalypso',
    KKCasbah = 'kKCasbah',
    KKChorale = 'kKChorale',
    KKChorinho = 'kKChorinho',
    KKCountry = 'kKCountry',
    KKCrusin = 'kKCrusin',
    KKDB = 'kKDB',
    KKDirge = 'kKDirge',
    KKDisco = 'kKDisco',
    KKDixie = 'kKDixie',
    KKDub = 'kKDub',
    KKEtude = 'kKEtude',
    KKFaire = 'kKFaire',
    KKFlamenco = 'kKFlamenco',
    KKFolk = 'kKFolk',
    KKFugue = 'kKFugue',
    KKFusion = 'kKFusion',
    KKGroove = 'kKGroove',
    KKGumbo = 'kKGumbo',
    KKHop = 'kKHop',
    KKHouse = 'kKHouse',
    KKIsland = 'kKIsland',
    KKJazz = 'kKJazz',
    KKJongara = 'kKJongara',
    KKKhoomei = 'kKKhoomei',
    KKLament = 'kKLament',
    KKLoveSong = 'kKLoveSong',
    KKLovers = 'kKLovers',
    KKLullaby = 'kKLullaby',
    KKMambo = 'kKMambo',
    KKMarathon = 'kKMarathon',
    KKMarch = 'kKMarch',
    KKMariachi = 'kKMariachi',
    KKMetal = 'kKMetal',
    KKMilonga = 'kKMilonga',
    KKMoody = 'kKMoody',
    KKOasis = 'kKOasis',
    KKParade = 'kKParade',
    KKPolka = 'kKPolka',
    KKRagtime = 'kKRagtime',
    KKRally = 'kKRally',
    KKReggae = 'kKReggae',
    KKRobotSynth = 'kKRobotSynth',
    KKRock = 'kKRock',
    KKRockabilly = 'kKRockabilly',
    KKSafari = 'kKSafari',
    KKSalsa = 'kKSalsa',
    KKSamba = 'kKSamba',
    KKSka = 'kKSka',
    KKSlackKey = 'kKSlackKey',
    KKSonata = 'kKSonata',
    KKSong = 'kKSong',
    KKSoul = 'kKSoul',
    KKSteppe = 'kKSteppe',
    KKStroll = 'kKStroll',
    KKSwing = 'kKSwing',
    KKSynth = 'kKSynth',
    KKTango = 'kKTango',
    KKTechnopop = 'kKTechnopop',
    KKWaltz = 'kKWaltz',
    KKWestern = 'kKWestern',
    KingKK = 'kingKK',
    LuckyKK = 'luckyKK',
    MarineSong2001 = 'marineSong2001',
    MountainSong = 'mountainSong',
    MrKK = 'mrKK',
    MyPlace = 'myPlace',
    Neapolitan = 'neapolitan',
    OnlyMe = 'onlyMe',
    Pondering = 'pondering',
    RockinKK = 'rockinKK',
    SoulfulKK = 'soulfulKK',
    SpaceKK = 'spaceKK',
    SpringBlossoms = 'springBlossoms',
    StaleCupcakes = 'staleCupcakes',
    SteepHill = 'steepHill',
    SurfinKK = 'surfinKK',
    TheKFunk = 'theKFunk',
    ToTheEdge = 'toTheEdge',
    TwoDaysAgo = 'twoDaysAgo',
    Wandering = 'wandering',
    WelcomeHorizons = 'welcomeHorizons'
}

export enum VillagerEnum {
    Ace = 'ace',
    Audie = 'audie',
    Azalea = 'azalea',
    Bob = 'bob',
    Bonbon = 'bonbon',
    Bones = 'bones',
    Boomer = 'boomer',
    Boone = 'boone',
    Cephalobot = 'cephalobot',
    Chabwick = 'chabwick'
}
