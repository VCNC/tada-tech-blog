import styled from '@emotion/styled'
import { Color } from '~designSystem/foundation'
import { LAYOUT_HEADER_HEIGHT } from '~constants/size'
import { DEVICE_MEDIA } from '~constants/mediaQuery'
import { Typefaces } from '~designSystem/foundation/Typeface'

export const HeaderWrapper = styled.header`
  padding: 0 90px;
  width: 100vw;
  height: ${LAYOUT_HEADER_HEIGHT.DESKTOP}px;
  display: flex;
  align-items: center;
  position: sticky;
  top: 0;
  left: 0;
  z-index: 200;

  @media ${DEVICE_MEDIA.MOBILE} {
    padding: 0 24px;
  }
`

export const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
`

export const LogoIconWrapper = styled.div`
  @media ${DEVICE_MEDIA.MOBILE} {
    transform: scale(0.925);
  }
`

export const LogoText = styled.p`
  margin-left: 16px;
  ${Typefaces.Body2Bold};
  color: ${Color.Navy600};
  white-space: nowrap;

  @media ${DEVICE_MEDIA.MOBILE_SMALL} {
    margin-left: 10px;
  }
`

export const MiddleLine = styled.div`
  margin: 0 16px;
  flex: 1;
  height: 2px;
  transform: translateY(-1px);
  background-color: ${Color.Navy600};

  @media ${DEVICE_MEDIA.MOBILE} {
    margin-right: -15px;
  }
`

export const NavWrapper = styled.nav`
  display: grid;
  align-items: center;
  justify-content: center;
  grid-template-columns: repeat(3, auto);
  gap: 0 24px;

  @media ${DEVICE_MEDIA.MOBILE} {
    display: none;
  }
`

export const NavButton = styled.button<{ isMobileNavOpened: boolean }>`
  display: none;
  position: relative;
  margin-bottom: 2px;
  width: 30px;
  height: 30px;

  @media ${DEVICE_MEDIA.MOBILE} {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &:before {
    content: '';
    height: 2px;
    position: absolute;
    left: 0;
    right: 0;
    top: ${({ isMobileNavOpened }) => (isMobileNavOpened ? 14 : 5)}px;
    background-color: ${Color.Navy600};
    transform: rotate(${({ isMobileNavOpened }) => (isMobileNavOpened ? 45 : 0)}deg);
    transition: top 0.3s ease ${({ isMobileNavOpened }) => (isMobileNavOpened ? 0 : 0.3)}s,
      transform 0.3s ease ${({ isMobileNavOpened }) => (isMobileNavOpened ? 0.3 : 0)}s;
  }

  &:after {
    content: '';
    height: 2px;
    position: absolute;
    left: 0;
    right: 0;
    bottom: ${({ isMobileNavOpened }) => (isMobileNavOpened ? 14 : 5)}px;
    background-color: ${Color.Navy600};
    transform: rotate(${({ isMobileNavOpened }) => (isMobileNavOpened ? -45 : 0)}deg);
    transition: bottom 0.3s ease ${({ isMobileNavOpened }) => (isMobileNavOpened ? 0 : 0.3)}s,
      transform 0.3s ease ${({ isMobileNavOpened }) => (isMobileNavOpened ? 0.3 : 0)}s;
  }
`

export const NavButtonMiddleLine = styled.div<{ isMobileNavOpened: boolean }>`
  width: 100%;
  height: 2px;
  background-color: ${Color.Navy600};
  opacity: ${({ isMobileNavOpened }) => (isMobileNavOpened ? 0 : 1)};
  transition: opacity 0.3s ease 0.2s;
`

export const NavText = styled.p<{ navTextWidth: number }>`
  width: ${({ navTextWidth }) => navTextWidth}px;
  ${Typefaces.Body3Medium};
  color: ${Color.Navy600};
  text-align: center;
  white-space: nowrap;

  &:hover {
    font-weight: 700;
  }
`

export const RSSIconWrapper = styled.div`
  cursor: pointer;

  & > svg > rect {
    fill: ${Color.Navy500};
    transition: fill 0.3s linear;
  }

  &:hover {
    & > svg > rect {
      fill: ${Color.Navy400};
    }
  }
`
