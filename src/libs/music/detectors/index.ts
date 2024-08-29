const isNavigatorDefined = typeof navigator !== 'undefined'

export const isTablet = () => {
  if (!isNavigatorDefined) return false
  return navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1
}

export const isMobile = () => {
  if (!isNavigatorDefined) return false
  return !!(navigator.userAgent.match(/mobile/i) || isAndroid())
}

export const isAndroid = () => {
  if (!isNavigatorDefined) return false
  return !!navigator.userAgent.match(/android/i)
}

export const isSafari = () => {
  if (!isNavigatorDefined) return false
  return !!navigator.userAgent.match(/Safari/) && !navigator.userAgent.match(/Chrome/)
}
