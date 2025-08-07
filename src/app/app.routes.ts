import { Routes } from '@angular/router';
import { ProductsComponent } from '../pages/products/products.component';
import { ProductCategoriesComponent } from '../pages/product-categories/product-categories.component';
import { CreateProductPageComponent } from '../pages/create-product-page/create-product-page.component';
import { ProductPageComponent } from '../pages/product-page/product-page.component';
import { EditProductPageComponent } from '../pages/edit-product-page/edit-product-page.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'products',
        pathMatch: 'full',
    },
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
    },
    {
        path: 'product/:id',
        component: ProductPageComponent,
    },
    { 
        path: 'edit-product/:id', 
        component: EditProductPageComponent, 
    }
];
