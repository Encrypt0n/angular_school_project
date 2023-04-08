import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';

import { ResultService } from 'apps/school-app/src/app/shared/services/result/result.service';
import { User } from 'apps/school-app/src/app/shared/models/user.model';
import { UserService } from 'apps/school-app/src/app/shared/services/user/user.service';

import { SubjectService } from 'apps/school-app/src/app/shared/services/subject/subject.service';
import { Result } from 'libs/data/src/lib/result.model';
import { Subject } from '@school-app/data';


@Component({
  selector: 'app-resultEdit',
  templateUrl: '../edit/edit.component.html',
  styleUrls: ['../edit/edit.component.css']
})
export class ResultEditComponent implements OnInit {
  result: Result = new Result();
  users: User[] = [];
  subjects: Subject[] = [];
  isEdit: boolean = false;
  results: Result[] = [];

  constructor(private resultService: ResultService, private userService: UserService, private subjectService: SubjectService,  private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    
    this.userService.getAllUsers().subscribe((users) => {
      this.users = users.filter(user => user.role === "student");
      
      console.log(users);
    });
    this.subjectService.getAllSubjects().subscribe((subjects) => {
      this.subjects = subjects;
      console.log(subjects);
    });

    this.route.paramMap.subscribe((params) => {
      let id = params.get("id");
      let studentId = params.get("studentId");
      if (id) {
        this.isEdit = true;
        
        this.resultService.getResultById(studentId!, id).subscribe((result) => {
          //this.result.subjectId = result.subjectId.id;
          this.result = {
            id: result.id,
            studentId: result.studentId,
            subject: result.subject,
            grade: result.grade,
            rating: result.rating,
            date: result.date,
            
          }
      })
      } else {
        this.isEdit = false;
        this.result = {
          id: "",
          studentId: "",
          subject: new Subject(),
          grade: 0,
          rating: "",
          date: "",
          
        }
      }
    })
  }

  onSubmit(resultForm: NgForm): void {
    this.resultService.getAllResults().subscribe((results) => {
      this.results = {
        ...results,
        ...resultForm.value
      }
      console.log(results);
    });
    if (this.isEdit) {
      this.route.paramMap.subscribe((param) => {
      this.resultService.updateResult(param.get('studentId')!, this.result.id, resultForm.value).subscribe((data: any) => {
        //this.getRe(+this.route.snapshot.paramMap.get('id')!);
      });
    });
    } else {
      let result = {
        id: this.results.length + 1,
        ...resultForm.value
      };
      console.log(result);
      this.resultService.addResult(result).subscribe((data: any) => {
        //this.getRe(+this.route.snapshot.paramMap.get('id')!);
      });
    }
    console.log(this.result);
    this.router.navigate(['results']);
  }

}
