import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users, DollarSign, Shield, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { AuthContext } from '../components/auth/AuthContext';

const CreateEvent = () => {
  const navigate = useNavigate();
  const { isAuthenticated, backendActor, login } = useContext(AuthContext);
  
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    time: '',
    location: '',
    ticketPrice: '',
    totalTickets: '',
    maxResaleMultiplier: '1.5',
    enableWhitelist: false,
    whitelist: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      await login();
      return;
    }

    if (!backendActor) {
      setError('Backend not available');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Convert form data to backend format
      const eventDateTime = new Date(`${formData.date}T${formData.time}`);
      const dateTimestamp = BigInt(Math.floor(eventDateTime.getTime() / 1000));
      
      // Convert ICP to e8s (1 ICP = 100,000,000 e8s)
      const ticketPriceE8s = BigInt(Math.floor(parseFloat(formData.ticketPrice) * 100000000));
      const totalTickets = BigInt(parseInt(formData.totalTickets));
      
      // Parse whitelist if enabled
      let whitelist = [];
      if (formData.enableWhitelist && formData.whitelist.trim()) {
        try {
          whitelist = formData.whitelist
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0);
        } catch (err) {
          setError('Invalid whitelist format');
          setLoading(false);
          return;
        }
      }

      const result = await backendActor.create_event(
        formData.name,
        dateTimestamp,
        formData.location,
        ticketPriceE8s,
        totalTickets,
        formData.maxResaleMultiplier ? [parseFloat(formData.maxResaleMultiplier)] : [],
        whitelist.length > 0 ? [whitelist] : []
      );

      if ('Ok' in result) {
        setSuccess(true);
        setTimeout(() => {
          navigate(`/events/${result.Ok}`);
        }, 2000);
      } else {
        setError(result.Err);
      }
    } catch (err) {
      console.error('Event creation failed:', err);
      setError('Failed to create event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-sm text-center max-w-md">
          <Shield className="h-16 w-16 text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h2>
          <p className="text-gray-600 mb-6">You need to login with Internet Identity to create events.</p>
          <button
            onClick={login}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Login with Internet Identity
          </button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-sm text-center max-w-md">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Event Created Successfully!</h2>
          <p className="text-gray-600 mb-6">Your event has been created on the ICP blockchain.</p>
          <div className="animate-pulse text-blue-600">Redirecting to event page...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
            <h1 className="text-3xl font-bold text-white">Create New Event</h1>
            <p className="text-blue-100 mt-2">Launch your event on the ICP blockchain</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center text-red-700">
                <AlertCircle className="h-5 w-5 mr-3 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Basic Information */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Event Details
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    maxLength={100}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter event name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date *
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time *
                  </label>
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="h-4 w-4 inline mr-1" />
                    Location *
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Event venue or location"
                  />
                </div>
              </div>
            </div>

            {/* Ticketing */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <DollarSign className="h-5 w-5 mr-2" />
                Ticketing
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ticket Price (ICP) *
                  </label>
                  <input
                    type="number"
                    name="ticketPrice"
                    value={formData.ticketPrice}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Users className="h-4 w-4 inline mr-1" />
                    Total Tickets *
                  </label>
                  <input
                    type="number"
                    name="totalTickets"
                    value={formData.totalTickets}
                    onChange={handleInputChange}
                    required
                    min="1"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Resale Multiplier
                  </label>
                  <select
                    name="maxResaleMultiplier"
                    value={formData.maxResaleMultiplier}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">No limit</option>
                    <option value="1.1">1.1x (10% markup)</option>
                    <option value="1.25">1.25x (25% markup)</option>
                    <option value="1.5">1.5x (50% markup)</option>
                    <option value="2.0">2.0x (100% markup)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Whitelist */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Access Control
              </h2>
              
              <div className="space-y-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="enableWhitelist"
                    checked={formData.enableWhitelist}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Enable whitelist (restrict ticket purchases to specific principals)
                  </span>
                </label>

                {formData.enableWhitelist && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Whitelisted Principals (one per line)
                    </label>
                    <textarea
                      name="whitelist"
                      value={formData.whitelist}
                      onChange={handleInputChange}
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="rdmx6-jaaaa-aaaah-qcaiq-cai&#10;rrkah-fqaaa-aaaah-qcaiq-cai&#10;..."
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Enter one principal ID per line. Only these principals will be able to purchase tickets.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Submit */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate('/events')}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating Event...
                  </>
                ) : (
                  'Create Event'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateEvent;