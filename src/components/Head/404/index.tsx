import { Helmet } from 'react-helmet'

export const PageNotFoundHead = () => {
  return (
    <Helmet>
      <meta charSet="utf-8" />
      <title>경로를 이탈하셨습니다 !</title>
      <meta property="og:type" content="blog" />
      <meta property="og:title" content="경로를 이탈하셨습니다 !" />
      <meta property="og:site_name" content="타다 TECH BLOG" />
      <meta property="og:image" content="https://static.tadatada.com/resources/blog/img_404_2x.png" />
      <meta property="og:url" content="https://blog-tech.tadatada.com/" />
    </Helmet>
  )
}
