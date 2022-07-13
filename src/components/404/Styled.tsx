import styled from '@emotion/styled'
import { DEVICE_MEDIA } from '~constants/mediaQuery'
import { Color } from '~designSystem/foundation'
import { Typefaces } from '~designSystem/foundation/Typeface'

export const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  @media ${DEVICE_MEDIA.MOBILE} {
    padding: 0 24px;
  }
`

export const ImageWrapper = styled.div`
  max-width: 370px;
  width: 100%;
  height: auto;
`

export const NotFoundTitle = styled.h1`
  margin-top: 40px;
  ${Typefaces.Headline1Medium};
  color: ${Color.Navy600};
  white-space: pre-wrap;
  text-align: center;
  word-break: keep-all;

  & + & {
    margin-top: 10px;
  }

  @media ${DEVICE_MEDIA.MOBILE} {
    ${Typefaces.Headline2Medium};

    & + & {
      margin-top: 0;
    }
  }
`

export const BackToHomeButton = styled.button`
  margin-top: 50px;
  padding: 14px 28px;
  background-color: ${Color.White};
  border: 1px solid ${Color.Gray200};
  border-radius: 65px;
  filter: drop-shadow(0px 4px 10px ${Color.Gray300});
  transition: all 0.3s linear;

  &:hover {
    background-color: ${Color.Navy600};
    border: 1px solid ${Color.Navy600};

    & > p {
      color: ${Color.White};
    }
  }
`

export const BackToHomeButtonText = styled.span`
  ${Typefaces.Body1Bold};
  color: ${Color.Navy600};
  transition: color 0.3s linear;
`
