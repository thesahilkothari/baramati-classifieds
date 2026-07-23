import { redirect } from "next/navigation";

export default function DisclaimerRedirectPage() {
  redirect("/legal/safety");
}
