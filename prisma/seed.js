const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const categories = [
  { nameEn: "Real Estate", nameMr: "रिअल इस्टेट", slug: "real-estate", icon: "🏠" },
  { nameEn: "Jobs", nameMr: "नोकरी", slug: "jobs", icon: "💼" },
  { nameEn: "Vehicles", nameMr: "वाहने", slug: "vehicles", icon: "🚗" },
  { nameEn: "Electronics", nameMr: "इलेक्ट्रॉनिक्स", slug: "electronics", icon: "📱" },
  { nameEn: "Agriculture Equipment", nameMr: "शेती उपकरणे", slug: "agriculture-equipment", icon: "🚜" },
  { nameEn: "Local Services", nameMr: "स्थानिक सेवा", slug: "local-services", icon: "🛠️" },
  { nameEn: "Education", nameMr: "शिक्षण", slug: "education", icon: "📚" },
  { nameEn: "Business & Commercial", nameMr: "व्यवसाय", slug: "business-commercial", icon: "🏪" }
];

const cities = [
  { name: "Baramati", slug: "baramati", latitude: 18.1517, longitude: 74.5776 },
  { name: "Pune", slug: "pune", latitude: 18.5204, longitude: 73.8567 },
  { name: "Indapur", slug: "indapur", latitude: 18.1187, longitude: 75.0236 },
  { name: "Daund", slug: "daund", latitude: 18.4655, longitude: 74.5833 },
  { name: "Phaltan", slug: "phaltan", latitude: 17.9911, longitude: 74.4318 },
  { name: "Akluj", slug: "akluj", latitude: 17.8833, longitude: 75.0167 }
];

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

async function main() {
  console.log("Seeding categories and cities...");

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: category,
      create: category
    });
  }

  for (const city of cities) {
    await prisma.city.upsert({
      where: { slug: city.slug },
      update: city,
      create: city
    });
  }

  const user = await prisma.user.upsert({
    where: { mobile: "9673931666" },
    update: {
      name: "My Classifieds Demo User",
      isVerified: true
    },
    create: {
      name: "My Classifieds Demo User",
      mobile: "9673931666",
      email: "thesahilkothari@gmail.com",
      isVerified: true
    }
  });

  const realEstate = await prisma.category.findUnique({ where: { slug: "real-estate" } });
  const jobs = await prisma.category.findUnique({ where: { slug: "jobs" } });
  const vehicles = await prisma.category.findUnique({ where: { slug: "vehicles" } });
  const electronics = await prisma.category.findUnique({ where: { slug: "electronics" } });
  const agri = await prisma.category.findUnique({ where: { slug: "agriculture-equipment" } });

  const baramati = await prisma.city.findUnique({ where: { slug: "baramati" } });
  const pune = await prisma.city.findUnique({ where: { slug: "pune" } });

  const demoAds = [
    {
      title: "2 BHK Flat for Sale in Baramati",
      description:
        "Spacious 2 BHK flat available in a good residential area of Baramati. Suitable for family residence or investment.",
      price: "4200000",
      mobile: "9673931666",
      whatsapp: "9673931666",
      address: "Baramati, Maharashtra",
      status: "ACTIVE",
      adType: "FEATURED",
      isFeatured: true,
      categoryId: realEstate.id,
      cityId: baramati.id
    },
    {
      title: "Office Assistant Job in Baramati",
      description:
        "Local business requires office assistant with basic computer knowledge, communication skills and document handling ability.",
      price: "12000",
      mobile: "9673931666",
      whatsapp: "9673931666",
      address: "Baramati MIDC",
      status: "ACTIVE",
      adType: "FREE",
      isFeatured: false,
      categoryId: jobs.id,
      cityId: baramati.id
    },
    {
      title: "Used Two Wheeler for Sale",
      description:
        "Well-maintained two wheeler available for sale. Documents available. Genuine buyers may contact.",
      price: "45000",
      mobile: "9673931666",
      whatsapp: "9673931666",
      address: "Baramati",
      status: "ACTIVE",
      adType: "FREE",
      isFeatured: false,
      categoryId: vehicles.id,
      cityId: baramati.id
    },
    {
      title: "Laptop for Students and Office Use",
      description:
        "Good condition laptop suitable for students, office work, online classes and basic business use.",
      price: "18000",
      mobile: "9673931666",
      whatsapp: "9673931666",
      address: "Pune",
      status: "ACTIVE",
      adType: "FREE",
      isFeatured: false,
      categoryId: electronics.id,
      cityId: pune.id
    },
    {
      title: "Agriculture Sprayer Machine Available",
      description:
        "Agriculture sprayer machine available for sale. Suitable for farm use. Contact for details.",
      price: "8500",
      mobile: "9673931666",
      whatsapp: "9673931666",
      address: "Baramati rural area",
      status: "ACTIVE",
      adType: "FEATURED",
      isFeatured: true,
      categoryId: agri.id,
      cityId: baramati.id
    }
  ];

  console.log("Seeding demo ads...");

  for (const ad of demoAds) {
    const slug = slugify(ad.title);

    await prisma.ad.upsert({
      where: { slug },
      update: ad,
      create: {
        ...ad,
        slug,
        userId: user.id
      }
    });
  }

  console.log("Seed completed successfully.");
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
