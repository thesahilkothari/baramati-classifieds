export const SUPPORT_FAQS = [
  {
    id: "post-ad",
    question: {
      en: "How do I post an ad?",
      mr: "जाहिरात कशी पोस्ट करावी?"
    },
    answer: {
      en:
        "Tap Post Ad, choose a Free/Paid/Premium plan, enter your classified details, accept the posting terms and submit. Paid/Premium ads require UPI payment reference before submission.",
      mr:
        "Post Ad वर टॅप करा, Free/Paid/Premium प्लॅन निवडा, जाहिरातीची माहिती भरा, पोस्टिंग अटी स्वीकारा आणि सबमिट करा. Paid/Premium जाहिरातींसाठी सबमिट करण्यापूर्वी UPI पेमेंट रेफरन्स आवश्यक आहे."
    }
  },
  {
    id: "pricing",
    question: {
      en: "How much does it cost?",
      mr: "जाहिरातीचे दर किती आहेत?"
    },
    answer: {
      en:
        "Free ad is Rs. 0 for 7 days. Paid ad is Rs. 199 for 7 days. Premium ad is Rs. 499 for 30 days. Featured add-on is Rs. 299 for 10 days and is available only with Paid or Premium ads. Prices are GST inclusive.",
      mr:
        "Free जाहिरात ७ दिवसांसाठी Rs. 0 आहे. Paid जाहिरात ७ दिवसांसाठी Rs. 199 आहे. Premium जाहिरात ३० दिवसांसाठी Rs. 499 आहे. Featured add-on १० दिवसांसाठी Rs. 299 आहे आणि तो फक्त Paid किंवा Premium जाहिरातींसाठी उपलब्ध आहे. सर्व दर GST inclusive आहेत."
    }
  },
  {
    id: "approval",
    question: {
      en: "When will my ad be approved?",
      mr: "माझी जाहिरात कधी मंजूर होईल?"
    },
    answer: {
      en:
        "Free ads are generally reviewed within 2-3 working days. Paid and Premium ads are generally reviewed within 1 working day after manual UPI payment verification.",
      mr:
        "Free जाहिराती साधारणपणे २-३ कामकाजाच्या दिवसांत तपासल्या जातात. Paid आणि Premium जाहिराती manual UPI payment verification नंतर साधारणपणे १ कामकाजाच्या दिवसात तपासल्या जातात."
    }
  },
  {
    id: "payment",
    question: {
      en: "How do I make payment?",
      mr: "पेमेंट कसे करावे?"
    },
    answer: {
      en:
        "Select Paid/Premium on the Post Ad page, scan the UPI QR or use the UPI ID skepl1@icici, pay the exact amount and enter the UPI Transaction ID/UTR in the form before submitting.",
      mr:
        "Post Ad पेजवर Paid/Premium निवडा, UPI QR स्कॅन करा किंवा UPI ID skepl1@icici वापरा, अचूक रक्कम भरा आणि सबमिट करण्यापूर्वी UPI Transaction ID/UTR फॉर्ममध्ये भरा."
    }
  },
  {
    id: "featured",
    question: {
      en: "What is a Featured ad?",
      mr: "Featured जाहिरात म्हणजे काय?"
    },
    answer: {
      en:
        "Featured ads are shown at the top and publicly marked as Featured. Featured is available only as an add-on with Paid or Premium ads.",
      mr:
        "Featured जाहिराती वरच्या भागात दाखवल्या जातात आणि त्यांना Featured असे सार्वजनिकपणे दाखवले जाते. Featured हा add-on फक्त Paid किंवा Premium जाहिरातींसोबत उपलब्ध आहे."
    }
  },
  {
    id: "renew",
    question: {
      en: "How do I renew or upgrade my ad?",
      mr: "जाहिरात renew किंवा upgrade कशी करावी?"
    },
    answer: {
      en:
        "Open the Renew page, enter your ad ID and posting mobile number, choose Paid/Premium/Featured option, pay through UPI and submit the transaction reference for admin verification.",
      mr:
        "Renew पेज उघडा, Ad ID आणि पोस्टिंगसाठी वापरलेला मोबाईल नंबर भरा, Paid/Premium/Featured पर्याय निवडा, UPI द्वारे पेमेंट करा आणि admin verification साठी transaction reference सबमिट करा."
    }
  }
];

export function getLocalizedFaqText(faq, language = "en") {
  const normalizedLanguage = language === "mr" ? "mr" : "en";

  return {
    question: faq.question?.[normalizedLanguage] || faq.question?.en || "",
    answer: faq.answer?.[normalizedLanguage] || faq.answer?.en || ""
  };
}

export function getSupportWhatsAppMessage(question = "", language = "en") {
  const selected = SUPPORT_FAQS.find((faq) => faq.id === question);

  if (selected) {
    const localized = getLocalizedFaqText(selected, language);
    return language === "mr"
      ? `नमस्कार My Classifieds, मला या विषयावर मदत हवी आहे: ${localized.question}`
      : `Hello My Classifieds, I need help with: ${localized.question}`;
  }

  return language === "mr"
    ? "नमस्कार My Classifieds, मला जाहिरात पोस्ट किंवा मॅनेज करण्याबाबत मदत हवी आहे."
    : "Hello My Classifieds, I need help with posting or managing my classified ad.";
}

export function getSupportWhatsAppUrl(question = "", language = "en") {
  return `https://wa.me/919673931166?text=${encodeURIComponent(
    getSupportWhatsAppMessage(question, language)
  )}`;
}
