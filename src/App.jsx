import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Collections from './pages/Collections';
import ProductDetails from './pages/ProductDetails';
import About from './pages/About';
import Contact from './pages/Contact';
import AdminApp from '../admin/src/AdminApp';
import { StoreSettingsProvider } from './contexts/StoreSettingsContext';

function CustomerLayout() {
  return (
    <StoreSettingsProvider>
      <div className="app-container">
        <Navbar />
        <main>
          <Outlet />
        </main>
        <Footer />
      </div>
    </StoreSettingsProvider>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin/*" element={<AdminApp />} />
        
        <Route element={<CustomerLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/collections" element={<Collections />} />
          <Route path="/collections/:parentSlug" element={<Collections />} />
          <Route path="/collections/:parentSlug/:childSlug" element={<Collections />} />
          <Route path="/collections/:parentSlug/:childSlug/:subSlug" element={<Collections />} />
          <Route path="/product/:slug" element={<ProductDetails />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
