import { Helmet } from 'react-helmet'

export const BlogListHead = () => {
  return (
    <Helmet>
      <meta charSet="utf-8" />
      <title>타다 TECH BLOG</title>
      <meta property="description" content="기술로 이동의 한계를 돌파합니다" />
      <meta property="og:type" content="blog" />
      <meta property="og:title" content="타다 TECH BLOG" />
      <meta property="og:site_name" content="타다 TECH BLOG" />
      <meta property="og:description" content="기술로 이동의 한계를 돌파합니다" />
      <meta property="og:image" content="https://static.tadatada.com/resources/blog/img_thumbnail_link.png" />
      <meta property="og:url" content="https://blog-tech.tadatada.com/" />
    </Helmet>
  )
}
