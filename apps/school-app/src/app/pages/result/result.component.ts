import { Component, OnInit } from '@angular/core';
import { Result } from 'apps/school-app/src/app/shared/models/result.model';
import { ResultService } from 'apps/school-app/src/app/shared/services/result/result.service';

import { UserService } from 'apps/school-app/src/app/shared/services/user/user.service';
import { Subject } from 'apps/school-app/src/app/shared/models/subject.model';
import { SubjectService } from 'apps/school-app/src/app/shared/services/subject/subject.service';
import { IToken } from '../../auth/auth.interface';
import { Observable } from 'rxjs';
import { User } from 'libs/data/src/lib/user.model';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-result',
  templateUrl: '../result/result.component.html',
  styleUrls: ['../result/result.component.css']
})
export class ResultComponent implements OnInit {
    results: Result[] = [];
    users: User[] = [];
    subjects: Subject[] = [];
    userId: string | undefined;
  token$: Observable<IToken> | undefined;
  userTokenData: any;
  user: User | null = null;


    constructor(private resultService: ResultService, private userService: UserService, private subjectService: SubjectService, private route: ActivatedRoute) {

      
     }

    
    ngOnInit(): void {
      


      this.userTokenData = this.userService.decodeJwtToken(this.userService.getAuthorizationToken()!) as any;


      console.log("userTokenData", this.userTokenData);

     // let id = userTokenData["id"];
    //  console.log("id", id);

    
     
  
      //this.route.paramMap.subscribe((param) => {
        
              
              this.userService.getUserById(this.userTokenData["id"] as string | undefined).subscribe((user) => {
               this.user = user;
               this.loadResults();
              })
              //console.log("user", this.user);
      //});
            
              
      /*this.userService.getUserById(userTokenData['id']).subscribe((user) => {
        this.user = user;
      });*/
      
     // console.log("role", this.user);
     
      
      //this.loadResults();
      
    }

    loadResults() { 
      if(this.user?.role === "teacher") {
        console.log("teacher");
        
        this.resultService.getAllResults().subscribe((results) => {
          this.results = results;
          console.log("results", results);
        });
      } else {
        console.log("student");
        
        this.resultService.getResultsByStudent(this.userTokenData['id']).subscribe((results) => {
          this.results = results;
          console.log("results", results);
        });
      }
        
      this.results.forEach((result) => {
        this.userService.getUserById(result.studentId).subscribe((user) => { 
          result.studentId = user.id;
        });
      });
      this.userService.getAllUsers().subscribe((users) => {
        this.users = users;
        console.log(users);
      });
      this.subjectService.getAllSubjects().subscribe((subjects) => {
        this.subjects = subjects;
        console.log(subjects);
      });
    }
  
    async deleteResult(studentId: string, id: string) {
      console.log("studentId", studentId);
      
      this.resultService.deleteResult(studentId, id).subscribe((result) => {
        
          console.log('deleted result', result);
      });
    }

}
