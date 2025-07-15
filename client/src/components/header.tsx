import { RefreshCw, QrCode, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import collegeLogo from "@assets/WhatsApp Image 2025-07-05 at 21.27.43_f0c05f70_1752584744079.jpg";

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b-2 border-college-gold">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-4">
            {/* College Logo */}
            <div className="w-16 h-16 rounded-lg overflow-hidden bg-college-navy flex items-center justify-center">
              <img 
                src={collegeLogo} 
                alt="College Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold college-navy">
                Shri Venkateshwara Padmavathy
              </h1>
              <p className="text-sm text-gray-600">Engineering College</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {/* QR Code for Google Maps access */}
            <div className="hidden md:flex items-center space-x-2">
              <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                <QrCode className="w-6 h-6 text-gray-600" />
              </div>
              <span className="text-sm text-gray-600">Scan for Maps</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
