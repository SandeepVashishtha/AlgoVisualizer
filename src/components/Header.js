import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/navbar.css';

const Header = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        return savedTheme ? savedTheme === 'dark' : true;
    });

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
    };

    useEffect(() => {
        const theme = isDarkMode ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', theme);
        document.body.className = `theme-${theme}`;
        localStorage.setItem('theme', theme);
    }, [isDarkMode]);

    return (
        <header>
            <div className="logo">
                <Link to="/">
                    <h1>AlgoVisualizer</h1>
                </Link>
            </div>
            <nav className={`nav-links ${isMobileMenuOpen ? 'nav-active' : ''}`}>
                <Link to="/" onClick={toggleMobileMenu}>Home</Link>
                <Link to="/sorting" onClick={toggleMobileMenu}>Sorting</Link>
                <Link to="/searching" onClick={toggleMobileMenu}>Searching</Link>
                <Link to="/data-structures" onClick={toggleMobileMenu}>Data Structures</Link>
            </nav>
            <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
                {isDarkMode ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                )}
            </button>
            <div className="hamburger" onClick={toggleMobileMenu}>
                <span className="bar"></span>
                <span className="bar"></span>
                <span className="bar"></span>
            </div>
        </header>
    );
};

export default Header;
