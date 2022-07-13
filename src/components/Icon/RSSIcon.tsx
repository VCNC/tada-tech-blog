import { Color } from '~designSystem/foundation'

interface Props {
  fillColor?: Color
}

export const RSSIcon = ({ fillColor }: Props) => {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="24" height="24" rx="3" fill={fillColor} />
      <path d="M18 18C18 11.3726 12.6274 6 6 6" stroke={Color.White} strokeWidth="1.71429" />
      <path d="M12.8571 18C12.8571 14.2129 9.7871 11.1428 6 11.1428" stroke={Color.White} strokeWidth="1.71429" />
      <circle cx="7.28571" cy="16.7142" r="1.28571" fill={Color.White} />
    </svg>
  )
}
