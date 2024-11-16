import { TrackRepository } from '../Repositories/TrackRepository';

export class WhoKnowsTrackService {
    public getTrackPlayCountForUser(artistName: string, trackName: string, userId: string) {
        return TrackRepository.GetTrackPlayCountForUser(artistName, trackName, userId);
    }
}
