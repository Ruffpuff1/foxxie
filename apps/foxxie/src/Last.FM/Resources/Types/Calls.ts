import { UserResponseLfm } from './Models/User.js';

export const enum Call {
	UserInfo = 'user.getInfo'
}

export type LastFmApiReturnType<M extends Call> = M extends Call.UserInfo ? UserResponseLfm : never;
