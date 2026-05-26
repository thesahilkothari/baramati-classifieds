const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const categories = [
    { nameEn: "Real Estate", nameMr: "मालमत्ता", slug: "real-estate", icon: "home" },
    { nameEn: "Jobs", nameMr: "नोकऱ्या", slug: "jobs", icon: "briefcase" },
    { nameEn: "Vehicles", nameMr: "वाहने", slug: "vehicles", icon: "car" },
    { nameEn: "Electronics", nameMr: "इलेक्ट्रॉनिक्स", slug: "electronics", icon: "smartphone" },
    { nameEn: "Agriculture Equipment", nameMr: "शेती उपकरणे", slug: "agriculture-equipment", icon: "tractor" },
    { nameEn: "Local Services", nameMr: "स्थानिक सेवा", slug: "local-services", icon: "wrench" },
    { nameEn: "To Rent / Let", nameMr: "भाड्याने / देणे", slug: "to-rent-let", icon: "key" },
  ];

  const cities = [
    { name: "Baramati", slug: "baramati", latitude: 18.1517, longitude: 74.5777 },
    { name: "Pune", slug: "pune", latitude: 18.5204, longitude: 73.8567 },
    { name: "Mumbai", slug: "mumbai", latitude: 19.0760, longitude: 72.8777 },
    { name: "Nagpur", slug: "nagpur", latitude: 21.1458, longitude: 79.0882 },
    { name: "Nashik", slug: "nashik", latitude: 19.9975, longitude: 73.7898 },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
  }

  for (const city of cities) {
    await prisma.city.upsert({
      where: { slug: city.slug },
      update: {},
      create: city,
    });
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
