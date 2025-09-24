'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, Home, DollarSign, Percent, Calendar, TrendingUp, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { calculateMortgage, formatCurrency } from '@/lib/utils';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

export default function MortgagePage() {
  const [formData, setFormData] = useState({
    homePrice: 750000,
    downPayment: 150000,
    interestRate: 5.25,
    amortization: 25,
    paymentFrequency: 'monthly'
  });

  const [results, setResults] = useState(calculateMortgage(
    750000, 5.25, 25, 150000
  ));

  const handleInputChange = (field: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    const newData = { ...formData, [field]: numValue };
    setFormData(newData);
    
    const newResults = calculateMortgage(
      newData.homePrice,
      newData.interestRate,
      newData.amortization,
      newData.downPayment
    );
    setResults(newResults);
  };

  const downPaymentPercentage = (formData.downPayment / formData.homePrice * 100) || 0;
  const loanToValue = ((formData.homePrice - formData.downPayment) / formData.homePrice * 100) || 0;

  // Canadian mortgage insurance calculation
  const cmhcInsurance = formData.downPayment < (formData.homePrice * 0.2) 
    ? results.loanAmount * 0.0275 // Approximate CMHC premium
    : 0;

  // Property taxes and other costs (estimated)
  const annualPropertyTax = formData.homePrice * 0.015; // 1.5% estimated
  const monthlyPropertyTax = annualPropertyTax / 12;
  const monthlyInsurance = 150; // Estimated home insurance

  const totalMonthlyPayment = results.monthlyPayment + monthlyPropertyTax + monthlyInsurance;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <motion.div 
        className="container mx-auto px-4"
        {...fadeInUp}
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Canadian Mortgage Calculator
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Calculate your monthly mortgage payments and explore different scenarios 
            to find the right mortgage for your Canadian home purchase.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Calculator Form */}
          <motion.div {...fadeInUp} transition={{ delay: 0.2 }}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Mortgage Calculator
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="homePrice">Home Price</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="homePrice"
                        type="number"
                        value={formData.homePrice}
                        onChange={(e) => handleInputChange('homePrice', e.target.value)}
                        className="pl-10"
                        placeholder="750,000"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="downPayment">Down Payment</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="downPayment"
                        type="number"
                        value={formData.downPayment}
                        onChange={(e) => handleInputChange('downPayment', e.target.value)}
                        className="pl-10"
                        placeholder="150,000"
                      />
                    </div>
                    <p className="text-xs text-gray-500">
                      {downPaymentPercentage.toFixed(1)}% of home price
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="interestRate">Interest Rate (%)</Label>
                    <div className="relative">
                      <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="interestRate"
                        type="number"
                        step="0.01"
                        value={formData.interestRate}
                        onChange={(e) => handleInputChange('interestRate', e.target.value)}
                        className="pl-10"
                        placeholder="5.25"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="amortization">Amortization (years)</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <select
                        id="amortization"
                        value={formData.amortization}
                        onChange={(e) => handleInputChange('amortization', e.target.value)}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      >
                        <option value="15">15 years</option>
                        <option value="20">20 years</option>
                        <option value="25">25 years</option>
                        <option value="30">30 years</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="paymentFrequency">Payment Frequency</Label>
                  <select
                    id="paymentFrequency"
                    value={formData.paymentFrequency}
                    onChange={(e) => setFormData({ ...formData, paymentFrequency: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="bi-weekly">Bi-weekly</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </div>

                {cmhcInsurance > 0 && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <div className="flex items-start gap-2">
                      <Info className="h-5 w-5 text-orange-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-orange-800">CMHC Insurance Required</p>
                        <p className="text-sm text-orange-700 mt-1">
                          Down payment is less than 20%. CMHC insurance: {formatCurrency(cmhcInsurance)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Results */}
          <motion.div 
            className="space-y-6"
            {...fadeInUp} 
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="h-5 w-5" />
                  Monthly Payment Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Principal & Interest</span>
                    <span className="font-semibold">{formatCurrency(results.monthlyPayment)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Property Tax (est.)</span>
                    <span className="font-semibold">{formatCurrency(monthlyPropertyTax)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Home Insurance (est.)</span>
                    <span className="font-semibold">{formatCurrency(monthlyInsurance)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center text-lg">
                    <span className="font-semibold text-gray-900">Total Monthly Payment</span>
                    <span className="font-bold text-emerald-600">{formatCurrency(totalMonthlyPayment)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Loan Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Loan Amount</p>
                    <p className="text-xl font-bold text-gray-900">{formatCurrency(results.loanAmount)}</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Total Interest</p>
                    <p className="text-xl font-bold text-gray-900">{formatCurrency(results.totalInterest)}</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Total Payments</p>
                    <p className="text-xl font-bold text-gray-900">{formatCurrency(results.totalPayment)}</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Loan-to-Value</p>
                    <p className="text-xl font-bold text-gray-900">{loanToValue.toFixed(1)}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Canadian Mortgage Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2"></div>
                    <p>Minimum down payment: 5% for homes under $500K, 10% for $500K-$1M</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2"></div>
                    <p>CMHC insurance required for down payments less than 20%</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2"></div>
                    <p>Consider bi-weekly payments to pay off your mortgage faster</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2"></div>
                    <p>Get pre-approved to strengthen your offer and know your budget</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}