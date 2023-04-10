import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Education, Subject } from '@school-app/data';

import { SubjectService } from 'apps/school-app/src/app/shared/services/subject/subject.service';



import { EducationService } from '../../../shared/services/education/education.service';

@Component({
  selector: 'app-subjectEdit',
  templateUrl: '../edit/edit.component.html',
  styleUrls: ['../edit/edit.component.css']
})
export class SubjectEditComponent implements OnInit {
  subject: Subject  = new Subject();
  isEdit: boolean = false;
  subjects: Subject[] = [];
  educations: Education[] = []

  constructor(private subjectService: SubjectService, private educationService: EducationService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {

    this.educationService.getAllEducations().subscribe((educations) => {
      this.educations = educations;
      console.log(educations);
    });

    this.route.paramMap.subscribe((params) => {
      let id = params.get("id");
      if (id) {
        this.isEdit = true;
       
        this.subjectService.getSubjectById(id).subscribe((subject) => {
          this.subject = subject;
      })
        
      } else {
        this.isEdit = false;
        this.subject = {
          id: "",
          name: "",
          description: "",
          credits: 0,
          educations: [],
          education: "",
          students: []
          
        }
      }
    })
  }

  onSubmit(subjectForm: NgForm): void {
    this.subjectService.getAllSubjects().subscribe((subjects) => {
      this.subjects = subjects;
      console.log(subjects);
    });
    if (this.isEdit) {
      console.log(subjectForm.value);
      
      this.subjectService.updateSubject(this.subject.id, subjectForm.value).subscribe((data: any) => {
        //this.getRe(+this.route.snapshot.paramMap.get('id')!);
      });
    } else {
      let subject = {
        id: this.subjects.length + 1,
        ...subjectForm.value
      };
      console.log(subject);
      
      this.subjectService.addSubject(subject).subscribe((data: any) => {
        //this.getRe(+this.route.snapshot.paramMap.get('id')!);
      });
    }

    this.router.navigate(['subjects']);
  }

}
