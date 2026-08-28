import { useEffect, useState } from 'react';
import { PageHeader, ChildSwitcher, FeeCard, PaymentForm, EmptyState } from '@/features/parent';
import { parentApi } from '@/services/api/parentApi';
import type { Child, FeeRecord, PaymentIntent } from '@/types/parent';

export function ParentFees() {
  const [children, setChildren] = useState<Child[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<string>('');
  const [fees, setFees] = useState<FeeRecord[]>([]);
  const [paymentIntent, setPaymentIntent] = useState<PaymentIntent | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const [childrenData, feesData] = await Promise.all([
        parentApi.getChildren(),
        parentApi.getFees(),
      ]);
      setChildren(childrenData);
      setSelectedChildId(childrenData[0]?.id || '');
      setFees(feesData);
      setLoading(false);
    }
    loadData();
  }, []);

  const childFees = fees.filter((f) => f.childId === selectedChildId);
  const totalPending = fees.reduce((sum, f) => sum + f.pendingAmount, 0);
  const totalPaid = fees.reduce((sum, f) => sum + f.paidAmount, 0);
  const totalFees = fees.reduce((sum, f) => sum + f.totalAmount, 0);

  const handlePayNow = async (_feeId: string) => {
    setIsProcessing(true);
    try {
      const intent = await parentApi.initiatePayment(1000, selectedChildId);
      setPaymentIntent(intent);
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Fees" subtitle="Manage fee payments and view history" />

      <ChildSwitcher
        items={children}
        selectedChildId={selectedChildId}
        onSelect={setSelectedChildId}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-5 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            ₹{totalFees.toLocaleString()}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Fees</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            ₹{totalPaid.toLocaleString()}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Paid</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">
            ₹{totalPending.toLocaleString()}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
        </div>
      </div>

      {paymentIntent && (
        <PaymentForm
          paymentIntent={paymentIntent}
          onPay={async () => {
            setIsProcessing(true);
            await new Promise((resolve) => setTimeout(resolve, 2000));
            setPaymentIntent(null);
            setIsProcessing(false);
            alert('Payment successful! (Demo only)');
          }}
          isProcessing={isProcessing}
        />
      )}

      <div className="space-y-4">
        {childFees.length === 0 ? (
          <EmptyState title="No fee records found" description="Fee details will appear here." />
        ) : (
          childFees.map((fee) => <FeeCard key={fee.id} fee={fee} onPayNow={handlePayNow} />)
        )}
      </div>
    </div>
  );
}
