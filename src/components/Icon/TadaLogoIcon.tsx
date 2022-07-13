import { Color } from '~designSystem/foundation'

interface Props {
  fillColor?: Color
}

export const TadaLogoIcon = ({ fillColor }: Props) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="80" height="20" viewBox="0 0 80 20">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M27,20V0h3.9v8.1H38v3.9h-7.1V20H27z M0,4h19.5V0.1H0V4z M0,11.9h19.5V8.1H0V11.9z M19.5,19.9H0V16h19.5V19.9z
	 M42,4h19.5V0.1H42V4z M42,19.9h19.5V16H42V19.9z M69,20V0h3.9v8.1H80v3.9h-7.1V20H69z"
        fill={fillColor}
      />
    </svg>
  )
}
