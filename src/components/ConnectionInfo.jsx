import { useEffect, useState } from 'react'
import { api } from '../config/app.js'
import { apiUrlBase } from '../config/env.js'

const describe = (res) => {
    const body = res.data

    // The dev server answered instead of the API, which means the /api proxy is
    // not running (the dev server was started before vite.config.js was saved).
    if (typeof body === 'string') {
        return 'HTML from the dev server, not the API - restart `npm run dev`'
    }

    if (body?.success && body?.result) {
        return `signed in as ${body.result.email || 'unknown'}`
    }

    if (body?.error) return body.error

    return `no session (${res.status})`
}

function Row({ label, value, bad }) {
    return (
        <div className="flex flex-wrap items-baseline justify-between gap-2 py-0.5">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">{label}</span>
            <span className={`text-[11px] break-all text-right ${bad ? 'font-bold text-red-600' : 'text-slate-700'}`}>{value}</span>
        </div>
    )
}

function isCrossSite() {
    try {
        return window.location.origin !== new URL(apiUrlBase).origin
    } catch {
        return false
    }
}

function ConnectionInfo() {
    const [probe, setProbe] = useState('checking...')
    const [bad, setBad] = useState(false)

    useEffect(() => {
        let active = true

        api.get('/customer/me')
            .then((res) => {
                if (!active) return
                setProbe(describe(res))
                setBad(typeof res.data === 'string')
            })
            .catch((error) => {
                if (!active) return
                setProbe(`${error.response?.status ?? error.message} - no session cookie reached the API`)
                setBad(true)
            })

        return () => {
            active = false
        }
    }, [])

    // Empty when the session cookie is HttpOnly, which is the correct and
    // secure setup - not a problem in itself.
    const cookies = document.cookie ? document.cookie : 'none visible (HttpOnly session cookie)'

    return (
        <details className="mt-6 rounded-xl border border-amber-200 bg-amber-50/60 px-4 py-3 text-left">
            <summary className="cursor-pointer text-[10px] font-semibold uppercase tracking-widest text-amber-800">
                Connection info
            </summary>
            <div className="mt-2 divide-y divide-amber-100/70">
                <Row label="page" value={window.location.host} />
                <Row label="cross-site" value={String(isCrossSite())} />
                <Row label="api base" value={apiUrlBase} bad={apiUrlBase.includes('localhost')} />
                <Row label="session" value={probe} bad={bad} />
                <Row label="cookies" value={cookies} />
            </div>
            <p className="mt-2 text-[10px] leading-relaxed text-amber-800/80">
                If cross-site is <strong>true</strong> and session shows no cookie, the browser is
                blocking the third-party session cookie. The API must send
                {' '}<code>SameSite=None; Secure</code> with a non-wildcard
                {' '}<code>Access-Control-Allow-Origin</code> and
                {' '}<code>Access-Control-Allow-Credentials: true</code>.
            </p>
        </details>
    )
}

export default ConnectionInfo
