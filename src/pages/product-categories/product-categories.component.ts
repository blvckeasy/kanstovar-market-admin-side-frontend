import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, NonNullableFormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';

import { ProductCategoryService } from '../../services/product-category.service';
import { MenuComponent } from "../../components/menu/menu.component";
import { NzMessageService } from 'ng-zorro-antd/message';

export interface ItemData {
  id: string;
  name: string;
  age: number;
  address: string;
}

export interface IProductCategory {
  _id: string;
  name_uz: string;
  name_ru: string;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateProductCategory {
  name_uz: string;
  name_ru: string;
}

@Component({
  selector: 'app-product-categories',
  imports: [NzTableModule, MenuComponent, FormsModule, NzInputModule, NzPopconfirmModule, ReactiveFormsModule, NzButtonModule, NzFormModule, NzInputModule, NzModalModule],
  templateUrl: './product-categories.component.html',
  styleUrl: './product-categories.component.css',
  providers: [ProductCategoryService]
})
export class ProductCategoriesComponent implements OnInit {
  private fb = inject(NonNullableFormBuilder);

  editCache: { [key: string]: { edit: boolean; data: IProductCategory } } = {};
  listOfData: ItemData[] = [];

  productCategories: IProductCategory[] = [];

  isCreateCategoryModalVisibleMiddle: boolean = false;
  
  createProductCategoryForm = this.fb.group({
    name_uz: ['', Validators.required],
    name_ru: ['', Validators.required],
  });

  
  constructor (
    private productCategoryService: ProductCategoryService,
    private messageService: NzMessageService,
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

  async openCreateProductCategoryModal () {
    this.isCreateCategoryModalVisibleMiddle = true;
  }

  async handleCreateCategoryModealCancelMiddle () {
    this.isCreateCategoryModalVisibleMiddle = false;
  }

  async handlehandleCreateCategoryModealOkMiddle () {

    const body = this.createProductCategoryForm.value;

    this.productCategoryService.createProductCategory(body).subscribe(({ message, data, error }) => {
      if (error) {
        this.messageService.error(error.message);
        return;
      }

      this.messageService.success(message);
      this.createProductCategoryForm.reset();
    })

    this.isCreateCategoryModalVisibleMiddle = false;
  }
}
