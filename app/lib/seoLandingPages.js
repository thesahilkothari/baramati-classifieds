import { buildPageMetadata } from "./seo";

export const landingPages = {
  baramatiProperty: {
    path: "/baramati/property",
    title: "Property Classifieds in Baramati | My Classifieds",
    description:
      "Browse approved property classifieds in Baramati for residential, commercial and rental needs on My Classifieds.",
    h1: "Property Classifieds in Baramati",
    eyebrow: "Baramati Real Estate",
    categorySlug: "real-estate",
    citySlug: "baramati",
    searchHref: "/ads?category=real-estate&city=baramati",
    introEn:
      "Find local property advertisements in Baramati, including sale, rent and real-estate opportunities posted by users and reviewed under My Classifieds moderation rules.",
    introMr:
      "बारामतीमधील मालमत्ता, विक्री, भाडे व रिअल इस्टेट जाहिराती येथे पाहा. प्रत्येक जाहिरात My Classifieds च्या moderation प्रक्रियेअंतर्गत प्रकाशित केली जाते.",
    note:
      "My Classifieds does not verify title, ownership, RERA status or transaction documents. Buyers and tenants should independently verify all documents before payment.",
    breadcrumb: [
      { name: "Home", path: "/" },
      { name: "Baramati", path: "/ads?city=baramati" },
      { name: "Property", path: "/baramati/property" }
    ]
  },
  baramatiJobs: {
    path: "/baramati/jobs",
    title: "Jobs in Baramati | My Classifieds",
    description:
      "Browse approved job classifieds in Baramati for local employment, office, field and service opportunities.",
    h1: "Jobs in Baramati",
    eyebrow: "Local Employment",
    categorySlug: "jobs",
    citySlug: "baramati",
    searchHref: "/ads?category=jobs&city=baramati",
    introEn:
      "Browse user-posted job advertisements in Baramati for local employment and work opportunities. Contact employers directly and verify the role before sharing documents or making any payment.",
    introMr:
      "बारामतीमधील नोकरी व कामाच्या संधींसाठी स्थानिक जाहिराती पाहा. कागदपत्रे किंवा पैसे देण्यापूर्वी नोकरीची व नियोक्त्याची स्वतंत्र खात्री करा.",
    note:
      "Never pay for a job offer without independent verification. My Classifieds does not guarantee employment, salary or employer identity.",
    breadcrumb: [
      { name: "Home", path: "/" },
      { name: "Baramati", path: "/ads?city=baramati" },
      { name: "Jobs", path: "/baramati/jobs" }
    ]
  },
  baramatiUsedVehicles: {
    path: "/baramati/used-vehicles",
    title: "Used Vehicles in Baramati | My Classifieds",
    description:
      "Browse approved used vehicle classifieds in Baramati for two-wheelers, cars and local vehicle listings.",
    h1: "Used Vehicles in Baramati",
    eyebrow: "Vehicles",
    categorySlug: "vehicles",
    citySlug: "baramati",
    searchHref: "/ads?category=vehicles&city=baramati",
    introEn:
      "Find used vehicle advertisements in Baramati for two-wheelers, cars and other local vehicle listings. Check documents, ownership and vehicle condition before paying.",
    introMr:
      "बारामतीमधील वापरलेली वाहने, दुचाकी, कार व इतर वाहनांच्या स्थानिक जाहिराती येथे पाहा. पैसे देण्यापूर्वी कागदपत्रे, मालकी व वाहनाची स्थिती तपासा.",
    note:
      "Verify RC, insurance, loan/hypothecation status, challans and physical condition before purchase.",
    breadcrumb: [
      { name: "Home", path: "/" },
      { name: "Baramati", path: "/ads?city=baramati" },
      { name: "Used Vehicles", path: "/baramati/used-vehicles" }
    ]
  },
  baramatiLocalServices: {
    path: "/baramati/local-services",
    title: "Local Services in Baramati | My Classifieds",
    description:
      "Browse approved local service classifieds in Baramati for household, business, repair and professional services.",
    h1: "Local Services in Baramati",
    eyebrow: "Services Near You",
    categorySlug: "local-services",
    citySlug: "baramati",
    searchHref: "/ads?category=local-services&city=baramati",
    introEn:
      "Discover local service advertisements in Baramati for household help, repairs, business support and professional services. Speak directly with the service provider and agree scope, price and timeline clearly.",
    introMr:
      "बारामतीमधील घरगुती, दुरुस्ती, व्यवसाय सहाय्य व व्यावसायिक सेवांच्या जाहिराती येथे पाहा. सेवा, दर व वेळापत्रक स्पष्टपणे ठरवूनच व्यवहार करा.",
    note:
      "My Classifieds facilitates advertisements only and does not certify service quality, licence or performance.",
    breadcrumb: [
      { name: "Home", path: "/" },
      { name: "Baramati", path: "/ads?city=baramati" },
      { name: "Local Services", path: "/baramati/local-services" }
    ]
  },
  maharashtraAgricultureEquipment: {
    path: "/maharashtra/agriculture-equipment",
    title: "Agriculture Equipment Classifieds in Maharashtra | My Classifieds",
    description:
      "Browse approved agriculture equipment classifieds in Maharashtra, including farm machinery and local farm-use equipment listings.",
    h1: "Agriculture Equipment Classifieds in Maharashtra",
    eyebrow: "Farm and Agriculture",
    categorySlug: "agriculture-equipment",
    citySlug: null,
    searchHref: "/ads?category=agriculture-equipment",
    introEn:
      "Browse agriculture equipment advertisements across Maharashtra, including farm machinery and tools posted by users. Check ownership, condition, serviceability and documents before payment.",
    introMr:
      "महाराष्ट्रातील शेती उपकरणे, यंत्रे व farm-use साधनांच्या जाहिराती येथे पाहा. पैसे देण्यापूर्वी मालकी, स्थिती, वापरयोग्यता व कागदपत्रे तपासा.",
    note:
      "Inspect equipment personally where possible and avoid advance payments without reliable verification.",
    breadcrumb: [
      { name: "Home", path: "/" },
      { name: "Maharashtra", path: "/ads" },
      {
        name: "Agriculture Equipment",
        path: "/maharashtra/agriculture-equipment"
      }
    ]
  }
};

export function getLandingPageMetadata(config) {
  return buildPageMetadata({
    title: config.title,
    description: config.description,
    path: config.path
  });
}

export const landingPageSitemapRoutes = Object.values(landingPages).map((page) => page.path);
