export class User {
    id: string = '';
    firstName: string = '';
    lastName: string = '';
    emailAddress: string = '';
    role: string = '';

    constructor(id = '', firstName = '', lastName = '', emailAddress = '', role = '') {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.emailAddress = emailAddress;
        this.role = role;
    }
}