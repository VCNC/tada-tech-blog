import { graphql } from 'gatsby'
import { Helmet } from 'react-helmet'

export const BlogPostHead = ({ title, description }: Partial<GatsbyTypes.PostHeadFragment>) => {
  return (
    <Helmet>
      <meta charSet="utf-8" />
      <title>{title}</title>
      <meta property="description" content={description} />
      <meta property="og:type" content="blog" />
      <meta property="og:title" content={title} />
      <meta property="og:site_name" content="타다 TECH BLOG" />
      <meta property="og:image" content="https://static.tadatada.com/resources/blog/img_thumbnail_link.png" />
      <meta property="og:url" content="https://blog-tech.tadatada.com/" />
    </Helmet>
  )
}

export const query = graphql`
  fragment PostHead on MarkdownRemarkFrontmatter {
    title
    description
  }
`
