import React from 'react';
import HeroCarousel from '../components/HeroCarousel';

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-teal-900/20 z-10" />
        <HeroCarousel />
        <div className="relative z-20 text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-teal-400 via-blue-400 to-purple-400 text-transparent bg-clip-text">
            Bounce back from missed Calls!
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Studies show that the average small business loses $150-$250 per missed call. Stop missing out, sign up today!
          </p>
        </div>
      </div>

      {/* New Content Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-12 text-center bg-gradient-to-r from-teal-400 to-purple-400 text-transparent bg-clip-text">
          Never Miss Another Opportunity
        </h2>
        
        {/* Benefits Section */}
        <div className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 hover:border-purple-500 transition-all">
              <div className="text-purple-400 text-2xl mb-4">⚡</div>
              <h3 className="text-xl font-bold mb-2">Instant Response</h3>
              <p className="text-gray-300">Automatically send a text message to callers within seconds of a missed call, letting them know you'll get back to them soon.</p>
            </div>
            
            <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 hover:border-teal-500 transition-all">
              <div className="text-teal-400 text-2xl mb-4">💼</div>
              <h3 className="text-xl font-bold mb-2">Boost Conversions</h3>
              <p className="text-gray-300">Convert up to 80% more missed calls into actual business with our proven callback system.</p>
            </div>
            
            <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 hover:border-blue-500 transition-all">
              <div className="text-blue-400 text-2xl mb-4">📊</div>
              <h3 className="text-xl font-bold mb-2">Track Performance</h3>
              <p className="text-gray-300">Get detailed analytics on your missed calls, callback rates, and conversion metrics all in one dashboard.</p>
            </div>
          </div>
          
          <div className="text-center max-w-3xl mx-auto mb-12">
            <p className="text-xl text-gray-200 mb-6">
              Our missed call text service helps you recover potentially lost business by immediately engaging with callers who couldn't reach you. Set up personalized messages, schedule follow-ups, and never lose another lead.
            </p>
            <button className="bg-gradient-to-r from-purple-500 to-teal-500 text-white font-bold py-3 px-8 rounded-full hover:from-purple-600 hover:to-teal-600 transition-all">
              Start Your Free Trial
            </button>
          </div>
        </div>
        
        {/* Testimonials Section */}
        <div>
          <h3 className="text-2xl font-bold mb-8 text-center">What Our Clients Say</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-xl font-bold mr-4">SB</div>
                <div>
                  <p className="font-bold">Sarah Benson</p>
                  <p className="text-sm text-gray-400">Dental Practice Owner</p>
                </div>
              </div>
              <p className="text-gray-300 italic">"We were missing at least 15 calls per week during busy periods. Since using this service, we've recovered about 70% of those missed opportunities, adding an estimated $4,000 in monthly revenue."</p>
            </div>
            
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center text-xl font-bold mr-4">JL</div>
                <div>
                  <p className="font-bold">James Liu</p>
                  <p className="text-sm text-gray-400">Real Estate Agent</p>
                </div>
              </div>
              <p className="text-gray-300 italic">"In real estate, responding quickly is everything. This service has helped me close three additional deals in just the first month by connecting with clients who called while I was showing properties."</p>
            </div>
            
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-xl font-bold mr-4">AP</div>
                <div>
                  <p className="font-bold">Alex Patel</p>
                  <p className="text-sm text-gray-400">Auto Shop Manager</p>
                </div>
              </div>
              <p className="text-gray-300 italic">"Our mechanics are often too busy to answer the phone. Now when we miss a call, customers get an immediate text, and we've seen a 65% reduction in customers going to competitors."</p>
            </div>
            
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-xl font-bold mr-4">MT</div>
                <div>
                  <p className="font-bold">Maria Torres</p>
                  <p className="text-sm text-gray-400">Salon Owner</p>
                </div>
              </div>
              <p className="text-gray-300 italic">"The automated follow-up system has been a game-changer. We're booking 30% more appointments because we're catching clients who call after hours or when we're with other customers."</p>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <a href="/pricing" className="text-teal-400 font-bold underline hover:text-teal-300 transition-all">View our pricing plans →</a>
          </div>
        </div>
      </div>
    </div>
  );
}
