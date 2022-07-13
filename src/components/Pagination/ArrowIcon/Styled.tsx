import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { Color } from '~designSystem/foundation'

export const ArrowIconWrapper = styled.div<{ isDimmed?: boolean }>`
  ${({ isDimmed = false }) => css`
    width: 36px;
    height: 36px;
    border-radius: 50%;
    overflow: hidden;
    cursor: ${isDimmed ? 'default' : 'pointer'};

    & > svg > circle {
      fill: ${isDimmed ? Color.Navy100 : Color.Navy600};
      transition: fill 0.3s linear;
    }

    &:hover {
      & > svg > circle {
        fill: ${isDimmed ? Color.Navy100 : Color.Navy400};
      }
    }
  `}
`
