import { PostGridWrapper } from '~components/PostGrid/Styled'

import type { ChildrenType } from '~constants/type'

interface Props extends ChildrenType {
  postCount: number
}

export const PostGrid = ({ postCount, children }: Props) => {
  return <PostGridWrapper postCount={postCount}>{children}</PostGridWrapper>
}
