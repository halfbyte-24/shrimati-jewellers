import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { MessageCircle } from 'lucide-react';
import aboutImg from '../assets/about-img.jpg';

export default function About() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('store_settings')
        .select('*')
        .eq('id', 1)
        .single();
      
      if (error) throw error;
      setSettings(data);
    } catch (err) {
      console.error("Error fetching store settings:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page-about pt-4xl min-h-screen flex items-center justify-center">
        <div className="text-muted">Loading our story...</div>
      </div>
    );
  }

  // Fallbacks in case settings is empty/missing
  const storeName = settings?.store_name || "Shrimati Jewellers";
  const tagline = settings?.tagline || "Timeless Craft. Modern Elegance.";
  const shortDesc = settings?.short_description || "For generations, we have been a symbol of trust, purity, and unparalleled craftsmanship.";
  const fullDesc = settings?.description || shortDesc;

  const hasSocials = settings?.instagram_url || settings?.facebook_url || settings?.youtube_url || settings?.whatsapp_url;

  return (
    <div className="page-about pt-4xl">
      <div className="container mt-2xl mb-4xl">
        
        {/* Intro Section */}
        <div className="text-center max-w-2xl mx-auto mb-4xl">
          <span className="text-secondary tracking-wider text-sm uppercase">About Us</span>
          <h1 className="text-5xl mt-sm mb-lg text-primary" style={{ textTransform: 'uppercase' }}>
            {storeName}
          </h1>
          {tagline && (
            <h2 className="text-2xl mb-md text-primary font-serif" style={{ fontStyle: 'italic' }}>
              {tagline}
            </h2>
          )}
          <p className="text-lg text-muted">
            {shortDesc}
          </p>
        </div>

        {/* Editorial Section */}
        <div className="grid grid-cols-2 gap-4xl items-center mb-4xl">
          <div className="about-img-wrap" style={{ borderRadius: '12px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', maxWidth: '380px' }}>
            {/* Using the user-provided jewelry crafting image. */}
            <img 
              src={aboutImg} 
              alt={storeName} 
              style={{ width: '100%', height: '100%', objectFit: 'cover', aspectRatio: '4/5', display: 'block' }} 
            />
          </div>
          <div className="about-story">
            <h2 className="text-3xl mb-md text-primary font-serif">Our Story</h2>
            {/* Render full description, supporting basic line breaks if present */}
            <div className="text-muted text-lg" style={{ lineHeight: '1.8' }}>
              {fullDesc.split('\n').map((paragraph, idx) => (
                <p key={idx} className="mb-md">{paragraph}</p>
              ))}
            </div>
            
            <div className="mt-xl flex flex-wrap gap-md">
              <Link 
                to="/collections" 
                style={{ backgroundColor: '#742222', color: '#ffffff', padding: '12px 32px', border: '1px solid #742222', borderRadius: '2px', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '14px', fontWeight: '500', transition: 'all 0.3s ease', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
              >
                Explore Collections
              </Link>
              <Link 
                to="/contact" 
                style={{ backgroundColor: 'transparent', color: '#742222', padding: '12px 32px', border: '1px solid #742222', borderRadius: '2px', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '14px', fontWeight: '500', transition: 'all 0.3s ease', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
              >
                Visit Our Store
              </Link>
            </div>
          </div>
        </div>

        {/* Social Media Section */}
        {hasSocials && (
          <div className="text-center mt-4xl pt-2xl" style={{ borderTop: '1px solid rgba(0,0,0,0.05)' }}>
            <h3 className="text-xl mb-md text-primary font-serif">Connect With Us</h3>
            <div className="flex justify-center gap-md">
              {settings?.instagram_url && (
                <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" className="text-secondary hover:text-primary transition-colors uppercase text-sm tracking-wider mx-xs">
                  Instagram
                </a>
              )}
              {settings?.facebook_url && (
                <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" className="text-secondary hover:text-primary transition-colors uppercase text-sm tracking-wider mx-xs">
                  Facebook
                </a>
              )}
              {settings?.youtube_url && (
                <a href={settings.youtube_url} target="_blank" rel="noopener noreferrer" className="text-secondary hover:text-primary transition-colors uppercase text-sm tracking-wider mx-xs">
                  YouTube
                </a>
              )}
              {settings?.whatsapp_url && (
                <a href={settings.whatsapp_url} target="_blank" rel="noopener noreferrer" className="text-secondary hover:text-primary transition-colors uppercase text-sm tracking-wider mx-xs">
                  WhatsApp
                </a>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
