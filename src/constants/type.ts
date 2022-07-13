import type { ReactNode } from 'react'

export interface ChildrenType {
  children: ReactNode
}

export interface BlogListPageContextType {
  limit: number
  skip: number
  pageCount: number
  currentPageNumber: number
}
