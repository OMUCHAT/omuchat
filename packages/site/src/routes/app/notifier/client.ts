import { App, Client } from '@omuchatjs/omu';
import { BROWSER } from 'esm-env';
import { IDENTIFIER } from './app.js';
import { NotifyEntry } from './model.js';
import { Chat } from '@omuchatjs/chat';

const app = new App(IDENTIFIER, {
    version: '1.0.0',
});
export const client = new Client(app);
const chat = new Chat(client);
export const notifyTable = client.tables.model(IDENTIFIER, {
    name: 'notify',
    model: NotifyEntry,
});

chat.messages.event.add.listen((messages) => {
    messages.forEach((message) => {
        console.log(message);
        if (/^!ping/.test(message.text)) {
            // play sound
        }
    });
});

if (BROWSER) {
    client.start();
}
