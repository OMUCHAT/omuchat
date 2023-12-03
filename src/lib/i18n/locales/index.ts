import { createI18n, type I18n } from '../i18n';

export interface Entry {
    name: string;
    load: () => Promise<I18n>;
}

async function loadI18n(load: () => any, locale: string): Promise<I18n> {
    const { default: messages } = await load();
    return createI18n(messages, locale);
}

export const LOCALES = {
    'ja-JP': {
        name: '日本語',
        load: () => loadI18n(() => import('./ja-JP.json'), 'ja-JP')
    },
    'ja-JP-hiragana': {
        name: 'ひらがな',
        load: () => loadI18n(() => import('./ja-JP-hiragana.json'), 'ja-JP-hiragana')
    },
    'ja-PD': {
        name: 'Pseudo Japanese',
        load: () => loadI18n(() => import('./ja-PD.json'), 'ja-PD')
    },
    'ja-EN': {
        name: 'English Japanese',
        load: () => loadI18n(() => import('./ja-EN.json'), 'ja-EN')
    },
    'en-US': {
        name: 'English (US)',
        load: () => loadI18n(() => import('./en-US.json'), 'en-US')
    },
    'ar-EG': {
        name: 'العربية',
        load: () => loadI18n(() => import('./ar-EG.json'), 'ar-EG')
    },
    'zh-CN': {
        name: '简体中文',
        load: () => loadI18n(() => import('./zh-CN.json'), 'zh-CN')
    },
};
