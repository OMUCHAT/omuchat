import { TableType } from '@omuchatjs/omu/extension/table/table.js';
import { Identifier } from '@omuchatjs/omu/identifier.js';
import { client } from '../client.js';
import { AppMetadata } from './app-metadata.js';
import emoji from './emoji/app.js';
import notifier from './notifier/app.js';
import playqueue from './playqueue/app.js';
import quiz from './quiz/app.js';
import tester from './tester/app.js';

export const apps = [] as AppMetadata[];

export function loadApps(origin: string) {
    if (apps.length) return;
    apps.push(...[quiz(origin), notifier(origin), playqueue(origin), emoji(origin), tester(origin)]);
}

const DASHBOARD = Identifier.fromKey('cc.omuchat:dashboard');
export const appTable = client.tables.get(
    TableType.model(DASHBOARD, {
        name: 'apps',
        model: AppMetadata,
    }),
);
