import { GatsbyImage, getImage, StaticImage } from 'gatsby-plugin-image'
import isNull from 'lodash/isNull'
import { ProfileImageWrapper } from '~components/Post/PostFooter/AuthorProfileImage/Styled'

import type { getMainAuthorInfo } from '~components/Post/PostFooter/policy'

export const AuthorProfileImage = ({
  profileImage,
  name,
}: Pick<ReturnType<typeof getMainAuthorInfo>, 'profileImage' | 'name'>) => {
  if (isNull(profileImage))
    return (
      <ProfileImageWrapper>
        <StaticImage
          src="../../../../images/img_profile_default_4x.png"
          layout="fullWidth"
          alt="TADA 기본 프로필 이미지"
        />
      </ProfileImageWrapper>
    )

  return (
    <ProfileImageWrapper>
      <GatsbyImage image={getImage(profileImage as any) as any} alt={`${name} 프로필 이미지`} />
    </ProfileImageWrapper>
  )
}
