"use client";

import Link from "next/link";
import { Mail, Phone, MapPin, Instagram, Linkedin, Facebook, Youtube } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0A0A0A] border-t border-white/10 pt-12 sm:pt-16 md:pt-20 pb-8 sm:pb-10 relative z-10 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-16">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 sm:gap-12 md:gap-8 mb-10 sm:mb-16">
          
          {/* Col 1: Brand */}
          <div className="flex flex-col space-y-4 sm:space-y-6 sm:col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-3 sm:gap-4">
              <img src="/VRE%20Logo.png" alt="VeerRacerss Logo" className="h-9 sm:h-11 w-auto object-contain" />
              <span className="text-white font-display font-bold text-base sm:text-lg tracking-[0.15em] uppercase">VeerRacerss Electric</span>
            </Link>
            <p className="text-white/50 text-xs sm:text-sm leading-relaxed max-w-sm font-light">
              Pushing the frontiers of electric motorsport. Official Formula Student team of VSSUT Burla.
            </p>
            <div className="flex gap-3 sm:gap-4 pt-1 sm:pt-2">
              <a href="https://www.linkedin.com/company/veerracerss" target="_blank" rel="noopener noreferrer" className="w-9 h-9 sm:w-10 sm:h-10 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:border-racing-red transition-all" aria-label="LinkedIn">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="https://instagram.com/veerracerss" target="_blank" rel="noopener noreferrer" className="w-9 h-9 sm:w-10 sm:h-10 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:border-racing-red transition-all" aria-label="Instagram">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="https://facebook.com/veerracerss" target="_blank" rel="noopener noreferrer" className="w-9 h-9 sm:w-10 sm:h-10 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:border-racing-red transition-all" aria-label="Facebook">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="https://youtube.com/@veerracerss" target="_blank" rel="noopener noreferrer" className="w-9 h-9 sm:w-10 sm:h-10 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:border-racing-red transition-all" aria-label="YouTube">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="flex flex-col space-y-4 sm:space-y-6 md:pl-8 lg:pl-16">
            <h4 className="text-white font-display font-bold uppercase tracking-widest text-xs sm:text-sm">Quick Links</h4>
            <ul className="space-y-2.5 sm:space-y-3.5 text-xs sm:text-sm">
              <li><Link href="/about" className="text-white/50 hover:text-racing-red transition-colors">About Us</Link></li>
              <li><Link href="/cars" className="text-white/50 hover:text-racing-red transition-colors">The Fleet & Cars</Link></li>
              <li><Link href="/members" className="text-white/50 hover:text-racing-red transition-colors">Team & Squad Roster</Link></li>
              <li><Link href="/achievements" className="text-white/50 hover:text-racing-red transition-colors">Hall of Fame</Link></li>
              <li><Link href="/#partners" className="text-white/50 hover:text-racing-red transition-colors">Sponsors & Partners</Link></li>
            </ul>
          </div>

          {/* Col 3: Contact */}
          <div className="flex flex-col space-y-6">
            <h4 className="text-white font-display font-bold uppercase tracking-widest text-sm">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-4 text-white/50 text-sm group">
                <Mail className="w-5 h-5 text-racing-red mt-0.5 shrink-0 group-hover:scale-110 transition-transform" />
                <a href="mailto:tech@veerracerss.org" className="hover:text-white transition-colors">tech@veerracerss.org</a>
              </li>
              <li className="flex items-start gap-4 text-white/50 text-sm group">
                <Phone className="w-5 h-5 text-racing-red mt-0.5 shrink-0 group-hover:scale-110 transition-transform" />
                <a href="tel:+919967624731" className="hover:text-white transition-colors">+91 9967624731</a>
              </li>
              <li className="flex items-start gap-4 text-white/50 text-sm group">
                <MapPin className="w-5 h-5 text-racing-red mt-0.5 shrink-0 group-hover:scale-110 transition-transform" />
                <span className="leading-relaxed">
                  Veer Surendra Sai University of Technology,<br/>
                  Burla, Sambalpur, Odisha 768018
                </span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/30 text-xs font-mono tracking-widest uppercase">
            &copy; {currentYear} VEERRACERSS ELECTRIC. ALL RIGHTS RESERVED.
          </p>
          <div className="flex gap-6 text-white/30 text-xs font-mono tracking-widest uppercase">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
