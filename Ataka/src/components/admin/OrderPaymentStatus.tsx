
import React, { useState } from 'react';
import { backend } from '@/modules/api';
import { toast } from '@/components/ui/sonner';
import { Check, X } from 'lucide-react';

interface OrderPaymentStatusProps {
  orderId: string;
  onStatusUpdate?: (status: string) => void;
}

const OrderPaymentStatus: React.FC<OrderPaymentStatusProps> = ({ orderId, onStatusUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [method, setMethod] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const checkStatus = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await backend.payment.checkPaymentStatus(orderId);

      setStatus(result.status);
      setMethod(result.method);

      if (onStatusUpdate) {
        onStatusUpdate(result.status);
      }

      if (result.status === 'paid') {
        toast.success("Payment captured!", {
          description: "The order payment was successful.",
          icon: <Check className="text-green-600" />
        });
        // Here, you could trigger push notification logic as needed
      } else {
        toast.error("Payment failed or pending.", {
          description: `Status: ${result.status}`,
          icon: <X className="text-red-600" />
        });
      }
    } catch (err: any) {
      setError(err.message || "Failed to check payment status.");
      toast.error("Error checking payment status.", { description: err.message });
    } finally {
      setLoading(false);
    }
  };

  let display = "Check Payment";
  if (status === 'paid') display = "Payment captured";
  else if (status) display = `Status: ${status}`;

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={checkStatus}
        disabled={loading}
        className={`px-3 py-1 rounded-md text-xs font-medium border transition ${
          status === 'paid'
            ? 'bg-green-100 text-green-700 border-green-300'
            : status
            ? 'bg-red-100 text-red-700 border-red-300'
            : 'bg-muted text-muted-foreground border-gray-300'
        } hover:shadow-sm`}
      >
        {loading ? 'Checking...' : display}
      </button>
      {method && <span className="text-xs text-muted-foreground">({method})</span>}
      {error && <span className="ml-2 text-xs text-red-500">{error}</span>}
    </div>
  );
};

export default OrderPaymentStatus;
