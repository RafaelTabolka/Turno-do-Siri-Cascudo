import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IItem } from '../interfaces/models/item/item';

@Injectable({
  providedIn: 'root'
})
export class ItemsService {
  private readonly baseUrl: string = '/api/items'

  constructor(private http: HttpClient) { }

  getAllItems(): Observable<IItem[]> {
    return this.http.get<IItem[]>(this.baseUrl);
  }
}
