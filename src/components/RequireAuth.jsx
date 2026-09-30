import { Navigate, useLocation } from 'react-router-dom'
import useCurrent from './hook/Auth/useCurrent.js'
import Loading from './Loading.jsx'

function RequireAuth({ children }) {
    const { data, isLoading } = useCurrent()
    const location = useLocation()

    if (isLoading) {
        return <Loading />
    }

    if (!data) {
        // Remember where the user was headed so Signin can send them back after
        // a successful sign-in instead of always dropping them on the home page.
        return <Navigate to="/signin" replace state={{ from: location }} />
    }

    return children
}

export default RequireAuth
