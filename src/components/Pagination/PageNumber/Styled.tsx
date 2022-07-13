import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { DEVICE_MEDIA } from '~constants/mediaQuery'
import { Color } from '~designSystem/foundation'
import { Typefaces } from '~designSystem/foundation/Typeface'

export const PageNumberItem = styled.li<{ isCurrentPage?: boolean }>`
  position: relative;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;

  ${({ isCurrentPage = false }) => {
    if (isCurrentPage) {
      return css`
        &:after {
          content: '';
          margin: 0 auto;
          position: absolute;
          bottom: 1px;
          left: 0;
          right: 0;
          width: 14px;
          height: 3px;
          background-color: ${Color.Navy400};
        }
      `
    }
  }}

  @media ${DEVICE_MEDIA.MOBILE} {
    width: 26px;
    height: 26px;
  }
`

export const PageNumberItemText = styled.span<{ isCurrentPage?: boolean }>`
  ${Typefaces.Headline5Bold};
  transition: color 0.3s linear;
  cursor: default;

  ${({ isCurrentPage = false }) => {
    if (isCurrentPage) {
      return css`
        color: ${Color.Navy400};
      `
    } else {
      return css`
        color: ${Color.Navy100};

        &:hover {
          color: ${Color.Navy400};
        }
      `
    }
  }}
`
