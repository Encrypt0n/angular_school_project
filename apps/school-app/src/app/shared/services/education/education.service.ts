import { Injectable } from '@angular/core';
import { Education } from '../../models/education.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { User } from '../../models/user.model';

@Injectable({providedIn: 'root'})

export class EducationService {
    private educations: Education[] = [];
    private readonly headers = new HttpHeaders({
        'Content-Type': 'application/json',
      });

   
   

constructor(private httpClient: HttpClient) {}

private url = 'https://angularschoolproject-production.up.railway.app/api/data-api'

getAllEducations(): Observable<Education[]> {
    return this.httpClient
    .get(this.url +`/education`, {
      headers: this.headers,
    })
    .pipe(
      map((data: any) => data),
      map((educations: Education[]) => {
        return educations;
      })
    );
}

getEducationById(id: string | null): Observable<Education> {
 // console.log(id);
  
    return this.httpClient
    .get<Education>(this.url +`/education/` + id, {
      headers: this.headers,
    })
    .pipe(
      map((education: Education) => {
        //console.log(education);
        return education;
      })
    );
}



addEducation(educationInfo: any
  ): Observable<Object> {
    //console.log(educationInfo);
    
    const education = {
        name: educationInfo.name,
        description: educationInfo.description,
        subjects: educationInfo.subjects
   
    }
    //console.log(education);
    

    return this.httpClient
      .post(this.url +`/education`, education, {
        headers: this.headers,
      })
      
  }

deleteEducation(id: string) {
    //let subject = this.subjects.findIndex((subject) => subject.id == id);
    //this.subjects.splice(subject, 1);
    return this.httpClient
    .delete(this.url +`/education/` + id, {
      headers: this.headers,
    });
}

updateEducation(id: string, educationInfo: any): Observable<Object> {
    //console.log(id);
    //console.log(educationInfo);
    return this.httpClient
    .put(this.url +`/education/` + id, educationInfo, {
      headers: this.headers,
    });
    
}









}