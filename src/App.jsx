import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Browse from './pages/Browse';
import Admin from './pages/Admin';
import Quiz from './pages/Quiz';
import Swipe from './pages/Swipe';
import Matches from './pages/Matches';

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/swipe" element={<Swipe />} />
          <Route path="/matches" element={<Matches />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
