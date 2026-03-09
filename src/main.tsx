import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.tsx';
import './index.css';
import ProtectedRoute from './routes/ProtectedRoute.tsx';
import App from './App.tsx';
import Home from './pages/Home.tsx';
import Grammar from './pages/Grammar.tsx';
import Vocabulary from './pages/Vocabulary.tsx';
import Practice from './pages/Practice.tsx';
import GrammarLevel from './pages/GrammarLevel.tsx';
import GrammarLesson from './pages/GrammarLesson.tsx';
import Login from './pages/Login.tsx';
import Dashboard from './pages/Dashboard.tsx';
import SignUp from './pages/SignUp.tsx';
import PracticeGrammar from './pages/PracticeGrammar.tsx';
import PracticeGrammarTopic from './pages/PracticeGrammarTopic.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path='/' element={<App />}>
            <Route index element={<Home />} />
            <Route path='signup' element={<SignUp />} />
            <Route path="login" element={<Login />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route path='/grammar' element={<Grammar />} />
            <Route path='/grammar/:levelId' element={<GrammarLevel />} />
            <Route path='/grammar/:levelId/:topicId' element={<GrammarLesson />} />
            <Route path='/vocabulary' element={<Vocabulary />} />
            <Route path='/practice' element={<Practice />} />
            <Route path='/practice/grammar' element={<PracticeGrammar />} />
            <Route path='/practice/grammar/:topicId' element={<PracticeGrammarTopic />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
