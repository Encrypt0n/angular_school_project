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
    user: User | null = null;
    subjects: Subject[] = [];
    constructor(private resultService: ResultService, private userService: UserService, private subjectService: SubjectService, private route: ActivatedRoute) {}

    ngOnInit(): void {
        this.route.paramMap.subscribe((param) => {
            

            this.resultService.getResultById(param.get('studentId')!, param.get('id')).subscribe((result) => {
               console.log(param.get('studentId')!);
               
                this.result = result;
                console.log(result);
                
            })
            
            this.subjectService.getAllSubjects().subscribe((subjects) => {
                this.subjects = subjects;
                console.log(subjects);
              });
            this.userService.getUserById(param.get('studentId')!).subscribe((user) => {
                this.user = user;
                console.log(user);
              });
        })
    }
}