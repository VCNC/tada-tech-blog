import styled from '@emotion/styled'
import { DEVICE_MEDIA } from '~constants/mediaQuery'
import { Color } from '~designSystem/foundation'
import { Typefaces } from '~designSystem/foundation/Typeface'

export const AuthorNameText = styled.p<{ hasLink?: boolean }>`
  margin-top: 16px;
  ${Typefaces.Body1Bold};
  color: ${Color.Navy500};

  @media ${DEVICE_MEDIA.DESKTOP} {
    &:hover {
      text-decoration: ${({ hasLink = false }) => (hasLink ? 'underline' : 'none')};
    }
  }
`
