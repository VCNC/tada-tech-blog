import { css } from '@emotion/react'
import styled from '@emotion/styled'

export const ColorImg = styled.div<{ isShow: boolean }>`
  ${({ isShow }) => css`
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    opacity: ${isShow ? 1 : 0};
    transition: opacity 0.6s ease-in-out;

    z-index: 50;
  `}
`
