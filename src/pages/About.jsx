import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useStoreSettings } from '../contexts/StoreSettingsContext';
import ScrollReveal from '../components/common/ScrollReveal';
import aboutImg from '../assets/about-img.jpg';
import './About.css';

const DAYS_OF_WEEK = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

export default function About() {
  const { settings, loading } = useStoreSettings();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (loading) {
    return (
      <div className="page-about bg-ivory" style={{ minHeight: '100vh', paddingTop: 'var(--spacing-4xl)' }}>
        <div className="container" style={{ paddingTop: 'var(--spacing-4xl)', textAlign: 'center' }}>
          <p className="text-muted">Loading our story…</p>
        </div>
      </div>
    );
  }

  // Dynamic values with sensible fallbacks
  const storeName = settings?.store_name || 'Shrimati Jewellers';
  const tagline = settings?.tagline || '';
  const shortDesc = settings?.short_description || '';
  const fullDesc = settings?.description || '';

  const hasSocials = settings?.instagram_url || settings?.facebook_url || settings?.youtube_url || settings?.whatsapp;

  return (
    <div className="page-about bg-ivory">

      {/* ── Page Hero (matches CollectionHero pattern) ─── */}
      <section className="about-hero" aria-labelledby="about-heading">
        <div className="about-hero-bg" aria-hidden="true"></div>
        <div className="container relative z-10 text-center">
          <h1 id="about-heading" className="text-5xl text-primary-dark font-serif mb-md">About Us</h1>
          {tagline && (
            <p className="text-lg text-muted max-w-2xl mx-auto" style={{ fontStyle: 'italic', fontFamily: 'var(--font-serif)' }}>
              {tagline}
            </p>
          )}
          {!tagline && shortDesc && (
            <p className="text-lg text-muted max-w-2xl mx-auto">
              {shortDesc}
            </p>
          )}
          <div className="hero-divider mt-lg mb-lg">
            <span className="hero-divider-line"></span>
            <span className="hero-divider-icon">✦</span>
            <span className="hero-divider-line"></span>
          </div>
          <p className="text-sm tracking-wider uppercase text-secondary-dark">
            Heritage • Craftsmanship • Trust
          </p>
        </div>
      </section>

      {/* ── Main Content ──────────────────────────────── */}
      <div className="container mt-2xl mb-4xl">

        {/* SECTION 1 — Our Story (Editorial Two-Column) */}
        {fullDesc && (
          <ScrollReveal>
            <section className="about-story-section" aria-labelledby="about-story-heading">
              <div className="about-image-wrap">
                <img
                  src={aboutImg}
                  alt={`${storeName} — craftsmanship`}
                  className="about-image"
                  loading="lazy"
                />
              </div>
              <div className="about-story-content">
                <h2 id="about-story-heading">Our Story</h2>
                <div className="about-story-text">
                  {fullDesc.split('\n').filter(p => p.trim()).map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </section>
          </ScrollReveal>
        )}

        {/* SECTION 2 — Brand Information */}
        {shortDesc && fullDesc && shortDesc !== fullDesc && (
          <ScrollReveal>
            <section className="about-brand-section" aria-labelledby="about-brand-heading">
              <div className="about-brand-content">
                <h2 id="about-brand-heading">Crafted With Trust</h2>
                <div className="about-brand-description">
                  <p>{shortDesc}</p>
                </div>
              </div>
            </section>
          </ScrollReveal>
        )}

        {/* SECTION 3 — Social Presence */}
        {hasSocials && (
          <ScrollReveal>
            <section className="about-social-section" aria-labelledby="about-social-heading">
              <h3 id="about-social-heading">Connect With Us</h3>
              <div className="about-social-links">
                {settings?.instagram_url && (
                  <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" className="about-social-link" aria-label="Follow us on Instagram">
                    Instagram
                  </a>
                )}
                {settings?.facebook_url && (
                  <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" className="about-social-link" aria-label="Follow us on Facebook">
                    Facebook
                  </a>
                )}
                {settings?.youtube_url && (
                  <a href={settings.youtube_url} target="_blank" rel="noopener noreferrer" className="about-social-link" aria-label="Watch us on YouTube">
                    YouTube
                  </a>
                )}
                {settings?.whatsapp && (
                  <a href={`https://wa.me/${settings.whatsapp.replace(/[\s+()\-]/g, '')}`} target="_blank" rel="noopener noreferrer" className="about-social-link" aria-label="Chat with us on WhatsApp">
                    WhatsApp
                  </a>
                )}
              </div>
            </section>
          </ScrollReveal>
        )}

        {/* SECTION 4 — Final CTA */}
        <ScrollReveal>
          <section className="about-cta-section">
            <p>Discover our collections or visit us to find the piece that tells your story.</p>
            <div className="about-cta-actions">
              <Link to="/collections" className="btn btn-outline-burgundy">
                Explore Collections <span className="btn-arrow">&rarr;</span>
              </Link>
              <Link to="/contact" className="btn btn-outline-gold" style={{ backgroundColor: 'var(--burgundy-deep)', borderColor: 'var(--gold)' }}>
                Visit Our Store
              </Link>
            </div>
          </section>
        </ScrollReveal>

      </div>
    </div>
  );
}
