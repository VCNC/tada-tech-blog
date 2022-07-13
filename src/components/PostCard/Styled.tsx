import styled from '@emotion/styled'
import { DEVICE_MEDIA } from '~constants/mediaQuery'
import { Color } from '~designSystem/foundation'
import { Typefaces } from '~designSystem/foundation/Typeface'

export const PostEnterAnimationWrapper = styled.li<{ isIntersectingInit: boolean }>`
  width: 100%;
  height: 100%;
  transition-property: transform, opacity;
  transition-timing-function: cubic-bezier(0.01, 0.24, 0.63, 1);
  transition-duration: 0.8s;

  @media ${DEVICE_MEDIA.TABLET} {
    opacity: ${({ isIntersectingInit }) => (isIntersectingInit ? 1 : 0)};
    transform: translateY(${({ isIntersectingInit }) => (isIntersectingInit ? 0 : '30px')});
  }

  @media ${DEVICE_MEDIA.MOBILE} {
    opacity: ${({ isIntersectingInit }) => (isIntersectingInit ? 1 : 0)};
    transform: translateY(${({ isIntersectingInit }) => (isIntersectingInit ? 0 : '30px')});
  }
`

export const PostCardWrapper = styled.div<{ isHovered: boolean }>`
  width: 100%;
  height: 100%;
  background-color: ${Color.White};
  transform: translateY(${({ isHovered }) => (isHovered ? '-20px' : 0)});
  transition: transform 1s cubic-bezier(0, 0.55, 0.45, 1);

  @media ${DEVICE_MEDIA.MOBILE_SMALL} {
    width: calc(100vw - 48px);
    height: calc(2 * (100vw - 48px));
  }
`

export const UpperWrapper = styled.div`
  padding: 30px 12px;
  position: relative;
  width: 100%;
  height: 50%;
  display: flex;
  align-items: center;
  justify-content: center;

  @media ${DEVICE_MEDIA.MOBILE_SMALL} {
    padding: 30px 10px;
  }
`

export const PostNewTag = styled.div`
  padding-left: 7px;
  width: 35%;
  height: 25px;
  position: absolute;
  top: 30px;
  left: -30px;
  background-color: ${Color.Blue300};
`

export const PostNewTagText = styled.span`
  ${Typefaces.Body3Bold};
  color: ${Color.White};
`

export const Title = styled.p`
  ${Typefaces.Headline2Medium};
  color: ${Color.Navy500};
  text-align: center;
  word-break: keep-all;
`

export const DateWrapper = styled.p`
  ${Typefaces.Small1Bold};
  position: absolute;
  left: auto;
  right: auto;
  bottom: 12px;
  color: ${Color.Navy200};
`

const THUMBNAIL_GRAY_BACKGROUND_COLOR = '#d2d5d8'

export const LowerWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 50%;
  background-color: ${THUMBNAIL_GRAY_BACKGROUND_COLOR};
`

export const TagWrapper = styled.div`
  padding: 0 12px;
  position: absolute;
  left: auto;
  right: auto;
  top: 8px;
  width: 100%;
  height: 51px;
  overflow: hidden;
  text-align: center;
  z-index: 100;
`

export const Tag = styled.span<{ isColorChanged: boolean }>`
  ${Typefaces.Small1Bold};
  margin: 4px 6px 0;
  display: inline-block;
  color: ${({ isColorChanged }) => (isColorChanged ? Color.Gray100 : Color.Navy200)};
  transition: color 0.6s ease-in-out;
`
