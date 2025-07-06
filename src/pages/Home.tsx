import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Zap, Users, CheckCircle, TrendingUp, Globe } from 'lucide-react';

const Home = () => {
  const features = [
    {
      icon: Shield,
      title: 'Fraud Protection',
      description: 'Blockchain-based authentication eliminates counterfeit tickets and ensures authenticity.'
    },
    {
      icon: Zap,
      title: 'No Scalping',
      description: 'Smart contracts prevent unauthorized resale and maintain fair pricing for all fans.'
    },
    {
      icon: Users,
      title: 'Transparent Pricing',
      description: 'All fees and pricing are visible on-chain, ensuring complete transparency.'
    },
    {
      icon: CheckCircle,
      title: 'Instant Verification',
      description: 'Real-time ticket verification through ICP blockchain technology.'
    },
    {
      icon: TrendingUp,
      title: 'Event Analytics',
      description: 'Comprehensive insights and analytics for event organizers.'
    },
    {
      icon: Globe,
      title: 'Global Accessibility',
      description: 'Decentralized platform accessible from anywhere in the world.'
    }
  ];

  const steps = [
    {
      number: '01',
      title: 'Browse Events',
      description: 'Discover events from verified organizers on our transparent marketplace.'
    },
    {
      number: '02',
      title: 'Purchase Tickets',
      description: 'Buy authentic tickets with cryptocurrency through secure smart contracts.'
    },
    {
      number: '03',
      title: 'Get Verified',
      description: 'Receive tokenized tickets that are instantly verifiable on the blockchain.'
    },
    {
      number: '04',
      title: 'Attend Event',
      description: 'Present your verified digital ticket for seamless event entry.'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-emerald-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              The Future of
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-400">
                {' '}Event Ticketing
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-blue-100">
              Revolutionizing event ticketing with blockchain technology. 
              Transparent, fraud-proof, and fan-friendly ticketing for the digital age.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/events"
                className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Browse Events
              </Link>
              <Link
                to="/create-event"
                className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
              >
                Create Event
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">50K+</div>
              <div className="text-gray-600">Events Hosted</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">2M+</div>
              <div className="text-gray-600">Tickets Sold</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-emerald-600 mb-2">99.9%</div>
              <div className="text-gray-600">Fraud Prevention</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-600 mb-2">150+</div>
              <div className="text-gray-600">Countries</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose TicketChain?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the next generation of event ticketing with our revolutionary blockchain-based platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-6">
                  <feature.icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Simple, secure, and transparent - getting your tickets has never been easier.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-full text-xl font-bold mb-6">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Experience the Future?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of event organizers and fans who have already made the switch to secure, transparent ticketing.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/events"
              className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Get Started
            </Link>
            <Link
              to="/verify"
              className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              Verify Ticket
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;