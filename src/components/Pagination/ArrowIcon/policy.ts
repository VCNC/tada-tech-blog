import type { BlogListPageContextType } from '~constants/type'

export function getPreviousUrl({ currentPageNumber }: Pick<BlogListPageContextType, 'currentPageNumber'>) {
  if (currentPageNumber - 1 === 1) return `/`

  return `/page/${currentPageNumber - 1}`
}

export function getNextUrl({ currentPageNumber }: Pick<BlogListPageContextType, 'currentPageNumber'>) {
  return `/page/${currentPageNumber + 1}`
}
