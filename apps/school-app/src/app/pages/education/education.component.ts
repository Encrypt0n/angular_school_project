import { Component, OnInit } from '@angular/core';
import { Subject } from 'apps/school-app/src/app/shared/models/subject.model';
import { SubjectService } from 'apps/school-app/src/app/shared/services/subject/subject.service';
import { Education } from '../../shared/models/education.model';
import { User } from '../../shared/models/user.model';
import { EducationService } from '../../shared/services/education/education.service';
import { UserService } from '../../shared/services/user/user.service';

@Component({
  selector: 'app-education',
  templateUrl: '../education/education.component.html',
  styleUrls: ['../education/education.component.css']
})
export class EducationComponent implements OnInit {
    educations: Education[] = [];
    userTokenData: any;
    user: User | null = null;

    constructor(private educationService: EducationService, private userService: UserService) { }

    ngOnInit(): void {

      this.userTokenData = this.userService.decodeJwtToken(this.userService.getAuthorizationToken()!) as any;

   

      console.log("userTokenData", this.userTokenData);

      this.userService.getUserById(this.userTokenData["id"] as string | undefined).subscribe((user) => {
        this.user = user;
        //this.loadResults();
       })

    
      this.educationService.getAllEducations().subscribe((educations) => {
        this.educations = educations;
        console.log(educations);
      });
    }
  
    deleteEducation(id: string) {
      this.educationService.deleteEducation(id).subscribe((education) => {
        console.log('deleted education', education);
      });

    }

}
