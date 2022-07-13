import { Disqus } from 'gatsby-plugin-disqus'
import { DisqusWrapper } from '~components/Post/PostComment/Disqus/Styled'

export const DisqusComment = ({ disqusUrl }: Pick<GatsbyTypes.PostCommentFragment, 'disqusUrl'>) => {
  return (
    <DisqusWrapper>
      <Disqus config={{ url: disqusUrl }} />
    </DisqusWrapper>
  )
}
