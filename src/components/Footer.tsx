import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-white py-16">
      <div className="container-rt">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Column 1: Logo & Description */}
          <div>
            <div className="mb-4">
              <img 
                src="https://uat-rtcblissdrive.vercel.app/bliss_drive.png" 
                alt="RTC BLISS DRIVE" 
                className="h-16 w-auto"
              />
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mb-6">
              Drive Confidently with RTC BLISS DRIVE and prepare yourself for 
              future opportunities while ensuring safe driving skills.
            </p>
            {/* Social Media */}
            <div className="flex gap-4">
              <a 
                href="#" 
                className="text-gray-400 hover:text-white transition text-xl"
                aria-label="LinkedIn"
              >
        
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-6 text-white">Quick Links</h4>
            <nav className="space-y-3">
              <Link to="/about" className="text-gray-300 hover:text-white transition text-sm">
                About Us
              </Link><br/>
              <Link to="#" className="text-gray-300 hover:text-white transition text-sm">
                Services
              </Link><br/>
              <Link to="#" className="text-gray-300 hover:text-white transition text-sm">
                Drive With Us
              </Link><br/>
              <Link to="/contact" className="text-gray-300 hover:text-white transition text-sm">
                Contact
              </Link>
            </nav>
          </div>

          {/* Column 3: Contact Info */}
          <div>
            <h4 className="font-bold text-lg mb-6 text-white">Contact Info</h4>
            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <span className="text-lg">📞</span>
                <div>
                  <p className="text-gray-300">+1 (555) 123-4567</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-lg">📧</span>
                <div>
                  <p className="text-gray-300">rtcblissdrive@gmail.com</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-lg">📍</span>
                <div>
                  <p className="text-gray-300">123 Business Ave</p>
                  <p className="text-gray-300">Suite 100</p>
                  <p className="text-gray-300">Tampa, FL 33617</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 pt-8">
          <p className="text-gray-400 text-center text-sm">
            © 2025 RTC BlissDrive. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
