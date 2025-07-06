import React, { useState, useContext } from 'react';
import { ShoppingCart, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { AuthContext } from '../auth/AuthContext';

interface PurchaseButtonProps {
  event: any;
  ticketType: any;
  isAuthenticated: boolean;
}

const PurchaseButton: React.FC<PurchaseButtonProps> = ({ 
  event, 
  ticketType, 
  isAuthenticated 
}) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { backendActor, login } = useContext(AuthContext);

  const handlePurchase = async () => {
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
      const result = await backendActor.purchase_ticket(event.id);
      
      if ('Ok' in result) {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          // Optionally redirect to dashboard or show ticket
        }, 2000);
      } else {
        setError(result.Err);
      }
    } catch (err) {
      console.error('Purchase failed:', err);
      setError('Purchase failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <button className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center">
        <CheckCircle className="h-5 w-5 mr-2" />
        Purchase Successful!
      </button>
    );
  }

  return (
    <div className="space-y-3">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center text-red-700">
          <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}
      
      <button
        onClick={handlePurchase}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <ShoppingCart className="h-5 w-5 mr-2" />
            {isAuthenticated ? `Buy for ${ticketType.price} ICP` : 'Login to Purchase'}
          </>
        )}
      </button>
      
      <p className="text-xs text-gray-500 text-center">
        Secure payment via ICP blockchain
      </p>
    </div>
  );
};

export default PurchaseButton;