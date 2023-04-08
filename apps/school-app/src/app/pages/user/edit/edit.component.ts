import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { User } from 'apps/school-app/src/app/shared/models/user.model';
import { UserService } from 'apps/school-app/src/app/shared/services/user/user.service';

@Component({
  selector: 'app-userEdit',
  templateUrl: '../edit/edit.component.html',
  styleUrls: ['../edit/edit.component.css']
})
export class UserEditComponent implements OnInit {
  user: User | undefined;
  isEdit: boolean = false;
  users: User[] = [];

  constructor(private userService: UserService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      let id = params.get("id");
      if (id) {
        this.isEdit = true;
      
        this.userService.getUserById(id).subscribe((user) => {
          this.user = user;
      })
      } else {
        this.isEdit = false;
        this.user = {
          id: "",
          firstName: "",
          lastName: "",
          emailAddress: "",
          phoneNumber: "",
          city: "",
          role: "",
        }
      }
    })
  }

  onSubmit(userForm: NgForm): void {
    this.userService.getAllUsers().subscribe((users) => {
      this.users = users;
      console.log(users);
    });
    if (this.isEdit) {
      this.userService.updateUser(userForm.value).subscribe((data: any) => {
        //this.getRe(+this.route.snapshot.paramMap.get('id')!);
      });
    } else {
     
    }

    this.router.navigate(['users']);
  }

}
