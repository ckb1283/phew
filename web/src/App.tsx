import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Build from './pages/Build'
import Item from './pages/Item'
import Landing from './pages/Landing'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/build" element={<Build />} />
        <Route path="/item/:id" element={<Item />} />
      </Routes>
    </BrowserRouter>
  )
}
