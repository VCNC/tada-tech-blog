import isUndefined from 'lodash/isUndefined'

import type { ComponentProps } from 'react'
import type { PostFooter } from '~components/Post/PostFooter'

interface MainAuthorInfoType {
  profileImage?: any
  name?: string
  link?: string
  comment?: string
}

export function getMainAuthorInfo(authors: ComponentProps<typeof PostFooter>['authors']): MainAuthorInfoType {
  if (isUndefined(authors)) {
    return {}
  }

  const mainAuthor = authors[0]

  return {
    profileImage: mainAuthor?.profileImage,
    name: mainAuthor?.name,
    link: mainAuthor?.link,
    comment: mainAuthor?.comment,
  }
}
