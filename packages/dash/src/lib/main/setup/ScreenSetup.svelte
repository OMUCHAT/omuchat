<script lang="ts">
    import type { models } from '@omuchatjs/chat';
    import { onMount } from 'svelte';

    import { installed } from '../settings.js';

    import { t } from '$lib/i18n/i18n-context.js';

    import Background from '$lib/common/Background.svelte';
    import Button from '$lib/common/input/Button.svelte';
    import InputText from '$lib/common/input/InputText.svelte';
    import { getClient } from '$lib/common/omuchat/client.js';
    import ProviderIcon from '$lib/common/omuchat/ProviderIcon.svelte';
    import { type ScreenHandle } from '$lib/common/screen/screen.js';
    import Screen from '$lib/common/screen/Screen.svelte';
    import { Tooltip } from '@omuchatjs/ui';

    export let screen: ScreenHandle;
    const { chat, client } = getClient();

    let result: Map<string, { channel: models.Channel; active: boolean }> | undefined;

    let locked = false;
    let url: string = '';

    function fetchChannels() {
        if (locked) return;
        console.log(`fetching channels from ${url}`);
        locked = true;
        chat.createChannelTree(url)
            .then((res) => {
                result = new Map(
                    res.map((channel) => {
                        return [channel.url, { channel, active: false }];
                    }),
                );
                console.log(result);
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => {
                locked = false;
            });
    }

    function finish() {
        if (!result?.size) return;
        const channels = [...result.values()].filter((v) => v.active).map((v) => v.channel);
        chat.channels!.add(...channels);
        screen.pop();
        $installed = true;
    }

    function reset() {
        result = undefined;
    }

    let tooltipHint: string;
    let hints = [
        'youtu.be/xxxx...',
        'youtube.com/watch?v=xxxx...',
        'youtube.com/@xxxx...',
        'youtube.com/channel/xxxx...',
    ];

    function updateHint() {
        tooltipHint = hints[hints.indexOf(tooltipHint) + 1] || hints[0];
    }

    onMount(() => {
        updateHint();
        const handle = setInterval(updateHint, 1400);

        return () => {
            clearInterval(handle);
        };
    });
</script>

<Screen {screen} title="setup" windowed={false} noDecorated noClose>
    <div class="background">
        <Background />
    </div>
    <div class="container">
        <div class="content">
            <div class="title">
                <i class="ti ti-settings" />
                {$t('setup.title')}
            </div>
            {#if result}
                <div class="description">{$t('setup.whitch_channel')}</div>
                <div class="list">
                    {#each result.entries() as [key, { channel, active }] (key)}
                        <button class="item" class:active on:click={() => (active = !active)}>
                            <i class="ti ti-{active ? 'check' : 'plus'}" />
                            <div class="channel-icon">
                                {#if channel.iconUrl}
                                    <img src={client.assets.proxy(channel.iconUrl)} alt="icon" />
                                    <Tooltip>
                                        <img
                                            src={client.assets.proxy(channel.iconUrl)}
                                            alt="icon"
                                            class="tooltip-image"
                                        />
                                    </Tooltip>
                                {:else}
                                    <ProviderIcon providerId={channel.providerId} />
                                {/if}
                            </div>
                            <div class="description">
                                <div class="channel-name">
                                    {channel.name || channel.providerId}
                                </div>
                                <small class="channel-url">{channel.url}</small>
                            </div>
                        </button>
                    {/each}
                </div>
                <div class="buttons">
                    <Button
                        on:click={finish}
                        disabled={![...result.values()].some((v) => v.active)}
                        rounded
                        filled>{$t('setup.append')}</Button
                    >
                    <Button on:click={reset} rounded filled>{$t('setup.start_again')}</Button>
                </div>
            {:else}
                <div class="description">{$t('setup.please_put_in_urls')}</div>
                <div class="input">
                    <InputText
                        bind:value={url}
                        on:input={fetchChannels}
                        placeholder={tooltipHint}
                        disabled={locked}
                    />
                </div>
            {/if}
        </div>
        <button on:click={screen.pop} class="skip">
            {$t('setup.skip')}
            <i class="ti ti-arrow-right" />
        </button>
    </div>
</Screen>

<style lang="scss">
    .background {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: var(--color-bg-2);
    }

    .container {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        color: var(--color-text);
    }

    .skip {
        position: absolute;
        right: 20px;
        bottom: 20px;
        padding: 5px 0;
        font-size: 12px;
        color: var(--color-1);
        cursor: pointer;
        background: transparent;
        border: none;
        border-bottom: 1px solid var(--color-1);
    }

    .content {
        display: flex;
        flex-direction: column;
        gap: 20px;
        align-items: center;
        justify-content: center;
        width: 500px;
        min-height: 250px;
        padding: 20px;
        background: var(--color-bg-2);
    }

    .title {
        padding: 5px 10px;
        font-size: 24px;
        font-weight: bold;
    }

    .list {
        display: flex;
        flex-direction: column;
        gap: 10px;
        align-items: center;
        justify-content: center;
        width: 100%;
        max-height: 300px;
        overflow: auto;
    }

    .item {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        width: 100%;
        padding: 5px 10px;
        background: var(--color-bg-1);
        border: 1px solid var(--color-bg-1);
        border-radius: 5px;

        &:hover {
            background: var(--color-bg-2);
        }

        &.active {
            color: var(--color-bg-1);
            background: var(--color-1);
        }
    }

    .channel-icon {
        width: 32px;
        min-width: 32px;
        height: 32px;
        margin: 10px;
        border-radius: 50%;

        img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
        }

        .tooltip-image {
            width: 200px;
            height: 200px;
            padding: 0;
            margin: 0;
            border-radius: 0;
        }
    }

    .description {
        display: flex;
        flex-direction: column;
        gap: 5px;
        align-items: flex-start;
        justify-content: center;
        width: 100%;
        overflow: hidden;
        font-size: 16px;
        text-align: center;
        text-overflow: ellipsis;
    }

    .channel-name {
        font-size: 1rem;
        opacity: 1;
    }

    .channel-url {
        opacity: 0.5;
    }

    .buttons {
        display: flex;
        flex-direction: row;
        gap: 10px;
        align-items: center;
        justify-content: center;
        width: 100%;
    }
</style>
