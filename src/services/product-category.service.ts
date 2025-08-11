import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

interface GetProductCategoriesFilter {
  search?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductCategoryService {

  private apiURL = environment.apiUrl;

  constructor(
    private httpClient: HttpClient
  ) { }

  getProductCategories (filter?: GetProductCategoriesFilter): Observable<any> {
    const params = new URLSearchParams();
    
    if (filter?.search) {
      params.append('search', filter.search);
    }

    // Make HTTP GET request with optional filter parameters
    return this.httpClient.get(`${this.apiURL}/product-category?${params.toString()}`);
  }

}
