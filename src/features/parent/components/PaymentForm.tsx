import type { PaymentIntent } from '@/types/parent';
import { CreditCard, Loader2 } from 'lucide-react';

interface PaymentFormProps {
  paymentIntent: PaymentIntent | null;
  onPay: () => void;
  isProcessing: boolean;
}

export function PaymentForm({ paymentIntent, onPay, isProcessing }: PaymentFormProps) {
  if (!paymentIntent) return null;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Payment Details</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4 dark:bg-gray-900/50">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Amount to Pay</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              ₹{paymentIntent.amount.toLocaleString()}
            </p>
          </div>
          <CreditCard className="h-8 w-8 text-gray-400" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Card Number
            </label>
            <input
              type="text"
              placeholder="1234 5678 9012 3456"
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Expiry
              </label>
              <input
                type="text"
                placeholder="MM/YY"
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                CVV
              </label>
              <input
                type="text"
                placeholder="123"
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
              />
            </div>
          </div>
        </div>
        <button
          onClick={onPay}
          disabled={isProcessing}
          className="w-full inline-flex items-center justify-center rounded-lg px-4 py-2.5 font-medium bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50"
        >
          {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Pay ₹{paymentIntent.amount.toLocaleString()}
        </button>
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
          This is a demo. No real payment will be processed.
        </p>
      </div>
    </div>
  );
}
