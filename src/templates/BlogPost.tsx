import React from 'react'
import { graphql } from 'gatsby'
import { Layout } from '~components/Layout'
import { Post } from '~components/Post'
import { PostHeader } from '~components/Post/PostHeader'
import { PostArticle } from '~components/Post/PostArticle'
import { PostFooter } from '~components/Post/PostFooter'
import { PostComment } from '~components/Post/PostComment'
import { BlogPostHead } from '~components/Head'

import type { PageProps } from 'gatsby'

const BlogPost = ({ data }: PageProps<GatsbyTypes.BlogPostQuery>) => {
  return (
    <>
      <BlogPostHead {...data.markdownRemark?.postHead} />
      <Layout>
        <Post>
          <PostHeader {...data.markdownRemark?.postHeader} />
          <PostArticle __html={data.markdownRemark?.html} />
          <PostFooter {...data.markdownRemark?.postFooter} />
        </Post>
        <PostComment {...data.markdownRemark?.postComment} />
      </Layout>
    </>
  )
}

export default BlogPost

export const query = graphql`
  query BlogPost($id: String!) {
    markdownRemark(id: { eq: $id }) {
      postHead: frontmatter {
        ...PostHead
      }
      postHeader: frontmatter {
        ...PostHeader
      }
      postFooter: frontmatter {
        ...PostFooter
      }
      postComment: frontmatter {
        ...PostComment
      }
      html
    }
  }
`
