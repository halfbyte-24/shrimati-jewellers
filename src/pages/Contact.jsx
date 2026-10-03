import React, { useEffect } from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export default function Contact() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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

        <div className="grid grid-cols-2 gap-4xl">
          <div className="contact-info bg-background-alt p-3xl rounded-lg" style={{ borderRadius: '12px', padding: '3rem' }}>
            <h3 className="text-2xl mb-xl">Store Information</h3>
            
            <div className="flex gap-md mb-lg">
              <MapPin className="text-secondary flex-shrink-0 mt-xs" size={24} />
              <div>
                <h4 className="font-sans text-md font-bold mb-xs">Address</h4>
                <p className="text-muted">Uluberia, Nona<br/>Howrah, West Bengal</p>
              </div>
            </div>

            <div className="flex gap-md mb-lg">
              <Phone className="text-secondary flex-shrink-0 mt-xs" size={24} />
              <div>
                <h4 className="font-sans text-md font-bold mb-xs">Phone / WhatsApp</h4>
                <p className="text-muted">92422 76397<br/>80018 76397</p>
              </div>
            </div>

            <div className="flex gap-md mb-lg">
              <Mail className="text-secondary flex-shrink-0 mt-xs" size={24} />
              <div>
                <h4 className="font-sans text-md font-bold mb-xs">Email</h4>
                <p className="text-muted">info@srimatijewelers.com</p>
              </div>
            </div>

            <div className="flex gap-md">
              <Clock className="text-secondary flex-shrink-0 mt-xs" size={24} />
              <div>
                <h4 className="font-sans text-md font-bold mb-xs">Store Hours</h4>
                <p className="text-muted">Mon - Sat: 10:30 AM - 8:30 PM<br/>Sunday: Closed</p>
              </div>
            </div>
          </div>

          <div className="contact-form">
            <h3 className="text-2xl mb-xl">Send us a Message</h3>
            <form onSubmit={(e) => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label className="block text-sm font-bold mb-xs">Name</label>
                <input type="text" className="w-full p-md border rounded-sm" style={{ padding: '0.75rem', width: '100%', border: '1px solid #e6e6e6', borderRadius: '4px' }} placeholder="Your Name" required />
              </div>
              <div>
                <label className="block text-sm font-bold mb-xs">Phone</label>
                <input type="tel" className="w-full p-md border rounded-sm" style={{ padding: '0.75rem', width: '100%', border: '1px solid #e6e6e6', borderRadius: '4px' }} placeholder="Your Phone Number" required />
              </div>
              <div>
                <label className="block text-sm font-bold mb-xs">Message</label>
                <textarea className="w-full p-md border rounded-sm" style={{ padding: '0.75rem', width: '100%', border: '1px solid #e6e6e6', borderRadius: '4px', minHeight: '150px', fontFamily: 'inherit' }} placeholder="How can we help you?" required></textarea>
              </div>
              <button type="submit" className="btn btn-primary" style={{ padding: '1rem', fontSize: '1rem' }}>Send Message</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
