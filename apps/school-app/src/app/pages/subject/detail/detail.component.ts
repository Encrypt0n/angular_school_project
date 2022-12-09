import { SubjectService } from 'apps/school-app/src/app/shared/services/subject/subject.service';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'apps/school-app/src/app/shared/models/subject.model';
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-subjectDetail',
    templateUrl: '../detail/detail.component.html',
    styleUrls: ['../detail/detail.component.css']
})
export class SubjectDetailComponent implements OnInit {
    subject: Subject | null = null;
    constructor(private subjectService: SubjectService, private route: ActivatedRoute) {}

    ngOnInit(): void {
        this.route.paramMap.subscribe((param) => {
            this.subject = this.subjectService.getSubjectById(Number(param.get('id')));
        })
    }
}