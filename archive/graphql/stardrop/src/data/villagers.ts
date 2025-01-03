import { EnumCollection, LivesInEnum, SeasonEnum, StardewValleyTypes } from '../utils';

export const villagers = new EnumCollection<string, StardewValleyTypes.Villager>([
    [
        'abigail',
        {
            key: 'abigail',
            birthday: `${SeasonEnum.Fall} 13`,
            livesIn: LivesInEnum.PelicanTown,
            address: "Pierre's General Store",
            family: [
                {
                    key: 'pierre',
                    relation: 'Father'
                },
                {
                    key: 'caroline',
                    relation: 'Mother'
                }
            ],
            friends: ['sam', 'sebastian'],
            marriage: true,
            bestGifts: ['Amethyst', 'Banana Pudding', 'Blackberry Cobbler', 'Chocolate Cake', 'Pufferfish', 'Pumpkin', 'Spicy Eel'],
            description:
                'Abigail lives at the general store with her parents. She sometimes fights with her mom, who worries about Abigail’s “alternative lifestyle”. Her mom has the following to say: “I wish Abby would dress more appropriately and stop dyeing her hair blue. She has such a wonderful natural hair color, just like her grandmother did. Oh, and I wish she’d find some wholesome interests instead of this occult nonsense she’s into.” You might find Abigail alone in the graveyard, or maybe out in a rainstorm looking for frogs.',
            portrait: 'https://stardewvalleywiki.com/mediawiki/images/8/88/Abigail.png'
        }
    ],
    [
        'alex',
        {
            key: 'alex',
            birthday: `${SeasonEnum.Summer} 13`,
            livesIn: LivesInEnum.PelicanTown,
            address: '1 River Road',
            family: [
                {
                    key: 'evelyn',
                    relation: 'Grandmother'
                },
                {
                    key: 'george',
                    relation: 'Grandfather'
                }
            ],
            friends: ['haley'],
            marriage: true,
            bestGifts: ['Complete Breakfast', 'Salmon Dinner'],
            description:
                "Alex loves sports and hanging out at the beach. He is quite arrogant and brags to everyone that he is going to be a professional athlete. Is his cockiness just a facade to mask his crushing self-doubt? Is he using his sports dream to fill the void left by the disappearance of his parents? Or is he just a brazen youth trying to 'look cool?'",
            portrait: 'https://stardewvalleywiki.com/mediawiki/images/0/04/Alex.png'
        }
    ],
    [
        'caroline',
        {
            key: 'caroline',
            birthday: `${SeasonEnum.Winter} 7`,
            livesIn: LivesInEnum.PelicanTown,
            address: "Pierre's General Store",
            family: [
                {
                    key: 'pierre',
                    relation: 'Husband'
                },
                {
                    key: 'abigail',
                    relation: 'Daughter'
                }
            ],
            friends: ['jodi'],
            marriage: false,
            bestGifts: ['Fish Taco', 'Green Tea', 'Summer Spangle', 'Tropical Curry'],
            portrait: 'https://stardewvalleywiki.com/mediawiki/images/8/87/Caroline.png'
        }
    ],
    [
        'clint',
        {
            key: 'clint',
            birthday: `${SeasonEnum.Winter} 26`,
            livesIn: LivesInEnum.PelicanTown,
            address: 'Blacksmith',
            family: [],
            friends: ['emily'],
            marriage: false,
            bestGifts: ['Amethyst', 'Aquamarine', 'Artichoke Dip', 'Emerald', 'Fiddlehead Risotto', 'Gold Bar', 'Iridium Bar', 'Jade', 'Omni Geode', 'Ruby', 'Topaz'],
            portrait: 'https://stardewvalleywiki.com/mediawiki/images/3/31/Clint.png'
        }
    ],
    [
        'demetrius',
        {
            key: 'demetrius',
            birthday: `${SeasonEnum.Summer} 19`,
            livesIn: LivesInEnum.TheMountain,
            address: '24 Mountain Road',
            family: [
                {
                    key: 'robin',
                    relation: 'Wife'
                },
                {
                    key: 'maru',
                    relation: 'Daughter'
                },
                {
                    key: 'sebastian',
                    relation: 'Step-son'
                }
            ],
            friends: [],
            marriage: false,
            bestGifts: ['Bean Hotpot', 'Ice Cream', 'Rice Pudding', 'Strawberry'],
            portrait: 'https://stardewvalleywiki.com/mediawiki/images/f/f9/Demetrius.png'
        }
    ],
    [
        'dwarf',
        {
            key: 'dwarf',
            birthday: `${SeasonEnum.Summer} 22`,
            livesIn: LivesInEnum.TheMines,
            address: 'Eastern Cave',
            family: [],
            friends: [],
            marriage: false,
            bestGifts: ['Amethyst', 'Aquamarine', 'Emerald', 'Jade', 'Lemon Stone', 'Omni Geode', 'Ruby', 'Topaz'],
            portrait: 'https://stardewvalleywiki.com/mediawiki/images/e/ed/Dwarf.png'
        }
    ],
    [
        'elliott',
        {
            key: 'elliott',
            birthday: `${SeasonEnum.Fall} 5`,
            livesIn: LivesInEnum.TheBeach,
            address: "Elliott's Cabin",
            family: [],
            friends: ['leah', 'willy'],
            marriage: true,
            bestGifts: ['Crab Cakes', 'Duck Feather', 'Lobster', 'Pomegranate', 'Squid Ink', 'Tom Kha Soup'],
            portrait: 'https://stardewvalleywiki.com/mediawiki/images/b/bd/Elliott.png'
        }
    ],
    [
        'emily',
        {
            key: 'emily',
            birthday: `${SeasonEnum.Spring} 27`,
            livesIn: LivesInEnum.PelicanTown,
            address: '2 Willow Lane',
            family: [
                {
                    key: 'haley',
                    relation: 'Sister'
                }
            ],
            friends: ['sandy'],
            marriage: true,
            bestGifts: ['Amethyst', 'Aquamarine', 'Cloth', 'Emerald', 'Jade', 'Ruby', 'Survival Burger', 'Topaz', 'Wool'],
            portrait: 'https://stardewvalleywiki.com/mediawiki/images/2/28/Emily.png'
        }
    ],
    [
        'evelyn',
        {
            key: 'evelyn',
            birthday: `${SeasonEnum.Winter} 20`,
            livesIn: LivesInEnum.PelicanTown,
            address: '1 River Road',
            family: [
                {
                    key: 'alex',
                    relation: 'Grandson'
                },
                {
                    key: 'george',
                    relation: 'Husband'
                }
            ],
            friends: [],
            marriage: false,
            bestGifts: ['Beet', 'Chocolate Cake', 'Diamond', 'Fairy Rose', 'Stuffing', 'Tulip'],
            description:
                "Evelyn has lived in Pelican Town her entire life. Always hopeful and optimistic, Granny spends her days tending the town gardens, baking her signature cookies, and reminiscing about Stardew Valley's vibrant past.",
            portrait: 'https://stardewvalleywiki.com/mediawiki/images/8/8e/Evelyn.png'
        }
    ],
    [
        'george',
        {
            key: 'george',
            birthday: `${SeasonEnum.Fall} 24`,
            livesIn: LivesInEnum.PelicanTown,
            address: '1 River Road',
            family: [
                {
                    key: 'alex',
                    relation: 'Grandson'
                },
                {
                    key: 'evelyn',
                    relation: 'Wife'
                }
            ],
            friends: [],
            marriage: false,
            bestGifts: ['Fried Mushroom', 'Leek'],
            portrait: 'https://stardewvalleywiki.com/mediawiki/images/7/78/George.png'
        }
    ],
    [
        'gus',
        {
            key: 'gus',
            birthday: `${SeasonEnum.Summer} 8`,
            livesIn: LivesInEnum.PelicanTown,
            address: 'The Stardrop Saloon',
            family: [],
            friends: ['pam'],
            marriage: false,
            bestGifts: ['Diamond', 'Escargot', 'Fish Taco', 'Orange', 'Tropical Curry'],
            portrait: 'https://stardewvalleywiki.com/mediawiki/images/5/52/Gus.png'
        }
    ],
    [
        'haley',
        {
            key: 'haley',
            birthday: `${SeasonEnum.Spring} 14`,
            livesIn: LivesInEnum.PelicanTown,
            address: '2 Willow Lane',
            family: [
                {
                    key: 'emily',
                    relation: 'Sister'
                }
            ],
            friends: ['alex'],
            marriage: true,
            bestGifts: ['Coconut', 'Fruit Salad', 'Pink Cake', 'Sunflower'],
            description:
                'Being wealthy and popular throughout high school has made Haley a little conceited and self-centered. She has a tendency to judge people for superficial reasons. But is it too late for her to discover a deeper meaning to life? Is there a fun, open-minded young woman hidden within that candy-coated shell?',
            portrait: 'https://stardewvalleywiki.com/mediawiki/images/1/1b/Haley.png'
        }
    ],
    [
        'harvey',
        {
            key: 'harvey',
            birthday: `${SeasonEnum.Winter} 14`,
            livesIn: LivesInEnum.PelicanTown,
            address: 'Medical Clinic',
            family: [],
            friends: ['maru'],
            marriage: true,
            bestGifts: ['Coffee', 'Pickles', 'Super Meal', 'Truffle Oil', 'Wine'],
            portrait: 'https://stardewvalleywiki.com/mediawiki/images/9/95/Harvey.png'
        }
    ],
    [
        'jas',
        {
            key: 'jas',
            birthday: `${SeasonEnum.Summer} 4`,
            livesIn: LivesInEnum.CindersapForest,
            address: "Marnie's Ranch",
            family: [
                {
                    key: 'marnie',
                    relation: 'Aunt'
                },
                {
                    key: 'shane',
                    relation: 'Godfather'
                }
            ],
            friends: ['leo', 'vincent'],
            marriage: false,
            bestGifts: ['Fairy Rose', 'Pink Cake', 'Plum Pudding'],
            portrait: 'https://stardewvalleywiki.com/mediawiki/images/5/55/Jas.png'
        }
    ],
    [
        'jodi',
        {
            key: 'jodi',
            birthday: `${SeasonEnum.Fall} 11`,
            livesIn: LivesInEnum.PelicanTown,
            address: '1 Willow Lane',
            family: [
                {
                    key: 'kent',
                    relation: 'Husband'
                },
                {
                    key: 'sam',
                    relation: 'Son'
                },
                {
                    key: 'vincent',
                    relation: 'Son'
                }
            ],
            friends: ['caroline'],
            marriage: false,
            bestGifts: ['Chocolate Cake', 'Crispy Bass', 'Diamond', 'Eggplant Parmesan', 'Fried Eel', 'Pancakes', 'Rhubarb Pie', 'Vegetable Medley'],
            portrait: 'https://stardewvalleywiki.com/mediawiki/images/4/41/Jodi.png'
        }
    ],
    [
        'kent',
        {
            key: 'kent',
            birthday: `${SeasonEnum.Spring} 4`,
            livesIn: LivesInEnum.PelicanTown,
            address: '1 Willow Lane',
            family: [
                {
                    key: 'jodi',
                    relation: 'Wife'
                },
                {
                    key: 'sam',
                    relation: 'Son'
                },
                {
                    key: 'vincent',
                    relation: 'Son'
                }
            ],
            friends: [],
            marriage: false,
            bestGifts: ['Fiddlehead Risotto', 'Roasted Hazelnuts'],
            portrait: 'https://stardewvalleywiki.com/mediawiki/images/9/99/Kent.png'
        }
    ],
    [
        'krobus',
        {
            key: 'krobus',
            birthday: `${SeasonEnum.Winter} 1`,
            livesIn: LivesInEnum.TheSewers,
            address: "Krobus's Shop",
            family: [],
            friends: [],
            marriage: false,
            bestGifts: ['Diamond', 'Iridium Bar', 'Pumpkin', 'Void Egg', 'Void Mayonnaise', 'Wild Horseradish'],
            portrait: 'https://stardewvalleywiki.com/mediawiki/images/7/71/Krobus.png'
        }
    ],
    [
        'leah',
        {
            key: 'leah',
            birthday: `${SeasonEnum.Winter} 23`,
            livesIn: LivesInEnum.CindersapForest,
            address: "Leah's Cottage",
            family: [],
            friends: ['elliott'],
            marriage: true,
            bestGifts: ['Goat Cheese', 'Poppyseed Muffin', 'Salad', 'Stir Fry', 'Truffle', 'Vegetable Medley', 'Wine'],
            portrait: 'https://stardewvalleywiki.com/mediawiki/images/e/e6/Leah.png'
        }
    ],
    [
        'leo',
        {
            key: 'leo',
            birthday: `${SeasonEnum.Summer} 26`,
            livesIn: LivesInEnum.GingerIsland,
            address: 'Hut, Treehouse',
            family: [],
            friends: ['jas', 'linus', 'vincent'],
            marriage: false,
            bestGifts: ['Duck Feather', 'Mango', 'Ostrich Egg', 'Poi'],
            portrait: 'https://stardewvalleywiki.com/mediawiki/images/1/1d/Leo.png'
        }
    ],
    [
        'lewis',
        {
            key: 'lewis',
            birthday: `${SeasonEnum.Spring} 7`,
            livesIn: LivesInEnum.PelicanTown,
            address: "Mayor's Manor",
            family: [],
            friends: ['marnie'],
            marriage: false,
            bestGifts: ["Autumn's Bounty", 'Glazed Yams', 'Green Tea', 'Hot Pepper', 'Vegetable Medley'],
            portrait: 'https://stardewvalleywiki.com/mediawiki/images/2/2b/Lewis.png'
        }
    ],
    [
        'linus',
        {
            key: 'linus',
            birthday: `${SeasonEnum.Winter} 3`,
            livesIn: LivesInEnum.TheMountain,
            address: 'Tent',
            family: [],
            friends: ['wizard', 'leo'],
            marriage: false,
            bestGifts: ['Blueberry Tart', 'Cactus Fruit', 'Coconut', "Dish O' The Sea", 'Yam'],
            portrait: 'https://stardewvalleywiki.com/mediawiki/images/3/31/Linus.png'
        }
    ],
    [
        'marnie',
        {
            key: 'marnie',
            birthday: `${SeasonEnum.Fall} 18`,
            livesIn: LivesInEnum.CindersapForest,
            address: "Marnie's Ranch",
            family: [
                {
                    key: 'jas',
                    relation: 'Niece'
                },
                {
                    key: 'shane',
                    relation: 'Nephew'
                }
            ],
            friends: ['lewis'],
            marriage: false,
            bestGifts: ['Diamond', "Farmer's Lunch", 'Pink Cake', 'Pumpkin Pie'],
            portrait: 'https://stardewvalleywiki.com/mediawiki/images/5/52/Marnie.png'
        }
    ],
    [
        'maru',
        {
            key: 'maru',
            birthday: `${SeasonEnum.Summer} 10`,
            livesIn: LivesInEnum.TheMountain,
            address: '24 Mountain Road',
            family: [
                {
                    key: 'demetrius',
                    relation: 'Father'
                },
                {
                    key: 'robin',
                    relation: 'Mother'
                },
                {
                    key: 'sebastian',
                    relation: 'Half-Brother'
                }
            ],
            friends: ['penny', 'harvey'],
            marriage: true,
            bestGifts: [
                'Battery Pack',
                'Cauliflower',
                'Cheese Cauliflower',
                'Diamond',
                'Gold Bar',
                'Iridium Bar',
                "Miner's Treat",
                'Pepper Poppers',
                'Radioactive Bar',
                'Rhubarb Pie',
                'Strawberry'
            ],
            description:
                'Growing up with a carpenter and a scientist for parents, Maru acquired a passion for creating gadgets at a young age. When she isn’t in her room, fiddling with tools and machinery, she sometimes does odd jobs at the local clinic. Friendly, outgoing, and ambitious, Maru would be quite a lucky match for a lowly newcomer such as yourself… Can you win her heart, or will she slip through your fingers and disappear from your life forever?',
            portrait: 'https://stardewvalleywiki.com/mediawiki/images/f/f8/Maru.png'
        }
    ],
    [
        'pam',
        {
            key: 'pam',
            birthday: `${SeasonEnum.Spring} 18`,
            livesIn: LivesInEnum.PelicanTown,
            address: 'Trailer',
            family: [
                {
                    key: 'penny',
                    relation: 'Daughter'
                }
            ],
            friends: ['gus'],
            marriage: false,
            bestGifts: [],
            portrait: 'https://stardewvalleywiki.com/mediawiki/images/d/da/Pam.png'
        }
    ],
    [
        'penny',
        {
            key: 'penny',
            birthday: `${SeasonEnum.Fall} 2`,
            livesIn: LivesInEnum.PelicanTown,
            address: 'Trailer',
            family: [
                {
                    key: 'pam',
                    relation: 'Mother'
                }
            ],
            friends: ['maru', 'sam'],
            marriage: true,
            bestGifts: ['Diamond', 'Emerald', 'Melon', 'Poppy', 'Poppyseed Muffin', 'Red Plate', 'Roots Platter', 'Sandfish', 'Tom Kha Soup'],
            description:
                'Penny lives with her mom, Pam, in a little trailer by the river. While Pam is out carousing at the saloon, Penny quietly tends to her chores in the dim, stuffy room she is forced to call home. She is shy and modest, without any grand ambitions for life other than settling in and starting a family. She likes to cook (although her skills are questionable) and read books from the local library.',
            portrait: 'https://stardewvalleywiki.com/mediawiki/images/a/ab/Penny.png'
        }
    ],
    [
        'pierre',
        {
            key: 'pierre',
            birthday: `${SeasonEnum.Spring} 26`,
            livesIn: LivesInEnum.PelicanTown,
            address: "Pierre's General Store",
            family: [
                {
                    key: 'caroline',
                    relation: 'Wife'
                },
                {
                    key: 'qbigail',
                    relation: 'Daughter'
                }
            ],
            friends: [],
            marriage: false,
            bestGifts: ['Fried Calamari'],
            portrait: 'https://stardewvalleywiki.com/mediawiki/images/7/7e/Pierre.png'
        }
    ],
    [
        'robin',
        {
            key: 'robin',
            birthday: `${SeasonEnum.Fall} 21`,
            livesIn: LivesInEnum.TheMountain,
            address: '24 Mountain Road',
            family: [
                {
                    key: 'demetrius',
                    relation: 'Husband'
                },
                {
                    key: 'maru',
                    relation: 'Daughter'
                },
                {
                    key: 'sebastian',
                    relation: 'Son'
                }
            ],
            friends: [],
            marriage: false,
            bestGifts: ['Goat Cheese', 'Peach', 'Spaghetti'],
            portrait: 'https://stardewvalleywiki.com/mediawiki/images/1/1b/Robin.png'
        }
    ],
    [
        'sam',
        {
            key: 'sam',
            birthday: `${SeasonEnum.Summer} 17`,
            livesIn: LivesInEnum.PelicanTown,
            address: '1 Willow Lane',
            family: [
                {
                    key: 'kent',
                    relation: 'Father'
                },
                {
                    key: 'jodi',
                    relation: 'Mother'
                },
                {
                    key: 'vincent',
                    relation: 'Brother'
                }
            ],
            friends: ['abigail', 'penny', 'sebastian'],
            marriage: true,
            bestGifts: ['Cactus Fruit', 'Maple Bar', 'Pizza', 'Tigerseye'],
            description:
                'Sam is an outgoing, friendly guy who is brimming with youthful energy. He plays guitar and drums, and wants to start a band with Sebastian as soon as he has enough songs together. However, he does have a habit of starting ambitious projects and not finishing them. Sam is a little stressed about the impending return of his father, who has been away for years due to his line of work.',
            portrait: 'https://stardewvalleywiki.com/mediawiki/images/9/94/Sam.png'
        }
    ],
    [
        'sandy',
        {
            key: 'sandy',
            birthday: `${SeasonEnum.Fall} 15`,
            livesIn: LivesInEnum.TheDesert,
            address: 'Oasis',
            family: [],
            friends: ['emily'],
            marriage: false,
            bestGifts: ['Crocus', 'Daffodil', 'Mango Sticky Rice', 'Sweet Pea'],
            portrait: 'https://stardewvalleywiki.com/mediawiki/images/4/4e/Sandy.png'
        }
    ],
    [
        'sebastian',
        {
            key: 'sebastian',
            birthday: `${SeasonEnum.Winter} 10`,
            livesIn: LivesInEnum.TheMountain,
            address: '24 Mountain Road',
            family: [
                {
                    key: 'robin',
                    relation: 'Mother'
                },
                {
                    key: 'maru',
                    relation: 'Half-Sister'
                },
                {
                    key: 'demetrius',
                    relation: 'Step-Father'
                }
            ],
            friends: ['abigail', 'sam'],
            marriage: true,
            bestGifts: ['Frozen Tear', 'Obsidian', 'Pumpkin Soup', 'Sashimi', 'Void Egg'],
            description:
                'Sebastian is a rebellious loner who lives in his parents’ basement. He is Maru’s older half-brother, and feels like his sister gets all the attention and adoration, while he is left to rot in the dark. He tends to get deeply absorbed in his work, computer games, comic books, sci-fi novels, and will sometimes spend great lengths of time pursuing these hobbies alone in his room. He can be a bit unfriendly to people he doesn’t know. Could a charming new farmer cultivate the wasteland of his heart? Who knows?',
            portrait: 'https://stardewvalleywiki.com/mediawiki/images/a/a8/Sebastian.png'
        }
    ],
    [
        'shane',
        {
            key: 'shane',
            birthday: `${SeasonEnum.Spring} 20`,
            livesIn: LivesInEnum.CindersapForest,
            address: "Marine's Ranch",
            family: [
                {
                    key: 'marnie',
                    relation: 'Aunt'
                },
                {
                    key: 'jas',
                    relation: 'Goddaughter'
                }
            ],
            friends: [],
            marriage: true,
            bestGifts: ['Beer', 'Hot Pepper', 'Pepper Poppers', 'Pizza'],
            portrait: 'https://stardewvalleywiki.com/mediawiki/images/8/8b/Shane.png'
        }
    ],
    [
        'vincent',
        {
            key: 'vincent',
            birthday: `${SeasonEnum.Spring} 10`,
            livesIn: LivesInEnum.PelicanTown,
            address: '1 Willow Lane',
            family: [
                {
                    key: 'jodi',
                    relation: 'Mother'
                },
                {
                    key: 'kent',
                    relation: 'Father'
                },
                {
                    key: 'sam',
                    relation: 'Brother'
                }
            ],
            friends: ['jas', 'leo'],
            marriage: false,
            bestGifts: ['Cranberry Candy', 'Ginger Ale', 'Grape', 'Pink Cake', 'Snail'],
            portrait: 'https://stardewvalleywiki.com/mediawiki/images/f/f1/Vincent.png'
        }
    ],
    [
        'willy',
        {
            key: 'willy',
            birthday: `${SeasonEnum.Summer} 24`,
            livesIn: LivesInEnum.TheBeach,
            address: 'Fish Shop',
            family: [],
            friends: ['elliott'],
            marriage: false,
            bestGifts: ['Catfish', 'Diamond', 'Iridium Bar', 'Mead', 'Octopus', 'Pumpkin', 'Sea Cucumber', 'Sturgeon'],
            portrait: 'https://stardewvalleywiki.com/mediawiki/images/8/82/Willy.png'
        }
    ],
    [
        'wizard',
        {
            key: 'wizard',
            aliases: ['mrasmodius'],
            birthday: `${SeasonEnum.Winter} 17`,
            livesIn: LivesInEnum.CindersapForest,
            address: 'Wizard\'s Tower',
            family: [],
            friends: ['linus'],
            marriage: false,
            bestGifts: ['Purple Mushroom', 'Solar Essence', 'Super Cucumber', 'Void Essence'],
            description: 'Wizard studies the spirit world from his tower in cindersap forest. He is fluent in many elemental languages.',
            portrait: 'https://stardewvalleywiki.com/mediawiki/images/c/c7/Wizard.png'
        }
    ]
]);
