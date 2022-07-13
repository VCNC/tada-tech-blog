import styled from '@emotion/styled'
import { DEVICE_MEDIA } from '~constants/mediaQuery'
import { postMaxWidth } from '~constants/size'

export const DisqusWrapper = styled.div`
  margin: 100px auto;
  width: 100%;
  max-width: ${postMaxWidth}px;

  @media ${DEVICE_MEDIA.MOBILE} {
    padding: 0 24px;
  }
`
