import React, { useState, useContext } from 'react';
import { Shield, Search, CheckCircle, XCircle, Loader2, AlertCircle } from 'lucide-react';
import { AuthContext } from '../components/auth/AuthContext';

const Verify = () => {
  const [ticketId, setTicketId] = useState('');
  const [verificationResult, setVerificationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { backendActor } = useContext(AuthContext);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!ticketId.trim()) {
      setError('Please enter a ticket ID');
      return;
    }

    if (!backendActor) {
      setError('Backend not available');
      return;
    }

    setLoading(true);
    setError(null);
    setVerificationResult(null);

    try {
      const ticketIdBigInt = BigInt(ticketId);
      const result = await backendActor.get_ticket(ticketIdBigInt);
      
      if ('Ok' in result) {
        const ticket = result.Ok;
        
        // Get event details
        const eventResult = await backendActor.get_event(ticket.metadata.event_id);
        
        if ('Ok' in eventResult) {
          setVerificationResult({
            valid: true,
            ticket,
            event: eventResult.Ok,
          });
        } else {
          setVerificationResult({
            valid: false,
            error: 'Event not found',
          });
        }
      } else {
        setVerificationResult({
          valid: false,
          error: result.Err,
        });
      }
    } catch (err) {
      console.error('Verification failed:', err);
      setError('Verification failed. Please check the ticket ID and try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(Number(timestamp) * 1000);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric',
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (priceInE8s) => {
    const icp = Number(priceInE8s) / 100000000;
    return `${icp.toFixed(2)} ICP`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-blue-100 rounded-full">
              <Shield className="h-12 w-12 text-blue-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Ticket Verification
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Verify the authenticity of any ticket using our blockchain-based verification system
          </p>
        </div>

        {/* Verification Form */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
          <form onSubmit={handleVerify} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ticket ID
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={ticketId}
                  onChange={(e) => setTicketId(e.target.value)}
                  placeholder="Enter ticket ID (e.g., 1, 2, 3...)"
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center text-red-700">
                <AlertCircle className="h-5 w-5 mr-3 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <Shield className="h-5 w-5 mr-2" />
                  Verify Ticket
                </>
              )}
            </button>
          </form>
        </div>

        {/* Verification Result */}
        {verificationResult && (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className={`p-6 ${verificationResult.valid ? 'bg-green-50 border-b border-green-200' : 'bg-red-50 border-b border-red-200'}`}>
              <div className="flex items-center">
                {verificationResult.valid ? (
                  <>
                    <CheckCircle className="h-8 w-8 text-green-600 mr-3" />
                    <div>
                      <h2 className="text-xl font-bold text-green-900">Ticket Verified ✓</h2>
                      <p className="text-green-700">This ticket is authentic and valid</p>
                    </div>
                  </>
                ) : (
                  <>
                    <XCircle className="h-8 w-8 text-red-600 mr-3" />
                    <div>
                      <h2 className="text-xl font-bold text-red-900">Verification Failed ✗</h2>
                      <p className="text-red-700">{verificationResult.error || 'This ticket is not valid'}</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {verificationResult.valid && verificationResult.ticket && verificationResult.event && (
              <div className="p-6 space-y-6">
                {/* Ticket Details */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Ticket Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">Ticket ID</p>
                      <p className="font-semibold text-gray-900">#{Number(verificationResult.ticket.id)}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">Owner</p>
                      <p className="font-mono text-sm text-gray-900">
                        {verificationResult.ticket.owner.toString().slice(0, 20)}...
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">Original Price</p>
                      <p className="font-semibold text-gray-900">
                        {formatPrice(verificationResult.ticket.original_price)}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">Transfer Count</p>
                      <p className="font-semibold text-gray-900">
                        {verificationResult.ticket.transfer_history.length} transfers
                      </p>
                    </div>
                  </div>
                </div>

                {/* Event Details */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Details</h3>
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
                    <h4 className="text-xl font-bold text-gray-900 mb-2">
                      {verificationResult.event.name}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Date & Time</p>
                        <p className="font-medium text-gray-900">
                          {formatDate(verificationResult.event.date)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Location</p>
                        <p className="font-medium text-gray-900">{verificationResult.event.location}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Organizer</p>
                        <p className="font-mono text-xs text-gray-900">
                          {verificationResult.event.organizer.toString().slice(0, 20)}...
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Event ID</p>
                        <p className="font-mono text-xs text-gray-900">{verificationResult.event.id}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Transfer History */}
                {verificationResult.ticket.transfer_history.length > 1 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Transfer History</h3>
                    <div className="space-y-2">
                      {verificationResult.ticket.transfer_history.map((transfer, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-mono text-sm text-gray-900">
                              {transfer[1].toString().slice(0, 20)}...
                            </p>
                            <p className="text-xs text-gray-600">
                              {index === 0 ? 'Original Purchase' : `Transfer ${index}`}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-900">
                              {new Date(Number(transfer[0]) / 1000000).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Blockchain Verification */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <Shield className="h-5 w-5 text-blue-600 mr-2" />
                    <span className="text-sm font-medium text-blue-900">
                      Verified on ICP Blockchain
                    </span>
                  </div>
                  <p className="text-xs text-blue-700 mt-1">
                    This ticket's authenticity is guaranteed by the Internet Computer blockchain.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* How It Works */}
        <div className="mt-12 bg-white rounded-2xl shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            How Verification Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 font-bold">1</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Enter Ticket ID</h3>
              <p className="text-sm text-gray-600">
                Input the unique ticket ID you want to verify
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 font-bold">2</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Blockchain Query</h3>
              <p className="text-sm text-gray-600">
                Our system queries the ICP blockchain for ticket data
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 font-bold">3</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Instant Results</h3>
              <p className="text-sm text-gray-600">
                Get immediate verification with complete ticket history
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Verify;