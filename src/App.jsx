import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import LandingPage from './pages/LandingPage'
import AuthPage from './pages/AuthPage'
import AuthCallback from './components/auth/AuthCallback'
import ProtectedRoute from './components/auth/ProtectedRoute'
import AppShell from './components/layout/AppShell'

// Lazy load actual app pages (implementing next)
import UploadDataset from './pages/UploadDataset'
import RunningAgents from './pages/RunningAgents'
import FailedAgents from './pages/FailedAgents'
import CompletedAgents from './pages/CompletedAgents'
import ResultDashboard from './pages/ResultDashboard'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/auth/callback" element={<AuthCallback />} />

          {/* Protected App Routes */}
          <Route path="/app" element={<ProtectedRoute><AppShell /></ProtectedRoute>}>
            <Route index element={<Navigate to="/app/upload" replace />} />
            <Route path="upload" element={<UploadDataset />} />
            <Route path="running" element={<RunningAgents />} />
            <Route path="failed" element={<FailedAgents />} />
            <Route path="completed" element={<CompletedAgents />} />
            <Route path="result/:jobId" element={<ResultDashboard />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
