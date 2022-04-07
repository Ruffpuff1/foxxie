export interface WebsterResponse {
    meta: WebsterMetadata;
    hom: number;
    hwi?: {
        hw: string;
        prs?: WebsterPrs[];
        vrs?: WebsterVrs[]
    };
    fl?: string;
    lbs?: string[],
    psl?: string;
    def?: WebsterDefinition[];
    et: string[][];
    data: string;
    shortdef: string[]
}

export interface WebsterMetadata {
    id: string;
    uuid: string;
    sort: string;
    src: string;
    section: string;
    stems: string[];
    offensive: boolean;
}

export interface WebsterVrs {
    vl: string;
    va: string
    prs?: WebsterPrs[]
}

export interface WebsterPrs {
    mw: string;
    l: string;
    l2: string;
    pun: string;
    sound: {
        audio: string;
        ref: string
        stat: string;
    }
}

export interface WebsterDefinition {
    sseq: WebsterSense[][]
}

export type WebsterSense = WebsterSenseDataModel[]

export interface WebsterSenseDataModel {
    sn?: string;
    dt: (string | WebsterVis[])[];
}

export interface WebsterVis {
    t: string;
}