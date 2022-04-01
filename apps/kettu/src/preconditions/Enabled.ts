import { ApplyOptions } from '@sapphire/decorators';
import { Precondition, AllFlowsPrecondition, Identifiers } from '@sapphire/framework';

@ApplyOptions<Precondition.Options>({
    position: 10
})
export class UserPrecondition extends Precondition {
    public async chatInputRun(...[, command]: Parameters<AllFlowsPrecondition['chatInputRun']>): Promise<any> {
        if (!command.enabled) {
            return this.error({
                identifier: Identifiers.CommandDisabled
            });
        }

        return this.ok();
    }
}
