import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { DEVICE_MEDIA } from '~constants/mediaQuery'

export const PaginationWrapper = styled.nav`
  padding: 0 90px 180px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media ${DEVICE_MEDIA.TABLET} {
    padding: 0 50px 180px;
  }

  @media ${DEVICE_MEDIA.MOBILE} {
    padding: 0 24px 80px;
  }
`

export const PageNumberWrapper = styled.ol<{ pageCount: number }>`
  ${({ pageCount }) => css`
    display: grid;
    grid-template-columns: repeat(${pageCount}, auto);
    column-gap: 10px;
  `}

  @media ${DEVICE_MEDIA.MOBILE} {
    column-gap: 4px;
  }
`
