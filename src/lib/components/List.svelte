<style>
    #list-items {
        display: flex;
        flex-wrap: wrap;
        overflow: scroll;
    }

    .list-item {
        font-family: Georgia, 'Times New Roman', Times, serif;
        font-size: 1.2em;
        line-height: 1.5em;
        width: 60%;
        margin: 20px 40px;
        border-bottom: #ccc dotted 4px;
        padding-bottom: 10px;
    }

    img {
        width: 100%;
    }

    .head {
        margin: 30px 40px 0 40px;
    }

    .tail {
        margin: 20px 40px;
        padding-bottom: 40px;
    }

    h1 {
        font-size: 3.4em;
        font-family: Arial, Helvetica, sans-serif;
    }
</style>

<script>
    import { onMount, onDestroy } from 'svelte';
    import { listItems, sprudgeArticle } from '$stores/consts.js';
    import { activeListItem, activeMapItem } from '$stores/stores.js';
    // Define the ref
    let listRef;

    onMount(async () => {
        // Import in-view
        const inView = await import('in-view');

        // Set a nicer offset so it's not a hard cutoff
        inView.offset(200);

        listRef.addEventListener('scroll', function() {
            // Active list item is top-most fully-visible item
            const visibleListItems = Array.from(
                document.getElementsByClassName('list-item')
            ).map(inView.is);
            // If it's a new one, update active list item
            const topMostVisible = visibleListItems.indexOf(true);
            if (topMostVisible !== $activeMapItem) {
                activeMapItem.set(topMostVisible);
            }
        });
    });

    // Update list scroll position when active list item is updated via map
    const unsubscribeActiveListItem = activeListItem.subscribe(
        newActiveListItem => {
            if (listRef) {
                listRef.scrollTop = document.getElementById(
                    `list-item-${newActiveListItem}`
                ).offsetTop;
            }
        }
    );

    // Remove listener on unmount
    onDestroy(unsubscribeActiveListItem);
</script>

<div id="list-items" bind:this="{listRef}">
    <div class="head block m-2">
        <h3>INCIDENTS DÉCLARÉS</h3>
    </div>
    {#each listItems as listItem, index}
        <div class="list-item" id="list-item-{index}">
                <img src="{listItem.image}" alt="{listItem.name}" />
                <h2>{listItem.name}</h2>
            {@html listItem.description}
        </div>
    {/each}
    <div class="tail">
        <i>
            This was made as part of a <a href="https://svelte.dev/">Svelte</a>
            tutorial on <a href="https://dev.to/bryce/an-interactive-scrolling-map-list-in-svelte-34c3">dev.to</a>.
            View source on <a href="https://gitlab.com/brycedorn/svelte-reactive-map-list">GitLab</a>.
        </i>
    </div>
</div>
