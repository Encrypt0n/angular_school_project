import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Result } from 'src/app/shared/models/result.model';
import { ResultService } from 'src/app/shared/services/result/result.service';
import { User } from 'src/app/shared/models/user.model';
import { UserService } from 'src/app/shared/services/user/user.service';
import { Subject } from 'src/app/shared/models/subject.model';
import { SubjectService } from 'src/app/shared/services/subject/subject.service';


@Component({
  selector: 'app-resultEdit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class ResultEditComponent implements OnInit {
  result: Result | undefined;
  users: User[] = [];
  subjects: Subject[] = [];
  isEdit: boolean = false;

  constructor(private resultService: ResultService, private userService: UserService, private subjectService: SubjectService,  private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.users = this.userService.getAllUsers();
    this.subjects = this.subjectService.getAllSubjects();

    this.route.paramMap.subscribe((params) => {
      let id = params.get("id");
      if (id) {
        this.isEdit = true;
        this.result = this.resultService.getResultById(Number(id));
      } else {
        this.isEdit = false;
        this.result = {
          resultId: 0,
          studentId: 0,
          subjectId: 0,
          grade: 0,
          rating: "",
          date: "",
          
        }
      }
    })
  }

  onSubmit(resultForm: NgForm): void {
    
    if (this.isEdit) {
      this.resultService.updateResult(resultForm.value)
    } else {
      let result = {
        resultId: this.resultService.getAllResults().length + 1,
        ...resultForm.value
      };
      console.log(result);
      this.resultService.addResult(result);
    }
    console.log(this.result);
    this.router.navigate(['results']);
  }

}
