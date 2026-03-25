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
import VocabularyTopic from './pages/VocabularyTopic.tsx';
import VocabularyWords from './pages/VocabularyWords.tsx';
import Practice from './pages/Practice.tsx';
import GrammarLevel from './pages/GrammarLevel.tsx';
import GrammarLesson from './pages/GrammarLesson.tsx';
import Login from './pages/Login.tsx';
import Dashboard from './pages/Dashboard.tsx';
import SignUp from './pages/SignUp.tsx';
import PracticeGrammar from './pages/PracticeGrammar.tsx';
import PracticeGrammarTopic from './pages/PracticeGrammarTopic.tsx';
import VocabularyPractice from './pages/VocabularyPractice.tsx';
import VocabularyPracticeTopic from './pages/VocabularyPracticeTopic.tsx';
import VocabularyPracticeSession from './pages/VocabularyPracticeSession.tsx';

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
            <Route path='/vocabulary/:topicId/' element={<VocabularyTopic />} />
            <Route path='/vocabulary/:topicId/:level' element={<VocabularyWords />} />
            <Route path='/practice' element={<Practice />} />
            <Route path='/practice/grammar' element={<PracticeGrammar />} />
            <Route path='/practice/grammar/:topicId' element={<PracticeGrammarTopic />} />
            <Route path='/practice/vocabulary' element={<VocabularyPractice />} />
            <Route path='/practice/vocabulary/:topicId' element={<VocabularyPracticeTopic />} />
            <Route path='/practice/vocabulary/:topicId/:level' element={<VocabularyPracticeSession />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
