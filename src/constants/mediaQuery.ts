enum SCREEN_WIDTH_THRESHOLD {
  DESKTOP = 1440,
  TABLET = 768,
  MOBILE_LARGE = 321,
  MOBILE_SMALL = 280,
}

export const DEVICE_MEDIA = {
  DESKTOP: `only screen and (min-width: ${SCREEN_WIDTH_THRESHOLD.DESKTOP}px)`,
  TABLET: `only screen and (max-width: ${SCREEN_WIDTH_THRESHOLD.DESKTOP - 1}px) and (min-width: ${
    SCREEN_WIDTH_THRESHOLD.TABLET
  }px)`,
  MOBILE: `only screen and (max-width: ${SCREEN_WIDTH_THRESHOLD.TABLET - 1}px)`,
  MOBILE_LARGE: `only screen and (max-width: ${SCREEN_WIDTH_THRESHOLD.TABLET - 1}px) and (min-width: ${
    SCREEN_WIDTH_THRESHOLD.MOBILE_LARGE
  }px)`,
  MOBILE_SMALL: `only screen and (max-width: ${SCREEN_WIDTH_THRESHOLD.MOBILE_LARGE - 1}px)`,
}
