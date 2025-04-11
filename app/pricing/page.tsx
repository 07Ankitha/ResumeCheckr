"use client";

import { useState } from "react";
import Navbar from "../../components/Navbar";
import PricingModal from "../../components/PricingModal";
import { CheckIcon } from "@heroicons/react/24/outline";

const tiers = [
  {
    name: "Basic",
    id: "tier-basic",
    price: { monthly: "₹199", annually: "₹1,990" },
    description:
      "Perfect for individuals getting started with their professional journey.",
    features: [
      "Basic profile analysis",
      "Resume optimization",
      "5 AI recommendations",
      "Email support",
      "Basic skill gap analysis",
    ],
  },
  {
    name: "Pro",
    id: "tier-pro",
    price: { monthly: "₹299", annually: "₹2,990" },
    description:
      "Ideal for professionals looking to enhance their career prospects.",
    features: [
      "Advanced profile analysis",
      "Resume optimization",
      "Unlimited AI recommendations",
      "Priority email support",
      "Advanced skill gap analysis",
      "LinkedIn post suggestions",
      "Industry trend insights",
    ],
  },
  {
    name: "Enterprise",
    id: "tier-enterprise",
    price: { monthly: "₹399", annually: "₹3,990" },
    description:
      "For organizations and teams looking to optimize their professional presence.",
    features: [
      "Everything in Pro",
      "Team management",
      "Custom branding",
      "API access",
      "Dedicated support",
      "Advanced analytics",
      "Custom integrations",
    ],
  },
];

export default function Pricing() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<(typeof tiers)[0] | null>(
    null
  );
  const [billingInterval, setBillingInterval] = useState<
    "monthly" | "annually"
  >("monthly");

  const handlePlanSelect = (plan: (typeof tiers)[0]) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar />

      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-7xl py-24 sm:py-32 lg:py-40">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Simple, transparent pricing
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Choose the perfect plan for your professional growth journey.
            </p>
          </div>

          <div className="mt-16 flex justify-center">
            <div className="relative self-center rounded-full bg-gray-100 p-1 flex w-fit">
              <button
                type="button"
                className={`${
                  billingInterval === "monthly"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-900"
                } w-full rounded-full px-4 py-2.5 text-sm font-semibold leading-5 transition-colors`}
                onClick={() => setBillingInterval("monthly")}
              >
                Monthly Billing
              </button>
              <button
                type="button"
                className={`${
                  billingInterval === "annually"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-900"
                } w-full rounded-full px-4 py-2.5 text-sm font-semibold leading-5 transition-colors`}
                onClick={() => setBillingInterval("annually")}
              >
                Annual Billing
              </button>
            </div>
          </div>

          <div className="mx-auto mt-16 grid max-w-6xl grid-cols-1 gap-8 sm:mt-20 lg:grid-cols-3">
            {tiers.map((tier) => (
              <div
                key={tier.id}
                className="flex flex-col justify-between rounded-3xl bg-white p-8 ring-1 ring-gray-200 xl:p-10"
              >
                <div>
                  <div className="flex items-center justify-between gap-x-4">
                    <h3 className="text-lg font-semibold leading-8 text-gray-900">
                      {tier.name}
                    </h3>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-gray-600">
                    {tier.description}
                  </p>
                  <p className="mt-6 flex items-baseline gap-x-1">
                    <span className="text-4xl font-bold tracking-tight text-gray-900">
                      {tier.price[billingInterval]}
                    </span>
                    <span className="text-sm font-semibold leading-6 text-gray-600">
                      /{billingInterval === "monthly" ? "month" : "year"}
                    </span>
                  </p>
                  <ul
                    role="list"
                    className="mt-8 space-y-3 text-sm leading-6 text-gray-600"
                  >
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex gap-x-3">
                        <CheckIcon
                          className="h-6 w-5 flex-none text-blue-600"
                          aria-hidden="true"
                        />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <button
                  onClick={() => handlePlanSelect(tier)}
                  className="mt-8 block rounded-md bg-blue-600 px-3 py-2 text-center text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-colors"
                >
                  Get started
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedPlan && (
        <PricingModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedPlan(null);
          }}
          selectedPlan={{
            name: selectedPlan.name,
            price: selectedPlan.price[billingInterval],
            features: selectedPlan.features,
          }}
        />
      )}
    </main>
  );
}
