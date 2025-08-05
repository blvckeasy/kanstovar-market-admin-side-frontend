import { Routes } from '@angular/router';
import { ProductsComponent } from '../pages/products/products.component';
import { ProductCategoriesComponent } from '../pages/product-categories/product-categories.component';
import { CreateProductPageComponent } from '../pages/create-product-page/create-product-page.component';

export const routes: Routes = [
    {
        path: 'products',
        component: ProductsComponent,
    },
    {
        path: 'product-categories',
        component: ProductCategoriesComponent,
    },
    {
        path: 'create-product',
        component: CreateProductPageComponent,
    }
];
