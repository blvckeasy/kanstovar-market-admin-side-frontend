import { Component, OnInit } from '@angular/core';
import { NzTableModule } from 'ng-zorro-antd/table';
import { MenuComponent } from "../../components/menu/menu.component";

import { FormsModule } from '@angular/forms';

import { NzInputModule } from 'ng-zorro-antd/input';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';

interface ItemData {
  id: string;
  name: string;
  age: number;
  address: string;
}

@Component({
  selector: 'app-product-categories',
  imports: [NzTableModule, MenuComponent, FormsModule, NzInputModule, NzPopconfirmModule],
  templateUrl: './product-categories.component.html',
  styleUrl: './product-categories.component.css'
})
export class ProductCategoriesComponent implements OnInit {
  editCache: { [key: string]: { edit: boolean; data: ItemData } } = {};
  listOfData: ItemData[] = [];

  startEdit(id: string): void {
    this.editCache[id].edit = true;
  }

  cancelEdit(id: string): void {
    const index = this.listOfData.findIndex(item => item.id === id);
    this.editCache[id] = {
      data: { ...this.listOfData[index] },
      edit: false
    };
  }

  saveEdit(id: string): void {
    const index = this.listOfData.findIndex(item => item.id === id);
    Object.assign(this.listOfData[index], this.editCache[id].data);
    this.editCache[id].edit = false;
  }

  updateEditCache(): void {
    this.listOfData.forEach(item => {
      this.editCache[item.id] = {
        edit: false,
        data: { ...item }
      };
    });
  }

  ngOnInit(): void {
    const data: ItemData[] = [];
    for (let i = 0; i < 100; i++) {
      data.push({
        id: `${i}`,
        name: `Edward ${i}`,
        age: 32,
        address: `London Park no. ${i}`
      });
    }
    this.listOfData = data;
    this.updateEditCache();
  }
}
