import { EXTERNAL_URL } from '~constants/link'
import { FacebookIcon, InstagramIcon, NaverIcon, YouTubeIcon } from '~components/Icon'
import {
  FooterWrapper,
  CompanyInfoWrapper,
  HomePageLinkText,
  CompanyName,
  Nav,
  IconWrapper,
  ContentWrapper,
} from '~components/Layout/Footer/Styled'

export const Footer = () => {
  return (
    <FooterWrapper>
      <ContentWrapper>
        <CompanyInfoWrapper>
          <HomePageLinkText>
            <a href={EXTERNAL_URL.TADA.link()} title={EXTERNAL_URL.TADA.title()} target="_blank">{`tadatada.com`}</a>
          </HomePageLinkText>

          <CompanyName>{`© TADA by Value Creators & Company`}</CompanyName>
        </CompanyInfoWrapper>

        <Nav>
          <a href={EXTERNAL_URL.INSTAGRAM.link()} title={EXTERNAL_URL.INSTAGRAM.title()} target="_blank">
            <IconWrapper>
              <InstagramIcon />
            </IconWrapper>
          </a>
          <a href={EXTERNAL_URL.YOUTUBE.link()} title={EXTERNAL_URL.YOUTUBE.title()} target="_blank">
            <IconWrapper>
              <YouTubeIcon />
            </IconWrapper>
          </a>
          <a href={EXTERNAL_URL.FACEBOOK.link()} title={EXTERNAL_URL.FACEBOOK.title()} target="_blank">
            <IconWrapper>
              <FacebookIcon />
            </IconWrapper>
          </a>
          <a href={EXTERNAL_URL.NAVER.link()} title={EXTERNAL_URL.NAVER.title()} target="_blank">
            <IconWrapper>
              <NaverIcon />
            </IconWrapper>
          </a>
        </Nav>
      </ContentWrapper>
    </FooterWrapper>
  )
}
