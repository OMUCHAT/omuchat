import type { Client } from '../client/index.js';
import type { AppJson } from '../extension/server/index.js';
import { App } from '../extension/server/index.js';
import type { Model } from '../interface.js';
import { Serializable, Serializer } from '../serializer.js';

import type { EventData, EventType } from './event.js';

export interface EventRegistry {
    register(...types: EventType<unknown>[]): void;
    addListener<T>(eventType: EventType<T>, listener: (event: T) => void): void;
    removeListener(eventType: EventType<unknown>, listener: (event: any) => void): void;
}

interface EventEntry<T = unknown> {
    type: EventType<T>;
    listeners: ((data: T) => void)[];
}

export function createEventRegistry(client: Client): EventRegistry {
    const eventMap: Map<string, EventEntry> = new Map();

    function register(...types: EventType<unknown>[]): void {
        types.forEach((type) => {
            if (eventMap.has(type.type)) {
                throw new Error(`Event type ${type.type} already registered`);
            }
            eventMap.set(type.type, {
                type: type,
                listeners: [],
            });
        });
    }

    function addListener<T>(eventType: EventType<T>, listener: (event: T) => void): void {
        const eventInfo = eventMap.get(eventType.type) as EventEntry<T> | undefined;
        if (!eventInfo) {
            throw new Error(`No event for type ${eventType.type}`);
        }
        eventInfo.listeners.push(listener);
    }

    function removeListener(eventType: EventType<unknown>, listener: (event: any) => void): void {
        const eventInfo = eventMap.get(eventType.type);
        if (!eventInfo) {
            throw new Error(`No event for type ${eventType.type}`);
        }
        eventInfo.listeners.splice(eventInfo.listeners.indexOf(listener), 1);
    }

    function onEvent(eventJson: EventData): void {
        const event = eventMap.get(eventJson.type);
        if (!event) {
            console.warn(`Received unknown event type ${eventJson.type}`);
            console.debug(eventMap);
            return;
        }
        const data = event.type.serializer.deserialize(eventJson.data);
        event.listeners.forEach((listener) => {
            listener(data);
        });
    }

    const registry = {
        register,
        addListener,
        removeListener,
        onEvent,
    };
    client.connection.addListener(registry);
    return registry;
}

function defineEvent<T>(type: string, serializer: Serializable<T, any>): EventType<T> {
    return {
        type: `:${type}`,
        serializer: Serializer.noop<T>().pipe(serializer).pipe(Serializer.json()),
    };
}

type ConnectEventData = { app: AppJson; token: string | null };

export class ConnectEvent implements Model<ConnectEventData> {
    constructor(public app: App, public token: string | null) {
    }

    toJson(): ConnectEventData {
        return {
            app: this.app.toJson(),
            token: this.token,
        };
    }

    static fromJson(json: ConnectEventData): ConnectEvent {
        return new ConnectEvent(App.fromJson(json.app), json.token);
    }
}

export const EVENTS = {
    Connect: defineEvent('connect', Serializer.model(ConnectEvent)),
    Token: defineEvent('token', Serializer.noop<string>()),
    Ready: defineEvent('ready', Serializer.noop()),
};
