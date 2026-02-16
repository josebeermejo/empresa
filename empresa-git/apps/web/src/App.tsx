import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Health from './pages/Health';

function App() {
    return (
        <BrowserRouter>
            <div className="app">
                <nav className="navbar">
                    <div className="container">
                        <h1 className="logo">AI Data Steward</h1>
                        <div className="nav-links">
                            <Link to="/">Inicio</Link>
                            <Link to="/health">Estado del Sistema</Link>
                        </div>
                    </div>
                </nav>
                <main className="main-content">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/health" element={<Health />} />
                    </Routes>
                </main>
            </div>
        </BrowserRouter>
    );
}

export default App;
