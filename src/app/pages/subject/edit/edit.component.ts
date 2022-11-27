import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Subject } from 'src/app/shared/models/subject.model';
import { SubjectService } from 'src/app/shared/services/subject/subject.service';

@Component({
  selector: 'app-subjectEdit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class SubjectEditComponent implements OnInit {
  subject: Subject | undefined;
  isEdit: boolean = false;

  constructor(private subjectService: SubjectService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      let id = params.get("id");
      if (id) {
        this.isEdit = true;
        this.subject = this.subjectService.getSubjectById(Number(id));
      } else {
        this.isEdit = false;
        this.subject = {
          subjectId: 0,
          name: "",
          description: "",
          credits: 0,
          
        }
      }
    })
  }

  onSubmit(subjectForm: NgForm): void {
    if (this.isEdit) {
      this.subjectService.updateSubject(subjectForm.value)
    } else {
      let subject = {
        subjectId: this.subjectService.getAllSubjects().length + 1,
        ...subjectForm.value
      };
      this.subjectService.addSubject(subject);
    }

    this.router.navigate(['subjects']);
  }

}
