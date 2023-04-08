import { UserService } from 'apps/school-app/src/app/shared/services/user/user.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { User } from 'libs/data/src/lib/user.model';

@Component({
    selector: 'app-userDetail',
    templateUrl: '../detail/detail.component.html',
    styleUrls: ['../detail/detail.component.css']
})
export class UserDetailComponent implements OnInit {
    
    user: User = new User();
    constructor(private userService: UserService, private route: ActivatedRoute) {}

    async ngOnInit(): Promise<void> {
        this.route.paramMap.subscribe((param) => {
            
            this.userService.getUserById(param.get('id') as string).subscribe((user) => {
                this.user.id = user.id;
                this.user.firstName = user.firstName;
                this.user.lastName = user.lastName;
                this.user.emailAddress = user.emailAddress;
            })
        })
        console.log(this.user);
    }
}