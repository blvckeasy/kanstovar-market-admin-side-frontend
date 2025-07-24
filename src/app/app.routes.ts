import { Routes } from '@angular/router';
import { ProductsComponent } from '../pages/products/products.component';
import { ProductCategoriesComponent } from '../pages/product-categories/product-categories.component';

export const routes: Routes = [
    {
        path: 'products',
        component: ProductsComponent,
    },
    {
        path: 'product-categories',
        component: ProductCategoriesComponent,
    }
];
