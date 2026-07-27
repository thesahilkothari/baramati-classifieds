import SeoLandingPage from "../../components/SeoLandingPage";
import { getLandingPageMetadata, landingPages } from "../../lib/seoLandingPages";

export const dynamic = "force-dynamic";
export const metadata = getLandingPageMetadata(landingPages.baramatiUsedVehicles);

export default function BaramatiUsedVehiclesPage() {
  return <SeoLandingPage config={landingPages.baramatiUsedVehicles} />;
}
