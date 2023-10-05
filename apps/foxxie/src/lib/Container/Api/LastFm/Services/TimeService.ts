import { List } from "#lib/Container/Utility/Extensions/ArrayExtensions";
import { DurationFormatter } from "@sapphire/time-utilities";
import { UserPlay } from "../Structures/Entities/UserPlay";

export class TimeService {
    public async getPlayTimeForPlays(plays: List<UserPlay>) {
        const totalMs = plays.sumBy(userPlay => this.getTrackLengthForTrack(userPlay.artist, userPlay.track))
        return new DurationFormatter().format(totalMs, 2);
    }

    private getTrackLengthForTrack(__: string, ___: string): number {
        return 210000
    }
}
