import { Color } from '~designSystem/foundation'

interface Props {
  fillColor?: Color
}

export const FacebookIcon = ({ fillColor }: Props) => {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="16" fill={fillColor} />
      <path
        d="M13.8804 23.5234H17.1653V15.4556H19.4559L19.7013 12.756H17.1653V11.2165C17.1653 10.5809 17.2943 10.3279 17.9236 10.3279H19.7013V7.52344H17.4264C14.9848 7.52344 13.8804 8.57859 13.8804 10.5994V12.7529H12.1719V15.4895H13.8804V23.5234Z"
        fill={Color.Gray200}
      />
    </svg>
  )
}
