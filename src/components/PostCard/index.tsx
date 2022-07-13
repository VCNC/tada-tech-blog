import { useEffect, useRef, useState } from 'react'
import { graphql, Link } from 'gatsby'
import isNull from 'lodash/isNull'
import isUndefined from 'lodash/isUndefined'
import { pageConfig } from '~lib/router/config'
import { getDateFormatText, replaceSpaceWithUnderscore } from '~lib/utils'
import {
  PostEnterAnimationWrapper,
  PostCardWrapper,
  UpperWrapper,
  Title,
  DateWrapper,
  LowerWrapper,
  TagWrapper,
  Tag,
  PostNewTag,
  PostNewTagText,
} from '~components/PostCard/Styled'
import { isShowNewTag } from '~components/PostCard/policy'
import { Thumbnail } from '~components/PostCard/Thumbnail'
import { useIntersection } from 'react-use'

interface Props extends Pick<GatsbyTypes.MarkdownRemark, 'fileAbsolutePath'> {
  post?: GatsbyTypes.PostCardFragment
}

export const PostCard = ({ post }: Props) => {
  const [isIntersectingInit, setIsIntersectingInit] = useState<boolean>(false)
  const [isHovered, setIsHovered] = useState(false)

  const intersectionRef = useRef(null)
  const intersection = useIntersection(intersectionRef, { threshold: 0.25 })

  useEffect(() => {
    if (!isNull(intersection) && !isUndefined(intersection?.isIntersecting)) {
      if (!isIntersectingInit && intersection.isIntersecting) {
        setIsIntersectingInit(true)
      }
    }
  }, [isIntersectingInit, intersection, intersection?.isIntersecting])

  if (isUndefined(post)) return null

  const { title, date, tags, permalink, thumbnail } = post

  const thumbnailProps = { title, thumbnail }

  return (
    <PostEnterAnimationWrapper ref={intersectionRef} isIntersectingInit={isIntersectingInit}>
      <Link
        to={isUndefined(permalink) ? pageConfig.notFound.build() : pageConfig.post.build({ pathname: permalink })}
        title={
          isUndefined(permalink) ? pageConfig.notFound.getTitle() : pageConfig.post.getTitle({ pathname: permalink })
        }
      >
        <PostCardWrapper
          isHovered={isHovered}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <UpperWrapper>
            {isShowNewTag(date) && (
              <PostNewTag>
                <PostNewTagText>NEW</PostNewTagText>
              </PostNewTag>
            )}
            <Title>{title}</Title>
            <DateWrapper>{getDateFormatText(date)}</DateWrapper>
          </UpperWrapper>
          <LowerWrapper>
            <Thumbnail {...thumbnailProps} isHovered={isHovered} />

            <TagWrapper>
              {tags?.map((tag, idx) => {
                return <Tag key={String(idx)} isColorChanged={isHovered}>{`#${replaceSpaceWithUnderscore(tag)}`}</Tag>
              })}
            </TagWrapper>
          </LowerWrapper>
        </PostCardWrapper>
      </Link>
    </PostEnterAnimationWrapper>
  )
}

export const query = graphql`
  fragment PostCard on MarkdownRemarkFrontmatter {
    title
    date
    tags
    thumbnail {
      color {
        childImageSharp {
          gatsbyImageData
        }
      }
      gray {
        childImageSharp {
          gatsbyImageData
        }
      }
    }
    permalink
  }
`
