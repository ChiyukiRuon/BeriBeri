import { LanguageType } from '~/enums/appEnums'
import { getBilibiliLocale } from '~/utils/main'

export function getInterfaceLanguage(preference: string): string {
    switch (preference) {
        case 'zh-Hans':
        case 'zh-CN':
            return LanguageType.Mandarin_CN
        case 'zh-Hant':
        case 'zh-TW':
            return LanguageType.Mandarin_TW
        default:
            return preference
    }
}

export function getFeedLocaleParams(url: string, translate: boolean) {
    const locale = getBilibiliLocale(url)
    if (!locale)
        return {}

    const [language, script] = locale.split('-')
    return {
        'x-bili-locale-json': JSON.stringify({ c_locale: { language, script }, always_translate: translate }),
    }
}
