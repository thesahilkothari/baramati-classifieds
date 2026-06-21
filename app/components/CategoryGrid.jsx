import Link from "next/link";
import {
  Home,
  Briefcase,
  Car,
  Smartphone,
  Tractor,
  Wrench,
  KeyRound
} from "lucide-react";

const categories = [
  {
    name: "Real Estate",
    mr: "मालमत्ता",
    slug: "real-estate",
    icon: Home
  },
  {
    name: "Jobs",
    mr: "नोकऱ्या",
    slug: "jobs",
    icon: Briefcase
  },
  {
    name: "Vehicles",
    mr: "वाहने",
    slug: "vehicles",
    icon: Car
  },
  {
    name: "Electronics",
    mr: "इलेक्ट्रॉनिक्स",
    slug: "electronics",
    icon: Smartphone
  },
  {
    name: "Agriculture Equipment",
    mr: "शेती उपकरणे",
    slug: "agriculture-equipment",
    icon: Tractor
  },
  {
    name: "Local Services",
    mr: "स्थानिक सेवा",
    slug: "local-services",
    icon: Wrench
  },
  {
    name: "To Rent / Let",
    mr: "भाड्याने / देणे",
    slug: "to-rent-let",
    icon: KeyRound
  }
];

export default function CategoryGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {categories.map((category) => {
        const Icon = category.icon;

        return (
          <Link
            key={category.slug}
            href={`/category/${category.slug}`}
            className="rounded-2xl border bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <Icon className="h-8 w-8 text-blue-700" />
            <h3 className="mt-4 font-bold">{category.name}</h3>
            <p className="text-sm text-slate-500">{category.mr}</p>
          </Link>
        );
      })}
    </div>
  );
}
