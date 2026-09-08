'use client';

import React, { useState, useCallback } from 'react';
import { X } from 'lucide-react';

const WhatsAppSVG = React.memo(function WhatsAppSVG({ className = '' }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
    </svg>
  );
});

function WhatsAppButton() {
  const [isOpen, setIsOpen] = useState(false);
  const phoneNumber = '8179124566';
  const message = 'Hello! I would like to know more about your services ';

  const handleWhatsAppClick = useCallback(() => {
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  }, []);

  return (
    <>
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-center gap-3">
        {/* Chat bubble */}
        {isOpen && (
          <div className="absolute bottom-[5rem] right-0 bg-white rounded-2xl shadow-2xl p-4 w-80">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white">
                  <WhatsAppSVG className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">Adyapan Support</p>
                  <p className="text-xs text-gray-500">Typically replies instantly</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-gray-50 rounded-xl p-3 mb-3">
              <p className="text-sm text-gray-700">
                Hi there! How can we help you today? Feel free to ask us anything about our courses and services.
              </p>
            </div>

            <button
              onClick={handleWhatsAppClick}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <WhatsAppSVG className="w-5 h-5" />
              Chat on WhatsApp
            </button>
          </div>
        )}

        {/* Main WhatsApp Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-16 h-16 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center relative"
          title="Chat with us on WhatsApp"
        >
          <WhatsAppSVG className="w-8 h-8" />
        </button>
      </div>
    </>
  );
}

export default React.memo(WhatsAppButton);
