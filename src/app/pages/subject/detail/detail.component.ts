import { SubjectService } from 'src/app/shared/services/subject/subject.service';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'src/app/shared/models/subject.model';
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-subjectDetail',
    templateUrl: './detail.component.html',
    styleUrls: ['./detail.component.css']
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