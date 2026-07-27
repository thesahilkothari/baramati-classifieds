import SeoLandingPage from "../../components/SeoLandingPage";
import { getLandingPageMetadata, landingPages } from "../../lib/seoLandingPages";

export const dynamic = "force-dynamic";
export const metadata = getLandingPageMetadata(landingPages.baramatiProperty);

export default function BaramatiPropertyPage() {
  return <SeoLandingPage config={landingPages.baramatiProperty} />;
}
