import isNull from 'lodash/isNull'
import { AuthorNameText } from '~components/Post/PostFooter/AuthorName/Styled'

import type { getMainAuthorInfo } from '~components/Post/PostFooter/policy'

export const AuthorName = ({ name, link }: Pick<ReturnType<typeof getMainAuthorInfo>, 'name' | 'link'>) => {
  if (isNull(name)) return null

  if (isNull(link)) {
    return <AuthorNameText>{name}</AuthorNameText>
  }

  return (
    <a href={link} title={`${name}_${link}`} target="_blank">
      <AuthorNameText hasLink>{name}</AuthorNameText>
    </a>
  )
}
