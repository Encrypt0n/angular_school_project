import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Subject } from '@school-app/data';


import { Education } from 'libs/data/src/lib/education.model';

import { EducationService } from '../../../shared/services/education/education.service';


@Component({
  selector: 'app-educationEdit',
  templateUrl: '../edit/edit.component.html',
  styleUrls: ['../edit/edit.component.css']
})
export class EducationEditComponent implements OnInit {
  education: Education = new Education();
  isEdit: boolean = false;
  educations: Education[] = [];

  constructor(private educationService: EducationService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      let id = params.get("id");
      if (id) {
        this.isEdit = true;
       
        this.educationService.getEducationById(id).subscribe((education) => {
          this.education = education;
      })
        
      } else {
        this.isEdit = false;
        this.education = {
          id: "",
          name: "",
          description: "",
         subjects: []
        }
      }
    })
  }

  onSubmit(educationForm: NgForm): void {
    this.educationService.getAllEducations().subscribe((educations) => {
      this.educations = educations;
      console.log(educations);
    });
    if (this.isEdit) {
      console.log(educationForm.value);
      
      this.educationService.updateEducation(this.education.id, educationForm.value).subscribe((data: any) => {
        //this.getRe(+this.route.snapshot.paramMap.get('id')!);
      });
    } else {
      let subject = {
        id: this.educations.length + 1,
        ...educationForm.value
      };
      console.log(subject);
      
      this.educationService.addEducation(subject).subscribe((data: any) => {
        //this.getRe(+this.route.snapshot.paramMap.get('id')!);
      });
    }

    this.router.navigate(['education']);
  }

}
