import { InfoTextCommandService } from './InfoCommands';
import { LastFmTextCommandService } from './LastFmCommands';

export class TextCommandsService {
    public info = new InfoTextCommandService();

    public lastFm = new LastFmTextCommandService();
}
