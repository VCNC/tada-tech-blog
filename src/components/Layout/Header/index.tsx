import React, { useState } from 'react'
import { Link } from 'gatsby'
import { EXTERNAL_URL } from '~constants/link'
import { pageConfig } from '~lib/router/config'
import { TadaLogoIcon } from '~components/Icon'
import {
  HeaderWrapper,
  LogoWrapper,
  LogoIconWrapper,
  LogoText,
  MiddleLine,
  NavButtonMiddleLine,
} from '~components/Layout/Header/Styled'
import { NavWrapper, NavText, RSSIconWrapper, NavButton } from '~components/Layout/Header/Styled'
import { Color } from '~designSystem/foundation/Colors'
import { RSSIcon } from '~components/Icon'
import { MobileNavMenu } from '~components/Layout/Header/MobileNavMenu'

export const Header = () => {
  const [isMobileNavOpened, setIsMobileNavOpened] = useState(false)
  return (
    <>
      <MobileNavMenu isMobileNavOpened={isMobileNavOpened} />
      <HeaderWrapper>
        <Link to={pageConfig.home.build()} title={pageConfig.home.getTitle()}>
          <LogoWrapper>
            <LogoIconWrapper>
              <TadaLogoIcon fillColor={Color.Navy600} />
            </LogoIconWrapper>
            <LogoText>TECH BLOG</LogoText>
          </LogoWrapper>
        </Link>
        <MiddleLine />

        {/* 큰 화면 */}
        <NavWrapper>
          <a
            href={EXTERNAL_URL.TADA_SPEAKER_DECK.link()}
            title={EXTERNAL_URL.TADA_SPEAKER_DECK.title()}
            target="_blank"
          >
            <NavText navTextWidth={110}>PRESENTATION</NavText>
          </a>
          <a href={EXTERNAL_URL.TADA_RECRUIT.link()} title={EXTERNAL_URL.TADA_RECRUIT.title()} target="_blank">
            <NavText navTextWidth={30}>JOB</NavText>
          </a>
          <a href={pageConfig.rss.build()} title={pageConfig.rss.getTitle()} target="_blank">
            <RSSIconWrapper>
              <RSSIcon />
            </RSSIconWrapper>
          </a>
        </NavWrapper>
        {/* 작은 화면 */}
        <NavButton isMobileNavOpened={isMobileNavOpened} onClick={() => setIsMobileNavOpened(prev => !prev)}>
          <NavButtonMiddleLine isMobileNavOpened={isMobileNavOpened} />
        </NavButton>
      </HeaderWrapper>
    </>
  )
}
