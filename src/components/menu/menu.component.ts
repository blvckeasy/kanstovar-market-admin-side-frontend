import { Component } from '@angular/core';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-menu',
  imports: [NzMenuModule, RouterModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {

}
