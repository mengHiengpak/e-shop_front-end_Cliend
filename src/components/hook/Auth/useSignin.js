import { useContext, useState } from "react";
import { api } from "../../../config/app.js";
import { AuthContext } from "./AuthContext.jsx";
import toast from "react-hot-toast";

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// The session lives in an HttpOnly cookie, so the only way to know it was stored
// is to ask the server who we are. On the hosted site the frontend and the API
// are on different origins, and mobile browsers drop those third-party cookies
// far more readily than desktop does. The POST can therefore succeed while the
// cookie is silently discarded, which used to leave the user staring at the
// sign-in form with a "success" toast and no session. Retry the confirmation a
// few times: the first request after sign-in can also race the cookie being
// written.
const confirmSession = async (refetch, attempts = 4, delay = 400) => {
    for (let attempt = 0; attempt < attempts; attempt += 1) {
        const user = await refetch()
        if (user) return user
        if (attempt < attempts - 1) await wait(delay)
    }
    return null
}

export const useSignin = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const { refetch } = useContext(AuthContext);

    const signin = async (email, password) => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await api.post('/customer/signin', {email, password})

            const user = await confirmSession(refetch)

            if (!user) {
                // Credentials were accepted but the browser never kept the
                // session. Returning { success: false } (rather than throwing)
                // keeps the caller from navigating, so the user stays on the
                // form and sees why instead of landing on a signed-out home page.
                const msg = 'Signed in, but this device did not keep the session. Check that cookies are allowed for this site, then sign in again.'
                setError(msg)
                toast.error(msg)
                return { success: false }
            }

            toast.success(res?.data?.message || 'Signed in successfully!')
            return { ...res.data, success: true, result: user }
        } catch (error) {
            const msg = error.response?.data?.error || error.response?.data?.message || 'server is error'
            setError(msg)
            toast.error(msg)
            console.log(msg)
            throw error
        } finally {
            setIsLoading(false)
        }
    }

    return {
        isLoading,
        error,
        signin
    }
}
