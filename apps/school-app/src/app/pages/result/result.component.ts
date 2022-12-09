import { Component, OnInit } from '@angular/core';
import { Result } from 'apps/school-app/src/app/shared/models/result.model';
import { ResultService } from 'apps/school-app/src/app/shared/services/result/result.service';
import { User } from 'apps/school-app/src/app/shared/models/user.model';
import { UserService } from 'apps/school-app/src/app/shared/services/user/user.service';
import { Subject } from 'apps/school-app/src/app/shared/models/subject.model';
import { SubjectService } from 'apps/school-app/src/app/shared/services/subject/subject.service';

@Component({
  selector: 'app-result',
  templateUrl: '../result/result.component.html',
  styleUrls: ['../result/result.component.css']
})
export class ResultComponent implements OnInit {
    results: Result[] = [];
    users: User[] = [];
    subjects: Subject[] = [];

    constructor(private resultService: ResultService, private userService: UserService, private subjectService: SubjectService) { }

    ngOnInit(): void {
      this.results = this.resultService.getAllResults();
      this.users = this.userService.getAllUsers();
      this.subjects = this.subjectService.getAllSubjects();
    }
  
    deleteResult(id: number) {
      this.resultService.deleteResult(id)
    }

}
