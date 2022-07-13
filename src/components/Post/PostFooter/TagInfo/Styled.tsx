import styled from '@emotion/styled'
import { Color } from '~designSystem/foundation'
import { Typefaces } from '~designSystem/foundation/Typeface'

export const TagWrapper = styled.div`
  margin-top: 30px;
  width: 300px;
  text-align: center;
`

export const Tag = styled.span`
  margin: 4px 6px 0;
  display: inline-block;
  ${Typefaces.Small1Bold};
  color: ${Color.Navy200};
`
