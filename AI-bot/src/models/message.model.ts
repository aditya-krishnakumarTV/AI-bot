export interface Message {
    content: string | null;
    sender: 'user' | 'bot';
    timestamp: Date;
}