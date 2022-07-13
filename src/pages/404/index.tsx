import React from 'react'
import { PageNotFound } from '~components/404'
import { PageNotFoundHead } from '~components/Head'

const PageNotFoundPage = () => {
  return (
    <>
      <PageNotFoundHead />
      <PageNotFound />
    </>
  )
}

export default PageNotFoundPage
