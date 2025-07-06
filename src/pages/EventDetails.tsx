import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, Users, Shield, Star, Clock, Share2, Heart } from 'lucide-react';
import { AuthContext } from '../components/auth/AuthContext';
import PurchaseButton from '../components/tickets/PurchaseButton';

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTicketType, setSelectedTicketType] = useState(null);
  const { backendActor, isAuthenticated } = useContext(AuthContext);

  // Mock event data - replace with actual backend call
  const mockEvent = {
    id: 1,
    title: 'Electronic Music Festival 2024',
    date: '2024-06-15',
    time: '18:00',
    location: 'Central Park, New York',
    category: 'music',
    image: 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=800',
    attendees: 2500,
    verified: true,
    rating: 4.8,
    organizer: 'MusicEvents Pro',
    description: 'Experience the best electronic music artists in a stunning outdoor setting. This festival brings together world-renowned DJs and producers for an unforgettable night of music, lights, and energy.',
    longDescription: 'The Electronic Music Festival 2024 is set to be the most spectacular event of the year, featuring multiple stages, immersive art installations, and cutting-edge sound systems. Join thousands of music lovers for an experience that transcends the ordinary.',
    venue: {
      name: 'Central Park Main Stage',
      address: '1 Central Park West, New York, NY 10023',
      capacity: 2500,
      amenities: ['Food & Beverages', 'Parking', 'Restrooms', 'Accessibility']
    },
    ticketTypes: [
      {
        id: 1,
        name: 'General Admission',
        price: 89,
        description: 'Access to main stage area and festival grounds',
        available: 150,
        perks: ['Festival Entry', 'Access to Food Courts', 'Restroom Access']
      },
      {
        id: 2,
        name: 'VIP Experience',
        price: 199,
        description: 'Premium viewing area with exclusive amenities',
        available: 45,
        perks: ['Premium Viewing Area', 'Complimentary Drinks', 'VIP Restrooms', 'Meet & Greet']
      },
      {
        id: 3,
        name: 'Backstage Pass',
        price: 399,
        description: 'Exclusive backstage access and artist meet & greet',
        available: 10,
        perks: ['Backstage Access', 'Artist Meet & Greet', 'Professional Photos', 'Exclusive Merchandise']
      }
    ],
    lineup: ['DJ Shadow', 'Tiësto', 'Deadmau5', 'Skrillex', 'Above & Beyond'],
    schedule: [
      { time: '18:00', artist: 'Opening Act' },
      { time: '19:00', artist: 'DJ Shadow' },
      { time: '20:30', artist: 'Tiësto' },
      { time: '22:00', artist: 'Deadmau5' },
      { time: '23:30', artist: 'Skrillex' },
      { time: '01:00', artist: 'Above & Beyond' }
    ]
  };

  useEffect(() => {
    const loadEvent = async () => {
      setLoading(true);
      try {
        // TODO: Replace with actual backend call
        // const eventData = await backendActor.getEvent(id);
        setEvent(mockEvent);
        setSelectedTicketType(mockEvent.ticketTypes[0]);
      } catch (error) {
        console.error('Error loading event:', error);
        setEvent(mockEvent);
        setSelectedTicketType(mockEvent.ticketTypes[0]);
      } finally {
        setLoading(false);
      }
    };

    loadEvent();
  }, [id, backendActor]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric',
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Event Not Found</h2>
          <p className="text-gray-600 mb-6">The event you're looking for doesn't exist.</p>
          <Link
            to="/events"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Events
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            to="/events"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Events
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative">
        <div className="h-64 md:h-96 bg-gradient-to-r from-blue-600 to-purple-600 overflow-hidden">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover mix-blend-overlay"
          />
        </div>
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-white">
            <div className="flex items-center space-x-4 mb-4">
              {event.verified && (
                <span className="inline-flex items-center px-3 py-1 bg-green-500 text-white text-sm font-medium rounded-full">
                  <Shield className="h-4 w-4 mr-1" />
                  Verified Event
                </span>
              )}
              <span className="inline-flex items-center px-3 py-1 bg-white bg-opacity-20 text-white text-sm font-medium rounded-full">
                <Star className="h-4 w-4 mr-1" />
                {event.rating} Rating
              </span>
              <span className="inline-block px-3 py-1 bg-white bg-opacity-20 text-white text-sm rounded-full capitalize">
                {event.category}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{event.title}</h1>
            <p className="text-xl text-gray-200 mb-6">{event.description}</p>
            <div className="flex flex-wrap gap-6 text-sm">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                <span>{formatDate(event.date)} at {event.time}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                <span>{event.location}</span>
              </div>
              <div className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                <span>{event.attendees.toLocaleString()} expected</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About */}
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">About This Event</h2>
              <p className="text-gray-600 mb-6">{event.longDescription}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Venue Information</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>{event.venue.name}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2" />
                      <span>Capacity: {event.venue.capacity.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Amenities</h3>
                  <div className="flex flex-wrap gap-2">
                    {event.venue.amenities.map((amenity, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Lineup */}
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Lineup</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {event.lineup.map((artist, index) => (
                  <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-3 flex items-center justify-center text-white font-bold">
                      {artist.charAt(0)}
                    </div>
                    <h3 className="font-semibold text-gray-900">{artist}</h3>
                  </div>
                ))}
              </div>
            </div>

            {/* Schedule */}
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Schedule</h2>
              <div className="space-y-4">
                {event.schedule.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 text-gray-400 mr-3" />
                      <span className="font-medium text-gray-900">{item.time}</span>
                    </div>
                    <span className="text-gray-600">{item.artist}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Ticket Selection */}
            <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-4">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Select Tickets</h3>
              <div className="space-y-4">
                {event.ticketTypes.map((ticketType) => (
                  <div
                    key={ticketType.id}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                      selectedTicketType?.id === ticketType.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedTicketType(ticketType)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-gray-900">{ticketType.name}</h4>
                      <span className="text-xl font-bold text-gray-900">${ticketType.price}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{ticketType.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        {ticketType.available} available
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {selectedTicketType && (
                <div className="mt-6 space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Included Perks</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {selectedTicketType.perks.map((perk, index) => (
                        <li key={index} className="flex items-center">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                          {perk}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <PurchaseButton
                    event={event}
                    ticketType={selectedTicketType}
                    isAuthenticated={isAuthenticated}
                  />
                </div>
              )}
            </div>

            {/* Event Info */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Event Information</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Organizer</span>
                  <span className="font-medium text-gray-900">{event.organizer}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Category</span>
                  <span className="font-medium text-gray-900 capitalize">{event.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Expected Attendees</span>
                  <span className="font-medium text-gray-900">{event.attendees.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Verification Status</span>
                  <span className="inline-flex items-center text-green-600">
                    <Shield className="h-4 w-4 mr-1" />
                    Verified
                  </span>
                </div>
              </div>
            </div>

            {/* Share */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Share Event</h3>
              <div className="flex space-x-3">
                <button className="flex-1 flex items-center justify-center py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </button>
                <button className="flex-1 flex items-center justify-center py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Heart className="h-4 w-4 mr-2" />
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;