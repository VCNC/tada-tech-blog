import React from 'react'
import { graphql } from 'gatsby'
import {
  PostHeaderWrapper,
  PostTitle,
  PostInfoWrapper,
  PostDate,
  PostAuthorWrapper,
  PostAuthor,
  WhiteSpace,
} from '~components/Post/PostHeader/Styled'

export const PostHeader = ({ title, date, authors }: Partial<GatsbyTypes.PostHeaderFragment>) => {
  return (
    <>
      <WhiteSpace />
      <PostHeaderWrapper>
        <PostTitle>{title}</PostTitle>
        <PostInfoWrapper>
          <PostDate>{date}</PostDate>
          <PostAuthorWrapper>
            {authors?.map((author, idx) => {
              return (
                <a key={String(idx)} href={author?.link} title={`${author?.name} Link`} target="_blank">
                  <PostAuthor>{author?.name}</PostAuthor>
                </a>
              )
            })}
          </PostAuthorWrapper>
        </PostInfoWrapper>
      </PostHeaderWrapper>
    </>
  )
}

export const query = graphql`
  fragment PostHeader on MarkdownRemarkFrontmatter {
    title
    date(formatString: "MMMM DD, YYYY")
    authors {
      name
      link
    }
  }
`
