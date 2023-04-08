import { Injectable } from '@angular/core';
import { User } from '../../models/user.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, map, Observable, of, switchMap } from 'rxjs';
import { IToken } from '../../../auth/auth.interface';
import jwt_decode from 'jwt-decode';


@Injectable({providedIn: 'root'})
 

export class UserService {
    private users: User[] = [];
    private readonly headers = new HttpHeaders({
        'Content-Type': 'application/json',
      });
    public currentUser$ = new BehaviorSubject<IToken | undefined>(undefined);
    private readonly CURRENT_USER = 'currentuser';
    


constructor(private httpClient: HttpClient) {
  this.getUserFromLocalStorage()
  .pipe(
    switchMap((user: IToken | undefined) => {
      if (user) {
        console.log('User found in local storage');
        console.log(user);
        this.currentUser$.next(user);
        return of(user);
      } else {
        return of(undefined);
      }
    })
  )
  .subscribe();
}



getAllUsers(): Observable<User[]> {
    return this.httpClient
      .get(`http://localhost:3333/api/data-api/user`, {
        headers: this.headers,
      })
      .pipe(
        map((data: any) => data),
        map((users: User[]) => {
          return users;
        })
      );
  }

getUserById(userId: string | undefined): Observable<User> {
    return this.httpClient
      .get<User>(`http://localhost:3333/api/data-api/user/` + userId, {
        headers: this.headers,
      })
      .pipe(
        map((user: User) => {
          console.log(user);
          return user;
        })
      );
  }




deleteUser(id: string) {
  return this.httpClient.delete(
    `http://localhost:3333/api/data-api/user/` + id,
    {
      headers: this.headers,
    }
  );
}

updateUser(userToUpdate: User): Observable<Object> {
    
    return this.httpClient.put(
        `http://localhost:3333/api/data-api/user/` + userToUpdate.id,
        userToUpdate,
        {
          headers: this.headers,
        }
      );
}

getUserFromLocalStorage(): Observable<IToken | undefined> {
  const user = localStorage.getItem(this.CURRENT_USER);
  if (user) {
    const localUser = JSON.parse(user);
    return of(localUser);
  } else {
    return of(undefined);
  }
}

getAuthorizationToken(): string | undefined {
  const user = localStorage.getItem(this.CURRENT_USER);
  if (user) {
    const localUser = JSON.parse(user);
    return localUser.token;
  }
  return undefined;
}

decodeJwtToken(token: string){
  return jwt_decode(token);
}



}