import React from 'react'
import { graphql } from 'gatsby'
import { Layout } from '~components/Layout'
import { PostCard } from '~components/PostCard'
import { PostGrid } from '~components/PostGrid'
import { Pagination } from '~components/Pagination'
import { BlogListHead } from '~components/Head'

import type { PageProps } from 'gatsby'
import type { BlogListPageContextType } from '~constants/type'

interface Props extends PageProps<GatsbyTypes.BlogListQuery> {
  pageContext: BlogListPageContextType
}

const BlogList = ({ data, pageContext }: Props) => {
  return (
    <>
      <BlogListHead />
      <Layout>
        <PostGrid postCount={data.allMarkdownRemark.nodes.length}>
          {data.allMarkdownRemark.nodes.map(props => (
            <PostCard key={props.id} {...props} />
          ))}
        </PostGrid>
        <Pagination {...pageContext} />
      </Layout>
    </>
  )
}

export default BlogList

export const query = graphql`
  query BlogList($skip: Int!, $limit: Int!) {
    allMarkdownRemark(
      sort: { order: DESC, fields: [frontmatter___date] }
      limit: $limit
      skip: $skip
      filter: { frontmatter: { title: { ne: "DUMMY" } } }
    ) {
      nodes {
        id
        fileAbsolutePath
        post: frontmatter {
          ...PostCard
        }
      }
    }
  }
`
