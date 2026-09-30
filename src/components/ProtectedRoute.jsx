/**
 * Protected route wrapper.
 * Redirects to /login if user is not authenticated.
 */
import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ivory">
        <p className="text-cocoa animate-pulse">Loading...</p>
      </div>
    )
  }

  return user ? children : <Navigate to="/login" replace />
}
