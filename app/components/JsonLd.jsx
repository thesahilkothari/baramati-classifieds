export default function JsonLd({ data }) {
  const schemas = Array.isArray(data) ? data.filter(Boolean) : [data].filter(Boolean);

  if (schemas.length === 0) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schemas.length === 1 ? schemas[0] : schemas)
      }}
    />
  );
}
