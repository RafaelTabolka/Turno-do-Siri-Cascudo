import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IGetUserResponse } from '../interfaces/user/get-user-response';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly baseUrl = '/api/users';

  constructor(private http: HttpClient) { }

  public getUsers(): Observable<IGetUserResponse[]> {
    return this.http.get<IGetUserResponse[]>(this.baseUrl);
  }
}
