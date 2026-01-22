import React, { useState } from 'react';
import { Menu, X, HeartHandshake } from 'lucide-react';
import { COMPANY_INFO, NAVIGATION_LINKS } from '../constants';

interface NavbarProps {
  onFormClick: (e: React.MouseEvent) => void;
  onLogoClick: (e: React.MouseEvent) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onFormClick, onLogoClick }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed w-full z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          
          {/* Logo Section */}
          <button 
            onClick={onLogoClick}
            className="flex-shrink-0 flex items-center gap-2 md:gap-3 hover:opacity-80 transition-opacity outline-none"
          >
            <div className="bg-primary-600 p-1.5 md:p-2 rounded-lg">
                <HeartHandshake className="h-6 w-6 md:h-8 md:w-8 text-white" />
            </div>
            <span className="font-bold text-lg md:text-2xl text-primary-900 tracking-tight whitespace-nowrap">
              {COMPANY_INFO.name}
            </span>
          </button>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8 space-x-reverse">
            {NAVIGATION_LINKS.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-slate-600 hover:text-primary-600 font-medium transition-colors"
              >
                {link.name}
              </a>
            ))}
            <button
              onClick={onFormClick}
              className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2.5 rounded-full font-bold shadow-lg shadow-primary-500/30 transition-all hover:scale-105"
            >
              تقديم الطلب
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-600 hover:text-primary-600 p-2 outline-none touch-manipulation"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-6 h-6" /> : <Menu className="h-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div 
        className={`md:hidden bg-white border-t border-slate-100 absolute w-full shadow-xl transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
        } overflow-hidden`}
      >
        <div className="px-4 pt-2 pb-8 space-y-1">
          {NAVIGATION_LINKS.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="block px-4 py-4 text-base font-bold text-slate-700 hover:text-primary-600 hover:bg-slate-50 border-b border-slate-50 last:border-0"
            >
              {link.name}
            </a>
          ))}
          <div className="pt-6 px-2">
            <button
              onClick={(e) => {
                setIsOpen(false);
                onFormClick(e);
              }}
              className="block w-full text-center bg-primary-600 text-white px-5 py-4 rounded-xl font-bold shadow-lg shadow-primary-600/20 outline-none active:scale-95 transition-transform"
            >
              تقديم الطلب الآن
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;