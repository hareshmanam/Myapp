import { useState } from 'react'
import { useAuth } from '../auth'

type ContactMessage = {
  id: string
  name: string
  email: string
  type: 'feedback' | 'inquiry' | 'advertise'
  subject: string
  message: string
  phone?: string
  business_name?: string
  timestamp: string
}

type AdvertiseSubmission = {
  id: string
  business_name: string
  email: string
  phone: string
  message: string
  timestamp: string
}

export default function Contact() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<'contact' | 'advertise'>('contact')
  
  // Contact form state
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    type: 'feedback' as 'feedback' | 'inquiry' | 'advertise',
    subject: '',
    message: '',
  })

  // Advertise form state
  const [advertiseForm, setAdvertiseForm] = useState({
    business_name: '',
    email: '',
    phone: '',
    message: '',
  })

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const message: ContactMessage = {
      id: Date.now().toString(),
      name: contactForm.name,
      email: contactForm.email,
      type: contactForm.type,
      subject: contactForm.subject,
      message: contactForm.message,
      timestamp: new Date().toISOString(),
    }

    // Save to localStorage
    const existing = localStorage.getItem('contact_messages')
    const messages = existing ? JSON.parse(existing) : []
    messages.push(message)
    localStorage.setItem('contact_messages', JSON.stringify(messages))

    alert(`✅ Thank you! Your ${contactForm.type} has been sent to our team.`)
    setContactForm({
      name: '',
      email: '',
      type: 'feedback',
      subject: '',
      message: '',
    })
  }

  const handleAdvertiseSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const submission: AdvertiseSubmission = {
      id: Date.now().toString(),
      business_name: advertiseForm.business_name,
      email: advertiseForm.email,
      phone: advertiseForm.phone,
      message: advertiseForm.message,
      timestamp: new Date().toISOString(),
    }

    // Save to localStorage
    const existing = localStorage.getItem('advertise_submissions')
    const submissions = existing ? JSON.parse(existing) : []
    submissions.push(submission)
    localStorage.setItem('advertise_submissions', JSON.stringify(submissions))

    alert(`✅ Thank you! Your advertising inquiry has been sent. We'll contact you soon at ${advertiseForm.email}`)
    setAdvertiseForm({
      business_name: '',
      email: '',
      phone: '',
      message: '',
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-rt py-12">
        <h1 className="text-4xl font-bold mb-4">📞 Contact Us</h1>
        <p className="text-gray-600 text-lg mb-12">
          Have questions? We'd love to hear from you. Get in touch with the RTC Bliss Drive team.
        </p>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-300">
          <button
            onClick={() => setActiveTab('contact')}
            className={`px-6 py-3 font-bold ${activeTab === 'contact' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
          >
            💬 Contact Us
          </button>
          <button
            onClick={() => setActiveTab('advertise')}
            className={`px-6 py-3 font-bold ${activeTab === 'advertise' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
          >
            🏢 Advertise With Us
          </button>
        </div>

        {/* CONTACT TAB */}
        {activeTab === 'contact' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white p-8 rounded-lg shadow">
              <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    required
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    className="w-full border border-gray-300 p-3 rounded"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    required
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    className="w-full border border-gray-300 p-3 rounded"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Type</label>
                  <select
                    value={contactForm.type}
                    onChange={(e) => setContactForm({ ...contactForm, type: e.target.value as any })}
                    className="w-full border border-gray-300 p-3 rounded"
                  >
                    <option value="feedback">📝 Feedback</option>
                    <option value="inquiry">❓ General Inquiry</option>
                    <option value="advertise">🎯 Advertising Question</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Subject</label>
                  <input
                    type="text"
                    required
                    value={contactForm.subject}
                    onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                    className="w-full border border-gray-300 p-3 rounded"
                    placeholder="Message subject"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Message</label>
                  <textarea
                    required
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    className="w-full border border-gray-300 p-3 rounded"
                    rows={5}
                    placeholder="Your message..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 rounded font-bold hover:bg-blue-700 transition"
                >
                  Send Message
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-8">
              <div className="bg-white p-8 rounded-lg shadow">
                <h3 className="text-2xl font-bold mb-6">Get in Touch</h3>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="font-bold text-lg text-gray-900 mb-2">📞 Phone</h4>
                    <p className="text-gray-600">+1 (555) 123-4567</p>
                    <p className="text-gray-500 text-sm">Available Mon-Fri, 9am-5pm EST</p>
                  </div>

                  <div>
                    <h4 className="font-bold text-lg text-gray-900 mb-2">📧 Email</h4>
                    <p className="text-gray-600">rtcblissdrive@gmail.com</p>
                    <p className="text-gray-500 text-sm">We'll respond within 24 hours</p>
                  </div>

                  <div>
                    <h4 className="font-bold text-lg text-gray-900 mb-2">📍 Office</h4>
                    <p className="text-gray-600">123 Business Ave</p>
                    <p className="text-gray-600">Suite 100</p>
                    <p className="text-gray-600">Tampa, FL 33617</p>
                  </div>

                  <div>
                    <h4 className="font-bold text-lg text-gray-900 mb-2">⏰ Hours</h4>
                    <p className="text-gray-600">Monday - Friday: 9am - 6pm EST</p>
                    <p className="text-gray-600">Saturday: 10am - 4pm EST</p>
                    <p className="text-gray-600">Sunday: Closed</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ADVERTISE TAB */}
        {activeTab === 'advertise' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Advertise Form */}
            <div className="bg-white p-8 rounded-lg shadow">
              <h2 className="text-2xl font-bold mb-2">Become a Partner</h2>
              <p className="text-gray-600 mb-6">
                Fill out the form below and our team will contact you to discuss advertising opportunities.
              </p>
              
              <form onSubmit={handleAdvertiseSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Business Name</label>
                  <input
                    type="text"
                    required
                    value={advertiseForm.business_name}
                    onChange={(e) => setAdvertiseForm({ ...advertiseForm, business_name: e.target.value })}
                    className="w-full border border-gray-300 p-3 rounded"
                    placeholder="Your restaurant/business name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    required
                    value={advertiseForm.email}
                    onChange={(e) => setAdvertiseForm({ ...advertiseForm, email: e.target.value })}
                    className="w-full border border-gray-300 p-3 rounded"
                    placeholder="business@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    required
                    value={advertiseForm.phone}
                    onChange={(e) => setAdvertiseForm({ ...advertiseForm, phone: e.target.value })}
                    className="w-full border border-gray-300 p-3 rounded"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Tell us about your business</label>
                  <textarea
                    required
                    value={advertiseForm.message}
                    onChange={(e) => setAdvertiseForm({ ...advertiseForm, message: e.target.value })}
                    className="w-full border border-gray-300 p-3 rounded"
                    rows={5}
                    placeholder="Describe your business and why you'd like to advertise with us..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-green-600 text-white py-3 rounded font-bold hover:bg-green-700 transition"
                >
                  Submit Advertising Inquiry
                </button>
              </form>
            </div>

            {/* Advertise Benefits */}
            <div className="space-y-8">
              <div className="bg-white p-8 rounded-lg shadow">
                <h3 className="text-2xl font-bold mb-6">Why Advertise With Us?</h3>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">👥</span>
                    <div>
                      <h4 className="font-bold text-gray-900">Reach Driving Enthusiasts</h4>
                      <p className="text-gray-600 text-sm">Target new drivers and test takers in your area</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="text-2xl">📍</span>
                    <div>
                      <h4 className="font-bold text-gray-900">Local Visibility</h4>
                      <p className="text-gray-600 text-sm">Featured prominently on our platform with location details</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="text-2xl">📱</span>
                    <div>
                      <h4 className="font-bold text-gray-900">Digital Presence</h4>
                      <p className="text-gray-600 text-sm">Include menu links and special offers</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="text-2xl">💼</span>
                    <div>
                      <h4 className="font-bold text-gray-900">Flexible Packages</h4>
                      <p className="text-gray-600 text-sm">Customizable advertising solutions for your budget</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="text-2xl">📊</span>
                    <div>
                      <h4 className="font-bold text-gray-900">Analytics</h4>
                      <p className="text-gray-600 text-sm">Track engagement and see how many people visit your ad</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 p-8 rounded-lg">
                <h3 className="font-bold text-lg text-blue-900 mb-3">📧 Questions?</h3>
                <p className="text-blue-800 text-sm mb-4">
                  Email us at <span className="font-bold">partners@rtcblissdrive.com</span> or call <span className="font-bold">+1 (555) 456-7890</span>
                </p>
                <p className="text-blue-800 text-sm">
                  We look forward to partnering with you!
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
