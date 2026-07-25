"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

const TEXT = {
  en: {
    lookupTitle: "Check Your Ad Status",
    lookupText:
      "Enter the mobile number used while posting the ad. You can check approval, payment, expiry, renewal and sold status from here.",
    mobile: "Mobile Number",
    search: "Search My Ads",
    searching: "Searching...",
    noAds: "No ads found for this mobile number.",
    paymentStatus: "Payment Status",
    category: "Category",
    city: "City",
    price: "Price",
    expiry: "Expiry",
    created: "Created",
    views: "Views",
    viewPublicAd: "View Public Ad",
    renewUpgrade: "Renew / Upgrade",
    markAvailable: "Mark Available",
    soldThroughPlatform: "Sold Through My Classifieds",
    soldElsewhere: "Sold Elsewhere",
    editRequest: "Request Edit",
    reportIssue: "Need Help",
    pending: "Pending admin approval",
    active: "Active",
    rejected: "Rejected",
    expired: "Expired",
    sold: "Sold",
    paymentPending: "Payment under manual verification",
    paymentPaid: "Payment verified",
    noPayment: "No payment record",
    pendingApprovalNote:
      "Your classified has been submitted and is waiting for admin review.",
    pendingPaymentNote:
      "Your UPI reference has been submitted and is waiting for manual verification.",
    rejectedNote:
      "Your classified was rejected or needs correction. Contact support for clarification.",
    expiredNote:
      "Your classified has expired. Renew or upgrade it to make it visible again.",
    activeNote:
      "Your classified is live. You can renew, upgrade, request correction or mark it as sold.",
    soldNote:
      "This classified is marked as sold.",
    supportMessage:
      "Hello My Classifieds, I need help with my ad status.",
    statusUpdated: "Status updated successfully."
  },
  mr: {
    lookupTitle: "आपल्या जाहिरातीचा Status तपासा",
    lookupText:
      "जाहिरात पोस्ट करताना वापरलेला मोबाईल नंबर भरा. येथे approval, payment, expiry, renewal आणि sold status तपासू शकता.",
    mobile: "मोबाईल नंबर",
    search: "माझ्या जाहिराती शोधा",
    searching: "शोधत आहे...",
    noAds: "या मोबाईल नंबरवर जाहिराती सापडल्या नाहीत.",
    paymentStatus: "Payment Status",
    category: "कॅटेगरी",
    city: "शहर",
    price: "किंमत",
    expiry: "Expiry",
    created: "Created",
    views: "Views",
    viewPublicAd: "Public Ad पाहा",
    renewUpgrade: "Renew / Upgrade",
    markAvailable: "Available म्हणून Mark करा",
    soldThroughPlatform: "My Classifieds द्वारे विकले",
    soldElsewhere: "इतर ठिकाणी विकले",
    editRequest: "Edit Request",
    reportIssue: "मदत हवी आहे",
    pending: "Admin approval pending",
    active: "Active",
    rejected: "Rejected",
    expired: "Expired",
    sold: "Sold",
    paymentPending: "Manual payment verification pending",
    paymentPaid: "Payment verified",
    noPayment: "Payment record नाही",
    pendingApprovalNote:
      "आपली जाहिरात सबमिट झाली आहे आणि admin review साठी pending आहे.",
    pendingPaymentNote:
      "आपला UPI reference सबमिट झाला आहे आणि manual verification साठी pending आहे.",
    rejectedNote:
      "आपली जाहिरात rejected आहे किंवा correction आवश्यक आहे. clarification साठी support ला contact करा.",
    expiredNote:
      "आपली जाहिरात expired झाली आहे. पुन्हा visible करण्यासाठी renew किंवा upgrade करा.",
    activeNote:
      "आपली जाहिरात live आहे. आपण renew, upgrade, correction request किंवा sold mark करू शकता.",
    soldNote:
      "ही जाहिरात sold म्हणून mark केलेली आहे.",
    supportMessage:
      "नमस्कार My Classifieds, मला माझ्या जाहिरातीच्या status बाबत मदत हवी आहे.",
    statusUpdated: "Status update झाला."
  }
};

function cleanMobile(value) {
  return String(value || "").replace(/\D/g, "").slice(0, 10);
}

