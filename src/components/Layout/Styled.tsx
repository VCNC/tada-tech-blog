import styled from '@emotion/styled'
import { Color } from '~designSystem/foundation'
import { LAYOUT_FOOTER_HEIGHT, LAYOUT_HEADER_HEIGHT } from '~constants/size'
import { DEVICE_MEDIA } from '~constants/mediaQuery'

export const LayoutWrapper = styled.div`
  background-color: ${Color.Gray200};
`

export const MainWrapper = styled.main`
  min-height: calc(100vh - ${LAYOUT_HEADER_HEIGHT.DESKTOP}px - ${LAYOUT_FOOTER_HEIGHT.DESKTOP}px);

  @media ${DEVICE_MEDIA.MOBILE} {
    min-height: calc(100vh - ${LAYOUT_HEADER_HEIGHT.MOBILE}px - ${LAYOUT_FOOTER_HEIGHT.MOBILE}px);
  }
`
