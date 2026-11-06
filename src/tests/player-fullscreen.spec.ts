// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest'

import { isPlayerWebFullscreen } from '../utils/player-fullscreen'

afterEach(() => {
    document.body.innerHTML = ''
    document.body.className = ''
})

describe('player web fullscreen', () => {
    it('tracks ordinary video entering and leaving web fullscreen', () => {
        document.body.innerHTML = '<button class="bpx-player-ctrl-web"></button>'
        const button = document.querySelector('button')!
        expect(isPlayerWebFullscreen()).toBe(false)
        button.classList.add('bpx-state-entered')
        expect(isPlayerWebFullscreen()).toBe(true)
        button.classList.remove('bpx-state-entered')
        expect(isPlayerWebFullscreen()).toBe(false)
    })

    it('tracks PGC icon visibility and replacement between episodes', () => {
        document.body.innerHTML = '<i class="squirtle-pagefullscreen-active" style="display: none"></i>'
        expect(isPlayerWebFullscreen()).toBe(false)
        document.querySelector<HTMLElement>('i')!.style.display = 'block'
        expect(isPlayerWebFullscreen()).toBe(true)
        document.body.innerHTML = '<i class="squirtle-pagefullscreen-active" style="display: none"></i>'
        expect(isPlayerWebFullscreen()).toBe(false)
    })

    it('recognizes container state before the controls mount', () => {
        document.body.innerHTML = '<div class="bpx-player-container" data-screen="web"></div>'
        expect(isPlayerWebFullscreen()).toBe(true)
        document.querySelector('div')!.setAttribute('data-screen', 'normal')
        expect(isPlayerWebFullscreen()).toBe(false)
        document.body.classList.add('webscreen-fix')
        expect(isPlayerWebFullscreen()).toBe(true)
    })
})
