import React, { useEffect, useState } from 'react'
import { EXTERNAL_URL } from '~constants/link'
import { NavMenu, MenuButtonText, HomePageLinkText } from '~components/Layout/Header/MobileNavMenu/Styled'

interface Props {
  isMobileNavOpened: boolean
}

export const MobileNavMenu = ({ isMobileNavOpened }: Props) => {
  const [isMounted, setIsMounted] = useState(false)
  const [isExtended, setIsExtended] = useState(false)

  useEffect(() => {
    if (isMobileNavOpened) {
      setIsMounted(true)
      setTimeout(() => {
        setIsExtended(true)
      }, 10)
    } else {
      setIsExtended(false)
    }
  }, [isMobileNavOpened])

  if (!isMounted) return null

  return (
    <>
      <NavMenu
        isExtended={isExtended}
        onTransitionEnd={() => {
          if (!isMobileNavOpened) {
            setIsMounted(false)
          }
        }}
      >
        <MenuButtonText>
          <a
            href={EXTERNAL_URL.TADA_SPEAKER_DECK.link()}
            title={EXTERNAL_URL.TADA_SPEAKER_DECK.title()}
            target="_blank"
          >
            PRESENTATION
          </a>
        </MenuButtonText>

        <MenuButtonText>
          <a href={EXTERNAL_URL.TADA_RECRUIT.link()} title={EXTERNAL_URL.TADA_RECRUIT.title()} target="_blank">
            JOB
          </a>
        </MenuButtonText>

        <HomePageLinkText>
          <a href={EXTERNAL_URL.TADA.link()} title={EXTERNAL_URL.TADA.title()} target="_blank">{`tadatada.com`}</a>
        </HomePageLinkText>
      </NavMenu>
    </>
  )
}
