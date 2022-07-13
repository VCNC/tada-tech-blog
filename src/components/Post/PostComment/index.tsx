import { graphql } from 'gatsby'
import isNull from 'lodash/isNull'
import { DisqusComment } from '~components/Post/PostComment/Disqus'
import { UtteranceComment } from '~components/Post/PostComment/Utterance'

export const PostComment = ({ disqusUrl }: Partial<GatsbyTypes.PostCommentFragment>) => {
  if (isNull(disqusUrl)) {
    return <UtteranceComment />
  }
  return <DisqusComment disqusUrl={disqusUrl} />
}

export const query = graphql`
  fragment PostComment on MarkdownRemarkFrontmatter {
    disqusUrl
  }
`
