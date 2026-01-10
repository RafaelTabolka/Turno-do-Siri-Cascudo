import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IUser } from '../interfaces/models/user/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly baseUrl = '/api/users';

  constructor(private http: HttpClient) { }

  getUsers(): Observable<IUser[]> {
    return this.http.get<IUser[]>(this.baseUrl);
  }
}
