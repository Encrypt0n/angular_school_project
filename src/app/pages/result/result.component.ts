import { Component, OnInit } from '@angular/core';
import { Result } from 'src/app/shared/models/result.model';
import { ResultService } from 'src/app/shared/services/result/result.service';
import { User } from 'src/app/shared/models/user.model';
import { UserService } from 'src/app/shared/services/user/user.service';
import { Subject } from 'src/app/shared/models/subject.model';
import { SubjectService } from 'src/app/shared/services/subject/subject.service';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css']
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
