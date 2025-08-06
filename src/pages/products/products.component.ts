import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { MenuComponent } from '../../components/menu/menu.component';
import { PaginationComponent } from '../../components/pagination/pagination.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-products',
  imports: [CommonModule, ProductCardComponent, MenuComponent, PaginationComponent, NzButtonModule, RouterModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
  providers: [ProductService],
})
export class ProductsComponent implements OnInit {
  products: any[] = [];

  constructor(
    private productService: ProductService,
  ) { }

  ngOnInit(): void {
    console.log("ProductsComponent initialized");
    this.productService.getProducts().subscribe(({ data, error }) => {
      if (error) {
        alert(error.message);
        return;
      }

      console.log(data);

      this.products = data;
    })
    console.log("ProductsComponent ngOnInit executed");
  }
}
