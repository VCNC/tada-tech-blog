import styled from '@emotion/styled'
import { Color } from '~designSystem/foundation'
import { DEVICE_MEDIA } from '~constants/mediaQuery'
import { LAYOUT_HEADER_HEIGHT } from '~constants/size'
import { Typefaces } from '~designSystem/foundation/Typeface'

export const NavMenu = styled.nav<{ isExtended: boolean }>`
  display: none;

  @media ${DEVICE_MEDIA.MOBILE} {
    padding: ${LAYOUT_HEADER_HEIGHT.MOBILE}px 24px 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    position: fixed;
    top: 0;
    top: -${LAYOUT_HEADER_HEIGHT.MOBILE}px;
    left: 0;
    right: 0;
    z-index: 150;
    width: 100vw;
    height: ${({ isExtended }) => (isExtended ? `calc(50vh + ${LAYOUT_HEADER_HEIGHT.MOBILE}px)` : 0)};
    background-color: ${Color.White};
    transition: height 0.3s cubic-bezier(0, 0.54, 0.63, 1);
    box-shadow: 0px 0px 20px rgba(153, 165, 192, 0.3);
    overflow: hidden;

    & > * + * {
      margin-top: 32px;
    }
  }
`

export const MenuButtonText = styled.p`
  ${Typefaces.Headline3Medium};
  color: ${Color.Navy600};
  overflow: hidden;
`

export const HomePageLinkText = styled.p`
  ${Typefaces.Small1Bold};
  position: absolute;
  bottom: 24px;
  left: 24px;
  color: ${Color.Navy200};
  white-space: nowrap;

  &:hover {
    text-decoration: underline;
  }
`
