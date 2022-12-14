import { Component, OnInit } from '@angular/core';
import { Subject } from 'apps/school-app/src/app/shared/models/subject.model';
import { SubjectService } from 'apps/school-app/src/app/shared/services/subject/subject.service';

@Component({
  selector: 'app-subject',
  templateUrl: '../subject/subject.component.html',
  styleUrls: ['../subject/subject.component.css']
})
export class SubjectComponent implements OnInit {
    subjects: Subject[] = [];

    constructor(private subjectService: SubjectService) { }

    ngOnInit(): void {
      this.subjects = this.subjectService.getAllSubjects();
    }
  
    deleteSubject(id: number) {
      this.subjectService.deleteSubject(id)
    }

}
