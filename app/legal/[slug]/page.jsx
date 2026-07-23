import Link from "next/link";
import { notFound } from "next/navigation";
import MarkdownContent from "../../components/MarkdownContent";
import {
  getLegalPage,
  getLegalTitle,
  LEGAL_PAGES,
  normalizeLegalLanguage,
  POLICY_EFFECTIVE_DATE,
  POLICY_VERSION,
  readLegalMarkdown
} from "../../lib/legalContent";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return LEGAL_PAGES.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params, searchParams }) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const page = getLegalPage(resolvedParams.slug);

  if (!page) {
    return {
      title: "Legal Page Not Found | My Classifieds"
    };
  }

  const lang = normalizeLegalLanguage(resolvedSearchParams?.lang);
  const title = getLegalTitle(page, lang);

  return {
    title: `${title} | My Classifieds`,
    description: `${title} for My Classifieds. Version ${POLICY_VERSION}, effective ${POLICY_EFFECTIVE_DATE}.`
  };
}

export default async function LegalDocumentPage({ params, searchParams }) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const page = getLegalPage(resolvedParams.slug);

  if (!page) {
    notFound();
  }

  const lang = normalizeLegalLanguage(resolvedSearchParams?.lang);
  const title = getLegalTitle(page, lang);
  const content = await readLegalMarkdown({ slug: page.slug, lang });

  if (!content) {
    notFound();
  }

  const otherLang = lang === "mr" ? "en" : "mr";

  return (
    <main className="bg-slate-100 px-4 py-10">
      <section className="mx-auto max-w-5xl">
        <div className="rounded-3xl border-2 border-slate-900 bg-white p-6 shadow-sm md:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b pb-5">
            <div>
              <Link href="/legal" className="text-sm font-bold text-blue-700">
                ← Legal Hub
              </Link>
              <p className="mt-4 text-xs font-black uppercase tracking-wide text-red-600">
                Version {POLICY_VERSION} | Effective {POLICY_EFFECTIVE_DATE}
              </p>
              <h1 className="mt-2 text-3xl font-black uppercase text-slate-950 md:text-4xl">
                {title}
              </h1>
            </div>

            <Link
              href={`/legal/${page.slug}?lang=${otherLang}`}
              className="rounded-xl border px-4 py-3 text-sm font-black uppercase text-slate-700 hover:bg-slate-50"
            >
              {lang === "mr" ? "Read in English" : "मराठीत वाचा"}
            </Link>
          </div>

          <article className="mt-8">
            <MarkdownContent content={content} />
          </article>
        </div>
      </section>
    </main>
  );
}
