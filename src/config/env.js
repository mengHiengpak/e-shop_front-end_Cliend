const PROD_API = 'https://e-shop-back-end-vpfq.onrender.com/api'

const envApi = (import.meta.env.VITE_URL_BASE || '').trim()

const isLocalApi = /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])(:\d+)?/i.test(envApi)

// Only the dev server may talk to localhost: a visitor's browser has no API
// running on their own machine, so any built bundle pointing there gets every
// request refused. DEV is true only for `vite`, never for `vite build`, so this
// holds no matter which mode the bundle was built with.
const isDevServer = Boolean(import.meta.env.DEV)

// In dev the browser only ever calls its own origin and server.proxy forwards
// /api to the real backend. That keeps the session cookie first-party, which is
// what makes it survive on a phone; pointing straight at the backend address
// would break on any device that is not the machine running the backend.
const apiUrlBase = isDevServer
  ? '/api'
  : isLocalApi || !envApi
    ? PROD_API
    : envApi

export {
apiUrlBase
}
