import { Component, Input } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-message',
  imports: [NzButtonModule],
  templateUrl: './message.component.html',
  styleUrl: './message.component.css'
})
export class MessageComponent {
  @Input() text: string = '';

  createBasicMessage(): void {
    this.message.success(this.text, {
      nzDuration: 5000
    });
  }

  constructor(private message: NzMessageService) {}
}