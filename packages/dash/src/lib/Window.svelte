<script lang="ts">
    import type { App } from '@omuchatjs/omu';

    import { FlexRowWrapper } from '@omuchatjs/ui';
    import OmuChatProvider from './common/omuchat/ClientProvider.svelte';
    import StatusBar from './common/omuchat/StatusBar.svelte';
    import ScreenRenderer from './common/screen/ScreenRenderer.svelte';
    import ButtonClose from './common/titlebar/ButtonClose.svelte';
    import ButtonMaximize from './common/titlebar/ButtonMaximize.svelte';
    import ButtonMinimize from './common/titlebar/ButtonMinimize.svelte';
    import TitleBar from './common/titlebar/TitleBar.svelte';
    import Title from './images/title.svg';

    export let app: App;
</script>

<div class="window">
    <OmuChatProvider {app} connect={false}>
        <div class="drag-area" data-tauri-drag-region>
            <div class="title">
                <img src={Title} alt="title" width="64" height="10" />
                <StatusBar />
            </div>
            <TitleBar>
                <FlexRowWrapper>
                    <ButtonMinimize />
                    <ButtonMaximize />
                    <ButtonClose />
                </FlexRowWrapper>
            </TitleBar>
        </div>
        <div class="content">
            <slot />
        </div>
        <ScreenRenderer />
    </OmuChatProvider>
</div>

<style lang="scss">
    .drag-area {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 1000;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        width: 100vw;
        height: 40px;
        user-select: none;
        background: var(--color-bg-2);
        outline: 1px solid var(--color-outline);
        outline-offset: -1px;
    }

    .title {
        display: flex;
        flex-direction: row;
        gap: 10px;
        align-items: center;
        justify-content: center;
        margin-left: 10px;
        pointer-events: none;
    }

    .window {
        width: 100vw;
        height: 100vh;
        overflow: hidden;
        background: var(--color-bg-2);
        outline: 2px solid var(--color-1);
        outline-offset: -1px;
    }

    .content {
        position: absolute;
        top: 40px;
        width: 100%;
        height: calc(100% - 40px);
        overflow: hidden;
        background: var(--color-bg-2);
    }
</style>
