"use client"

import { useState } from 'react';
import { generateInvoice } from '@/lib/invoiceGenerator';
import { Button } from '@/components/ui/button';

export default function InvoiceTestPage() {
  const [testRunning, setTestRunning] = useState(false);

  const testInvoiceGeneration = () => {
    setTestRunning(true);
    
    // Sample order data for testing
    const sampleOrderData = {
      items: [
        {
          productName: "Premium Cotton T-Shirt",
          price: 29.99,
          quantity: 2,
          selectedSize: "Medium",
          colorName: "Navy Blue"
        },
        {
          productName: "Designer Jeans",
          price: 89.99,
          quantity: 1,
          selectedSize: "32W x 34L",
          colorName: "Dark Wash"
        }
      ],
      totalAmount: 149.97,
      shippingCost: 0,
      tax: 12.00,
      paymentMethod: "Cash on Delivery",
      customerName: "John Doe",
      email: "john.doe@example.com",
      phone: "+1 (555) 123-4567",
      address: "123 Main St, Anytown, NY 12345, United States"
    };

    const sampleOrderResponse = {
      orderId: "ORD-" + Date.now(),
      status: "Confirmed"
    };

    try {
      generateInvoice(sampleOrderData, sampleOrderResponse);
      alert("Test invoice generated successfully! Check your downloads folder.");
    } catch (error) {
      console.error("Invoice generation failed:", error);
      alert("Invoice generation failed: " + error.message);
    } finally {
      setTestRunning(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Invoice System Test</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md">
        <h2 className="text-xl font-semibold mb-4">Test Invoice Generation</h2>
        <p className="text-gray-600 mb-4">
          Click the button below to test the invoice generation with sample data.
          A PDF will be downloaded to your default downloads folder.
        </p>
        
        <Button 
          onClick={testInvoiceGeneration}
          disabled={testRunning}
          className="w-full bg-purple-600 hover:bg-purple-700"
        >
          {testRunning ? "Generating..." : "Generate Test Invoice"}
        </Button>
      </div>

      <div className="mt-8 bg-blue-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">How it works:</h3>
        <ul className="text-blue-700 space-y-1">
          <li>• When customers complete checkout, an invoice PDF is automatically generated</li>
          <li>• The PDF includes order details, customer information, and company branding</li>
          <li>• Works for both cart checkout and buy-now purchases</li>
          <li>• PDF is downloaded with filename format: ElaRose-Invoice-{`{orderId}`}.pdf</li>
          <li>• Perfect for cash on delivery - customers get immediate receipt</li>
        </ul>
      </div>
    </div>
  );
}