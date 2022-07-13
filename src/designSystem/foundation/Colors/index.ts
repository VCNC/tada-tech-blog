import { BlueColor } from './BlueColor'
import { GrayColor } from './GrayColor'
import { NavyColor } from './NavyColor'
import { RedColor } from './RedColor'

export type Color = BlueColor | GrayColor | NavyColor | RedColor

export const Color = { ...BlueColor, ...GrayColor, ...NavyColor, ...RedColor }
