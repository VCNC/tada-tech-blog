import styled from '@emotion/styled'
import { DEVICE_MEDIA } from '~constants/mediaQuery'
import { LAYOUT_FOOTER_HEIGHT } from '~constants/size'
import { Color } from '~designSystem/foundation'
import { Typefaces } from '~designSystem/foundation/Typeface'

export const FooterWrapper = styled.footer`
  padding: 0 90px 90px;
  width: 100vw;
  height: ${LAYOUT_FOOTER_HEIGHT.DESKTOP}px;
  display: flex;
  align-items: flex-end;
  background-color: ${Color.Gray300};

  @media ${DEVICE_MEDIA.MOBILE} {
    padding: 0 24px 50px;
  }
`

export const ContentWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;

  @media ${DEVICE_MEDIA.MOBILE} {
    flex-direction: column-reverse;
    align-items: flex-start;
  }
`

export const CompanyInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;

  @media ${DEVICE_MEDIA.MOBILE} {
    margin-top: 26px;
  }
`

export const HomePageLinkText = styled.p`
  ${Typefaces.Small1Bold};
  color: ${Color.Navy300};

  &:hover {
    text-decoration: underline;
  }
`

export const CompanyName = styled.p`
  ${Typefaces.Small1Bold};
  margin-top: 4px;
  color: ${Color.Navy300};
`

export const Nav = styled.nav`
  display: flex;
  align-items: center;

  & > * + * {
    margin-left: 8px;
  }
`

export const IconWrapper = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  overflow: hidden;

  cursor: pointer;

  & > svg > circle {
    fill: ${Color.Navy100};
    transition: fill 0.4s linear;
  }

  &:hover {
    & > svg > circle {
      fill: ${Color.Navy400};
    }
  }
`
