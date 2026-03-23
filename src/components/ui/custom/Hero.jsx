import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { AuthModal } from './AuthModal';
import { FiMapPin, FiCalendar, FiDollarSign, FiUsers, FiArrowRight, FiStar, FiGlobe, FiCompass } from 'react-icons/fi';
import './Hero.css';

function Hero() {
  const [open, setOpen] = useState(false);
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const destinationsSectionRef = useRef(null);

  useEffect(() => {
    // Only redirect after auth check is complete
    if (!isLoading && user) {
      navigate('/Create-trip');
    }
  }, [user, isLoading, navigate]);

  const handleGetStartedClick = () => {
    if (user) {
      navigate('/Create-trip');
    } else {
      setOpen(true);
    }
  };

  const handleExploreDestinations = () => {
    destinationsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const features = [
    { icon: FiMapPin, title: "Smart Destinations", desc: "AI-powered recommendations" },
    { icon: FiCalendar, title: "Custom Itineraries", desc: "Day-by-day planning" },
    { icon: FiDollarSign, title: "Budget Friendly", desc: "Options for every wallet" },
    { icon: FiUsers, title: "Group Ready", desc: "Solo to family trips" },
  ];

  const destinations = [
    { name: "Paris", country: "France", image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400" },
    { name: "Tokyo", country: "Japan", image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400" },
    { name: "Bali", country: "Indonesia", image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400" },
    { name: "New York", country: "USA", image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" style={{ animationDelay: '2s' }}></div>

        <div className="container-app relative pt-20 pb-32">
          <div className="max-w-5xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4  m-2 py-2 rounded-full bg-indigo-50 border border-indigo-100 mb-8 animate-fade-in">
              <FiStar className="text-indigo-600" />
              <span className="text-sm font-medium text-indigo-700 ">AI-Powered Travel Planning</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 mb-6 animate-slide-up leading-tight">
              Plan Your Dream Trip
              <span className="block mt-2 gradient-text">in Seconds</span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-slate-600 mb-10 max-w-3xl mx-auto animate-slide-up stagger-1 leading-relaxed">
              Let AI craft the perfect itinerary tailored to your interests, budget, and travel style. Your next adventure starts here.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up stagger-2">
              <button
                onClick={handleGetStartedClick}
                className="btn-primary text-lg px-8 py-4 flex items-center justify-center gap-2 group"
              >
                Start Planning Free
                <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={handleExploreDestinations}
                className="btn-secondary text-lg px-8 py-4 flex items-center justify-center gap-2"
              >
                <FiCompass />
                Explore Destinations
              </button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 mt-16 animate-fade-in stagger-3">
              <div className="text-center">
                <div className="text-3xl font-bold text-slate-900">10K+</div>
                <div className="text-slate-500">Trips Created</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-slate-900">50+</div>
                <div className="text-slate-500">Countries</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-slate-900">4.9</div>
                <div className="text-slate-500">User Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container-app">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Why Choose ExploraTrails?
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Everything you need to plan the perfect trip, powered by artificial intelligence
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="card p-6 text-center group hover:bg-indigo-50 transition-colors"
              >
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-indigo-100 flex items-center justify-center group-hover:bg-indigo-600 transition-colors">
                  <feature.icon className="text-2xl text-indigo-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-semibold text-lg text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-500">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section ref={destinationsSectionRef} className="py-20 bg-slate-50">
        <div className="container-app">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                Popular Destinations
              </h2>
              <p className="text-slate-600">Explore trending places loved by travelers</p>
            </div>
            <button
              onClick={handleExploreDestinations}
              className="hidden md:flex items-center gap-2 text-indigo-600 font-semibold hover:gap-3 transition-all"
            >
              View All <FiArrowRight />
            </button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {destinations.map((dest, index) => (
              <div
                key={index}
                onClick={handleGetStartedClick}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleGetStartedClick();
                  }
                }}
                className="relative group cursor-pointer overflow-hidden rounded-2xl aspect-[3/4]"
              >
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                  <h3 className="text-xl md:text-2xl font-bold text-white">{dest.name}</h3>
                  <p className="text-white/80 flex items-center gap-1">
                    <FiGlobe size={14} /> {dest.country}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="container-app text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
            Join thousands of travelers who have discovered their perfect trips with AI
          </p>
          <button
            onClick={handleGetStartedClick}
            className="bg-white text-indigo-600 font-semibold text-lg px-8 py-4 rounded-xl hover:bg-opacity-90 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Create Your Free Itinerary
          </button>
        </div>
      </section>

      <AuthModal isOpen={open} onClose={() => setOpen(false)} />
    </div>
  );
}

export default Hero;
