import SeoLandingPage from "../../components/SeoLandingPage";
import { getLandingPageMetadata, landingPages } from "../../lib/seoLandingPages";

export const dynamic = "force-dynamic";
export const metadata = getLandingPageMetadata(landingPages.baramatiJobs);

export default function BaramatiJobsPage() {
  return <SeoLandingPage config={landingPages.baramatiJobs} />;
}
