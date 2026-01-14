import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.tsx'
import './index.css'
import App from './App.tsx'
import Home from './pages/Home.tsx'
import Grammar from './pages/Grammar.tsx'
import Vocab from './pages/Vocab.tsx'
import Practice from './pages/Practice.tsx'
import GrammarLevel from './pages/GrammarLevel.tsx'
import GrammarLesson from './pages/GrammarLesson.tsx'
import Login from './pages/Login.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path='/' element={<App />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path='/grammar' element={<Grammar />} />
            <Route path='/grammar/:levelId' element={<GrammarLevel />} />
            <Route path='/grammar/:levelId/:topicId' element={<GrammarLesson />} />
            <Route path='/vocab' element={<Vocab />} />
            <Route path='/practice' element={<Practice />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
