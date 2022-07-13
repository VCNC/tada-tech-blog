import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { Color } from '~designSystem/foundation'
import { Typefaces } from '~designSystem/foundation/Typeface'

export const ToastContainer = styled.div<{ isOnTransition: boolean }>`
  ${({ isOnTransition }) => {
    console.log(isOnTransition)
    return css``
  }};
  margin: 0 auto;
  padding: 14px 28px;
  width: fit-content;
  position: fixed;
  bottom: ${({ isOnTransition }) => (isOnTransition ? 60 : 40)}px;
  left: 0;
  right: 0;
  z-index: 200;
  background-color: ${Color.White};
  border: 1px solid ${Color.Gray200};
  border-radius: 65px;
  filter: drop-shadow(0px 4px 10px ${Color.Gray300});

  opacity: ${({ isOnTransition }) => (isOnTransition ? 1 : 0)};

  transition-property: opacity, bottom;
  transition-duration: 0.3s;
  transition-timing-function: ease-in-out;
`

export const ToastText = styled.p`
  ${Typefaces.Body1Bold};
  color: ${Color.Navy600};
  text-align: center;
  user-select: none;
`
