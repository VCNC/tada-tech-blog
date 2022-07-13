import React, { useEffect, useRef } from 'react'
import { UtteranceWrapper } from '~components/Post/PostComment/Utterance/Styled'

export const UtteranceComment = () => {
  const commentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const utteranceScript = document.createElement('script')
    const scriptAttributes = {
      src: 'https://utteranc.es/client.js',
      repo: 'VCNC/blog-comment',
      'issue-term': 'pathname',
      label: '⚡ Tech',
      theme: 'github-light',
      crossOrigin: 'anonymous',
      async: 'true',
    }
    Object.entries(scriptAttributes).forEach(([key, value]) => {
      utteranceScript.setAttribute(key, value)
    })

    commentRef.current!.appendChild(utteranceScript)
  }, [commentRef.current])

  return <UtteranceWrapper ref={commentRef} />
}
