import { Routes, Route } from 'react-router'
import Home from './pages/Home'
import { Articles } from './pages/Articles'
import { Article } from './pages/Article'
import { NotFound } from './pages/NotFound'
import { PageMetadata } from './components/PageMetadata'

export default function App() {
  return (
    <><PageMetadata /><Routes>
      <Route path="/" element={<Home />} />
      <Route path="/articles" element={<Articles />} />
      <Route path="/articles/:slug" element={<Article />} />
      <Route path="*" element={<NotFound />} />
    </Routes></>
  )
}
