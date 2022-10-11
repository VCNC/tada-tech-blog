import { graphql } from 'gatsby'
import { Helmet } from 'react-helmet'

export const BlogPostHead = ({ title, description, permalink }: Partial<GatsbyTypes.PostHeadFragment>) => {
  return (
    <Helmet>
      <meta charSet="utf-8" />
      <title>{title}</title>
      <meta property="description" content={description} />
      <meta property="og:type" content="blog" />
      <meta property="og:title" content={title} />
      <meta property="og:site_name" content="타다 TECH BLOG" />
      <meta property="og:image" content={`https://static.tadatada.com/resources/blog${permalink}/thumbnail_og.png`} />
      <meta property="og:url" content={`https://blog-tech.tadatada.com${permalink}`} />

      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`https://static.tadatada.com/resources/blog${permalink}/thumbnail_og.png`} />
      <meta name="twitter:site" content={`https://blog-tech.tadatada.com${permalink}`} />
    </Helmet>
  )
}

export const query = graphql`
  fragment PostHead on MarkdownRemarkFrontmatter {
    title
    description
    permalink
  }
`
