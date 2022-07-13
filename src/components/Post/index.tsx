import React from 'react'
import { PostWrapper } from '~components/Post/Styled'

import type { ChildrenType } from '~constants/type'

interface Props extends ChildrenType {}

export const Post = ({ children }: Props) => {
  return <PostWrapper>{children}</PostWrapper>
}
