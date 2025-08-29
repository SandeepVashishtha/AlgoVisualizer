import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Sorting from './pages/Sorting';
import Searching from './pages/Searching';
import DataStructures from './pages/DataStructures';
import './styles/components.css';
import './styles/global-dark-theme.css';

const App = () => {
    return (
        <Router>
            <div className="app-container">
                <Header />
                <main className="main-content">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/sorting" element={<Sorting />} />
                        <Route path="/searching" element={<Searching />} />
                        <Route path="/data-structures" element={<DataStructures />} />
                    </Routes>
                </main>
                <Footer />
            </div>
        </Router>
    );
};

export default App;
