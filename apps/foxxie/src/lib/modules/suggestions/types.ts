export type IntegerString = `${number}`;

export interface MessageData {
	id: number;
	message: string;
	timestamp: `<t:${bigint}>`;
	user: {
		avatar: string;
		id: string;
		mention: `<@${string}>`;
		tag: string;
	};
}
