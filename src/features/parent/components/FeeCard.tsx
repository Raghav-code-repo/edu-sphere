import type { FeeRecord } from '@/types/parent';
import { CreditCard, Download } from 'lucide-react';

interface FeeCardProps {
  fee: FeeRecord;
  onPayNow?: (feeId: string) => void;
}

export function FeeCard({ fee, onPayNow }: FeeCardProps) {
  const statusColors = {
    paid: 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/20',
    pending: 'text-yellow-600 bg-yellow-50 dark:text-yellow-400 dark:bg-yellow-900/20',
    overdue: 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/20',
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">
              {fee.childName}
            </h3>
            <span
              className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[fee.status]}`}
            >
              {fee.status.charAt(0).toUpperCase() + fee.status.slice(1)}
            </span>
          </div>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
            {fee.academicYear} • {fee.semester}
          </p>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Total Fees</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                ₹{fee.totalAmount.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Paid</p>
              <p className="text-sm font-semibold text-green-600 dark:text-green-400">
                ₹{fee.paidAmount.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Pending</p>
              <p className="text-sm font-semibold text-red-600 dark:text-red-400">
                ₹{fee.pendingAmount.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Due Date</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{fee.dueDate}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {fee.status !== 'paid' && onPayNow && (
            <button
              onClick={() => onPayNow(fee.id)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
            >
              <CreditCard className="h-4 w-4" />
              Pay Now
            </button>
          )}
          <button className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
            <Download className="h-4 w-4" />
            Receipt
          </button>
        </div>
      </div>

      {fee.payments.length > 0 && (
        <div className="mt-4 border-t border-gray-200 pt-4 dark:border-gray-700">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
            Payment History
          </h4>
          <div className="space-y-2">
            {fee.payments.map((payment) => (
              <div
                key={payment.id}
                className="flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-gray-900/50"
              >
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      ₹{payment.amount.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {payment.method} • {payment.date}
                    </p>
                  </div>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {payment.transactionId}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
