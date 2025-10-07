import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import SubmitCompanyModal from './components/SubmitCompanyModal';
import Home from './pages/Home';
import Browse from './pages/Browse';
import Admin from './pages/Admin';
import AdminLogin from './pages/AdminLogin';
import Quiz from './pages/Quiz';
import Swipe from './pages/Swipe';
import Matches from './pages/Matches';

function App() {
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  return (
    <Router>
      <div className="min-h-screen">
        <Navbar onOpenSubmitModal={() => setIsSubmitModalOpen(true)} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/swipe" element={<Swipe />} />
          <Route path="/matches" element={<Matches />} />
        </Routes>

        {/* Submit Company Modal - Rendered at root level */}
        <SubmitCompanyModal
          isOpen={isSubmitModalOpen}
          onClose={() => setIsSubmitModalOpen(false)}
        />
      </div>
    </Router>
  );
}

export default App;
