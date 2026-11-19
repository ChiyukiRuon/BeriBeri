import { i18n } from '~/utils/i18n'

import { LanguageType } from './../enums/appEnums'

export const { t } = i18n.global

export function numFormatter(num: number | string): string {
  const digits = 1 // specify number of digits after decimal
  let lookup

  if (i18n.global.locale.value === LanguageType.Mandarin_CN) {
    lookup = [
      { value: 1, symbol: ' ' },
      { value: 1e4, symbol: ' 万' },
      { value: 1e7, symbol: ' 千万' },
      { value: 1e8, symbol: ' 亿' },
    ]
  }
  else if (i18n.global.locale.value === LanguageType.Cantonese || i18n.global.locale.value === LanguageType.Mandarin_TW) {
    lookup = [
      { value: 1, symbol: ' ' },
      { value: 1e4, symbol: ' 萬' },
      { value: 1e7, symbol: ' 千萬' },
      { value: 1e8, symbol: ' 億' },
    ]
  }
  else {
    lookup = [
      { value: 1, symbol: '' },
      { value: 1e3, symbol: 'K' },
      { value: 1e6, symbol: 'M' },
      { value: 1e9, symbol: 'B' },
    ]
  }
  const rx = /\.0+$|(\.\d*[1-9])0+$/
  if (typeof num === 'string') {
    if (num.includes('萬') || num.includes('万')) {
      num = (Number(num.replaceAll('萬', '').replaceAll('万', '')) || 0) * 10000
    }
    else {
      num = Number(num)
    }
  }
  const item = lookup.slice().reverse().find((item) => {
    return num >= item.value
  })
  return item ? (num / item.value).toFixed(digits).replace(rx, '$1') + item.symbol : '0'
}

export function calcTimeSince(date: number | string | Date) {
    const seconds = Math.floor((Date.now() - Number(date)) / 1000)
    if (!Number.isFinite(seconds))
        return ''
    const units = [
        ['year', 31536000], ['month', 2592000], ['week', 604800],
        ['day', 86400], ['hour', 3600], ['minute', 60], ['second', 1],
    ] as const
    const [unit, duration] = units.find(([, value]) => seconds >= value) ?? units[units.length - 1]
    const count = Math.floor(seconds / duration)
    if (i18n.global.locale.value === LanguageType.Cantonese)
        return `${count} ${t(`common.${unit}`, count)}`
    return new Intl.RelativeTimeFormat(i18n.global.locale.value).format(-count, unit)
}

export function calcCurrentTime(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600)
  totalSeconds %= 3600
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60

  if (hours <= 0)
    return `${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`

  return `${hours < 10 ? `0${hours}` : hours}:${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`
}
