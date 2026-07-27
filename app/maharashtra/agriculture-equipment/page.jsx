import SeoLandingPage from "../../components/SeoLandingPage";
import { getLandingPageMetadata, landingPages } from "../../lib/seoLandingPages";

export const dynamic = "force-dynamic";
export const metadata = getLandingPageMetadata(landingPages.maharashtraAgricultureEquipment);

export default function MaharashtraAgricultureEquipmentPage() {
  return <SeoLandingPage config={landingPages.maharashtraAgricultureEquipment} />;
}
