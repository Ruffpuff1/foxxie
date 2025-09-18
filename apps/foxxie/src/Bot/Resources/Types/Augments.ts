import { GatewayEventStore } from '#root/Bot/Structures/index';

declare module '@sapphire/pieces' {
	interface StoreRegistryEntries {
		gatewayEvents: GatewayEventStore;
	}
}
