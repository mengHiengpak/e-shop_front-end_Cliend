import { Navigate } from 'react-router-dom'
import useCurrent from "./hook/Auth/useCurrent.js";
import Loading from "./Loading.jsx";

function AuthRedirect({ children }) {
    const { data, isLoading } = useCurrent()

    if (isLoading) {
        return <Loading />
    }

    // Any signed-in user belongs off the auth pages. This used to compare
    // data.role against the literal string "customer", so a user whose role came
    // back as "Customer", "user", or was missing entirely stayed stuck on
    // /signin even though they were authenticated.
    if (data) {
        // replace keeps /signin out of history, otherwise the back button walks
        // straight back into this redirect and bounces to / again.
        return <Navigate to="/" replace />
    }

    return children
}

export default AuthRedirect
