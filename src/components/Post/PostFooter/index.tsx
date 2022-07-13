import { graphql } from 'gatsby'
import { PostFooterWrapper } from '~components/Post/PostFooter/Styled'
import { getMainAuthorInfo } from '~components/Post/PostFooter/policy'
import { AuthorProfileImage } from '~components/Post/PostFooter/AuthorProfileImage'
import { AuthorName } from '~components/Post/PostFooter/AuthorName'
import { AuthorComment } from '~components/Post/PostFooter/AuthorComment'
import { TagInfo } from '~components/Post/PostFooter/TagInfo'

export const PostFooter = ({ tags, authors }: Partial<GatsbyTypes.PostFooterFragment>) => {
  const { name, profileImage, link, comment } = getMainAuthorInfo(authors)

  return (
    <PostFooterWrapper>
      <AuthorProfileImage profileImage={profileImage} name={name} />

      <AuthorName name={name} link={link} />

      <AuthorComment comment={comment} />

      <TagInfo tags={tags} />
    </PostFooterWrapper>
  )
}

export const query = graphql`
  fragment PostFooter on MarkdownRemarkFrontmatter {
    authors {
      name
      profileImage {
        childImageSharp {
          gatsbyImageData
        }
      }
      link
      comment
    }
    tags
  }
`
