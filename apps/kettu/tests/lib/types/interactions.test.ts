import { CommandName } from '#types/Interactions';

describe('command name enum', () => {
    test('WHEN given command name key, return the name of the command', () => {
        expect(CommandName.AnimalCrossing).toEqual('animalcrossing');
        expect(CommandName.Color).toEqual('color');
        expect(CommandName.Currency).toEqual('currency');
        expect(CommandName.Donate).toEqual('donate');
        expect(CommandName.Eval).toEqual('eval');
        expect(CommandName.Github).toEqual('github');
        expect(CommandName.Invite).toEqual('invite');
        expect(CommandName.Owoify).toEqual('owoify');
        expect(CommandName.Npm).toEqual('npm');
        expect(CommandName.Pokemon).toEqual('pokemon');
        expect(CommandName.Pride).toEqual('pride');
        expect(CommandName.Setcolor).toEqual('setcolor');
        expect(CommandName.Shorten).toEqual('shorten');
        expect(CommandName.StardewValley).toEqual('stardewvalley');
        expect(CommandName.Stats).toEqual('stats');
        expect(CommandName.Support).toEqual('support');
        expect(CommandName.Wolfram).toEqual('wolfram');
        expect(CommandName.Zodiac).toEqual('zodiac');
    });
});
