import { Component, OnInit } from '@angular/core';
import { Subject } from '@school-app/data';

import { SubjectService } from 'apps/school-app/src/app/shared/services/subject/subject.service';
import { User } from '../../shared/models/user.model';
import { UserService } from '../../shared/services/user/user.service';

@Component({
  selector: 'app-subject',
  templateUrl: '../subject/subject.component.html',
  styleUrls: ['../subject/subject.component.css']
})
export class SubjectComponent implements OnInit {
    subjects: Subject[] = [];
    userTokenData: any;
    user: User | null = null;

    constructor(private subjectService: SubjectService, private userService: UserService) { }

    ngOnInit(): void {

      this.userTokenData = this.userService.decodeJwtToken(this.userService.getAuthorizationToken()!) as any;


      console.log("userTokenData", this.userTokenData);

      this.userService.getUserById(this.userTokenData["id"] as string | undefined).subscribe((user) => {
        this.user = user;
        //this.loadResults();
       })

    
      this.subjectService.getAllSubjects().subscribe((subjects) => {
        this.subjects = subjects;
        console.log(subjects);
      });
    }
  
    deleteSubject(id: string) {
      this.subjectService.deleteSubject(id).subscribe((subject) => {
        console.log('deleted subject', subject);
      });

    }

}
