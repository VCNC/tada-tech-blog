import React from 'react'
import { LayoutWrapper, MainWrapper } from '~components/Layout/Styled'
import { Header } from '~components/Layout/Header'
import { Footer } from '~components/Layout/Footer'

import type { ChildrenType } from '~constants/type'

interface Props extends ChildrenType {}

export const Layout = ({ children }: Props) => {
  return (
    <>
      <LayoutWrapper>
        <Header />
        <MainWrapper>{children}</MainWrapper>
        <Footer />
      </LayoutWrapper>
    </>
  )
}
