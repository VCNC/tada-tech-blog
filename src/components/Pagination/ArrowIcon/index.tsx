import { Link } from 'gatsby'
import { ArrowRightIcon } from '~components/Icon'
import type { BlogListPageContextType } from '~constants/type'
import { ArrowIconWrapper } from '~components/Pagination/ArrowIcon/Styled'
import { getPreviousUrl, getNextUrl } from '~components/Pagination/ArrowIcon/policy'

export const LeftArrowIcon = ({ currentPageNumber }: Pick<BlogListPageContextType, 'currentPageNumber'>) => {
  const isFirstPage = currentPageNumber === 1

  if (isFirstPage) {
    return (
      <ArrowIconWrapper isDimmed>
        <ArrowRightIcon rotateDeg={180} />
      </ArrowIconWrapper>
    )
  }

  return (
    <Link to={getPreviousUrl({ currentPageNumber })}>
      <ArrowIconWrapper>
        <ArrowRightIcon rotateDeg={180} />
      </ArrowIconWrapper>
    </Link>
  )
}

export const RightArrowIcon = ({
  currentPageNumber,
  pageCount,
}: Pick<BlogListPageContextType, 'currentPageNumber' | 'pageCount'>) => {
  const isCurrentPage = currentPageNumber === pageCount

  if (isCurrentPage) {
    return (
      <ArrowIconWrapper isDimmed>
        <ArrowRightIcon />
      </ArrowIconWrapper>
    )
  }

  return (
    <Link to={getNextUrl({ currentPageNumber })}>
      <ArrowIconWrapper>
        <ArrowRightIcon />
      </ArrowIconWrapper>
    </Link>
  )
}
