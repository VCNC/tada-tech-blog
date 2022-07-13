import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { DEVICE_MEDIA } from '~constants/mediaQuery'
import { POST_GRID_COUNT } from '~constants/size'

const CARD_SIZE = 300

export const PostGridWrapper = styled.ul<{ postCount: number }>`
  ${({ postCount }) => css`
    padding: 130px 0 180px;
    display: grid;
    justify-content: center;
    grid-template-columns: repeat(${POST_GRID_COUNT.DESKTOP}, ${CARD_SIZE}px);
    grid-template-rows: repeat(${Math.ceil(postCount / POST_GRID_COUNT.DESKTOP)}, ${2 * CARD_SIZE}px);
    gap: 120px 120px;

    @media ${DEVICE_MEDIA.TABLET} {
      padding: 90px 30px 180px;
      grid-template-columns: repeat(${POST_GRID_COUNT.TABLET}, ${CARD_SIZE}px);
      grid-template-rows: repeat(${Math.ceil(postCount / POST_GRID_COUNT.TABLET)}, ${2 * CARD_SIZE}px);
      gap: 90px 70px;
    }

    @media ${DEVICE_MEDIA.MOBILE} {
      gap: 40px 0;
    }

    @media ${DEVICE_MEDIA.MOBILE_LARGE} {
      padding: 40px 0 80px;
      grid-template-columns: repeat(${POST_GRID_COUNT.MOBILE}, ${CARD_SIZE}px);
      grid-template-rows: repeat(${Math.ceil(postCount / POST_GRID_COUNT.MOBILE)}, ${2 * CARD_SIZE}px);
    }

    @media ${DEVICE_MEDIA.MOBILE_SMALL} {
      padding: 40px 24px 80px;
      grid-template-columns: repeat(${POST_GRID_COUNT.MOBILE}, 1fr);
      grid-template-rows: repeat(${Math.ceil(postCount / POST_GRID_COUNT.MOBILE)}, 1fr);
    }
  `}
`
