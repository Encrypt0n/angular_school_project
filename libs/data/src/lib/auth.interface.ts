import { Role } from './roles'

export interface UserCredentials {
    emailAddress: string;
    password: string;
}

export interface UserRegistration extends UserCredentials {
    firstName: string
    lastName: string
    
    role: Role


}

export interface Token {
    token: string
}
