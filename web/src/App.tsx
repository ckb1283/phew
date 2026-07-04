import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Build from './pages/Build'
import Landing from './pages/Landing'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/build" element={<Build />} />
      </Routes>
    </BrowserRouter>
  )
}
