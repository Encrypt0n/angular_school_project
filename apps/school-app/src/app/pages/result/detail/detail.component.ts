import { ResultService } from 'apps/school-app/src/app/shared/services/result/result.service';
import { ActivatedRoute } from '@angular/router';
import { Result } from 'apps/school-app/src/app/shared/models/result.model';
import { Component, OnInit } from '@angular/core';
import { User } from 'apps/school-app/src/app/shared/models/user.model';
import { UserService } from 'apps/school-app/src/app/shared/services/user/user.service';
import { Subject } from 'apps/school-app/src/app/shared/models/subject.model';
import { SubjectService } from 'apps/school-app/src/app/shared/services/subject/subject.service';

@Component({
    selector: 'app-resultDetail',
    templateUrl: '../detail/detail.component.html',
    styleUrls: ['../detail/detail.component.css']
})
export class ResultDetailComponent implements OnInit {
    result: Result | null = null;
    users: User[] = [];
    subjects: Subject[] = [];
    constructor(private resultService: ResultService, private userService: UserService, private subjectService: SubjectService, private route: ActivatedRoute) {}

    ngOnInit(): void {
        this.route.paramMap.subscribe((param) => {
            this.result = this.resultService.getResultById(Number(param.get('id')));
            this.subjects = this.subjectService.getAllSubjects();
            this.users = this.userService.getAllUsers();
        })
    }
}