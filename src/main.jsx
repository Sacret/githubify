import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes, useParams } from 'react-router';
//
import { AuthProvider } from './auth';
import Footer from './components/Footer';
import LoginPage from './pages/LoginPage';
import MainPage from './pages/MainPage';
//
import './styles/app.less';

// Remount main page with fresh state when switching between users
function UserRoute() {
  const { uname } = useParams();
  return (
    <>
      <MainPage key={uname} uname={uname} />
      <Footer />
    </>
  );
}

createRoot(document.getElementById('content')).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <div className="app">
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path=":uname" element={<UserRoute />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>
);
