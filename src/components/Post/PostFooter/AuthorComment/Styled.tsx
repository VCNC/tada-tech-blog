import styled from '@emotion/styled'
import { Color } from '~designSystem/foundation'
import { Typefaces } from '~designSystem/foundation/Typeface'

export const AuthorCommentText = styled.p`
  margin-top: 16px;
  max-width: 526px;
  ${Typefaces.Body1Regular};
  color: ${Color.Gray500};
  text-align: center;
  white-space: pre-wrap;
`
