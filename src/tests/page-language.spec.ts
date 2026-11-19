import { expect, it } from 'vitest'

import { i18n } from '~/utils/i18n'
import { getFeedLocaleParams, getInterfaceLanguage } from '~/utils/page-language'

it.each('zh-Hans zh-Hant en ja th ar pt es id ms ru tr vi'.split(' '))('requests feed metadata for %s independently of the interface language', (language) => {
    const url = 'https://www.bilibili.com/' + language
    const metadata = JSON.parse(getFeedLocaleParams(url, true)['x-bili-locale-json']!)
    const [lang, script] = language.split('-')
    expect(metadata).toEqual({ c_locale: { language: lang, ...(script && { script }) }, always_translate: true })
})

it('keeps the saved preference on unprefixed pages and respects the translation switch', () => {
    expect(getInterfaceLanguage('jyut')).toBe('jyut')
    expect(getInterfaceLanguage('zh-TW')).toBe('cmn-TW')
    expect(getFeedLocaleParams('https://www.bilibili.com/', true)).toEqual({})
    expect(JSON.parse(getFeedLocaleParams('https://www.bilibili.com/en', false)['x-bili-locale-json']!).always_translate).toBe(false)
})

it.each(['en', 'cmn-CN', 'cmn-TW', 'jyut'])('uses the saved %s interface catalog', (preference) => {
    expect(getInterfaceLanguage(preference)).toBe(preference)
    expect(i18n.global.te('home.for_you', preference)).toBe(true)
})
