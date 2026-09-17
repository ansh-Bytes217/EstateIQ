import React, { useState, useMemo } from "react";
import { Calculator, DollarSign, Percent, Info, ShieldCheck, ChevronDown, RefreshCw } from "lucide-react";
import { Property } from "../../types";
import { formatPrice } from "../../lib/utils";
import { useStore } from "../../store/useStore";

interface MonthlyPaymentCalculatorProps {
  property: Property;
}

export const MonthlyPaymentCalculator: React.FC<MonthlyPaymentCalculatorProps> = ({ property }) => {
  const { currency } = useStore();

  // Price & Down payment
  const [homePrice, setHomePrice] = useState<number>(property.price);
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(20);
  
  // Loan details
  const [loanTermYears, setLoanTermYears] = useState<number>(30);
  const defaultInterestRate = currency === "USD" ? 6.85 : 8.65;
  const [interestRate, setInterestRate] = useState<number>(defaultInterestRate);

  // Additional costs
  const hoaFee = property.monthlyCosts?.hoaFee || (property.status === "For Rent" ? 0 : 7500);
  const taxRate = property.monthlyCosts?.propertyTaxRatePercent || 1.1;
  const insuranceRate = property.monthlyCosts?.homeownersInsuranceRatePercent || 0.4;

  // Compute values
  const calculations = useMemo(() => {
    const downPaymentAmount = Math.round((homePrice * downPaymentPercent) / 100);
    const loanAmount = Math.max(0, homePrice - downPaymentAmount);

    // Monthly interest rate
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = loanTermYears * 12;

    // Monthly Principal & Interest: M = P * [r(1+r)^n] / [(1+r)^n - 1]
    let monthlyPI = 0;
    if (loanAmount > 0 && monthlyRate > 0) {
      monthlyPI = Math.round(
        (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments))) /
          (Math.pow(1 + monthlyRate, numberOfPayments) - 1)
      );
    }

    // Monthly Taxes
    const monthlyTaxes = Math.round((homePrice * (taxRate / 100)) / 12);

    // Monthly Homeowner Insurance
    const monthlyInsurance = Math.round((homePrice * (insuranceRate / 100)) / 12);

    // Total Monthly Payment
    const totalMonthly = monthlyPI + monthlyTaxes + monthlyInsurance + hoaFee;

    // Percentages for bar
    const piPercent = totalMonthly > 0 ? (monthlyPI / totalMonthly) * 100 : 0;
    const taxPercent = totalMonthly > 0 ? (monthlyTaxes / totalMonthly) * 100 : 0;
    const insPercent = totalMonthly > 0 ? (monthlyInsurance / totalMonthly) * 100 : 0;
    const hoaPercent = totalMonthly > 0 ? (hoaFee / totalMonthly) * 100 : 0;

    return {
      downPaymentAmount,
      loanAmount,
      monthlyPI,
      monthlyTaxes,
      monthlyInsurance,
      hoaFee,
      totalMonthly,
      breakdown: {
        pi: { amount: monthlyPI, percent: piPercent, color: "bg-emerald-600", label: "Principal & Interest" },
        tax: { amount: monthlyTaxes, percent: taxPercent, color: "bg-teal-500", label: "Property Taxes" },
        ins: { amount: monthlyInsurance, percent: insPercent, color: "bg-amber-500", label: "Homeowners Insurance" },
        hoa: { amount: hoaFee, percent: hoaPercent, color: "bg-indigo-500", label: "HOA Fees" },
      },
    };
  }, [homePrice, downPaymentPercent, interestRate, loanTermYears, taxRate, insuranceRate, hoaFee]);

  const handleReset = () => {
    setHomePrice(property.price);
    setDownPaymentPercent(20);
    setLoanTermYears(30);
    setInterestRate(defaultInterestRate);
  };

  return (
    <div id="payment-calculator" className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold text-slate-950 tracking-tight">Affordability & Monthly Payment</h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold border border-slate-200">
              Interactive Estimator
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Estimate your monthly out-of-pocket expenses based on down payment, interest rate, and local dues.
          </p>
        </div>

        <button
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-700 transition"
        >
          <RefreshCw className="h-3.5 w-3.5" /> Reset to defaults
        </button>
      </div>

      {/* Large Payment Badge & Multi-Color Progress Bar */}
      <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-200/80 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Estimated Monthly Cost
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-1">
              {formatPrice(calculations.totalMonthly, currency)}
              <span className="text-base font-normal text-slate-500"> / month</span>
            </div>
          </div>
          <div className="text-xs text-slate-500 sm:text-right">
            <div>Loan Amount: <span className="font-semibold text-slate-800">{formatPrice(calculations.loanAmount, currency)}</span></div>
            <div>Down Payment: <span className="font-semibold text-slate-800">{formatPrice(calculations.downPaymentAmount, currency)} ({downPaymentPercent}%)</span></div>
          </div>
        </div>

        {/* Segmented Color Bar */}
        <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden flex gap-0.5">
          <div
            className="h-full bg-emerald-600 transition-all duration-300"
            style={{ width: `${calculations.breakdown.pi.percent}%` }}
            title={`P&I: ${formatPrice(calculations.breakdown.pi.amount, currency)}`}
          />
          <div
            className="h-full bg-teal-500 transition-all duration-300"
            style={{ width: `${calculations.breakdown.tax.percent}%` }}
            title={`Taxes: ${formatPrice(calculations.breakdown.tax.amount, currency)}`}
          />
          <div
            className="h-full bg-amber-500 transition-all duration-300"
            style={{ width: `${calculations.breakdown.ins.percent}%` }}
            title={`Insurance: ${formatPrice(calculations.breakdown.ins.amount, currency)}`}
          />
          <div
            className="h-full bg-indigo-500 transition-all duration-300"
            style={{ width: `${calculations.breakdown.hoa.percent}%` }}
            title={`HOA: ${formatPrice(calculations.breakdown.hoa.amount, currency)}`}
          />
        </div>

        {/* Legend Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          {Object.entries(calculations.breakdown).map(([key, item]) => (
            <div key={key} className="flex items-start gap-2 text-xs">
              <div className={`h-3 w-3 rounded-full mt-0.5 shrink-0 ${item.color}`} />
              <div>
                <div className="font-semibold text-slate-900">{formatPrice(item.amount, currency)}</div>
                <div className="text-slate-500 text-[11px]">{item.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sliders & Controls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        {/* Home Price Slider */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm font-semibold text-slate-800">
            <span>Home Price</span>
            <span className="font-bold text-emerald-700">{formatPrice(homePrice, currency)}</span>
          </div>
          <input
            type="range"
            min={Math.round(property.price * 0.5)}
            max={Math.round(property.price * 1.5)}
            step={property.price > 1000000 ? 500000 : 10000}
            value={homePrice}
            onChange={(e) => setHomePrice(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
          />
        </div>

        {/* Down Payment % Slider */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm font-semibold text-slate-800">
            <span>Down Payment</span>
            <span className="font-bold text-emerald-700">
              {downPaymentPercent}% ({formatPrice(calculations.downPaymentAmount, currency)})
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={80}
            step={5}
            value={downPaymentPercent}
            onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
          />
        </div>

        {/* Interest Rate */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm font-semibold text-slate-800">
            <span>Interest Rate</span>
            <span className="font-bold text-emerald-700">{interestRate}%</span>
          </div>
          <input
            type="range"
            min={3.0}
            max={14.0}
            step={0.1}
            value={interestRate}
            onChange={(e) => setInterestRate(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
          />
        </div>

        {/* Loan Term Selector */}
        <div className="space-y-2">
          <div className="text-sm font-semibold text-slate-800">Loan Program</div>
          <div className="grid grid-cols-3 gap-2">
            {[15, 20, 30].map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => setLoanTermYears(term)}
                className={`py-2 text-xs font-bold rounded-xl border transition ${
                  loanTermYears === term
                    ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                }`}
              >
                {term}-year fixed
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
