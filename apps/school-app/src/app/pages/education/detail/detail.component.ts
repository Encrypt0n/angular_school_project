
import { ActivatedRoute } from '@angular/router';
import { Education } from 'apps/school-app/src/app/shared/models/education.model';
import { Component, OnInit } from '@angular/core';
import { EducationService } from '../../../shared/services/education/education.service';

@Component({
    selector: 'app-educationDetail',
    templateUrl: '../detail/detail.component.html',
    styleUrls: ['../detail/detail.component.css']
})
export class EducationDetailComponent implements OnInit {
    education: Education | null = null;
    constructor(private educationService: EducationService, private route: ActivatedRoute) {}

    ngOnInit(): void {
        
        this.route.paramMap.subscribe((param) => {
            
            console.log(param.get('id'));
            
            this.educationService.getEducationById(param.get('id')).subscribe((education) => {
               
                this.education = education;
                console.log(education);
                
            })
        })
    }
}