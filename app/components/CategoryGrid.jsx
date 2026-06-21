import Link from "next/link";

const categories = [
  ["Real Estate", "मालमत्ता", "real-estate"],
  ["Jobs", "नोकऱ्या", "jobs"],
  ["Vehicles", "वाहने", "vehicles"],
  ["Electronics", "इलेक्ट्रॉनिक्स", "electronics"],
  ["Agriculture Equipment", "शेती उपकरणे", "agriculture-equipment"],
  ["Local Services", "स्थानिक सेवा", "local-services"],
  ["To Rent / Let", "भाड्याने / देणे", "to-rent-let"],
];

export default function CategoryGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {categories.map(([name, mr, slug]) => (
        <Link
          key={slug}
          href={`/category/${slug}`}
          className="rounded-2xl border bg-white p-5 shadow-sm hover:shadow-md"
        >
          <h3 className="font-bold">{name}</h3>
          <p className="mt-1 text-sm text-slate-500">{mr}</p>
        </Link>
      ))}
    </div>
  );
}
