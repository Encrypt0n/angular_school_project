import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RegisterModel, LoginModel } from '@school-app/data';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
    constructor(private httpClient: HttpClient) {}

    private url = 'http://localhost:3333/api/auth-api'

    private headers = new HttpHeaders({
      'Access-Control-Allow-Origin':'*',
    });

    registerUser(newUser: RegisterModel): Observable<string> {
      console.log('Register new user');
      return this.httpClient.post<string>(this.url + '/register', newUser);
    }

    loginUser(loginUser: LoginModel): Observable<string> {
      console.log('Login existing user');
      return this.httpClient.post<string>(this.url + '/login', loginUser);
    }
}
