import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { User } from 'src/app/shared/models/user.model';
import { UserService } from 'src/app/shared/services/user/user.service';

@Component({
  selector: 'app-userEdit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class UserEditComponent implements OnInit {
  user: User | undefined;
  isEdit: boolean = false;

  constructor(private userService: UserService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      let id = params.get("id");
      if (id) {
        this.isEdit = true;
        this.user = this.userService.getUserById(Number(id));
      } else {
        this.isEdit = false;
        this.user = {
          userId: 0,
          firstName: "",
          lastName: "",
          emailAddress: "",
          phoneNumber: "",
          city: "",
        }
      }
    })
  }

  onSubmit(userForm: NgForm): void {
    if (this.isEdit) {
      this.userService.updateUser(userForm.value)
    } else {
      let user = {
        userId: this.userService.getAllUsers().length + 1,
        ...userForm.value
      };
      this.userService.addUser(user);
    }

    this.router.navigate(['users']);
  }

}
