export const SUPPORT_FAQS = [
  {
    id: "post-ad",
    question: "How do I post an ad?",
    answer:
      "Tap Post Ad, choose Free/Paid/Premium, enter your classified details, accept the posting terms and submit. Paid/Premium ads require UPI payment reference before submission."
  },
  {
    id: "pricing",
    question: "How much does it cost?",
    answer:
      "Free ad is Rs. 0 for 7 days. Paid ad is Rs. 199 for 7 days. Premium ad is Rs. 499 for 30 days. Featured add-on is Rs. 299 for 10 days and is available only with Paid or Premium ads. Prices are GST inclusive."
  },
  {
    id: "approval",
    question: "When will my ad be approved?",
    answer:
      "Free ads are generally reviewed within 2-3 working days. Paid and Premium ads are generally reviewed within 1 working day after manual UPI payment verification."
  },
  {
    id: "payment",
    question: "How do I make payment?",
    answer:
      "Select Paid/Premium on the Post Ad page, scan the UPI QR or use UPI ID skepl1@icici, pay the exact amount and enter the UPI Transaction ID/UTR in the form before submitting."
  },
  {
    id: "featured",
    question: "What is a Featured ad?",
    answer:
      "Featured ads are shown at the top and publicly marked as Featured. Featured is available only as an add-on with Paid or Premium ads."
  },
  {
    id: "renew",
    question: "How do I renew or upgrade my ad?",
    answer:
      "Open Renew, enter your ad ID and posting mobile number, choose Paid/Premium/Featured option, pay through UPI and submit the transaction reference for admin verification."
  }
];

export function getSupportWhatsAppMessage(question = "") {
  const selected = SUPPORT_FAQS.find((faq) => faq.id === question);

  if (selected) {
    return `Hello My Classifieds, I need help with: ${selected.question}`;
  }

  return "Hello My Classifieds, I need help with posting or managing my classified ad.";
}

export function getSupportWhatsAppUrl(question = "") {
  return `https://wa.me/919673931166?text=${encodeURIComponent(
    getSupportWhatsAppMessage(question)
  )}`;
}
