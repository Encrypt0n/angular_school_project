import { Component, OnInit } from '@angular/core';
import { User } from 'apps/school-app/src/app/shared/models/user.model';
import { UserService } from 'apps/school-app/src/app/shared/services/user/user.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-user',
  templateUrl: '../user/user.component.html',
  styleUrls: ['../user/user.component.css']
})
export class UserComponent implements OnInit {
  users: User[] = [];
  userTokenData: any;
  userr: User | null = null;

    constructor(private userService: UserService) { }

    async ngOnInit(): Promise<void> {
      this.userTokenData = this.userService.decodeJwtToken(this.userService.getAuthorizationToken()!) as any;


      console.log("userTokenData", this.userTokenData);

      this.userService.getUserById(this.userTokenData["id"] as string | undefined).subscribe((user) => {
        this.userr = user;
        console.log(this.userr);
        
        this.getUsers();
       })
       //console.log(this.userr);
       

      //await this.getUsers();
    }

    async getUsers(): Promise<void> {

      if(this.userr?.role === "teacher") {
        this.userService.getAllUsers().subscribe((users) => {
          this.users = users;
          console.log(users);
        });
      } else {
        this.userService.getUserById(this.userTokenData["id"] as string | undefined).subscribe((user) => {
          this.users.push(user);
          console.log(user);
        });
    }

  }


  
    async deleteUser(id: string) {
      console.log('userid', id);
      
      this.userService.deleteUser(id).subscribe((user) => {
        console.log('deleted user', user);
        
      });
    }

}
