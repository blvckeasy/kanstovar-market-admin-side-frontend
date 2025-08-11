import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { environment } from '../../environments/environment';


export interface IProduct {
  _id: string;
  name_uz: string;
  name_ru?: string;
  description_uz: string;
  description_ru?: string;
  images_urls: string[];
  price_uzs: number;
  discount_price?: number;
  category: string;
  brand: string;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
  views?: number;
  orders?: number;
  rating?: number;
  reviews_count?: number;
  photos_count?: number;
}
@Component({
  selector: 'app-product-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-page.component.html',
  styleUrl: './product-page.component.scss'
})
export class ProductPageComponent implements OnInit {
  product: IProduct | null = null;
  loading = true;
  error: string | null = null;
  currentImageIndex = 0;
  
  // Static data for demo
  views = 1245;
  weeklyOrders = 87;
  maxPurchase = 5;
  
  backendURL = environment.apiUrl;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    
    if (!id) {
      this.error = 'Product ID is missing';
      this.loading = false;
      return;
    }

    this.productService.getProductById(id).subscribe({
      next: (data: IProduct) => {
        this.product = {
          ...data,
          rating: data.rating || 4.9,
          reviews_count: data.reviews_count || 78,
          photos_count: data.photos_count || 5,
          orders: data.orders || 700,
          discount_price: data.discount_price || this.calculateDiscountPrice(data.price_uzs)
        };
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load product';
        this.loading = false;
        console.error(err);
      }
    });
  }

  get safeDescription(): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(this.product?.description_uz || '');
  }

  changeImage(index: number): void {
    this.currentImageIndex = index;
  }

  private calculateDiscountPrice(price: number): number {
    const discountPercent = 12;
    return Math.round(price * (1 - discountPercent / 100));
  }

  get discountPercent(): number {
    if (!this.product || !this.product.discount_price) return 0;
    return Math.round((1 - this.product.discount_price / this.product.price_uzs) * 100);
  }

  formatPrice(price: number): string {
    return price.toLocaleString('uz-UZ') + ' so\'m';
  }
}