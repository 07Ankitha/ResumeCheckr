'use client';

import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { CreditCardIcon, BanknotesIcon } from '@heroicons/react/24/outline';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlan: {
    name: string;
    price: string;
    features: string[];
  };
}

const paymentMethods = [
  {
    id: 'card',
    name: 'Credit/Debit Card',
    icon: CreditCardIcon,
    description: 'Pay securely with your card',
  },
  {
    id: 'upi',
    name: 'UPI',
    icon: BanknotesIcon,
    description: 'Pay using UPI apps',
  },
];

export default function PricingModal({ isOpen, onClose, selectedPlan }: PricingModalProps) {
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: '',
  });

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle payment processing here
    console.log('Processing payment:', { selectedPayment, cardDetails });
    onClose();
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div className="absolute right-0 top-0 pr-4 pt-4">
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500"
                    onClick={onClose}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                      Checkout - {selectedPlan.name}
                    </Dialog.Title>
                    <div className="mt-4">
                      <p className="text-2xl font-bold text-gray-900">{selectedPlan.price}</p>
                      <div className="mt-4 space-y-2">
                        <h4 className="font-medium text-gray-900">Plan Features:</h4>
                        <ul className="list-disc list-inside space-y-1 text-gray-600">
                          {selectedPlan.features.map((feature, index) => (
                            <li key={index}>{feature}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="mt-6">
                      <h4 className="font-medium text-gray-900 mb-4">Select Payment Method</h4>
                      <div className="space-y-4">
                        {paymentMethods.map((method) => (
                          <div
                            key={method.id}
                            className={`relative flex cursor-pointer rounded-lg border p-4 ${
                              selectedPayment === method.id
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-300'
                            }`}
                            onClick={() => setSelectedPayment(method.id)}
                          >
                            <div className="flex w-full items-center justify-between">
                              <div className="flex items-center">
                                <method.icon className="h-6 w-6 text-gray-400" />
                                <div className="ml-3">
                                  <p className="text-sm font-medium text-gray-900">{method.name}</p>
                                  <p className="text-sm text-gray-500">{method.description}</p>
                                </div>
                              </div>
                              {selectedPayment === method.id && (
                                <div className="h-5 w-5 rounded-full border-2 border-blue-500 bg-blue-500" />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      {selectedPayment === 'card' && (
                        <form onSubmit={handlePaymentSubmit} className="mt-6 space-y-4">
                          <div>
                            <label htmlFor="card-name" className="block text-sm font-medium text-gray-700">
                              Cardholder Name
                            </label>
                            <input
                              type="text"
                              id="card-name"
                              value={cardDetails.name}
                              onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                              required
                            />
                          </div>
                          <div>
                            <label htmlFor="card-number" className="block text-sm font-medium text-gray-700">
                              Card Number
                            </label>
                            <input
                              type="text"
                              id="card-number"
                              value={cardDetails.number}
                              onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                              required
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label htmlFor="card-expiry" className="block text-sm font-medium text-gray-700">
                                Expiry Date
                              </label>
                              <input
                                type="text"
                                id="card-expiry"
                                placeholder="MM/YY"
                                value={cardDetails.expiry}
                                onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                required
                              />
                            </div>
                            <div>
                              <label htmlFor="card-cvv" className="block text-sm font-medium text-gray-700">
                                CVV
                              </label>
                              <input
                                type="text"
                                id="card-cvv"
                                value={cardDetails.cvv}
                                onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                required
                              />
                            </div>
                          </div>
                          <button
                            type="submit"
                            className="w-full rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                          >
                            Pay {selectedPlan.price}
                          </button>
                        </form>
                      )}

                      {selectedPayment === 'upi' && (
                        <div className="mt-6">
                          <p className="text-sm text-gray-500">
                            You will be redirected to your UPI app to complete the payment.
                          </p>
                          <button
                            type="button"
                            onClick={handlePaymentSubmit}
                            className="mt-4 w-full rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                          >
                            Pay with UPI
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
} 