import isUndefined from 'lodash/isUndefined'

export function replaceSpaceWithUnderscore(input?: string) {
  if (isUndefined(input)) return ''

  return input.replaceAll(' ', '_')
}

export function getDateFormatText(date?: string) {
  if (isUndefined(date)) return '-'

  const dateInstance = new Date(date)

  const enMonth = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(dateInstance)
  return `${enMonth} ${dateInstance.getDate()}, ${dateInstance.getFullYear()}`
}

export function getUrlPath() {
  if (typeof window === 'undefined') return ''
  return window.location.href
}
