import { expect, it } from 'vitest'

import { isHomePage, isVideoOrBangumiPage, localizeBilibiliLink, withoutBilibiliLocale } from '~/utils/main'

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

it.each('zh-Hans zh-Hant en ja th ar pt es id ms ru tr vi'.split(' '))('keeps %s on navigation links', (locale) => {
    const home = 'https://www.bilibili.com/' + locale + '/'
    const video = home + 'video/BV123?p=2#start'
    expect(localizeBilibiliLink('//www.bilibili.com/video/BV123?p=2#start', home)).toBe(video)
    expect(isVideoOrBangumiPage(video)).toBe(true)
    expect(localizeBilibiliLink('/?page=History', video)).toBe(home + '?page=History')
    expect(localizeBilibiliLink(video, home)).toBe(video)
    expect(localizeBilibiliLink('https://live.bilibili.com/123', home)).toBe('https://live.bilibili.com/123')
})

it.each('zh-Hans zh-Hant en ja th ar pt es id ms ru tr vi'.split(' '))('keeps %s across moments, profiles and history', (locale) => {
    const home = 'https://www.bilibili.com/' + locale + '/'
    const moments = localizeBilibiliLink('//t.bilibili.com', home)
    expect(moments).toBe('https://t.bilibili.com/' + locale + '/')
    expect(isHomePage(moments)).toBe(false)

    const profile = localizeBilibiliLink('//space.bilibili.com/42/favlist?fid=7#top', moments)
    expect(profile).toBe('https://space.bilibili.com/' + locale + '/42/favlist?fid=7#top')
    expect(withoutBilibiliLocale(profile)).toBe('https://space.bilibili.com/42/favlist?fid=7#top')
    expect(localizeBilibiliLink(profile, moments)).toBe(profile)
    expect(localizeBilibiliLink('https://www.bilibili.com/history', profile)).toBe(home + 'history')
})

it.each('zh-Hans zh-Hant en ja th ar pt es id ms ru tr vi'.split(' '))('uses the message hash router for %s', (locale) => {
    const home = 'https://www.bilibili.com/' + locale
    const message = 'https://message.bilibili.com'
    for (const route of ['/', '/reply', '/at', '/love', '/system', '/whisper?mid=42']) {
        const localized = message + '/' + locale + '#' + route
        expect(localizeBilibiliLink(message + '/#' + route, home)).toBe(localized)
        expect(localizeBilibiliLink(localized, home)).toBe(localized)
        expect(localizeBilibiliLink('https://www.bilibili.com/history', localized)).toBe(home + '/history')
    }
    expect(localizeBilibiliLink(message, home)).toBe(message + '/' + locale + '#/')
    expect(localizeBilibiliLink(message + '/#/reply', 'https://www.bilibili.com/')).toBe(message + '/#/reply')
})
