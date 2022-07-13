import isEmpty from 'lodash/isEmpty'
import isUndefined from 'lodash/isUndefined'
import { replaceSpaceWithUnderscore } from '~lib/utils'
import { TagWrapper, Tag } from '~components/Post/PostFooter/TagInfo/Styled'

export const TagInfo = ({ tags }: Pick<GatsbyTypes.PostFooterFragment, 'tags'>) => {
  if (isUndefined(tags) || isEmpty(tags)) return null
  return (
    <TagWrapper>
      {tags?.map((tag, idx) => {
        return <Tag key={String(idx)}>{`#${replaceSpaceWithUnderscore(tag)}`}</Tag>
      })}
    </TagWrapper>
  )
}
