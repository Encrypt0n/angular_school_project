import { Component, OnInit } from '@angular/core';
import { User } from 'apps/school-app/src/app/shared/models/user.model';
import { UserService } from 'apps/school-app/src/app/shared/services/user/user.service';

@Component({
  selector: 'app-user',
  templateUrl: '../user/user.component.html',
  styleUrls: ['../user/user.component.css']
})
export class UserComponent implements OnInit {
    users: User[] = [];

    constructor(private userService: UserService) { }

    ngOnInit(): void {
      this.users = this.userService.getAllUsers();
    }
  
    deleteUser(id: number) {
      this.userService.deleteUser(id)
    }

}
