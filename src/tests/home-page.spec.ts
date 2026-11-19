import { expect, it } from 'vitest'

import { isHomePage } from '~/utils/main'

it.each('zh-Hans zh-Hant en ja th ar pt es id ms ru tr vi'.split(' '))('recognizes the %s homepage', (locale) => {
    for (const host of ['www.bilibili.com', 'bilibili.com']) {
        const url = `https://${host}/${locale}`
        expect(isHomePage(url)).toBe(true)
        expect(isHomePage(`${url}/?page=Home#top`)).toBe(true)
        expect(isHomePage(`${url}/video/BV123`)).toBe(false)
    }
})

it('matches the original homepage and excludes unrelated URLs', () => {
    expect(isHomePage('https://www.bilibili.com/?spm_id_from=home')).toBe(true)
    expect(isHomePage('https://www.bilibili.com/index.html')).toBe(true)
    expect(isHomePage('https://manga.bilibili.com/en')).toBe(false)
    expect(isHomePage('https://www.bilibili.com/video/?from=https://www.bilibili.com/en')).toBe(false)
})
