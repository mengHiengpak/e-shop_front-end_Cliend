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
        return <Navigate to="/signin" replace state={{ from: location, reason: 'no-session' }} />
    }

    return children
}

export default RequireAuth
