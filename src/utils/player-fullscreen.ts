export function isPlayerWebFullscreen(root: Document = document): boolean {
    if (root.querySelector('.bpx-player-ctrl-web.bpx-state-entered, .bpx-player-container[data-screen="web"], body.webscreen-fix'))
        return true

    // PGC players keep both icons mounted and switch their display state.
    const exitButton = root.querySelector<HTMLElement>('.squirtle-pagefullscreen-active')
    return !!exitButton && getComputedStyle(exitButton).display !== 'none'
}
