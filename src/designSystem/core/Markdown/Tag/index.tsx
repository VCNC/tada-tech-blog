import { css } from '@emotion/react'
import { Color } from '~designSystem/foundation'

const md_h1 = css`
  margin: 40px 0 10px;
  font-size: 28px;
  font-weight: 500;
  line-height: 39.2px;
`

const md_h2 = css`
  margin: 40px 0px 10px;
  font-size: 24px;
  font-weight: 500;
  line-height: 33.6px;
`

const md_h3 = css`
  margin: 20px 0px 10px;
  font-size: 20px;
  font-weight: 500;
  line-height: 28px;
`

const md_h4 = css`
  margin: 20px 0px 10px;
  font-size: 20px;
  font-weight: 500;
  line-height: 28px;
`

const md_h5 = css`
  margin: 20px 0px 10px;
  font-size: 20px;
  font-weight: 500;
  line-height: 28px;
`

const md_h6 = css`
  margin: 20px 0px 10px;
  font-size: 20px;
  font-weight: 500;
  line-height: 28px;
`

const md_p = css`
  font-size: 16px;
  font-weight: 400;
  line-height: 30.4px;
  word-break: keep-all;
`

const md_ol = css`
  margin-left: 40px;
  padding: 12px 0;

  & > li {
    list-style-type: decimal;
  }
`

const md_ul = css`
  margin-left: 40px;
  padding: 12px 0;

  & > li {
    list-style-type: disc;
  }
`

const md_li = css`
  font-size: 16px;
  font-weight: 400;
  line-height: 30.4px;

  & > ol,
  ul {
    margin-left: 20px;
  }
`

const md_a = css`
  color: ${Color.Blue400};
  text-decoration: underline;
`

const md_blockquote = css`
  margin: 30px 0 30px 20px;
  padding: 0 10px;

  & > blockquote {
    margin-left: 0;
  }

  & > p {
    position: relative;
    font-size: 14px;
    font-weight: 400;
    line-height: 25.2px;
    color: ${Color.Navy300};

    &::before {
      content: '';
      position: absolute;
      left: -14px;
      top: 0;
      width: 4px;
      height: 100%;
      background-color: ${Color.Navy100};
      border-radius: 4px;
    }
  }
`

const md_hr = css`
  margin: 10px 0;
  color: ${Color.Navy100};
`

const md_img = css`
  margin: 20px auto;
  display: block;
  max-width: 100%;
`

const md_figcaption = css`
  padding-bottom: 20px;
  display: block;
  font-size: 14px;
  font-weight: 400;
  line-height: 25.2px;
  color: ${Color.Navy300};
  text-align: center;
`

const md_iframe = css`
  margin: 20px auto;
  display: block;
  max-width: 100%;
`

const md_table = css`
  margin: 30px 0;
  font-size: 14px;
  font-weight: 400;
  line-height: 25.2px;

  border-top: 1px solid ${Color.Navy200};
  border-bottom: 1px solid ${Color.Navy200};
  border-spacing: 0;

  & th {
    padding: 8px;
    text-align: center;
    font-weight: 700;
    border-left: 0.5px solid ${Color.Navy200};
    border-right: 0.5px solid ${Color.Navy200};
  }

  & th:first-of-type {
    padding-right: 0;
    border-left: none;
  }

  & th:last-of-type {
    padding-right: 0;
    border-right: none;
  }

  & td {
    padding: 8px;
    text-align: left;
    border-top: 1px solid ${Color.Navy200};
    border-left: 0.5px solid ${Color.Navy200};
    border-right: 0.5px solid ${Color.Navy200};
  }

  & td:first-of-type {
    padding-right: 0;
    border-left: none;
  }

  & td:last-of-type {
    padding-right: 0;
    border-right: none;
  }
`

const md_sup = css`
  font-weight: 700;
`

// <code> 관련은 /theme/prism.css 에서 관리

export default {
  md_h1,
  md_h2,
  md_h3,
  md_h4,
  md_h5,
  md_h6,
  md_p,
  md_ol,
  md_ul,
  md_li,
  md_a,
  md_blockquote,
  md_hr,
  md_img,
  md_figcaption,
  md_iframe,
  md_table,
  md_sup,
}
