import { UserService } from 'apps/school-app/src/app/shared/services/user/user.service';
import { ActivatedRoute } from '@angular/router';
import { User } from 'apps/school-app/src/app/shared/models/user.model';
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-userDetail',
    templateUrl: '../detail/detail.component.html',
    styleUrls: ['../detail/detail.component.css']
})
export class UserDetailComponent implements OnInit {
    user: User | null = null;
    constructor(private userService: UserService, private route: ActivatedRoute) {}

    ngOnInit(): void {
        this.route.paramMap.subscribe((param) => {
            this.user = this.userService.getUserById(Number(param.get('id')));
        })
    }
}