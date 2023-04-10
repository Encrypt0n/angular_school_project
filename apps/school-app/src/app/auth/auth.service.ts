import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of, switchMap, tap } from 'rxjs';
import { RegisterModel, LoginModel } from '@school-app/data';
import { IToken } from './auth.interface';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public currentUser$ = new BehaviorSubject<IToken | undefined>(undefined);
  private readonly CURRENT_USER = 'currentuser';
  
    constructor(private httpClient: HttpClient) {
     
    }

    private url = 'https://angularschoolproject-production.up.railway.app/api/auth-api'
    

    private headers = new HttpHeaders({
      'Access-Control-Allow-Origin':'*',
    });

    registerUser(newUser: RegisterModel): Observable<string> {
      console.log('Register new user');
      return this.httpClient.post<string>(this.url + '/register', newUser);
    }

    loginUser(loginUser: LoginModel): Observable<string | undefined> {
      console.log('Login existing user');
      return this.httpClient.post<string>(this.url + '/login', loginUser).pipe(
        tap(console.log),
        map((data: any) => {
          localStorage.setItem(this.CURRENT_USER, JSON.stringify(data));
          this.currentUser$.next(data);
          return data;
        }),
        catchError((error) => {
          return of(undefined);
        })
      );;
    }


}
