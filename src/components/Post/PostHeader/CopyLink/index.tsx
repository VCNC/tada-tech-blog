import React, { useState } from 'react'
// import CopyToClipboard from 'react-copy-to-clipboard'
import { getUrlPath } from '~lib/utils'
import { LinkIcon } from '~components/Icon'
import { LinkIconWrapper } from '~components/Post/PostHeader/CopyLink/Styled'
import { Toast } from '~components/Modal/Toast'

// 사용하지 않게 된 컴포넌트
export const CopyLink = () => {
  const [isToastClicked, setIsToastClicked] = useState(false)

  return (
    <>
      {/* <CopyToClipboard text={getUrlPath()}> */}
        <LinkIconWrapper onClick={() => setIsToastClicked(true)}>
          <LinkIcon />
        </LinkIconWrapper>
      {/* </CopyToClipboard> */}
      <Toast isToastClicked={isToastClicked} setIsToastClicked={setIsToastClicked}>
        링크가 복사되었습니다
      </Toast>
    </>
  )
}
