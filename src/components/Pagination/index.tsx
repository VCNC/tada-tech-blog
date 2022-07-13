import type { BlogListPageContextType } from '~constants/type'
import { PageNumberWrapper, PaginationWrapper } from '~components/Pagination/Styled'
import { PageNumber } from '~components/Pagination/PageNumber'
import { LeftArrowIcon, RightArrowIcon } from '~components/Pagination/ArrowIcon'

const PAGINATION_UNIT = 5

export const Pagination = ({ pageCount, currentPageNumber }: BlogListPageContextType) => {
  const paginationNumber = Math.ceil(currentPageNumber / PAGINATION_UNIT)

  const skip = (paginationNumber - 1) * PAGINATION_UNIT

  const currentPaginationCount = pageCount - skip

  const paginationCount = Math.min(PAGINATION_UNIT, currentPaginationCount)
  return (
    <PaginationWrapper>
      <LeftArrowIcon currentPageNumber={currentPageNumber} />

      <PageNumberWrapper pageCount={paginationCount}>
        {Array.from({ length: paginationCount }, (_, index) => {
          const pageNumber = index + 1 + skip
          return <PageNumber key={String(index)} pageNumber={pageNumber} currentPageNumber={currentPageNumber} />
        })}
      </PageNumberWrapper>

      <RightArrowIcon currentPageNumber={currentPageNumber} pageCount={pageCount} />
    </PaginationWrapper>
  )
}
