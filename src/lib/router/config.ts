interface PageType {
  pageNumber: string
}

interface PostType {
  pathname: string
}

export const pageConfig = {
  home: { build: () => '/', getTitle: () => '타다 개발블로그' },
  page: {
    build: ({ pageNumber }: PageType) => `/page/${pageNumber}`,
    getTitle: ({ pageNumber }: PageType) => `Page ${pageNumber}`,
  },
  post: {
    build: ({ pathname }: PostType) => `${pathname}`,
    getTitle: ({ pathname }: PostType) => `${pathname} Post`,
  },
  rss: {
    build: () => '/rss.xml',
    getTitle: () => 'RSS Feed',
  },
  notFound: {
    build: () => '/404',
    getTitle: () => 'Page Not Found',
  },
}
