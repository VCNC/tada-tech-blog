import { Link } from 'gatsby'
import { pageConfig } from '~lib/router/config'
import { PageNumberItem, PageNumberItemText } from '~components/Pagination/PageNumber/Styled'

import type { BlogListPageContextType } from '~constants/type'

interface Props extends Pick<BlogListPageContextType, 'currentPageNumber'> {
  pageNumber: number
}

export const PageNumber = ({ pageNumber, currentPageNumber }: Props) => {
  const isCurrentPage = currentPageNumber === pageNumber

  if (isCurrentPage) {
    return (
      <PageNumberItem isCurrentPage>
        <PageNumberItemText isCurrentPage>{pageNumber}</PageNumberItemText>
      </PageNumberItem>
    )
  }

  return (
    <PageNumberItem>
      <Link
        to={pageNumber === 1 ? pageConfig.home.build() : pageConfig.page.build({ pageNumber: String(pageNumber) })}
        title={pageConfig.page.getTitle({ pageNumber: String(pageNumber) })}
      >
        <PageNumberItemText>{pageNumber}</PageNumberItemText>
      </Link>
    </PageNumberItem>
  )
}
