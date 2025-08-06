import { Component, Input } from '@angular/core';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule, NzButtonSize } from 'ng-zorro-antd/button';

@Component({
  selector: 'app-product-card',
  imports: [NzCardModule, NzButtonModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
})
export class ProductCardComponent {
  backendURL = 'http://localhost:5000';

  @Input() product: any;
  size: NzButtonSize = 'large';
}
