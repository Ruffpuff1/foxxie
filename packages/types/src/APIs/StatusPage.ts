export namespace StatusPage {
    export interface Result {
        page: Info;
        incidents: Incident[];
    }

    export interface Incident {
        id: string;
        name: string;
        status: 'investigating' | 'identified' | 'monitoring' | 'resolved' | 'postmortem';
        created_at: string;
        updated_at: string | null;
        monitoring_at: string | null;
        resolved_at: string | null;
        impact: 'none' | 'minor' | 'major' | 'critical';
        shortlink: string;
        started_at: string;
        page_id: string;
        incident_updates: IncidentUpdate[];
        components: Component[];
    }

    export interface IncidentUpdate {
        id: string;
        status: string;
        body: string;
        incident_id: string;
        created_at: string;
        update_at: string;
        display_at: string;
        affected_components: ComponentAffected[];
        deliever_notifications: boolean;
        custom_tweet: string | null;
        tweet_id: string | null;
    }

    export interface Component {
        id: string;
        name: string;
        status: string;
        created_at: string;
        updated_at: string;
        position: number;
        description: string;
        showcase: boolean;
        start_date: string | null;
        group_id: string | null;
        page_id: string;
        group: boolean;
        only_show_if_degraded: boolean;
    }

    export interface ComponentAffected {
        code: string;
        name: string;
        old_status: string;
        new_status: string;
    }

    interface Info {
        id: string;
        name: string;
        url: string;
        time_zone: string;
        updated_at: string;
    }
}
