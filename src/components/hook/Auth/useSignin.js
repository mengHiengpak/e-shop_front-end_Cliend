import { useContext, useState } from "react";
import { api } from "../../../config/app.js";
import { AuthContext } from "./AuthContext.jsx";
import toast from "react-hot-toast";

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Mobile browsers can be slow to hand the freshly issued session cookie back to
// the very next request, so confirm the session a few times before deciding the
// sign-in failed.
const confirmSession = async (refetch, attempts = 4) => {
    for (let attempt = 0; attempt < attempts; attempt += 1) {
        const user = await refetch()
        if (user) return user
        await wait(500)
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
                const msg = 'Signed in, but the session was lost. Please check your connection and sign in again.'
                setError(msg)
                toast.error(msg)
                return { success: false }
            }

            toast.success(res?.data?.message || 'Signed in successfully!')
            return res.data
        } catch (error) {
            const msg = error.response?.data?.error || error.response?.data?.message || error.message || 'server is error'
            setError(msg)
            toast.error(msg)
            console.log(msg)
            return { success: false }
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
