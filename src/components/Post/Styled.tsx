import styled from '@emotion/styled'
import { DEVICE_MEDIA } from '~constants/mediaQuery'
import { postMaxWidth } from '~constants/size'
import { Color } from '~designSystem/foundation'

export const PostWrapper = styled.section`
  margin: 0 auto;
  padding: 0 80px 100px;
  position: relative;
  width: 100%;
  max-width: ${postMaxWidth}px;
  background-color: ${Color.White};

  @media ${DEVICE_MEDIA.MOBILE} {
    padding: 0 24px 100px;
  }
`
