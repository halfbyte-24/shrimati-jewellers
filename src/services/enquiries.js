// This service handles the enquiry submission.
// For now, it simply opens a WhatsApp link or mailto link.

export function generateWhatsAppLink(product, message = '') {
  const phoneNumber = '919830000000'; // Replace with actual WhatsApp number from config
  const text = message || `Hello Srimati Jewelers, I would like to enquire about:
Product: ${product.name}
Code: ${product.product_code || 'N/A'}
Link: ${window.location.origin}/product/${product.slug}`;

  const encodedText = encodeURIComponent(text);
  return `https://wa.me/${phoneNumber}?text=${encodedText}`;
}

export function openEnquiry(product) {
  const link = generateWhatsAppLink(product);
  window.open(link, '_blank');
}
