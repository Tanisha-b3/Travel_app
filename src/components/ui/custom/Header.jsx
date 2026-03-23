import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth.jsx';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { toast } from '@/hooks/use-toast';
import MyTrip from '../../ui/trip';
import { FiMenu, FiX, FiMapPin, FiLogOut, FiCompass } from 'react-icons/fi';
import { AuthModal } from './AuthModal';
import { Button } from '@/components/ui/button';

function Header() {
  const { user, logout, isLoading } = useAuth();
  const [showMyTrips, setShowMyTrips] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const getEmailFirstLetter = (email) => {
    return email?.charAt(0).toUpperCase() || 'U';
  };

  const handleLogoClick = () => {
    window.location.href = '/';
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      toast({
        title: 'Goodbye!',
        description: 'You have been logged out',
      });
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: 'Error',
        description: 'Failed to logout',
        variant: 'destructive',
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleMyTripsClick = () => {
    if (!user) {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to view your trips',
        variant: 'destructive',
      });
      return;
    }
    setShowMyTrips(true);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-slate-100">
        <div className="container-app">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <div
              onClick={handleLogoClick}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-200 group-hover:shadow-indigo-300 transition-shadow">
                <FiCompass className="text-white text-xl" />
              </div>
              <span className="text-xl font-bold text-slate-900 hidden sm:block">
                Explora<span className="text-indigo-600">Trails</span>
              </span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
             {user && ( <a
                href="/"
                className="text-slate-600 hover:text-indigo-600 font-medium transition-colors"
              >
                Home
              </a>
             )}
              {user && (
                <a
                  href="/Create-trip"
                  className="text-slate-600 hover:text-indigo-600 font-medium transition-colors"
                >
                  Create Trip
                </a>
              )}
              {user && (
                <button
                  onClick={handleMyTripsClick}
                  className="text-slate-600 hover:text-indigo-600 font-medium transition-colors"
                >
                  My Trips
                </button>
              )}
            </nav>

            {/* Right Side */}
            <div className="flex items-center gap-3">
              {user ? (
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="flex items-center gap-3 p-1.5 pr-4 rounded-full bg-slate-50 hover:bg-slate-100 transition-colors">
                      {user.picture ? (
                        <img
                          src={user.picture}
                          alt="Profile"
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-sm font-semibold">
                          {getEmailFirstLetter(user.email)}
                        </div>
                      )}
                      <span className="text-sm font-medium text-slate-700 hidden sm:block">
                        {user.name?.split(' ')[0] || 'User'}
                      </span>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent
                    align="end"
                    className="w-56 p-2 bg-white rounded-xl shadow-xl border border-slate-100"
                  >
                    <div className="px-3 py-2 border-b border-slate-100 mb-2">
                      <p className="font-medium text-slate-900">{user.name}</p>
                      <p className="text-sm text-slate-500 truncate">{user.email}</p>
                    </div>
                    <button
                      onClick={handleMyTripsClick}
                      className="w-full px-3 py-2 text-left text-slate-700 hover:bg-slate-50 rounded-lg flex items-center gap-2 transition-colors text-sm font-medium"
                    >
                      <FiMapPin size={16} />
                      My Trips
                    </button>
                    <button
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className="w-full px-3 py-2 text-left text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoggingOut ? (
                        <>
                          <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                          Signing out...
                        </>
                      ) : (
                        <>
                          <FiLogOut size={16} />
                          Sign Out
                        </>
                      )}
                    </button>
                  </PopoverContent>
                </Popover>
              ) : (
                <Button
                  onClick={() => setShowAuthModal(true)}
                  disabled={isLoading}
                  className="btn-primary py-2.5 px-5 text-sm"
                >
                  {isLoading ? 'Loading...' : 'Get Started'}
                </Button>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
                aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              >
                {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-slate-100 animate-fade-in">
              <nav className="flex flex-col gap-2">
                <a
                  href="/"
                  className="px-4 py-3 rounded-lg text-slate-700 hover:bg-slate-50 font-medium transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </a>
                <a
                  href="/Create-trip"
                  className="px-4 py-3 rounded-lg text-slate-700 hover:bg-slate-50 font-medium transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Create Trip
                </a>
                {user && (
                  <button
                    onClick={handleMyTripsClick}
                    className="px-4 py-3 rounded-lg text-slate-700 hover:bg-slate-50 font-medium text-left transition-colors"
                  >
                    My Trips
                  </button>
                )}
                {user && (
                  <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 font-medium text-left transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoggingOut ? 'Signing out...' : 'Sign Out'}
                  </button>
                )}
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* My Trips Modal */}
      {showMyTrips && (
        <>
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 animate-fade-in"
            onClick={() => setShowMyTrips(false)}
          />
          <div className="fixed inset-4 md:inset-10 flex items-center justify-center z-50 pointer-events-none">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-full overflow-hidden pointer-events-auto animate-slide-up">
              <div className="sticky top-0 bg-white border-b border-slate-100 p-5 flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">My Trips</h2>
                  <p className="text-sm text-slate-500">Your saved travel plans</p>
                </div>
                <button
                  className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors"
                  onClick={() => setShowMyTrips(false)}
                  aria-label="Close"
                >
                  <FiX size={20} className="text-slate-500" />
                </button>
              </div>
              <div className="overflow-y-auto max-h-[calc(100vh-200px)] p-5">
                <MyTrip />
              </div>
            </div>
          </div>
        </>
      )}

      {/* Auth Modal */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  );
}

export default Header;
