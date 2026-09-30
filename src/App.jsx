import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Scan from './pages/Scan'
import Results from './pages/Results'
import Brief from './pages/Brief'
import ShowArtist from './pages/ShowArtist'
import Artists from './pages/Artists'
import ArtistDetail from './pages/ArtistDetail'
import ArtistDashboard from './pages/ArtistDashboard'
import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/scan" element={<Scan />} />
        <Route path="/results" element={<Results />} />
        <Route path="/brief" element={<Brief />} />
        <Route path="/show-artist" element={<ShowArtist />} />
        <Route path="/artists" element={<Artists />} />
        <Route path="/artists/:id" element={<ArtistDetail />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <ArtistDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}
