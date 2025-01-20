import Cookies from 'js-cookie'

export const setAuthCookie = (token: string) => {
  // Set cookie to expire in 7 days
  Cookies.set('firebase-token', token, { expires: 7 })
}

export const removeAuthCookie = () => {
  Cookies.remove('firebase-token')
} 