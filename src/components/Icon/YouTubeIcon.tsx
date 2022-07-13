import { Color } from '~designSystem/foundation'

interface Props {
  fillColor?: Color
}

export const YouTubeIcon = ({ fillColor }: Props) => {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="16" fill={fillColor} />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M23.5076 9.99558C24.3332 10.2158 24.9834 10.8671 25.2047 11.6927C25.6065 13.1894 25.6055 16.3143 25.6055 16.3143C25.6055 16.3143 25.6055 19.4381 25.2047 20.9359C24.9845 21.7615 24.3332 22.4117 23.5076 22.633C22.0099 23.0337 16.0064 23.0338 16.0064 23.0338C16.0064 23.0338 10.0029 23.0337 8.50517 22.633C7.67855 22.4127 7.02831 21.7625 6.80704 20.9359C6.40625 19.4381 6.40625 16.3143 6.40625 16.3143C6.40625 16.3143 6.40625 13.1894 6.80704 11.6927C7.02831 10.866 7.67855 10.2158 8.50517 9.99558C10.0019 9.59375 16.0064 9.59375 16.0064 9.59375C16.0064 9.59375 22.0099 9.59375 23.5076 9.99558ZM19.0749 16.326L14.0859 19.2056V13.4453L19.0749 16.326Z"
        fill={Color.Gray200}
      />
    </svg>
  )
}
