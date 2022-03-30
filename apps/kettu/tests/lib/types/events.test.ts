import { Events } from '../../../src/lib/types/Events';

describe('the events enum', () => {
    test('WHEN given an enum value return the same value', () => {
        expect(Events.ChatInputCommandDenied).toEqual('chatInputCommandDenied');
        expect(Events.ChatInputCommandError).toEqual('chatInputCommandError');
    });
});
