import { useEffect, useRef, useState } from 'react'
import isNull from 'lodash/isNull'
import { ToastContainer, ToastText } from '~components/Modal/Toast/Styled'

import type { Dispatch, SetStateAction } from 'react'
import type { ChildrenType } from '~constants/type'

interface Props extends ChildrenType {
  isToastClicked: boolean
  setIsToastClicked: Dispatch<SetStateAction<boolean>>
}

export const Toast = ({ isToastClicked, setIsToastClicked, children }: Props) => {
  const [isToastMounted, setIsToastMounted] = useState(false)
  const [isOnTransition, setIsOnTransition] = useState(false)
  const [toastTimer, setToastTimer] = useState<NodeJS.Timeout | null>(null)

  const ref = useRef<HTMLDivElement>(null)

  const toastTimerHandler = () => {
    if (!isNull(toastTimer)) {
      clearTimeout(toastTimer)
    }

    const timer = setTimeout(() => {
      setIsOnTransition(false)
      setToastTimer(null)
    }, 1000)

    setToastTimer(timer)
  }

  useEffect(() => {
    if (isToastClicked) {
      setIsToastMounted(true)
      setIsToastClicked(false)
      setTimeout(() => {
        setIsOnTransition(true)
        toastTimerHandler()
      }, 10)
    }
  }, [isToastClicked])

  if (!isToastMounted) return null

  return (
    <ToastContainer
      isOnTransition={isOnTransition}
      onTransitionEnd={() => {
        if (!isOnTransition) {
          setIsToastMounted(false)
        }
      }}
    >
      <ToastText>{children}</ToastText>
    </ToastContainer>
  )
}
