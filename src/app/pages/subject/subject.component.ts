import { Component, OnInit } from '@angular/core';
import { Subject } from 'src/app/shared/models/subject.model';
import { SubjectService } from 'src/app/shared/services/subject/subject.service';

@Component({
  selector: 'app-subject',
  templateUrl: './subject.component.html',
  styleUrls: ['./subject.component.css']
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
