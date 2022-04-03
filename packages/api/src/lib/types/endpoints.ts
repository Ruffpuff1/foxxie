import type { RESTGetAPIUsersResult, RESTGetAPIUsersUserBansResult, RESTGetAPIUsersUserPronounsResult, RESTGetAPIUsersUserResult } from './rest';

export interface Endpoints {
    'GET /users': RESTGetAPIUsersResult;
    'GET /users/:id': RESTGetAPIUsersUserResult;
    'GET /users/:id/bans': RESTGetAPIUsersUserBansResult;
    'GET /users/:id/pronouns': RESTGetAPIUsersUserPronounsResult;
}
