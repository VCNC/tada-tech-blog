import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { Color } from '~designSystem/foundation'

interface Props {
  rotateDeg?: number
}

export const ArrowRightIcon = ({ rotateDeg = 0 }: Props) => {
  return (
    <StyledSVG
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      rotateDeg={rotateDeg}
    >
      {/* TODO: Stroke 없애는것으로 수정 공유 */}
      <circle cx="18" cy="18" r="18" />
      <path
        d="M25.7071 18.7071C26.0976 18.3166 26.0976 17.6834 25.7071 17.2929L19.3431 10.9289C18.9526 10.5384 18.3195 10.5384 17.9289 10.9289C17.5384 11.3195 17.5384 11.9526 17.9289 12.3431L23.5858 18L17.9289 23.6569C17.5384 24.0474 17.5384 24.6805 17.9289 25.0711C18.3195 25.4616 18.9526 25.4616 19.3431 25.0711L25.7071 18.7071ZM10 19L25 19L25 17L10 17L10 19Z"
        fill={Color.White}
      />
    </StyledSVG>
  )
}

const StyledSVG = styled.svg<Props>`
  ${({ rotateDeg }) => css`
    transform: rotate(${rotateDeg}deg);
  `}
`
