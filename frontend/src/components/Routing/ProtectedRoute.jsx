import { Navigate, useLocation } from 'react-router-dom'

import { useAuth } from '../../context/AuthContext'
import { PageLoader } from '../Loader/Skeleton'

export default function ProtectedRoute({ children }) {
  const { user, initialising } = useAuth()
  const location = useLocation()
  if (initialising) return <PageLoader />
  if (!user) return <Navigate to={`/login?next=${encodeURIComponent(location.pathname + location.search)}`} replace />
  return children
}

export function GuestOnlyRoute({ children }) {
  const { user, initialising } = useAuth()
  const location = useLocation()
  if (initialising) return <PageLoader />
  if (user) {
    const next = new URLSearchParams(location.search).get('next')
    return <Navigate to={next && next.startsWith('/') ? next : '/account'} replace />
  }
  return children
}
