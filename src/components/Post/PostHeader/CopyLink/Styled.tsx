import styled from '@emotion/styled'
import { DEVICE_MEDIA } from '~constants/mediaQuery'
import { Color } from '~designSystem/foundation'

export const LinkIconWrapper = styled.div`
  margin-top: 24px;
  cursor: pointer;

  & > svg > circle {
    transition: fill 0.3s linear;
    fill: ${Color.Gray200};
  }
  & > svg > path {
    transition: fill 0.3s linear;
    fill: ${Color.Navy400};
  }

  &:hover {
    & > svg > circle {
      fill: ${Color.Navy400};
    }
    & > svg > path {
      fill: ${Color.Gray300};
    }
  }
`
