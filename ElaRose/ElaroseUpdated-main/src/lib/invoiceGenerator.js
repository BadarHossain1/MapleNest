import jsPDF from 'jspdf';

export const generateInvoice = (orderData, orderResponse) => {
  try {
    const doc = new jsPDF();
    
    // Set up colors
    const primaryColor = [156, 39, 176]; // Purple brand color
    const darkGray = [51, 51, 51];
    const lightGray = [128, 128, 128];
    
    // Add company logo/header
    doc.setFontSize(24);
    doc.setTextColor(...primaryColor);
    doc.text('ELAROSE', 20, 30);
    
    // Add invoice title
    doc.setFontSize(18);
    doc.setTextColor(...darkGray);
    doc.text('INVOICE', 150, 30);
    
    // Add invoice details
    doc.setFontSize(12);
    doc.setTextColor(...lightGray);
    const orderId = orderResponse.orderId || orderData.orderId || 'INV-' + Date.now();
    doc.text(`Invoice #: ${orderId}`, 150, 45);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 150, 55);
    doc.text(`Time: ${new Date().toLocaleTimeString()}`, 150, 65);
    
    // Add company details
    doc.setFontSize(10);
    doc.setTextColor(...darkGray);
    doc.text('ElaRose Fashion Store', 20, 50);
    doc.text('Premium Fashion & Accessories', 20, 60);
    doc.text('Email: support@elarose.com', 20, 70);
    doc.text('Phone: +1 (555) 123-4567', 20, 80);
    
    // Add customer details section
    let yPos = 100;
    doc.setFontSize(14);
    doc.setTextColor(...primaryColor);
    doc.text('BILL TO:', 20, yPos);
    
    yPos += 15;
    doc.setFontSize(12);
    doc.setTextColor(...darkGray);
    doc.text(`Customer: ${orderData.customerName || 'Valued Customer'}`, 20, yPos);
    yPos += 10;
    doc.text(`Email: ${orderData.email || 'N/A'}`, 20, yPos);
    yPos += 10;
    doc.text(`Phone: ${orderData.phone || 'N/A'}`, 20, yPos);
    yPos += 10;
    if (orderData.address && orderData.address.trim() !== '') {
      // Handle long addresses by wrapping them
      const maxWidth = 160;
      const lines = doc.splitTextToSize(orderData.address, maxWidth);
      lines.forEach((line, index) => {
        doc.text(`${index === 0 ? 'Address: ' : ''}${line}`, 20, yPos);
        yPos += 8;
      });
      yPos += 2; // Extra spacing after address
    }
    
    // Add order details section
    yPos += 15;
    doc.setFontSize(14);
    doc.setTextColor(...primaryColor);
    doc.text('ORDER DETAILS:', 20, yPos);
    
    // Table header
    yPos += 15;
    doc.setFillColor(240, 240, 240);
    doc.rect(20, yPos - 5, 170, 15, 'F');
    
    doc.setFontSize(10);
    doc.setTextColor(...darkGray);
    doc.text('ITEM', 25, yPos + 5);
    doc.text('QTY', 100, yPos + 5);
    doc.text('PRICE', 125, yPos + 5);
    doc.text('TOTAL', 155, yPos + 5);
    
    // Table content
    yPos += 20;
    let subtotal = 0;
    
    if (orderData.items && Array.isArray(orderData.items)) {
      // Multiple items (from cart)
      orderData.items.forEach((item, index) => {
        const itemPrice = parseFloat(item.price) || 0;
        const itemQuantity = parseInt(item.quantity) || 1;
        const itemTotal = itemPrice * itemQuantity;
        subtotal += itemTotal;
        
        doc.setFontSize(9);
        doc.setTextColor(...darkGray);
        
        // Product name (truncate if too long)
        let productName = item.productName || item.name || 'Product';
        if (productName.length > 30) {
          productName = productName.substring(0, 27) + '...';
        }
        doc.text(productName, 25, yPos);
        
        // Product details
        let detailYPos = yPos + 8;
        if (item.selectedSize && item.selectedSize !== 'One Size') {
          doc.text(`Size: ${item.selectedSize}`, 25, detailYPos);
          detailYPos += 8;
        }
        if (item.colorName) {
          doc.text(`Color: ${item.colorName}`, 25, detailYPos);
          detailYPos += 8;
        }
        
        // Quantity, price, total
        doc.text(itemQuantity.toString(), 105, yPos);
        doc.text(`$${itemPrice.toFixed(2)}`, 125, yPos);
        doc.text(`$${itemTotal.toFixed(2)}`, 155, yPos);
        
        yPos += Math.max(30, detailYPos - yPos + 10);
      });
    } else {
      // Single item (from buy now) or fallback
      const item = orderData.items?.[0] || orderData;
      const itemPrice = parseFloat(item.price || orderData.price) || 0;
      const itemQuantity = parseInt(item.quantity || orderData.quantity) || 1;
      const itemTotal = parseFloat(orderData.totalAmount) || (itemPrice * itemQuantity);
      subtotal = itemTotal;
      
      doc.setFontSize(9);
      doc.setTextColor(...darkGray);
      
      let productName = item.productName || item.name || orderData.productName || 'Product';
      if (productName.length > 30) {
        productName = productName.substring(0, 27) + '...';
      }
      doc.text(productName, 25, yPos);
      
      let detailYPos = yPos + 8;
      if ((item.selectedSize || orderData.selectedSize) && (item.selectedSize || orderData.selectedSize) !== 'One Size') {
        doc.text(`Size: ${item.selectedSize || orderData.selectedSize}`, 25, detailYPos);
        detailYPos += 8;
      }
      if (item.colorName || orderData.colorName) {
        doc.text(`Color: ${item.colorName || orderData.colorName}`, 25, detailYPos);
        detailYPos += 8;
      }
      
      doc.text(itemQuantity.toString(), 105, yPos);
      doc.text(`$${itemPrice.toFixed(2)}`, 125, yPos);
      doc.text(`$${itemTotal.toFixed(2)}`, 155, yPos);
      
      yPos += Math.max(30, detailYPos - yPos + 10);
    }
    
    // Add line separator
    doc.setDrawColor(...lightGray);
    doc.line(20, yPos, 190, yPos);
    
    // Totals section
    yPos += 15;
    doc.setFontSize(12);
    doc.setTextColor(...darkGray);
    
    // Subtotal
    doc.text('Subtotal:', 125, yPos);
    doc.text(`$${subtotal.toFixed(2)}`, 155, yPos);
    
    // Shipping (if applicable)
    yPos += 12;
    const shippingCost = parseFloat(orderData.shippingCost) || 0;
    doc.text('Shipping:', 125, yPos);
    doc.text(shippingCost > 0 ? `$${shippingCost.toFixed(2)}` : 'FREE', 155, yPos);
    
    // Tax (if applicable)
    yPos += 12;
    const tax = parseFloat(orderData.tax) || 0;
    doc.text('Tax:', 125, yPos);
    doc.text(`$${tax.toFixed(2)}`, 155, yPos);
    
    // Total
    yPos += 15;
    const total = parseFloat(orderData.totalAmount) || (subtotal + shippingCost + tax);
    doc.setFillColor(...primaryColor);
    doc.rect(120, yPos - 8, 70, 20, 'F');
    
    doc.setFontSize(14);
    doc.setTextColor(255, 255, 255);
    doc.text('TOTAL:', 125, yPos + 2);
    doc.text(`$${total.toFixed(2)}`, 155, yPos + 2);
    
    // Payment method
    yPos += 25;
    doc.setFontSize(12);
    doc.setTextColor(...darkGray);
    doc.text('Payment Method:', 20, yPos);
    doc.text(orderData.paymentMethod || 'Cash on Delivery', 80, yPos);
    
    // Order status
    yPos += 12;
    doc.text('Order Status:', 20, yPos);
    doc.text(orderResponse.status || 'Confirmed', 80, yPos);
    
    // Footer
    yPos += 30;
    doc.setFontSize(10);
    doc.setTextColor(...lightGray);
    doc.text('Thank you for shopping with ElaRose!', 20, yPos);
    yPos += 10;
    doc.text('For support, contact us at support@elarose.com', 20, yPos);
    yPos += 10;
    doc.text('This is a computer-generated invoice.', 20, yPos);
    
    // Generate filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
    const filename = `ElaRose-Invoice-${orderId}-${timestamp}.pdf`;
    
    // Save the PDF
    doc.save(filename);
    
    return filename;
  } catch (error) {
    console.error('Error generating invoice PDF:', error);
    throw new Error(`Invoice generation failed: ${error.message}`);
  }
};

// Helper function to format order data for invoice generation
export const formatOrderDataForInvoice = (orderData, customerInfo, orderResponse) => {
  return {
    ...orderData,
    ...customerInfo,
    orderId: orderResponse.orderId,
    status: orderResponse.status,
    createdAt: orderResponse.createdAt || new Date().toISOString()
  };
};