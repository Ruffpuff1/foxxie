export namespace StatusPage {
	export interface Result {
		incidents: Incident[];
		page: Info;
	}

	export interface Incident {
		components: Component[];
		created_at: string;
		id: string;
		impact: 'critical' | 'major' | 'minor' | 'none';
		incident_updates: IncidentUpdate[];
		monitoring_at: null | string;
		name: string;
		page_id: string;
		resolved_at: null | string;
		shortlink: string;
		started_at: string;
		status: 'identified' | 'investigating' | 'monitoring' | 'postmortem' | 'resolved';
		updated_at: null | string;
	}

	export interface IncidentUpdate {
		affected_components: ComponentAffected[];
		body: string;
		created_at: string;
		custom_tweet: null | string;
		deliever_notifications: boolean;
		display_at: string;
		id: string;
		incident_id: string;
		status: string;
		tweet_id: null | string;
		update_at: string;
	}

	export interface Component {
		created_at: string;
		description: string;
		group: boolean;
		group_id: null | string;
		id: string;
		name: string;
		only_show_if_degraded: boolean;
		page_id: string;
		position: number;
		showcase: boolean;
		start_date: null | string;
		status: string;
		updated_at: string;
	}

	export interface ComponentAffected {
		code: string;
		name: string;
		new_status: string;
		old_status: string;
	}

	export interface Info {
		id: string;
		name: string;
		time_zone: string;
		updated_at: string;
		url: string;
	}
}
