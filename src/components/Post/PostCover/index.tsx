import { graphql } from 'gatsby'
import { TransitionEvent, useEffect, useState } from 'react'
import { replaceSpaceWithUnderscore } from '~lib/utils'
import {
  PostCoverWrapper,
  HoldTransition,
  PostCardWrapper,
  UpperWrapper,
  Title,
  DateWrapper,
  LowerWrapper,
  TagWrapper,
  Tag,
} from '~components/Post/PostCover/Styled'
import { ThumbnailColor } from '~components/Post/PostCover/ThumbnailColor'

interface Props extends Partial<GatsbyTypes.PostCoverFragment> {}

// 사용하지 않게 된 컴포넌트
export const PostCover = ({ title, date, thumbnail, tags }: Props) => {
  const [isShow, setIsShow] = useState(true)
  const [isShowWrapper, setIsShowWrapper] = useState(true)
  const [isShowCard, setIsShowCard] = useState(false)
  const [isStartedHold, setIsStartedHold] = useState(false)

  const postCoverFadeOutHandler = (e: TransitionEvent) => {
    e.stopPropagation()
    setIsShow(false)
  }

  const holdTransitionHandler = (e: TransitionEvent) => {
    e.stopPropagation()
    setIsShowWrapper(false)
  }

  const postCardFadeInHandler = (e: TransitionEvent) => {
    e.stopPropagation()
    setIsStartedHold(true)
  }

  useEffect(() => {
    document.body.style.overflow = 'hidden'
  }, [])

  useEffect(() => {
    if (!isShow) {
      document.body.style.overflow = ''
    }
    setIsShowCard(true)
  })

  if (!isShow) return null

  return (
    <PostCoverWrapper isShowWrapper={isShowWrapper} onTransitionEnd={postCoverFadeOutHandler}>
      <HoldTransition isStartedHold={isStartedHold} onTransitionEnd={holdTransitionHandler} />
      <PostCardWrapper isShowCard={isShowCard} onTransitionEnd={postCardFadeInHandler}>
        <UpperWrapper>
          <Title>{title}</Title>
          <DateWrapper>{date}</DateWrapper>
        </UpperWrapper>
        <LowerWrapper>
          <ThumbnailColor title={title} thumbnail={thumbnail} />
          <TagWrapper>
            {tags?.map((tag, idx) => {
              return <Tag key={String(idx)}>{`#${replaceSpaceWithUnderscore(tag)}`}</Tag>
            })}
          </TagWrapper>
        </LowerWrapper>
      </PostCardWrapper>
    </PostCoverWrapper>
  )
}

export const query = graphql`
  fragment PostCover on MarkdownRemarkFrontmatter {
    title
    date(formatString: "MMMM DD, YYYY")
    tags
    thumbnail {
      color {
        childImageSharp {
          gatsbyImageData
        }
      }
    }
  }
`
