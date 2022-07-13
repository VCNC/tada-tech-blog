import React, { ComponentProps } from 'react'
import isUndefined from 'lodash/isUndefined'
import { GatsbyImage, getImage, StaticImage } from 'gatsby-plugin-image'
import { replaceSpaceWithUnderscore } from '~lib/utils'
import { PostCover } from '~components/Post/PostCover'

export const ThumbnailColor = ({ title, thumbnail }: Pick<ComponentProps<typeof PostCover>, 'title' | 'thumbnail'>) => {
  const defaultColor = '../../../../images/thumbnails/default-color.png'

  // TODO: not any type
  if (isUndefined(thumbnail) || isUndefined(thumbnail[0])) {
    return <StaticImage src={defaultColor} alt={`${replaceSpaceWithUnderscore(title)}_thumbnail_color`} />
  }

  const image = thumbnail[0].color as any
  const gatsbyOmage = getImage(image) as any
  return <GatsbyImage image={gatsbyOmage} alt={`${replaceSpaceWithUnderscore(title)}_thumbnail_color`} />
}
