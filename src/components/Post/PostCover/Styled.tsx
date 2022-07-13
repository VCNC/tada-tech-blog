import styled from '@emotion/styled'
import { Color } from '~designSystem/foundation'
import { Typefaces } from '~designSystem/foundation/Typeface'

export const PostCoverWrapper = styled.div<{ isShowWrapper: boolean }>`
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: ${Color.Gray200};
  z-index: 300;

  opacity: ${({ isShowWrapper }) => (isShowWrapper ? 1 : 0)};
  transition: opacity 0.8s linear;
`

export const HoldTransition = styled.div<{ isStartedHold: boolean }>`
  opacity: ${({ isStartedHold }) => (isStartedHold ? 0 : 1)};
  transition: opacity 1.1s linear;
`

export const PostCardWrapper = styled.div<{ isShowCard: boolean }>`
  margin: 0 auto;
  width: 50vh;
  height: 100vh;
  background-color: ${Color.White};
  opacity: ${({ isShowCard }) => (isShowCard ? 1 : 0)};
  transition: opacity 0.8s linear;
`

export const UpperWrapper = styled.div`
  padding: 24px;
  position: relative;
  width: 100%;
  height: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const Title = styled.h1`
  ${Typefaces.Headline1Medium};
  color: ${Color.Navy600};
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

export const LowerWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 50%;
`

export const TagWrapper = styled.div`
  margin: 0 auto;
  position: absolute;
  left: 0;
  right: 0;
  top: 8px;
  width: 300px;
  text-align: center;
  z-index: 100;
`

export const Tag = styled.span`
  ${Typefaces.Small1Bold};
  margin: 4px 6px 0;
  display: inline-block;
  color: ${Color.Gray100};
`
