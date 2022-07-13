import React from 'react'
import isNull from 'lodash/isNull'
import isUndefined from 'lodash/isUndefined'
import { GatsbyImage, getImage, StaticImage } from 'gatsby-plugin-image'
import { replaceSpaceWithUnderscore } from '~lib/utils'
import { ColorImg } from '~components/PostCard/Thumbnail/Styled'

interface Props extends Pick<GatsbyTypes.PostCardFragment, 'title' | 'thumbnail'> {
  isHovered: boolean
}

export const Thumbnail = ({ title, thumbnail, isHovered }: Props) => {
  if (isNull(thumbnail) || isUndefined(thumbnail) || isUndefined(thumbnail[0])) {
    return (
      <>
        <div>
          <StaticImage
            src="../../../images/thumbnails/default-gray.png"
            layout="fullWidth"
            alt={`${replaceSpaceWithUnderscore(title)}_thumbnail_gray`}
          />
        </div>
        <ColorImg isShow={isHovered}>
          <StaticImage
            src="../../../images/thumbnails/default-color.png"
            layout="fullWidth"
            alt={`${replaceSpaceWithUnderscore(title)}_thumbnail_color`}
          />
        </ColorImg>
      </>
    )
  }

  return (
    <>
      <div>
        <GatsbyImage
          image={getImage(thumbnail[0].gray as any) as any}
          alt={`${replaceSpaceWithUnderscore(title)}_thumbnail_gray`}
        />
      </div>
      <ColorImg isShow={isHovered}>
        <GatsbyImage
          image={getImage(thumbnail[0].color as any) as any}
          alt={`${replaceSpaceWithUnderscore(title)}_thumbnail_color`}
        />
      </ColorImg>
    </>
  )
}
