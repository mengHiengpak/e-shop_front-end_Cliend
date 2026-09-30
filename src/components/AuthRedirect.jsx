
import { Navigate } from 'react-router-dom'
import useCurrent from "./hook/Auth/useCurrent.js";
import Loading from './Loading.jsx'

function AuthRedirect({ children }) {
    const { data, isLoading } = useCurrent()

    if (isLoading) {
        return <Loading />
    }

    if (data) {
        return <Navigate to="/" replace />
    }

    return children
}

export default AuthRedirect
