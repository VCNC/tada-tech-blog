import styled from '@emotion/styled'
import Tag from '~designSystem/core/Markdown/Tag'
import { Color } from '~designSystem/foundation'

export const Markdown = styled.article`
  word-break: keep-all;
  color: ${Color.Gray600};

  & h1 {
    ${Tag.md_h1};
  }

  & h2 {
    ${Tag.md_h2};
  }

  & h3 {
    ${Tag.md_h3};
  }

  & h4 {
    ${Tag.md_h4};
  }

  & h5 {
    ${Tag.md_h5};
  }

  & h6 {
    ${Tag.md_h6};
  }

  & p {
    ${Tag.md_p};
  }

  & ol {
    ${Tag.md_ol};
  }

  & ul {
    ${Tag.md_ul};
  }

  & li {
    ${Tag.md_li};
  }

  & a {
    ${Tag.md_a};
  }

  & blockquote {
    ${Tag.md_blockquote};
  }

  & hr {
    ${Tag.md_hr};
  }

  & img,
  p > img {
    ${Tag.md_img}
  }

  & figcaption {
    ${Tag.md_figcaption};
  }

  & iframe {
    ${Tag.md_iframe};
  }

  & table {
    ${Tag.md_table};
  }

  & sup {
    ${Tag.md_sup};
  }

  & .gatsby-resp-image-wrapper {
    margin: 10px 0 20px;
    max-width: 100%;
  }

  & .gatsby-resp-image-background-image {
  }

  & .gatsby-resp-image-image {
  }

  & .google-presentation {
    margin: 30px 0;
    position: relative;
    width: 100%;
    padding-bottom: 62.5%;

    & > iframe {
      margin: 10px 0 20px;
      position: absolute;
      width: 100%;
      height: 100%;
    }
  }

  & .footnotes {
    margin-top: 50px;

    & li {
      font-size: 14px;
      font-weight: 400;
      line-height: 25.2px;
      color: ${Color.Navy300};
    }
  }
`
