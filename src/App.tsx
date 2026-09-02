import { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from '@/components/ui/sonner';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Admin from './pages/Admin';
import Posts from './pages/Posts';
import Guides from './pages/Guides';
import './App.css';

function App() {
  useEffect(() => {
    // Warm up the posts API on initial load to resolve database inactivity lag
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
    fetch(`${apiUrl}/api/posts`)
      .then((res) => {
        if (res.ok) {
          console.log('Posts API warmed up successfully.');
        }
      })
      .catch((err) => {
        console.log('Posts API warmup skipped or failed:', err);
      });
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-background text-foreground transition-colors duration-300 overflow-x-hidden">
            <Navbar />
            <main className="pt-16">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/home" element={<Home />} />
                <Route path="/guides" element={<Guides />} />
                <Route path="/blueprints" element={<Guides />} />
                <Route path="/posts" element={<Posts />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Toaster />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;