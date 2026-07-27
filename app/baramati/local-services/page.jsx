import SeoLandingPage from "../../components/SeoLandingPage";
import { getLandingPageMetadata, landingPages } from "../../lib/seoLandingPages";

export const dynamic = "force-dynamic";
export const metadata = getLandingPageMetadata(landingPages.baramatiLocalServices);

export default function BaramatiLocalServicesPage() {
  return <SeoLandingPage config={landingPages.baramatiLocalServices} />;
}
