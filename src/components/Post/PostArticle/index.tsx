import isUndefined from 'lodash/isUndefined'
import { PostArticleWrapper } from '~components/Post/PostArticle/Styled'

interface Props {
  __html?: GatsbyTypes.MarkdownRemark['html']
}

export const PostArticle = ({ __html }: Props) => {
  if (isUndefined(__html)) return null

  return <PostArticleWrapper dangerouslySetInnerHTML={{ __html }} />
}
