import { Id } from './id.type'


export interface UserIdentity {
    firstName: string
    lastName: string
    id: Id
}


export interface UserInfo extends UserIdentity {
    emailAddress: string
}
