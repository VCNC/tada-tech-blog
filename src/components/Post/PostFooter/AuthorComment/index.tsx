import isNull from 'lodash/isNull'
import { AuthorCommentText } from '~components/Post/PostFooter/AuthorComment/Styled'

import type { getMainAuthorInfo } from '~components/Post/PostFooter/policy'

export const AuthorComment = ({ comment }: Pick<ReturnType<typeof getMainAuthorInfo>, 'comment'>) => {
  if (isNull(comment)) return null

  return <AuthorCommentText>{comment}</AuthorCommentText>
}
