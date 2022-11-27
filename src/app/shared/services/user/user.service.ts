import { Injectable } from '@angular/core';
import { User } from '../../models/user.model';

@Injectable({providedIn: 'root'})

export class UserService {
    users: User[] = [
        {
            userId: 1,
            firstName: "Bas",
            lastName: "van Turnhout",
            emailAddress: "bas@bas.nl",
            phoneNumber: "0612345678",
            city: "Breda"
        },
        {
            userId: 2,
            firstName: "Jan",
            lastName: "Jansen",
            emailAddress: "jan@jan.nl",
            phoneNumber: "0612345678",
            city: "Tilburg"
        },
        {
            userId: 3,
            firstName: "Stijn",
            lastName: "van Oorschot",
            emailAddress: "stijn@stijn.nl",
            phoneNumber: "0612345678",
            city: "Etten-Leur"
        },
        {
            userId: 4,
            firstName: "Joost",
            lastName: "van Eekelen",
            emailAddress: "joost@joost.nl",
            phoneNumber: "0612345678",
            city: "Breda"
        },
        {
            userId: 5,
            firstName: "Nick",
            lastName: "Westervoorde",
            emailAddress: "nick@nick.nl",
            phoneNumber: "0612345678",
            city: "Dordrecht"
        }
    ]


constructor() {}

getAllUsers(): User[] {
    return this.users;
}

getUserById(id: number): User {
    return this.users.filter(user => user.userId == id)[0];
}

addUser(user: User) {
    this.users.push(user);
}

deleteUser(id: number) {
    let user = this.users.findIndex((user) => user.userId == id);
    this.users.splice(user, 1);
}

updateUser(userToUpdate: User) {
    this.users.forEach(user => {
        if(user.userId == userToUpdate.userId) {
            user = userToUpdate;
        }
    })
}

}