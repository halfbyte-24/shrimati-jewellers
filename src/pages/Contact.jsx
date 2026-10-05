import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, MessageCircle, Globe, CreditCard } from 'lucide-react';
import { supabase } from '../lib/supabase';
import ScrollReveal from '../components/common/ScrollReveal';
import './Contact.css';

const DAYS_OF_WEEK = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

/**
 * Converts 24-hour time string "HH:MM" to 12-hour format "H:MM AM/PM".
 */
function formatTime(timeStr) {
  if (!timeStr) return '';
  try {
    const [hours, minutes] = timeStr.split(':');
    const h = parseInt(hours, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${h12}:${minutes} ${ampm}`;
  } catch {
    return timeStr;
  }
}

/**
 * Builds an OpenStreetMap embed URL from address components.
 * Falls back to the store's google_maps_url if available, or a static location.
 */
function buildMapEmbedUrl(settings) {
  // Construct a search query from address parts
  const parts = [];
  if (settings?.address_line_1) parts.push(settings.address_line_1);
  if (settings?.locality) parts.push(settings.locality);
  if (settings?.city) parts.push(settings.city);
  if (settings?.state) parts.push(settings.state);
  if (settings?.postal_code) parts.push(settings.postal_code);
  if (settings?.country) parts.push(settings.country);

  if (parts.length > 0) {
    // Use store name + address for better accuracy
    const storeName = settings?.store_name || '';
    const query = encodeURIComponent(`${storeName}, ${parts.join(', ')}`);
    return `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${query}&maptype=roadmap`;
  }

  // Fallback: use existing hardcoded embed for Shrimati Jewellers with ROAD map type (!4f... controls tilt, !5e0 = standard map)
  return 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3504.5338200082797!2d88.10033347507449!3d22.46807697956633!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a0287004bcc64ed%3A0x3dbab5a853007921!2sShrimati%20Jewellers!5e0!3m2!1sen!2sin!4v1791055135545!5m2!1sen!2sin';
}

/**
 * Builds a Google Maps directions URL from address components.
 */
function buildDirectionsUrl(settings) {
  const parts = [];
  if (settings?.store_name) parts.push(settings.store_name);
  if (settings?.locality) parts.push(settings.locality);
  if (settings?.city) parts.push(settings.city);
  if (settings?.state) parts.push(settings.state);

  if (parts.length > 0) {
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(parts.join(', '))}`;
  }

  return 'https://www.google.com/maps/dir/?api=1&destination=Shrimati+Jewellers,+Uluberia,+West+Bengal';
}

export default function Contact() {
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
      console.error('Error fetching store settings:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page-contact bg-ivory" style={{ minHeight: '100vh', paddingTop: 'var(--spacing-4xl)' }}>
        <div className="container" style={{ paddingTop: 'var(--spacing-4xl)', textAlign: 'center' }}>
          <p className="text-muted">Loading contact details…</p>
        </div>
      </div>
    );
  }

  // ── Address formatting ───────────────────
  const addressLines = [];
  if (settings?.address_line_1) addressLines.push(settings.address_line_1);
  if (settings?.address_line_2) addressLines.push(settings.address_line_2);
  if (settings?.locality) addressLines.push(settings.locality);

  const cityStateParts = [];
  if (settings?.city) cityStateParts.push(settings.city);
  if (settings?.state) cityStateParts.push(settings.state);

  let cityStateLine = cityStateParts.join(', ');
  if (settings?.postal_code) {
    cityStateLine += cityStateLine ? ` — ${settings.postal_code}` : settings.postal_code;
  }

  const hasAddress = addressLines.length > 0 || cityStateLine;

  // ── Phone formatting ─────────────────────
  const hasPhone = settings?.phone || settings?.secondary_phone;

  // ── Email formatting ─────────────────────
  const hasEmail = settings?.email || settings?.enquiry_email;

  // ── WhatsApp ─────────────────────────────
  const hasWhatsApp = settings?.whatsapp || settings?.whatsapp_url;

  // ── Business hours ───────────────────────
  const businessHours = settings?.business_hours || {};
  const hasBusinessHours = DAYS_OF_WEEK.some(day => businessHours[day]);

  // ── Map ──────────────────────────────────
  const mapEmbedUrl = buildMapEmbedUrl(settings);
  const directionsUrl = buildDirectionsUrl(settings);

  // ── Dynamic intro text ───────────────────
  const storeName = settings?.store_name || 'Shrimati Jewellers';
  const shortDesc = settings?.short_description || '';

  return (
    <div className="page-contact bg-ivory">

      {/* ── Page Hero (matches CollectionHero pattern) ─── */}
      <section className="contact-hero" aria-labelledby="contact-heading">
        <div className="contact-hero-bg" aria-hidden="true"></div>
        <div className="container relative z-10 text-center">
          <h1 id="contact-heading" className="text-5xl text-primary-dark font-serif mb-md">Contact Us</h1>
          <p className="contact-intro-text text-muted max-w-2xl mx-auto">
            {shortDesc
              ? `We'd love to welcome you. ${shortDesc}`
              : "We'd love to welcome you to our showroom. Reach out to us anytime."
            }
          </p>
          <div className="hero-divider mt-lg mb-lg">
            <span className="hero-divider-line"></span>
            <span className="hero-divider-icon">✦</span>
            <span className="hero-divider-line"></span>
          </div>
          <p className="text-sm tracking-wider uppercase text-secondary-dark">
            {storeName}
          </p>
        </div>
      </section>

      {/* ── Main Content ──────────────────────────────── */}
      <div className="container mb-4xl">

        <ScrollReveal>
          <div className="contact-grid">

            {/* LEFT — Store Information */}
            <div className="contact-info-card">
              <h2>Store Information</h2>

              {/* Address */}
              {hasAddress && (
                <div className="contact-row">
                  <MapPin className="contact-row-icon" aria-hidden="true" />
                  <div className="contact-row-content">
                    <h3>Address</h3>
                    <p>
                      {addressLines.map((line, i) => (
                        <React.Fragment key={i}>{line}<br /></React.Fragment>
                      ))}
                      {cityStateLine}
                    </p>
                  </div>
                </div>
              )}

              {/* Phone */}
              {hasPhone && (
                <div className="contact-row">
                  <Phone className="contact-row-icon" aria-hidden="true" />
                  <div className="contact-row-content">
                    <h3>Phone</h3>
                    <p>
                      {settings.phone && (
                        <>
                          <a href={`tel:${settings.phone.replace(/\s/g, '')}`}>{settings.phone}</a>
                          <br />
                        </>
                      )}
                      {settings.secondary_phone && (
                        <a href={`tel:${settings.secondary_phone.replace(/\s/g, '')}`}>{settings.secondary_phone}</a>
                      )}
                    </p>
                  </div>
                </div>
              )}

              {/* WhatsApp */}
              {hasWhatsApp && (
                <div className="contact-row">
                  <MessageCircle className="contact-row-icon" aria-hidden="true" />
                  <div className="contact-row-content">
                    <h3>WhatsApp</h3>
                    <p>
                      {settings.whatsapp_url ? (
                        <a href={settings.whatsapp_url} target="_blank" rel="noopener noreferrer">
                          {settings.whatsapp || 'Chat with us'}
                        </a>
                      ) : (
                        <a href={`https://wa.me/${settings.whatsapp?.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer">
                          {settings.whatsapp}
                        </a>
                      )}
                    </p>
                  </div>
                </div>
              )}

              {/* Email */}
              {hasEmail && (
                <div className="contact-row">
                  <Mail className="contact-row-icon" aria-hidden="true" />
                  <div className="contact-row-content">
                    <h3>Email</h3>
                    <p>
                      {settings.email && (
                        <>
                          <a href={`mailto:${settings.email}`}>{settings.email}</a>
                          {settings.enquiry_email && settings.enquiry_email !== settings.email && <br />}
                        </>
                      )}
                      {settings.enquiry_email && settings.enquiry_email !== settings.email && (
                        <a href={`mailto:${settings.enquiry_email}`}>{settings.enquiry_email}</a>
                      )}
                    </p>
                  </div>
                </div>
              )}

              {/* Business Hours */}
              {hasBusinessHours && (
                <div className="contact-row">
                  <Clock className="contact-row-icon" aria-hidden="true" />
                  <div className="contact-row-content">
                    <h3>Business Hours</h3>
                    <table className="business-hours-table" aria-label="Business hours">
                      <tbody>
                        {DAYS_OF_WEEK.map(day => {
                          const dayData = businessHours[day];
                          if (!dayData) return null;

                          const isOpen = dayData.enabled && dayData.open && dayData.close;
                          return (
                            <tr key={day}>
                              <td>{day}</td>
                              <td>
                                {isOpen
                                  ? `${formatTime(dayData.open)} – ${formatTime(dayData.close)}`
                                  : <span className="closed-text">Closed</span>
                                }
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Languages Spoken */}
              <div className="contact-row">
                <Globe className="contact-row-icon" aria-hidden="true" />
                <div className="contact-row-content">
                  <h3>Languages Spoken</h3>
                  <p>English <span className="inline-divider">|</span> Hindi</p>
                </div>
              </div>

              {/* Payment Options */}
              <div className="contact-row">
                <CreditCard className="contact-row-icon" aria-hidden="true" />
                <div className="contact-row-content">
                  <h3>Payment Options</h3>
                  <p>
                    RTGS <span className="inline-divider">|</span> NEFT <span className="inline-divider">|</span> UPI <span className="inline-divider">|</span> Cash <span className="inline-divider">|</span> Cards<br/>
                    Online Wallets <span className="inline-divider">|</span> Senco Gift Card
                  </p>
                </div>
              </div>

              {/* Parking */}
              <div className="contact-row">
                <MapPin className="contact-row-icon" aria-hidden="true" />
                <div className="contact-row-content">
                  <h3>Parking</h3>
                  <p>Street Parking</p>
                </div>
              </div>
            </div>

            {/* RIGHT — Map */}
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-map-container"
              aria-label={`Get directions to ${storeName}`}
            >
              <div className="contact-map-overlay" aria-hidden="true"></div>
              <iframe
                src={mapEmbedUrl}
                width="100%"
                height="100%"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                title={`${storeName} location map`}
              ></iframe>
            </a>

          </div>
        </ScrollReveal>

        {/* ── Get Directions CTA ─────────────────────── */}
        <ScrollReveal>
          <section className="contact-directions">
            <p>Tap the map or use the link below for turn-by-turn directions.</p>
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline-burgundy"
            >
              Get Directions <span className="btn-arrow">&rarr;</span>
            </a>
          </section>
        </ScrollReveal>

      </div>
    </div>
  );
}
