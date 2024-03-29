import { EventEmitter } from '../event-emitter.js';
import type { AssetExtension } from '../extension/asset/asset-extension.js';
import type { EndpointExtension } from '../extension/endpoint/index.js';
import type { ExtensionManager as ExtensionManager } from '../extension/extension-manager.js';
import type { MessageExtension } from '../extension/message/message-extension.js';
import type { RegistryExtension } from '../extension/registry/registry-extension.js';
import type { App, ServerExtension } from '../extension/server/index.js';
import type { TableExtension } from '../extension/table/table-extension.js';
import type { Network } from '../network/index.js';
import type { PacketType } from '../network/packet/packet.js';

import type { TokenProvider } from './token.js';

export class ClientListeners {
    public readonly initialized = new EventEmitter<() => void>();
    public readonly started = new EventEmitter<() => void>();
    public readonly stopped = new EventEmitter<() => void>();
}

export interface Client {
    readonly app: App;
    readonly token: TokenProvider;
    readonly network: Network;
    readonly extensions: ExtensionManager;
    readonly endpoints: EndpointExtension;
    readonly tables: TableExtension;
    readonly registry: RegistryExtension;
    readonly message: MessageExtension;
    readonly assets: AssetExtension;
    readonly server: ServerExtension;
    readonly running: boolean;

    start(): void;
    stop(): void;
    send<T>(type: PacketType<T>, data: T): void;

    listeners: ClientListeners;
}
