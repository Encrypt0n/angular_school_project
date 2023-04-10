import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { User } from '../../models/user.model';
import { Subject } from '../../models/subject.model';


@Injectable({providedIn: 'root'})

export class SubjectService {
    private subjects: Subject[] = [];
    private readonly headers = new HttpHeaders({
        'Content-Type': 'application/json',
      });

   
   

constructor(private httpClient: HttpClient) {}

private url = 'http://localhost:3333/api/data-api'

getAllSubjects(): Observable<Subject[]> {
    return this.httpClient
    .get(this.url + `/subject`, {
      headers: this.headers,
    })
    .pipe(
      map((data: any) => data),
      map((subjects: Subject[]) => {
        return subjects;
      })
    );
}

getSubjectById(id: string | null): Observable<Subject> {
  console.log(id);
  
    return this.httpClient
    .get<Subject>(this.url +`/subject/` + id, {
      headers: this.headers,
    })
    .pipe(
      map((subject: Subject) => {
        console.log(subject);
        return subject;
      })
    );
}



addSubject(subjectInfo: any
  ): Observable<Object> {
    console.log(subjectInfo);
    
    const subject = {
        name: subjectInfo.name,
        description: subjectInfo.description,
        credits: subjectInfo.credits,
        education: subjectInfo.education,
   
    }
    console.log(subject);
    

    return this.httpClient
      .post(this.url +`/subject`, subject, {
        headers: this.headers,
      })
      
  }

deleteSubject(id: string) {
    //let subject = this.subjects.findIndex((subject) => subject.id == id);
    //this.subjects.splice(subject, 1);
    return this.httpClient
    .delete(this.url +`/subject/` + id, {
      headers: this.headers,
    });
}

updateSubject(id: string, subjectInfo: any): Observable<Object> {
    console.log(id);
    console.log(subjectInfo);
    return this.httpClient
    .put(this.url +`/subject/` + id, subjectInfo, {
      headers: this.headers,
    });
    
}









}