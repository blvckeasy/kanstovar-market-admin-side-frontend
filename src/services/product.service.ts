import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiURL = 'http://localhost:5000';

  constructor(
    private httpClient: HttpClient,
  ) { }

  getProducts (): Observable<any> {
    return this.httpClient.get(`${this.apiURL}/product`);
  }

  getProductById(id: string): Observable<any> {
    return this.httpClient.get(`${this.apiURL}/product/${id}`);
  }

  updateProduct(id: string, formData: FormData): Observable<any> {
    return this.httpClient.patch(`${this.apiURL}/product/${id}`, formData);
  }
}
