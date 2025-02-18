
import { Navigate } from 'react-router';

const ProtectedRoute = ({ element}) => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken)
        return <Navigate to="/login" />
    return element
}

export default ProtectedRoute