function formatDate(value, language) {
  if (!value) return "-";

  return new Intl.DateTimeFormat(language === "mr" ? "mr-IN" : "en-IN", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

function formatPrice(value) {
  if (!value) return "Call for price";

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(Number(value));
}

function formatPaymentAmount(amountInPaise) {
  if (!amountInPaise) return "-";

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(Number(amountInPaise) / 100);
}

function getStatusLabel(status, text) {
  if (status === "PENDING") return text.pending;
  if (status === "ACTIVE") return text.active;
  if (status === "REJECTED") return text.rejected;
  if (status === "EXPIRED") return text.expired;
  if (status === "SOLD") return text.sold;

  return status || "-";
}

function getStatusClass(status) {
  if (status === "ACTIVE") return "bg-green-700 text-white";
  if (status === "PENDING") return "bg-yellow-400 text-slate-950";
  if (status === "REJECTED") return "bg-red-700 text-white";
  if (status === "EXPIRED") return "bg-slate-700 text-white";
  if (status === "SOLD") return "bg-blue-700 text-white";

  return "bg-slate-200 text-slate-800";
}

function getStatusNote(ad, text) {
  if (ad.status === "PENDING" && ad.paymentSummary?.pendingVerification) {
    return text.pendingPaymentNote;
  }

  if (ad.status === "PENDING") return text.pendingApprovalNote;
  if (ad.status === "ACTIVE") return text.activeNote;
  if (ad.status === "REJECTED") return text.rejectedNote;
  if (ad.status === "EXPIRED") return text.expiredNote;
  if (ad.status === "SOLD") return text.soldNote;

  return "";
}

function getPaymentLabel(paymentSummary, text) {
  if (paymentSummary?.pendingVerification) return text.paymentPending;
  if (paymentSummary?.verifiedPaid) return text.paymentPaid;

  return text.noPayment;
}

function buildWhatsAppUrl(message, ad) {
  const detailedMessage = `${message}

Ad ID: ${ad?.id || ""}
Ad Title: ${ad?.title || ""}`;

  return `https://wa.me/919673931166?text=${encodeURIComponent(detailedMessage)}`;
}

export default function UserAdsDashboard({ initialMobile = "", initialLanguage = "en" }) {
  const language = initialLanguage === "mr" ? "mr" : "en";
  const text = TEXT[language];
  const [mobile, setMobile] = useState(cleanMobile(initialMobile));
  const [ads, setAds] = useState([]);
  const [hasSearched, setHasSearched] = useState(Boolean(initialMobile));
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [updatingAdId, setUpdatingAdId] = useState(null);

  const sortedAds = useMemo(() => ads, [ads]);

  async function fetchAds(event) {
    event?.preventDefault();

    setError("");
    setMessage("");

    const clean = cleanMobile(mobile);

    if (clean.length !== 10) {
      setError("Please enter a valid 10 digit mobile number.");
      return;
    }

    setMobile(clean);
    setIsSearching(true);

    try {
      const response = await fetch(`/api/user/ads?mobile=${clean}`);
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Unable to fetch ads.");
        return;
      }

      setAds(data.ads || []);
      setHasSearched(true);

      const nextUrl = new URL(window.location.href);
      nextUrl.searchParams.set("mobile", clean);
      window.history.replaceState(null, "", nextUrl.toString());
    } catch (lookupError) {
      console.error("User ad lookup failed:", lookupError);
      setError("Unable to fetch your ads. Please try again.");
    } finally {
      setIsSearching(false);
    }
  }

  async function updateSoldStatus(ad, soldStatus) {
    setError("");
    setMessage("");
    setUpdatingAdId(ad.id);

    try {
      const response = await fetch("/api/user/ad-status", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          adId: ad.id,
          mobile,
          soldStatus
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Unable to update status.");
        return;
      }

      setMessage(text.statusUpdated);
      await fetchAds();
    } catch (updateError) {
      console.error("User status update failed:", updateError);
      setError("Unable to update ad status. Please try again.");
    } finally {
      setUpdatingAdId(null);
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border-2 border-slate-900 bg-white p-5 shadow-sm md:p-8">
        <p className="text-sm font-black uppercase tracking-wide text-blue-700">
          My Ads
        </p>

        <h1 className="mt-2 text-3xl font-black uppercase leading-tight text-slate-950 md:text-5xl">
          {text.lookupTitle}
        </h1>

        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-700">
          {text.lookupText}
        </p>

        <form onSubmit={fetchAds} className="mt-6 grid gap-3 md:grid-cols-[1fr_auto]">
          <div>
            <label className="text-sm font-bold text-slate-700">
              {text.mobile}
            </label>
            <input
              value={mobile}
              onChange={(event) => setMobile(cleanMobile(event.target.value))}
              className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-700"
              placeholder="9876543210"
              inputMode="numeric"
              maxLength={10}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSearching}
            className="self-end rounded-xl bg-blue-700 px-6 py-3 font-black uppercase text-white hover:bg-blue-800 disabled:opacity-60"
          >
            {isSearching ? text.searching : text.search}
          </button>
        </form>
      </section>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      {message && (
        <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm font-semibold text-green-700">
          {message}
        </div>
      )}

      {hasSearched && sortedAds.length === 0 && !isSearching && (
        <section className="rounded-3xl border bg-white p-8 text-center shadow-sm">
          <h2 className="text-2xl font-black text-slate-950">
            {text.noAds}
          </h2>
          <Link
            href="/post-ad"
            className="mt-5 inline-flex rounded-xl bg-red-600 px-6 py-3 text-sm font-black uppercase text-white"
          >
            Post New Ad
          </Link>
        </section>
      )}

      {sortedAds.length > 0 && (
        <section className="space-y-5">
          {sortedAds.map((ad) => {
            const canViewPublic = ["ACTIVE", "SOLD"].includes(ad.status);
            const statusNote = getStatusNote(ad, text);
            const paymentLabel = getPaymentLabel(ad.paymentSummary, text);

            return (
              <article
                key={ad.id}
                className="rounded-3xl border bg-white p-5 shadow-sm md:p-6"
              >
                <div className="grid gap-5 xl:grid-cols-[1fr_340px]">
                  <div>
                    <div className="flex flex-wrap gap-2">
                      <span className={`rounded px-3 py-1 text-xs font-black uppercase ${getStatusClass(ad.status)}`}>
                        {getStatusLabel(ad.status, text)}
                      </span>

                      {ad.isFeatured && (
                        <span className="rounded bg-orange-500 px-3 py-1 text-xs font-black uppercase text-white">
                          Featured
                        </span>
                      )}

                      <span className="rounded bg-slate-100 px-3 py-1 text-xs font-black uppercase text-slate-700">
                        #{ad.id}
                      </span>
                    </div>

                    <h2 className="mt-4 text-2xl font-black text-slate-950">
                      {ad.title}
                    </h2>

                    <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-700">
                      {ad.description}
                    </p>

                    <div className="mt-4 grid gap-3 text-sm md:grid-cols-2 lg:grid-cols-3">
                      <div className="rounded-2xl border bg-slate-50 p-4">
                        <p className="text-xs font-black uppercase text-slate-500">
                          {text.category}
                        </p>
                        <p className="mt-1 font-bold text-slate-900">
                          {language === "mr"
                            ? ad.category?.nameMr || ad.category?.nameEn || "-"
                            : ad.category?.nameEn || "-"}
                        </p>
                      </div>

                      <div className="rounded-2xl border bg-slate-50 p-4">
                        <p className="text-xs font-black uppercase text-slate-500">
                          {text.city}
                        </p>
                        <p className="mt-1 font-bold text-slate-900">
                          {ad.city?.name || "-"}
                        </p>
                      </div>

                      <div className="rounded-2xl border bg-slate-50 p-4">
                        <p className="text-xs font-black uppercase text-slate-500">
                          {text.price}
                        </p>
                        <p className="mt-1 font-bold text-slate-900">
                          {formatPrice(ad.price)}
                        </p>
                      </div>

                      <div className="rounded-2xl border bg-slate-50 p-4">
                        <p className="text-xs font-black uppercase text-slate-500">
                          {text.created}
                        </p>
                        <p className="mt-1 font-bold text-slate-900">
                          {formatDate(ad.createdAt, language)}
                        </p>
                      </div>

                      <div className="rounded-2xl border bg-slate-50 p-4">
                        <p className="text-xs font-black uppercase text-slate-500">
                          {text.expiry}
                        </p>
                        <p className="mt-1 font-bold text-slate-900">
                          {formatDate(ad.expiresAt, language)}
                        </p>
                      </div>

                      <div className="rounded-2xl border bg-slate-50 p-4">
                        <p className="text-xs font-black uppercase text-slate-500">
                          {text.views}
                        </p>
                        <p className="mt-1 font-bold text-slate-900">
                          {ad.views || 0}
                        </p>
                      </div>
                    </div>

                    {statusNote && (
                      <div className="mt-4 rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm font-semibold leading-6 text-blue-900">
                        {statusNote}
                      </div>
                    )}
                  </div>

                  <aside className="rounded-3xl border bg-slate-50 p-4">
                    <div>
                      <p className="text-xs font-black uppercase text-slate-500">
                        {text.paymentStatus}
                      </p>
                      <p className="mt-2 font-black text-slate-950">
                        {paymentLabel}
                      </p>

                      {ad.paymentSummary?.latestAmount && (
                        <p className="mt-1 text-sm text-slate-600">
                          {formatPaymentAmount(ad.paymentSummary.latestAmount)} |{" "}
                          {ad.paymentSummary.latestPlan}
                        </p>
                      )}

                      {ad.paymentSummary?.latestReference && (
                        <p className="mt-2 break-all rounded-xl bg-white p-3 font-mono text-xs text-slate-600">
                          {ad.paymentSummary.latestReference}
                        </p>
                      )}
                    </div>

                    <div className="mt-5 grid gap-2">
                      {canViewPublic && (
                        <Link
                          href={`/ads/${ad.slug}`}
                          target="_blank"
                          className="rounded-xl bg-blue-700 px-4 py-3 text-center text-xs font-black uppercase text-white hover:bg-blue-800"
                        >
                          {text.viewPublicAd}
                        </Link>
                      )}

                      <Link
                        href={`/renew?adId=${ad.id}&mobile=${mobile}`}
                        className="rounded-xl bg-red-600 px-4 py-3 text-center text-xs font-black uppercase text-white hover:bg-red-700"
                      >
                        {text.renewUpgrade}
                      </Link>

                      <Link
                        href={`/edit-request?adId=${ad.id}&mobile=${mobile}`}
                        className="rounded-xl border bg-white px-4 py-3 text-center text-xs font-black uppercase text-slate-700 hover:bg-slate-50"
                      >
                        {text.editRequest}
                      </Link>

                      {ad.status !== "SOLD" ? (
                        <>
                          <button
                            type="button"
                            onClick={() => updateSoldStatus(ad, "SOLD_MYCLASSIFIEDS")}
                            disabled={updatingAdId === ad.id}
                            className="rounded-xl border bg-white px-4 py-3 text-xs font-black uppercase text-slate-700 hover:bg-slate-50 disabled:opacity-60"
                          >
                            {text.soldThroughPlatform}
                          </button>

                          <button
                            type="button"
                            onClick={() => updateSoldStatus(ad, "SOLD_ELSEWHERE")}
                            disabled={updatingAdId === ad.id}
                            className="rounded-xl border bg-white px-4 py-3 text-xs font-black uppercase text-slate-700 hover:bg-slate-50 disabled:opacity-60"
                          >
                            {text.soldElsewhere}
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={() => updateSoldStatus(ad, "AVAILABLE")}
                          disabled={updatingAdId === ad.id}
                          className="rounded-xl border bg-white px-4 py-3 text-xs font-black uppercase text-slate-700 hover:bg-slate-50 disabled:opacity-60"
                        >
                          {text.markAvailable}
                        </button>
                      )}

                      <a
                        href={buildWhatsAppUrl(text.supportMessage, ad)}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-xl border bg-white px-4 py-3 text-center text-xs font-black uppercase text-slate-700 hover:bg-slate-50"
                      >
                        {text.reportIssue}
                      </a>
                    </div>
                  </aside>
                </div>
              </article>
            );
          })}
        </section>
      )}
    </div>
  );
}
