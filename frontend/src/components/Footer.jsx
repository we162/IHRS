import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, ArrowRight } from 'lucide-react';

const Footer = ({ settings }) => {
  return (
    <footer className="bg-primary pt-24 pb-12 border-t-[1px] border-accent/30 relative">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-16">

          <div className="space-y-6">
            <a href="#home" className="text-3xl font-bold font-heading text-white flex items-center gap-2">
              <img src="/logo.png" alt="IHRS Logo" className="w-10 h-10 object-contain drop-shadow-lg filter invert-[1]" />
              <span className="text-accent italic uppercase">{settings.clubName?.split(' ')[0] || 'IHRS'}</span> <span className="uppercase">{settings.clubName?.split(' ').slice(1).join(' ')}</span>
            </a>
            <p className="text-white/60 text-sm leading-loose">
              Setting the standard for premium equestrian experiences. Where passion for riding meets the highest levels of performance and care.
            </p>
          </div>

          <div className="space-y-6">
            <h4 className="text-white font-heading text-xl uppercase tracking-wider mb-2">Quick Links</h4>
            <ul className="space-y-4">
              {['Home', 'About Us', 'Experiences', 'Gallery', 'Book a Ride'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-white/60 hover:text-accent transition-colors text-sm flex items-center gap-2 group">
                    <ArrowRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-white font-heading text-xl uppercase tracking-wider mb-2">Contact Info</h4>
            <ul className="space-y-4 text-sm text-white/60 leading-relaxed">
              <li className="whitespace-pre-line">{settings.address}</li>
              <li className="pt-2">
                <a href={`tel:${settings.phone}`} className="hover:text-accent transition-colors block">{settings.phone}</a>
                <a href={`mailto:${settings.email}`} className="hover:text-accent transition-colors block">{settings.email}</a>
              </li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-white font-heading text-xl uppercase tracking-wider mb-2">Newsletter</h4>
            <p className="text-white/60 text-sm">Subscribe for updates on our exclusive events and offers.</p>
            <form className="relative mt-4">
              <input
                type="email"
                placeholder="Your email address"
                className="w-full bg-dark border border-light-gray rounded-full px-6 py-4 text-sm text-white placeholder-white/30 focus:outline-none focus:border-accent transition-colors"
              />
              <button
                type="button"
                className="absolute right-2 top-2 bottom-2 bg-accent hover:bg-accent-light text-white rounded-full px-6 text-sm font-semibold transition-colors"
              >
                Join
              </button>
            </form>

            <div className="flex gap-4 pt-4">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, idx) => (
                <a
                  key={idx}
                  href="#"
                  className="w-10 h-10 rounded-full bg-dark border border-light-gray flex items-center justify-center text-white/70 hover:bg-accent hover:border-accent hover:text-white transition-all duration-300 shadow-[0_4px_10px_rgba(0,0,0,0.5)]"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-light-gray/30 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/40 tracking-wider">
          <p>&copy; {new Date().getFullYear()} {settings.clubName}. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
