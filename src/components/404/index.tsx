import { Link } from 'gatsby'
import { pageConfig } from '~lib/router/config'
import { StaticImage } from 'gatsby-plugin-image'
import { Wrapper, ImageWrapper, NotFoundTitle, BackToHomeButton, BackToHomeButtonText } from '~components/404/Styled'

export const PageNotFound = () => {
  return (
    <Wrapper>
      <ImageWrapper>
        <StaticImage src="../../images/img_404_4x.png" alt="Page Not Found Image" />
      </ImageWrapper>
      <NotFoundTitle>경로를 이탈하셨습니다!</NotFoundTitle>
      <NotFoundTitle>목적지 주소를 다시 확인해 주세요.</NotFoundTitle>

      <Link to={pageConfig.home.build()} title={pageConfig.home.getTitle()}>
        <BackToHomeButton>
          <BackToHomeButtonText>GO HOME</BackToHomeButtonText>
        </BackToHomeButton>
      </Link>
    </Wrapper>
  )
}
