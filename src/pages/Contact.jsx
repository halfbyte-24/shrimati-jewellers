import React, { useEffect, useState } from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { supabase } from '../lib/supabase';

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
      console.error("Error fetching store settings:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page-contact pt-4xl min-h-screen flex items-center justify-center">
        <div className="text-muted">Loading contact details...</div>
      </div>
    );
  }

  // Format Address lines
  const addressParts = [];
  if (settings?.address_line_1) addressParts.push(settings.address_line_1);
  if (settings?.address_line_2) addressParts.push(settings.address_line_2);
  if (settings?.locality) addressParts.push(settings.locality);
  
  const cityStateParts = [];
  if (settings?.city) cityStateParts.push(settings.city);
  if (settings?.state) cityStateParts.push(settings.state);
  if (settings?.postal_code) cityStateParts.push(settings.postal_code);

  // Business hours parsing
  const businessHours = settings?.business_hours || {};
  const formatTime = (timeStr) => {
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
  };

  const mon = businessHours['monday'] || { enabled: false };
  const sun = businessHours['sunday'] || { enabled: false };
  
  const monSatHours = mon.enabled && mon.open && mon.close 
    ? `${formatTime(mon.open)} - ${formatTime(mon.close)}` 
    : 'Closed';

  const sundayHours = sun.enabled && sun.open && sun.close
    ? `${formatTime(sun.open)} - ${formatTime(sun.close)}`
    : 'Closed';

  return (
    <div className="page-contact pt-4xl">
      <div className="container mt-2xl mb-4xl">
        <div className="text-center max-w-2xl mx-auto mb-3xl">
          <span className="text-secondary tracking-wider text-sm uppercase">Get In Touch</span>
          <h1 className="text-5xl mt-sm mb-lg text-primary">Contact Us</h1>
          <p className="text-lg text-muted">
            We are always here to help you find the perfect piece or answer any questions you may have about our collections.
          </p>
        </div>

        <div className="grid grid-cols-2 max-w-5xl mx-auto items-start" style={{ gap: '3rem', padding: '0 1rem' }}>
          {/* Left Column: Contact Details Card */}
          <div className="contact-info bg-white p-3xl rounded-lg flex flex-col" style={{ borderRadius: '16px', padding: '3rem', backgroundColor: '#ffffff', boxShadow: '0 10px 40px rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.05)' }}>
            <h3 className="text-2xl mb-2xl text-left font-serif text-primary">Store Information</h3>
            
            <div className="flex items-start text-left gap-md mb-xl">
              <MapPin className="text-secondary flex-shrink-0 mt-xs" size={24} />
              <div>
                <h4 className="font-sans text-md font-bold mb-xs">Address</h4>
                <p className="text-muted">
                  {addressParts.length > 0 && <>{addressParts.join(', ')}<br/></>}
                  {cityStateParts.length > 0 && <>{cityStateParts.join(', ')}</>}
                </p>
              </div>
            </div>

            <div className="flex items-start text-left gap-md mb-xl">
              <Phone className="text-secondary flex-shrink-0 mt-xs" size={24} />
              <div>
                <h4 className="font-sans text-md font-bold mb-xs">Phone / WhatsApp</h4>
                <p className="text-muted">
                  {settings?.phone && <>{settings.phone}<br/></>}
                  {settings?.secondary_phone && <>{settings.secondary_phone}<br/></>}
                  {settings?.whatsapp && <>{settings.whatsapp}</>}
                </p>
              </div>
            </div>

            <div className="flex items-start text-left gap-md mb-xl">
              <Mail className="text-secondary flex-shrink-0 mt-xs" size={24} />
              <div>
                <h4 className="font-sans text-md font-bold mb-xs">Email</h4>
                <p className="text-muted">
                  {settings?.email || settings?.enquiry_email}
                </p>
              </div>
            </div>

            <div className="flex items-start text-left gap-md">
              <Clock className="text-secondary flex-shrink-0 mt-xs" size={24} />
              <div>
                <h4 className="font-sans text-md font-bold mb-xs">Store Hours</h4>
                <p className="text-muted">
                  Mon - Sat: {monSatHours}<br/>
                  Sunday: {sundayHours}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Google Maps iframe (Clickable for directions) */}
          <a 
            href="https://www.google.com/maps/dir/?api=1&destination=Shrimati+Jewellers,+Uluberia,+West+Bengal" 
            target="_blank" 
            rel="noopener noreferrer"
            className="map-container block" 
            style={{ borderRadius: '16px', overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.05)', height: '450px', cursor: 'pointer', position: 'relative' }}
          >
            {/* Overlay to intercept clicks */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 10 }}></div>
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3504.5338200082797!2d88.10033347507449!3d22.46807697956633!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a0287004bcc64ed%3A0x3dbab5a853007921!2sShrimati%20Jewellers!5e1!3m2!1sen!2sin!4v1791055135545!5m2!1sen!2sin" 
              width="100%" 
              height="100%" 
              style={{ border: 0, pointerEvents: 'none' }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="strict-origin-when-cross-origin"
              title="Store Location Map"
            ></iframe>
          </a>
        </div>
      </div>
    </div>
  );
}
