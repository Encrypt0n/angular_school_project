import { SubjectService } from 'apps/school-app/src/app/shared/services/subject/subject.service';
import { ActivatedRoute } from '@angular/router';

import { Component, OnInit } from '@angular/core';
import { Subject } from '@school-app/data';



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
            
            console.log(param.get('id'));
            
            this.subjectService.getSubjectById(param.get('id')).subscribe((subject) => {
               
                this.subject = subject;
                console.log(subject);
                
            })
        })
    }
}