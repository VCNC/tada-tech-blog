import isUndefined from 'lodash/isUndefined'

const NEW_TAG_PERIOD = 7 * 24 * 60 * 60 * 1000 // 1주 millisecond

export function isShowNewTag(date?: string) {
  if (isUndefined(date)) return false

  const diff = Date.now() - new Date(date).getTime()

  if (diff <= NEW_TAG_PERIOD) {
    return true
  } else {
    return false
  }
}
