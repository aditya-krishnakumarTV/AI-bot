import { Injectable, signal } from '@angular/core';

import { ChatOpenAI } from "@langchain/openai";
import { UpstashRedisChatMessageHistory } from "@langchain/community/stores/message/upstash_redis";
import { BufferMemory } from "langchain/memory";
import { ConversationChain } from "langchain/chains";

import { Message } from '../models/message.model';

const model = new ChatOpenAI(
    {
        modelName: "gpt-4o",
        temperature: 1,
        maxTokens: 3000,
        openAIApiKey: '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',
        configuration: {
            baseURL: "https://openrouter.ai/api/v1"
        },
    },
);

// const memory = new BufferMemory({
//     chatHistory: new UpstashRedisChatMessageHistory({
//         sessionId: new Date().toISOString(), // Or some other unique identifier for the conversation
//         sessionTTL: 300, // 5 minutes, omit this parameter to make sessions never expire
//         config: {
//             url: "http://localhost:4200/", // Override with your own instance's URL
//             token: "ASo9AAIjcDE1ZTFjZDU3YWRiZGE0YTZjOGNkODA2ZDUwZWM0NjIwZXAxMA", // Override with your own instance's token
//         },
//     }),
// });

// const chain = new ConversationChain({ llm: model });

@Injectable({
    providedIn: 'root'
})
export class AiService {

    private messages = signal<Message[]>([]);

    constructor() {
        const savedChat = localStorage.getItem('chat-history');

        if (savedChat) {
            this.messages.set(JSON.parse(savedChat));
        }
    }

    getMessages = this.messages.asReadonly();

    async sendMessage(content: string): Promise<void> {
        const userMsg: Message = {
            content: content,
            sender: 'user',
            timestamp: new Date()
        };

        this.messages.update((oldMsg) => [...oldMsg, userMsg]);

        const input = [{
            role: "user",
            content: content,
        }];

        const botMessage = await model.invoke(input);

        const botMsg: Message = {
            content: botMessage.content.toString(),
            sender: 'bot',
            timestamp: new Date()
        };

        this.messages.update((oldMsg) => [...oldMsg, botMsg]);

        this.saveChat();
    }

    saveChat() {
        localStorage.setItem('chat-history', JSON.stringify(this.messages()));
    }

}