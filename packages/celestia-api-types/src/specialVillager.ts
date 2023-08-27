export type SpecialVillagerEnum = SpecialVillagerMainGameEnum | SpecialVillagerSideGameEnum;

export enum SpecialVillagerMainGameEnum {
    Blanca = 'blanca',
    Blathers = 'blathers',
    Booker = 'booker',
    Brewster = 'brewster',
    CJ = 'cj',
    Celeste = 'celeste',
    Chip = 'chip',
    Copper = 'copper',
    Cornimer = 'cornimer',
    Cyrus = 'cyrus',
    DaisyMae = 'daisyMae',
    Digby = 'digby',
    DonResetti = 'donResetti',
    DrShrunk = 'drShrunk',
    Farley = 'farley',
    Flick = 'flick',
    Franklin = 'franklin',
    Frillard = 'frillard',
    Gracie = 'gracie',
    Grams = 'grams',
    Gullivarrr = 'gullivarrr',
    Gulliver = 'gulliver',
    Harriet = 'harriet',
    Harvey = 'harvey',
    Isabelle = 'isabelle',
    Jack = 'jack',
    Jingle = 'jingle',
    Joan = 'joan',
    KKSlider = 'kkSlider',
    Kaitlin = 'kaitlin',
    Kappn = 'kappn',
    Katie = 'katie',
    Katrina = 'katrina',
    Kicks = 'kicks',
    Label = 'label',
    Leif = 'leif',
    Leila = 'leila',
    Leilani = 'leilani',
    Lloid = 'lloid',
    Lottie = 'lottie',
    Luna = 'luna',
    Lyle = 'lyle',
    Mabel = 'mabel',
    Nat = 'nat',
    Orville = 'orville',
    Pascal = 'pascal',
    Pave = 'pave',
    Pelly = 'pelly',
    Pete = 'pete',
    Phineas = 'phineas',
    Phyllis = 'phyllis',
    Porter = 'porter',
    Redd = 'redd',
    Reese = 'reese',
    Resetti = 'resetti',
    Rover = 'rover',
    Saharah = 'saharah',
    Sable = 'sable',
    Serena = 'serena',
    Snowboy = 'snowboy',
    Snowmam = 'snowmam',
    Snowman = 'snowman',
    SnowTyke = 'snowtyke',
    Timmy = 'timmy',
    Tommy = 'tommy',
    TomNook = 'tomNook',
    Tortimer = 'tortimer',
    Wendell = 'wendell',
    Wilbur = 'wilbur',
    Wisp = 'wisp',
    ZipperTBunny = 'zipperTBunny'
}

export enum SpecialVillagerSideGameEnum {
    Beppe = 'beppe',
    Carlo = 'carlo',
    Giovanni = 'giovanni'
}

export const SpecialVillagerMainGameArray: `${SpecialVillagerMainGameEnum}`[] = Object.keys(
    SpecialVillagerMainGameEnum
).map(key => SpecialVillagerMainGameEnum[key]);

export const SpecialVillagerSideGameArray: `${SpecialVillagerSideGameEnum}`[] = Object.keys(
    SpecialVillagerSideGameEnum
).map(key => SpecialVillagerSideGameEnum[key]);

export const SpecialVillagerArray = [...SpecialVillagerMainGameArray, ...SpecialVillagerSideGameArray];
