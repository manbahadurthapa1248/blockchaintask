import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, Filter, Search, Shield, Star, Clock, AlertCircle } from 'lucide-react';
import { AuthContext } from '../components/auth/AuthContext';

const Events = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { backendActor } = useContext(AuthContext);

  const categories = [
    { id: 'all', name: 'All Events' },
    { id: 'music', name: 'Music' },
    { id: 'sports', name: 'Sports' },
    { id: 'comedy', name: 'Comedy' },
    { id: 'arts', name: 'Arts & Culture' },
    { id: 'business', name: 'Business' },
  ];

  useEffect(() => {
    loadEvents();
  }, [backendActor]);

  const loadEvents = async () => {
    if (!backendActor) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Since there's no get_all_events function, we'll show mock data
      // In a real implementation, you'd need to add a get_all_events function to your backend
      const mockEvents = [
        {
          id: 'event_1',
          name: 'Electronic Music Festival 2024',
          date: BigInt(Math.floor(Date.now() / 1000) + 86400 * 30), // 30 days from now
          location: 'Central Park, New York',
          organizer: 'rdmx6-jaaaa-aaaah-qcaiq-cai', // Example principal
          ticket_price: BigInt(89000000), // 0.89 ICP in e8s
          max_resale_multiplier: [1.5],
          total_tickets: BigInt(2500),
          tickets_sold: BigInt(350),
          funds_collected: BigInt(31150000000), // 311.5 ICP in e8s
          whitelist: [],
          // Frontend display properties
          category: 'music',
          image: 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=400',
          verified: true,
          rating: 4.8,
          description: 'Experience the best electronic music artists in a stunning outdoor setting.',
        },
        {
          id: 'event_2',
          name: 'Champions League Final',
          date: BigInt(Math.floor(Date.now() / 1000) + 86400 * 45), // 45 days from now
          location: 'Wembley Stadium, London',
          organizer: 'rdmx6-jaaaa-aaaah-qcaiq-cai',
          ticket_price: BigInt(299000000), // 2.99 ICP in e8s
          max_resale_multiplier: [2.0],
          total_tickets: BigInt(90000),
          tickets_sold: BigInt(89975),
          funds_collected: BigInt(26897525000000), // 268975.25 ICP in e8s
          whitelist: [],
          category: 'sports',
          image: 'https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg?auto=compress&cs=tinysrgb&w=400',
          verified: true,
          rating: 4.9,
          description: 'The biggest football match of the year featuring Europe\'s top teams.',
        },
        {
          id: 'event_3',
          name: 'Tech Conference 2024',
          date: BigInt(Math.floor(Date.now() / 1000) + 86400 * 60), // 60 days from now
          location: 'San Francisco Convention Center',
          organizer: 'rdmx6-jaaaa-aaaah-qcaiq-cai',
          ticket_price: BigInt(150000000), // 1.5 ICP in e8s
          max_resale_multiplier: [1.2],
          total_tickets: BigInt(5000),
          tickets_sold: BigInt(1200),
          funds_collected: BigInt(180000000000), // 1800 ICP in e8s
          whitelist: [],
          category: 'business',
          image: 'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=400',
          verified: true,
          rating: 4.7,
          description: 'Join industry leaders for the latest in technology and innovation.',
        },
        {
          id: 'event_4',
          name: 'Comedy Night Special',
          date: BigInt(Math.floor(Date.now() / 1000) + 86400 * 15), // 15 days from now
          location: 'Comedy Club Downtown',
          organizer: 'rdmx6-jaaaa-aaaah-qcaiq-cai',
          ticket_price: BigInt(35000000), // 0.35 ICP in e8s
          max_resale_multiplier: [1.3],
          total_tickets: BigInt(200),
          tickets_sold: BigInt(180),
          funds_collected: BigInt(6300000000), // 63 ICP in e8s
          whitelist: [],
          category: 'comedy',
          image: 'https://images.pexels.com/photos/713149/pexels-photo-713149.jpeg?auto=compress&cs=tinysrgb&w=400',
          verified: true,
          rating: 4.6,
          description: 'An evening of laughter with top comedians.',
        },
      ];
      
      setEvents(mockEvents);
    } catch (error) {
      console.error('Error loading events:', error);
      setError('Failed to load events. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const formatDate = (timestamp) => {
    const date = new Date(Number(timestamp) * 1000);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatPrice = (priceInE8s) => {
    const icp = Number(priceInE8s) / 100000000; // Convert e8s to ICP
    return `From ${icp.toFixed(2)} ICP`;
  };

  const formatAttendees = (totalTickets, ticketsSold) => {
    return `${Number(totalTickets - ticketsSold)} available`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Discover Amazing Events
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Find verified, authentic events with blockchain-secured tickets
            </p>
          </div>

          {/* Search and Filter */}
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search events, locations..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-gray-400" />
                <select
                  className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            {filteredEvents.length} Events Found
          </h2>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Shield className="h-4 w-4 text-green-600" />
            <span>All events verified on ICP blockchain</span>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8 flex items-center text-red-700">
            <AlertCircle className="h-5 w-5 mr-3 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {filteredEvents.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search or filter criteria</p>
            <Link
              to="/create-event"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Your First Event
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event) => (
              <div key={event.id} className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                <div className="relative">
                  <img
                    src={event.image}
                    alt={event.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 left-4 flex items-center space-x-2">
                    {event.verified && (
                      <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                        <Shield className="h-3 w-3 mr-1" />
                        Verified
                      </span>
                    )}
                    <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                      <Star className="h-3 w-3 mr-1" />
                      {event.rating}
                    </span>
                  </div>
                  <div className="absolute bottom-4 right-4 bg-white bg-opacity-90 px-2 py-1 rounded-lg">
                    <span className="text-sm font-medium text-gray-900">{formatPrice(event.ticket_price)}</span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full capitalize">
                      {event.category}
                    </span>
                    <span className="text-sm text-gray-500">ICP Event</span>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                    {event.name}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {event.description}
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>{formatDate(event.date)}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="h-4 w-4 mr-2" />
                      <span>{Number(event.total_tickets).toLocaleString()} capacity</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>{formatAttendees(event.total_tickets, event.tickets_sold)}</span>
                    </div>
                  </div>

                  <Link
                    to={`/events/${event.id}`}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium text-center block"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Events;