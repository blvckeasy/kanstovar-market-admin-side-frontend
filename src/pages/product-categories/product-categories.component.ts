import { Component, OnInit } from '@angular/core';
import { NzTableModule } from 'ng-zorro-antd/table';
import { MenuComponent } from "../../components/menu/menu.component";

import { FormsModule } from '@angular/forms';

import { NzInputModule } from 'ng-zorro-antd/input';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { ProductCategoryService } from '../../services/product-category.service';

interface ItemData {
  id: string;
  name: string;
  age: number;
  address: string;
}

interface IProductCategory {
  _id: string;
  name_uz: string;
  name_ru: string;
  createdAt: string;
  updatedAt: string;
}

@Component({
  selector: 'app-product-categories',
  imports: [NzTableModule, MenuComponent, FormsModule, NzInputModule, NzPopconfirmModule],
  templateUrl: './product-categories.component.html',
  styleUrl: './product-categories.component.css',
  providers: [ProductCategoryService]
})
export class ProductCategoriesComponent implements OnInit {
  editCache: { [key: string]: { edit: boolean; data: IProductCategory } } = {};
  listOfData: ItemData[] = [];

  productCategories: IProductCategory[] = [];

  constructor (
    private productCategoryService: ProductCategoryService,
  ) {}

  startEdit(id: string): void {
    this.editCache[id].edit = true;
  }

  cancelEdit(id: string): void {
    const index = this.productCategories.findIndex(item => item._id === id);
    this.editCache[id] = {
      data: { ...this.productCategories[index] },
      edit: false
    };
  }

  saveEdit(id: string): void {
    const index = this.productCategories.findIndex(item => item._id === id);
    Object.assign(this.productCategories[index], this.editCache[id].data);
    this.editCache[id].edit = false;
  }

  updateEditCache(): void {
    this.productCategories.forEach(item => {
      this.editCache[item._id] = {
        edit: false,
        data: { ...item }
      };
    });
  }

  ngOnInit(): void {

    this.productCategoryService.getProductCategories().subscribe(({ error, data }) => {
      if (error) {
        return alert(error.message);
      }

      this.productCategories = data;
      this.updateEditCache();
    })
  }
}
