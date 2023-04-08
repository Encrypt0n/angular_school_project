import { Injectable } from '@angular/core';
import { Observable, Subject, map } from 'rxjs';
import { Result } from '../../models/result.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../../auth/auth.service';
import { User } from '../../models/user.model';
import { IToken } from '../../../auth/auth.interface';
import { UserService } from '../user/user.service';

@Injectable({providedIn: 'root'})

export class ResultService {
    private readonly headers = new HttpHeaders({
        'Content-Type': 'application/json',
      });


    


constructor(private httpClient: HttpClient, private userService: UserService) {}


getAllResults(): Observable<Result[]> {
  

    return this.httpClient
    .get(`http://localhost:3333/api/data-api/result`, {
      headers: this.headers,
    })
    .pipe(
      map((data: any) => data),
      map((results: Result[]) => {
        return results;
      })
    );
 

 
}

getResultsByStudent(id: string | null): Observable<Result[]> {
  return this.httpClient
  .get(`http://localhost:3333/api/data-api/result/student/` + id, {
    headers: this.headers,
  })
  .pipe(
    map((data: any) => data),
    map((results: Result[]) => {
      return results;
    })
  );
}

getResultById(studentId: string, id: string | null): Observable<Result> {
  console.log(studentId);
  
    return this.httpClient
    .get<Result>(`http://localhost:3333/api/data-api/result/`+ studentId + `/` + id, {
      headers: this.headers,
    })
    .pipe(
      map((result: Result) => {
        console.log(result);
        return result;
      })
    );
}

addResult(resultInfo: any): Observable<Object> {
    const result = {
        studentId: resultInfo.studentId,
        subject: resultInfo.subject,
        grade: resultInfo.grade,
        rating: resultInfo.rating
        
   
    }
    console.log(result);
    

    return this.httpClient
      .post(`http://localhost:3333/api/data-api/result`, result, {
        headers: this.headers,
      })
}

deleteResult(studentId: string, id: string): Observable<Object> {
  console.log(studentId);
  
    //let result = this.results.findIndex((result) => result.resultId == id);
    //this.results.splice(result, 1);
    return this.httpClient
    .delete(`http://localhost:3333/api/data-api/result/` + studentId + `/` + id, {
      headers: this.headers,
    });
}

updateResult(studentId: string, id: string, resultInfo: any): Observable<Object> {
    

    return this.httpClient
    .put(`http://localhost:3333/api/data-api/result/`+ studentId + `/` + id, resultInfo, {
      headers: this.headers,
    });
}

}