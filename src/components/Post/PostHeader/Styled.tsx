import styled from '@emotion/styled'
import { Color } from '~designSystem/foundation'
import { LAYOUT_HEADER_HEIGHT } from '~constants/size'
import { DEVICE_MEDIA } from '~constants/mediaQuery'
import { Typefaces } from '~designSystem/foundation/Typeface'

export const PostHeaderWrapper = styled.section`
  padding-top: 80px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
`

export const WhiteSpace = styled.div`
  width: 100%;
  height: ${LAYOUT_HEADER_HEIGHT.DESKTOP}px;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 100%;
  background-color: ${Color.White};

  @media ${DEVICE_MEDIA.TABLET} {
    height: ${LAYOUT_HEADER_HEIGHT.TABLET}px;
  }

  @media ${DEVICE_MEDIA.MOBILE} {
    height: ${LAYOUT_HEADER_HEIGHT.MOBILE}px;
  }
`

export const PostTitle = styled.h1`
  ${Typefaces.Headline1Medium};
  color: ${Color.Navy500};
  text-align: center;
  word-break: keep-all;
`

export const PostInfoWrapper = styled.div`
  margin-top: 50px;
  display: flex;
  align-items: center;
  justify-content: center;

  & > * + * {
    margin-left: 20px;
  }

  @media ${DEVICE_MEDIA.MOBILE} {
    flex-direction: column;

    & > * + * {
      margin-left: 0;
    }
  }
`

export const PostDate = styled.p`
  ${Typefaces.Small1Bold};
  color: ${Color.Navy200};
`

export const PostAuthorWrapper = styled.div`
  display: flex;
  align-items: center;

  & > * + * {
    margin-left: 10px;
  }

  @media ${DEVICE_MEDIA.MOBILE} {
    margin-top: 8px;
  }
`

export const PostAuthor = styled.p`
  ${Typefaces.Small1Bold};
  color: ${Color.Blue400};
  border-bottom: 1px solid ${Color.Blue400};

  &:hover {
    color: ${Color.Blue200};
  }
`
