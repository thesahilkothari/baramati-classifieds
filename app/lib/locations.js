export const ALLOWED_TIER2_LOCATIONS = [
  {
    name: "Baramati",
    slug: "baramati",
    latitude: 18.1517,
    longitude: 74.5776
  },
  {
    name: "Phaltan",
    slug: "phaltan",
    latitude: 17.9911,
    longitude: 74.4318
  },
  {
    name: "Akluj",
    slug: "akluj",
    latitude: 17.8833,
    longitude: 75.0167
  },
  {
    name: "Solapur",
    slug: "solapur",
    latitude: 17.6599,
    longitude: 75.9064
  },
  {
    name: "Karad",
    slug: "karad",
    latitude: 17.2851,
    longitude: 74.1844
  },
  {
    name: "Satara",
    slug: "satara",
    latitude: 17.6805,
    longitude: 74.0183
  },
  {
    name: "Sangli",
    slug: "sangli",
    latitude: 16.8524,
    longitude: 74.5815
  },
  {
    name: "Indapur",
    slug: "indapur",
    latitude: 18.1187,
    longitude: 75.0236
  },
  {
    name: "Daund",
    slug: "daund",
    latitude: 18.4655,
    longitude: 74.5833
  },
  {
    name: "Shirur",
    slug: "shirur",
    latitude: 18.8276,
    longitude: 74.3747
  },
  {
    name: "Nashik",
    slug: "nashik",
    latitude: 19.9975,
    longitude: 73.7898
  },
  {
    name: "Chhatrapati Sambhajinagar",
    slug: "chhatrapati-sambhajinagar",
    latitude: 19.8762,
    longitude: 75.3433
  },
  {
    name: "Ahilyanagar",
    slug: "ahilyanagar",
    latitude: 19.0948,
    longitude: 74.748
  }
];

export const ALLOWED_TIER2_LOCATION_SLUGS = ALLOWED_TIER2_LOCATIONS.map(
  (location) => location.slug
);

export const ALLOWED_TIER2_LOCATION_LABEL =
  "Baramati, Phaltan, Akluj, Solapur, Karad, Satara, Sangli, Indapur, Daund, Shirur, Nashik, Chhatrapati Sambhajinagar and Ahilyanagar";

export function isAllowedTier2LocationSlug(slug) {
  return ALLOWED_TIER2_LOCATION_SLUGS.includes(String(slug || ""));
}

export function filterAllowedTier2Locations(cities = []) {
  const cityBySlug = new Map(
    cities
      .filter((city) => isAllowedTier2LocationSlug(city?.slug))
      .map((city) => [city.slug, city])
  );

  return ALLOWED_TIER2_LOCATIONS.map((location) => {
    const databaseCity = cityBySlug.get(location.slug);

    return databaseCity
      ? { ...databaseCity, name: location.name, slug: location.slug }
      : location;
  });
}

export function getAllowedTier2LocationWhere() {
  return {
    slug: {
      in: ALLOWED_TIER2_LOCATION_SLUGS
    }
  };
}

export function getAllowedAdCityWhere() {
  return {
    city: {
      is: getAllowedTier2LocationWhere()
    }
  };
}

export async function ensureAllowedTier2Locations(prisma) {
  const existingCities = await prisma.city.findMany({
    where: getAllowedTier2LocationWhere(),
    select: { slug: true }
  });

  const existingSlugs = new Set(existingCities.map((city) => city.slug));
  const missingLocations = ALLOWED_TIER2_LOCATIONS.filter(
    (location) => !existingSlugs.has(location.slug)
  );

  if (missingLocations.length === 0) return;

  await Promise.all(
    missingLocations.map((location) =>
      prisma.city.upsert({
        where: { slug: location.slug },
        update: location,
        create: location
      })
    )
  );
}

export async function getAllowedTier2Cities(prisma) {
  await ensureAllowedTier2Locations(prisma);

  const cities = await prisma.city.findMany({
    where: getAllowedTier2LocationWhere()
  });

  return filterAllowedTier2Locations(cities).filter((city) => city.id);
}

export function getAllowedTier2CitySearchOptions() {
  return ALLOWED_TIER2_LOCATIONS;
}
