import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ILoginRequest } from '../interfaces/login/login-request';
import { Observable } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private readonly baseUrl = '/api/users';
  
  constructor(private http: HttpClient) { }

  public getUsers(): Observable<ILoginRequest[]> {
    return this.http.get<User[]>(this.baseUrl);
  }
}
