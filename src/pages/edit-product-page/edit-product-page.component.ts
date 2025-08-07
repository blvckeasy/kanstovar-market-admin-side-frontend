import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NzMessageService, NzMessageModule } from 'ng-zorro-antd/message';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { AngularEditorConfig, AngularEditorModule } from '@kolkov/angular-editor';
import { ProductCategoryService } from '../../services/product-category.service';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { MenuComponent } from '../../components/menu/menu.component';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { ProductService } from '../../services/product.service';


export interface IProductCategory {
  _id: string;
  name_uz: string;
  name_ru: string;
}

export interface Product {
  _id: string;
  name_uz: string;
  name_ru: string;
  description_uz: string;
  description_ru: string;
  images_urls: string[];
  price_uzs: number;
  category: IProductCategory;
  brand: string;
  isAvailable: boolean;
}

@Component({
  imports: [
    ReactiveFormsModule,
    NzUploadModule,
    NzCheckboxModule,
    MenuComponent,
    NzButtonModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    AngularEditorModule,
    HttpClientModule,
    NzMessageModule,
  ],
  selector: 'app-edit-product-page',
  templateUrl: './edit-product-page.component.html',
  styleUrls: ['./edit-product-page.component.css'],
  providers: [ProductCategoryService, ProductService],
})
export class EditProductPageComponent implements OnInit {
  productForm!: FormGroup;
  fileList: NzUploadFile[] = [];
  productCategories: IProductCategory[] = [];
  product: Product | null = null;
  localhostURL = 'http://localhost:5000';

  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '200px',
    minHeight: '0',
    placeholder: 'Tavsifni yozing...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    toolbarHiddenButtons: [['insertVideo', 'insertImage']],
  };

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private messageService: NzMessageService,
    private productCategoryService: ProductCategoryService,
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.productForm = this.fb.group({
      images: [[], Validators.required],
      name_uz: ['', Validators.required],
      name_ru: ['', Validators.required],
      description_uz: ['', Validators.required],
      description_ru: ['', Validators.required],
      price_uzs: [null, Validators.required],
      category: ['', Validators.required],
      brand: ['', Validators.required],
      isAvailable: [false],
    });

    // Kategoriyalarni yuklash
    this.productCategoryService.getProductCategories().subscribe(({ data, error }) => {
      if (error) {
        this.messageService.error(`Mahsulot kategoriyalarini olishda xatolik: ${error.message}`, {
          nzDuration: 5000,
          nzAnimate: true,
        });
        return;
      }
      this.productCategories = data;
    });

    // URL'dan product ID'sini olish
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.loadProduct(productId);
    }
  }

  loadProduct(productId: string): void {
    this.productService.getProductById(productId).subscribe({
      next: (data) => {

        this.product = data;
        if (this.product) {
          // Formani mahsulot ma'lumotlari bilan to'ldirish
          this.productForm.patchValue({
            name_uz: this.product.name_uz,
            name_ru: this.product.name_ru,
            description_uz: this.product.description_uz,
            description_ru: this.product.description_ru,
            price_uzs: this.product.price_uzs,
            category: this.product.category._id,
            brand: this.product.brand,
            isAvailable: this.product.isAvailable,
          });
          // Rasm fayllarini fileList'ga qo'shish (faqat nomi bilan)
          this.fileList = this.product.images_urls.map(img => ({ uid: '-1', name: img, status: 'done', url: `${this.localhostURL}/static/product-images/${img}` } as NzUploadFile));
          this.productForm.patchValue({ images: this.fileList });
        }
      },
      error: (error) => {
        this.messageService.error(`Mahsulotni olishda xatolik: ${error.message || 'Noma\'lum xato'}`, {
          nzDuration: 5000,
          nzAnimate: true,
        });
      },
    });
  }

  beforeUpload = (file: NzUploadFile): boolean => {
    const isImage = file.type?.startsWith('image/');
    if (!isImage) {
      this.messageService.error('Faqat rasm fayllari yuklanadi!');
      return false;
    }
    const isLt5M = file.size! / 1024 / 1024 < 5;
    if (!isLt5M) {
      this.messageService.error('Rasm hajmi 5MB dan kichik bo‘lishi kerak!');
      return false;
    }

    this.fileList = [...this.fileList, file];
    this.productForm.patchValue({ images: this.fileList });
    this.productForm.get('images')?.markAsDirty();
    this.productForm.get('images')?.updateValueAndValidity();

    return false;
  };

  onSubmit(): void {
    if (this.productForm.valid) {
      const formData = new FormData();
      const value = this.productForm.value;
      const productId = this.route.snapshot.paramMap.get('id');

      // Rasm fayllarini qo'shish
      value.images.forEach((file: NzUploadFile | File) => {
        formData.append('images', file instanceof File ? file : file.name); // Agar fayl yangi yuklangan bo'lsa, File obyekti, aks holda nomi
      });
      formData.append('name_uz', value.name_uz);
      formData.append('name_ru', value.name_ru);
      formData.append('description_uz', value.description_uz);
      formData.append('description_ru', value.description_ru);
      formData.append('price_uzs', value.price_uzs.toString());
      formData.append('category', value.category);
      formData.append('brand', value.brand);
      formData.append('isAvailable', value.isAvailable.toString());

      this.productService.updateProduct(productId!, formData).subscribe({
        next: () => {
          this.messageService.success('Mahsulot muvaffaqiyatli yangilandi!', {
            nzDuration: 5000,
            nzAnimate: true,
          });
          this.router.navigate(['/products']);
        },
        error: (error: any) => {
          this.messageService.error(`Mahsulotni yangilashda xatolik: ${error.message || 'Noma\'lum xato'}`, {
            nzDuration: 5000,
            nzAnimate: true,
          });
        },
      });
    } else {
      this.messageService.error('Forma to‘liq to‘ldirilmagan yoki xato bor', {
        nzDuration: 5000,
        nzAnimate: true,
      });
      Object.keys(this.productForm.controls).forEach((key) => {
        const control = this.productForm.get(key);
        if (control?.invalid) {
          console.log(`Xato maydon: ${key}, Xatolar:`, control.errors);
        }
      });
    }
  }
}