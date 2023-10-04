import { InfoTextCommandService } from './InfoCommands';
import { LastFmTextCommands } from './LastFmCommands';

export class TextCommandsService {
    public info = new InfoTextCommandService();

    public lastFm = new LastFmTextCommands();
}
