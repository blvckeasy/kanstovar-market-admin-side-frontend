import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { MenuComponent } from '../../components/menu/menu.component';
import { AngularEditorConfig, AngularEditorModule } from '@kolkov/angular-editor';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NzMessageService, NzMessageModule } from 'ng-zorro-antd/message';
import { ProductCategoryService } from '../../services/product-category.service';

export interface IProductCategory {
  _id: string;
  name_uz: string;
  name_ru: string;
};

@Component({
  selector: 'app-create-product-page',
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
    NzMessageModule, // NzMessageService uchun
  ],
  templateUrl: './create-product-page.component.html',
  styleUrl: './create-product-page.component.css',
  providers: [ProductCategoryService],
})
export class CreateProductPageComponent implements OnInit {
  productForm!: FormGroup;
  fileList: NzUploadFile[] = [];
  productCategories: IProductCategory[] = [];

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

    this.productCategoryService.getProductCategories().subscribe(({ data, error }) => {
      if (error) {
        this.messageService.error(`Mahsulot kategoriyalarini olishda xatolik: ${error.message}`, {
          nzDuration: 5000,
          nzAnimate: true,
        });
        return;
      }

      console.log(data);
      this.productCategories = data;
    })
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

  onSubmit() {
    if (this.productForm.valid) {
      const formData = new FormData();
      const value = this.productForm.value;

      // Fayllarni `images` nomi bilan qo'shish
      value.images.forEach((file: File) => {
        formData.append('images', file);
      });
      formData.append('name_uz', value.name_uz);
      formData.append('name_ru', value.name_ru);
      formData.append('description_uz', value.description_uz);
      formData.append('description_ru', value.description_ru);
      formData.append('price_uzs', value.price_uzs);
      formData.append('category', value.category);
      formData.append('brand', value.brand);
      formData.append('isAvailable', value.isAvailable.toString());

      // Backend'ga yuborish
      this.http.post('http://localhost:5000/product', formData).subscribe(
        (response) => {
          this.messageService.success('Mahsulot muvaffaqiyatli yaratildi!', {
            nzDuration: 5000,
            nzAnimate: true,
          });

          // buyerda product yaratilgandan keyin formani tozalab tashlaydigan qilish kerak
          this.productForm.reset();
          this.fileList = [];
          this.productForm.patchValue({ images: [] });
          this.productForm.get('isAvailable')?.setValue(false);        },
        (error) => {
          console.error('Error:', error);
          this.messageService.error(`Xatolik yuz berdi: ${error.message || 'Noma\'lum xato'}`, {
            nzDuration: 5000,
            nzAnimate: true,
          });
        },
      );
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