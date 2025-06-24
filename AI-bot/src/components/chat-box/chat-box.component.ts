import { Component, inject, signal } from "@angular/core";
import { FormsModule } from '@angular/forms';

import { DatePipe } from '@angular/common';

import { AiService } from "../../services/ai.service";

@Component({
    selector: 'app-chat-box',
    templateUrl: './chat-box.component.html',
    styleUrl: './chat-box.component.css',
    standalone: true,
    imports: [
        DatePipe,
        FormsModule,
    ]
})
export class ChatBoxComponent {
    userInput = signal('');

    aiService = inject(AiService);

    getMessages = this.aiService.getMessages;

    async sendMessage() {
        const userInp = this.userInput().trim();

        if (userInp) {
            this.userInput.set('');
            await this.aiService.sendMessage(userInp);
        }
    }
}