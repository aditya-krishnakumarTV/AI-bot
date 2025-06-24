import { Component } from '@angular/core';

import { ChatBoxComponent } from '../components/chat-box/chat-box.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ChatBoxComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
}
