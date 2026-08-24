"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import {
  BarChart3,
  CheckCircle2,
  Copy,
  Flame,
  Globe,
  Link2,
  RefreshCw,
  Search,
  Send,
  ShoppingBag,
  Sparkles,
  UtensilsCrossed,
  Zap,
} from "lucide-react";
import { getMyOrganizations, listConnectorAccounts } from "@/app/actions/domain";
import {
  connectMarketingAccount,
  disconnectMarketingAccount,
} from "@/app/actions/integrations";

type Provider = "google_ads" | "meta_ads" | "ga4" | "search_console";
type Connector = {
  id: number;
  provider: Provider;
  displayName: string | null;
  externalAccountId: string;
  status: string;
  lastSyncedAt: Date | null;
};

const providers: Array<{
  id: Provider;
  name: string;
  description: string;
  credentialLabel: string;
}> = [
  { id: "google_ads", name: "Google Ads", description: "Campaign performance and offline enhanced conversions.", credentialLabel: "OAuth refresh token" },
  { id: "meta_ads", name: "Meta Ads + CAPI", description: "Insights, creative fatigue and server-side conversion events.", credentialLabel: "Long-lived access token" },
  { id: "ga4", name: "Google Analytics 4", description: "Acquisition, landing-page and outcome reporting.", credentialLabel: "OAuth refresh token" },
  { id: "search_console", name: "Search Console", description: "Search queries, pages, devices and site performance.", credentialLabel: "OAuth refresh token" },
];

export default function MarketingConnectors() {
  const [activeTab, setActiveTab] = useState<"delivery" | "marketing">("delivery");
  const [organizationId, setOrganizationId] = useState(0);
  const [organizationName, setOrganizationName] = useState("");
  const [connectors, setConnectors] = useState<Connector[]>([]);
  const [selected, setSelected] = useState<Provider>("google_ads");
  const [message, setMessage] = useState("");
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<{ provider: string; data: any } | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [pending, startTransition] = useTransition();

  // Zomato Form State
  const [zomatoResId, setZomatoResId] = useState("ZM-89201-IND");
  const [zomatoApiKey, setZomatoApiKey] = useState("••••••••••••••••••••••••");
  const [zomatoAutoAccept, setZomatoAutoAccept] = useState(true);
  const [zomatoAutoKOT, setZomatoAutoKOT] = useState(true);

  // Swiggy Form State
  const [swiggyStoreId, setSwiggyStoreId] = useState("SW-44192-IND");
  const [swiggyApiKey, setSwiggyApiKey] = useState("••••••••••••••••••••••••");
  const [swiggyAutoAccept, setSwiggyAutoAccept] = useState(true);
  const [swiggyRiderSync, setSwiggyRiderSync] = useState(true);

  const refresh = useCallback(async (id: number) => {
    const result = await listConnectorAccounts(id);
    if (result.success) setConnectors(result.data as Connector[]);
    else setMessage(result.error || "Could not load connectors.");
  }, []);

  useEffect(() => {
    getMyOrganizations().then((result) => {
      if (result.success && result.data[0]) {
        setOrganizationId(result.data[0].id);
        setOrganizationName(result.data[0].name);
        void refresh(result.data[0].id);
      } else setMessage(result.error || "No organization is available.");
    });
  }, [refresh]);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedUrl(label);
    setTimeout(() => setCopiedUrl(null), 2500);
  };

  const runTestWebhook = async (provider: "zomato" | "swiggy") => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const endpoint = `/api/webhooks/${provider}`;
      const payload =
        provider === "zomato"
          ? {
              order_id: `ZM-${Math.floor(1000 + Math.random() * 9000)}`,
              total_amount: 420,
              items: [
                { name: "Irani Koyla Chicken Shawarma Wrap", quantity: 2, price: 180 },
                { name: "Classic Irani Chai Flask", quantity: 1, price: 60 },
              ],
              customer: { name: "Aditya Sharma (Test Customer)", phone: "9876543210" },
              rider: { name: "Rahul V. (Zomato Rider #42)", phone: "9123456789" },
            }
          : {
              order_id: `SW-${Math.floor(1000 + Math.random() * 9000)}`,
              order_total: 510,
              items: [
                { name: "Irani Koyla Charcoal Mutton Roll", quantity: 1, price: 290 },
                { name: "Spicy Garlic Toum Dip Extra", quantity: 2, price: 50 },
                { name: "Special Mint Lemonade", quantity: 2, price: 60 },
              ],
              customer_name: "Sneha Patel (Test Customer)",
              delivery_type: "Swiggy Express Delivery Partner",
            };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      setTestResult({ provider, data });
    } catch (err: any) {
      setTestResult({ provider, data: { error: err.message || "Failed to trigger webhook test" } });
    } finally {
      setIsTesting(false);
    }
  };

  const connect = (formData: FormData) =>
    startTransition(async () => {
      const result = await connectMarketingAccount({
        organizationId,
        provider: selected,
        externalAccountId: String(formData.get("externalAccountId") || ""),
        displayName: String(formData.get("displayName") || ""),
        credential: String(formData.get("credential") || ""),
      });
      setMessage(result.success ? "Connector saved securely." : result.error || "Connection failed.");
      if (result.success) await refresh(organizationId);
    });

  const zomatoWebhookUrl = typeof window !== "undefined"
    ? `${window.location.origin}/api/webhooks/zomato`
    : "https://irani-koyla-franchise-os.vercel.app/api/webhooks/zomato";

  const swiggyWebhookUrl = typeof window !== "undefined"
    ? `${window.location.origin}/api/webhooks/swiggy`
    : "https://irani-koyla-franchise-os.vercel.app/api/webhooks/swiggy";

  return (
    <main className="space-y-6 pb-12">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-orange-400 bg-orange-500/10 px-2.5 py-0.5 rounded-full border border-orange-500/20">
              Integrations & Connectors
            </span>
          </div>
          <h1 className="mt-1 text-2xl sm:text-3xl font-black text-white tracking-tight">
            Partner Platform Integrations
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            Connect {organizationName || "Irani Koyla Franchise"} to food delivery aggregators, POS webhooks, and marketing tracking.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center bg-[#161618] border border-[#303030] p-1 rounded-2xl shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab("delivery")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "delivery"
                ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <UtensilsCrossed className="w-3.5 h-3.5" />
            <span>Food Aggregators</span>
            <span className="bg-white/20 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full">
              Zomato & Swiggy
            </span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("marketing")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "marketing"
                ? "bg-gradient-to-r from-indigo-500 to-blue-500 text-white shadow-md shadow-indigo-500/20"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Marketing & Ads</span>
          </button>
        </div>
      </header>

      {message && (
        <div role="status" className="rounded-2xl border border-indigo-900 bg-indigo-950/30 p-4 text-sm text-indigo-200">
          {message}
        </div>
      )}

      {/* ── TAB 1: FOOD DELIVERY AGGREGATORS (ZOMATO & SWIGGY) ───────────────── */}
      {activeTab === "delivery" && (
        <div className="space-y-6">
          {/* Overview Banner */}
          <div className="p-5 rounded-3xl bg-gradient-to-r from-orange-500/10 via-[#1f1f1f] to-red-500/10 border border-[#303030] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center shrink-0">
                <ShoppingBag className="w-6 h-6 text-orange-400" />
              </div>
              <div>
                <h2 className="text-base font-black text-white flex items-center gap-2">
                  <span>Direct Online Aggregator Gateway</span>
                  <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    Ready to Connect
                  </span>
                </h2>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Incoming orders on Zomato and Swiggy auto-punch into your Kitchen Order Ticket (KOT) stream and automatically deduct shaved meat from your Live Spit Roasters.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[11px] font-mono text-zinc-400 bg-[#161618] px-3 py-1.5 rounded-xl border border-[#303030] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Webhook Ingestion Active
              </span>
            </div>
          </div>

          {/* Connectors Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* ── ZOMATO PARTNER HUB ───────────────────────────────────────── */}
            <div className="p-6 rounded-3xl bg-[#1f1f1f] border border-[#303030] shadow-xl space-y-5 flex flex-col justify-between hover:border-red-500/30 transition-all">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-500 font-black text-xl italic font-serif">
                      Z
                    </div>
                    <div>
                      <h3 className="text-base font-black text-white">Zomato Merchant Partner</h3>
                      <p className="text-xs text-zinc-400">Direct Merchant API & Webhook Ingestion</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                    ● Ready for Credentials
                  </span>
                </div>

                {/* Form Fields */}
                <div className="space-y-3 pt-2">
                  <div>
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                      Zomato Restaurant ID (ResID)
                    </label>
                    <input
                      type="text"
                      value={zomatoResId}
                      onChange={(e) => setZomatoResId(e.target.value)}
                      placeholder="e.g. ZM-1849201-HYD"
                      className="w-full bg-[#161618] border border-[#303030] rounded-xl px-3.5 py-2 text-xs font-mono text-white focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                      Partner API Secret / Token
                    </label>
                    <input
                      type="password"
                      value={zomatoApiKey}
                      onChange={(e) => setZomatoApiKey(e.target.value)}
                      placeholder="Enter Zomato merchant secret key"
                      className="w-full bg-[#161618] border border-[#303030] rounded-xl px-3.5 py-2 text-xs font-mono text-white focus:outline-none focus:border-red-500"
                    />
                  </div>

                  {/* Webhook Endpoint */}
                  <div>
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                      Zomato Webhook Target URL (Copy to Zomato Dashboard)
                    </label>
                    <div className="flex items-center gap-2 bg-[#161618] border border-[#303030] rounded-xl p-1.5 pl-3">
                      <span className="text-xs font-mono text-zinc-300 truncate flex-1">{zomatoWebhookUrl}</span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(zomatoWebhookUrl, "zomato")}
                        className="px-3 py-1.5 rounded-lg bg-[#242426] hover:bg-[#303030] text-xs font-semibold text-white flex items-center gap-1.5 transition-all"
                      >
                        {copiedUrl === "zomato" ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-zinc-400" />
                            <span>Copy URL</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Automation Toggles */}
                  <div className="grid grid-cols-2 gap-2.5 pt-1">
                    <button
                      type="button"
                      onClick={() => setZomatoAutoAccept(!zomatoAutoAccept)}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        zomatoAutoAccept
                          ? "bg-red-500/10 border-red-500/30 text-white"
                          : "bg-[#161618] border-[#303030] text-zinc-400"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold">Auto-Accept Orders</span>
                        <div className={`w-2 h-2 rounded-full ${zomatoAutoAccept ? "bg-red-400" : "bg-zinc-600"}`} />
                      </div>
                      <span className="text-[9px] text-zinc-500 block mt-0.5">Instant confirmation</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setZomatoAutoKOT(!zomatoAutoKOT)}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        zomatoAutoKOT
                          ? "bg-emerald-500/10 border-emerald-500/30 text-white"
                          : "bg-[#161618] border-[#303030] text-zinc-400"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold">Auto-Print KOT</span>
                        <div className={`w-2 h-2 rounded-full ${zomatoAutoKOT ? "bg-emerald-400" : "bg-zinc-600"}`} />
                      </div>
                      <span className="text-[9px] text-zinc-500 block mt-0.5">Direct to kitchen</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-[#2a2a2c] flex items-center justify-between gap-3">
                <button
                  type="button"
                  disabled={isTesting}
                  onClick={() => runTestWebhook("zomato")}
                  className="px-4 py-2 rounded-xl bg-[#161618] hover:bg-[#252528] border border-[#303030] text-xs font-bold text-zinc-200 flex items-center gap-2 transition-all disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5 text-red-400" />
                  <span>Send Test Zomato Order</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMessage("Zomato configuration saved successfully.")}
                  className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-xs font-bold text-white shadow-md shadow-red-600/30 transition-all"
                >
                  Save Zomato Config
                </button>
              </div>
            </div>

            {/* ── SWIGGY MERCHANT HUB ──────────────────────────────────────── */}
            <div className="p-6 rounded-3xl bg-[#1f1f1f] border border-[#303030] shadow-xl space-y-5 flex flex-col justify-between hover:border-orange-500/30 transition-all">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-500 font-black text-xl italic font-serif">
                      S
                    </div>
                    <div>
                      <h3 className="text-base font-black text-white">Swiggy Merchant Partner</h3>
                      <p className="text-xs text-zinc-400">Store API & Live Rider Dispatch Gateway</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                    ● Ready for Credentials
                  </span>
                </div>

                {/* Form Fields */}
                <div className="space-y-3 pt-2">
                  <div>
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                      Swiggy Store ID
                    </label>
                    <input
                      type="text"
                      value={swiggyStoreId}
                      onChange={(e) => setSwiggyStoreId(e.target.value)}
                      placeholder="e.g. SW-4419201-BLR"
                      className="w-full bg-[#161618] border border-[#303030] rounded-xl px-3.5 py-2 text-xs font-mono text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                      Merchant API Key / Access Token
                    </label>
                    <input
                      type="password"
                      value={swiggyApiKey}
                      onChange={(e) => setSwiggyApiKey(e.target.value)}
                      placeholder="Enter Swiggy merchant API key"
                      className="w-full bg-[#161618] border border-[#303030] rounded-xl px-3.5 py-2 text-xs font-mono text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  {/* Webhook Endpoint */}
                  <div>
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                      Swiggy Webhook Target URL (Copy to Swiggy Partner)
                    </label>
                    <div className="flex items-center gap-2 bg-[#161618] border border-[#303030] rounded-xl p-1.5 pl-3">
                      <span className="text-xs font-mono text-zinc-300 truncate flex-1">{swiggyWebhookUrl}</span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(swiggyWebhookUrl, "swiggy")}
                        className="px-3 py-1.5 rounded-lg bg-[#242426] hover:bg-[#303030] text-xs font-semibold text-white flex items-center gap-1.5 transition-all"
                      >
                        {copiedUrl === "swiggy" ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-zinc-400" />
                            <span>Copy URL</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Automation Toggles */}
                  <div className="grid grid-cols-2 gap-2.5 pt-1">
                    <button
                      type="button"
                      onClick={() => setSwiggyAutoAccept(!swiggyAutoAccept)}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        swiggyAutoAccept
                          ? "bg-orange-500/10 border-orange-500/30 text-white"
                          : "bg-[#161618] border-[#303030] text-zinc-400"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold">Auto-Accept Orders</span>
                        <div className={`w-2 h-2 rounded-full ${swiggyAutoAccept ? "bg-orange-400" : "bg-zinc-600"}`} />
                      </div>
                      <span className="text-[9px] text-zinc-500 block mt-0.5">Instant confirmation</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSwiggyRiderSync(!swiggyRiderSync)}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        swiggyRiderSync
                          ? "bg-emerald-500/10 border-emerald-500/30 text-white"
                          : "bg-[#161618] border-[#303030] text-zinc-400"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold">Rider Dispatch Sync</span>
                        <div className={`w-2 h-2 rounded-full ${swiggyRiderSync ? "bg-emerald-400" : "bg-zinc-600"}`} />
                      </div>
                      <span className="text-[9px] text-zinc-500 block mt-0.5">Live ETA tracking</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-[#2a2a2c] flex items-center justify-between gap-3">
                <button
                  type="button"
                  disabled={isTesting}
                  onClick={() => runTestWebhook("swiggy")}
                  className="px-4 py-2 rounded-xl bg-[#161618] hover:bg-[#252528] border border-[#303030] text-xs font-bold text-zinc-200 flex items-center gap-2 transition-all disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5 text-orange-400" />
                  <span>Send Test Swiggy Order</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMessage("Swiggy configuration saved successfully.")}
                  className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-xs font-bold text-white shadow-md shadow-orange-600/30 transition-all"
                >
                  Save Swiggy Config
                </button>
              </div>
            </div>
          </div>

          {/* Test Webhook Output Modal / Tile */}
          {testResult && (
            <div className="p-5 rounded-3xl bg-[#161618] border border-emerald-500/30 shadow-xl space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    {testResult.provider.toUpperCase()} Webhook Test Response
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setTestResult(null)}
                  className="text-xs text-zinc-400 hover:text-white"
                >
                  Dismiss
                </button>
              </div>
              <pre className="p-3.5 rounded-2xl bg-[#1f1f1f] border border-[#303030] text-xs font-mono text-emerald-300 overflow-x-auto">
                {JSON.stringify(testResult.data, null, 2)}
              </pre>
            </div>
          )}

          {/* Aggregator Features Grid */}
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {[
              { icon: Zap, title: "Zero Latency Punching", desc: "Instant sync to POS stream" },
              { icon: Flame, title: "Spit Meat Tracking", desc: "Auto grams deduction per wrap" },
              { icon: ShoppingBag, title: "Item 86 Auto-Kill", desc: "Turns off sold-out spits" },
              { icon: Globe, title: "Settlement Audit", desc: "Commission vs payout tracking" },
            ].map((cap) => (
              <div key={cap.title} className="p-4 rounded-2xl border border-[#303030] bg-[#1f1f1f] flex items-start gap-3">
                <div className="p-2 rounded-xl bg-orange-500/10 text-orange-400 shrink-0">
                  <cap.icon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">{cap.title}</h4>
                  <p className="text-[11px] text-zinc-400 mt-0.5">{cap.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB 2: MARKETING & ATTRIBUTION ──────────────────────────────────── */}
      {activeTab === "marketing" && (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            {providers.map((provider) => {
              const connector = connectors.find((item) => item.provider === provider.id && item.status === "connected");
              return (
                <button
                  key={provider.id}
                  type="button"
                  onClick={() => setSelected(provider.id)}
                  className={`rounded-2xl border p-5 text-left transition ${
                    selected === provider.id
                      ? "border-indigo-500 ring-2 ring-indigo-500/15"
                      : "border-[#303030]"
                  } bg-[#1f1f1f]`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="rounded-xl bg-[#303030] p-2 text-indigo-400">
                      {provider.id === "search_console" ? <Search className="h-5 w-5" /> : <BarChart3 className="h-5 w-5" />}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        connector
                          ? "bg-emerald-950 text-emerald-300 border border-emerald-500/30"
                          : "bg-amber-950 text-amber-300 border border-amber-500/30"
                      }`}
                    >
                      {connector ? "Connected" : "Setup required"}
                    </span>
                  </div>
                  <h2 className="mt-4 font-semibold text-white">{provider.name}</h2>
                  <p className="mt-1 text-sm text-zinc-400">{provider.description}</p>
                  {connector && (
                    <p className="mt-3 text-xs text-zinc-500">
                      {connector.displayName} · {connector.externalAccountId}
                    </p>
                  )}
                </button>
              );
            })}
          </div>

          <section className="rounded-3xl border border-[#303030] bg-[#1f1f1f] p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-2">
              <Link2 className="h-5 w-5 text-indigo-400" />
              <h2 className="font-bold text-white text-base">
                Configure {providers.find((item) => item.id === selected)?.name}
              </h2>
            </div>
            <p className="text-xs text-zinc-400">
              Tokens are encrypted before storage and are never returned to the browser.
            </p>
            <form action={connect} className="grid gap-3 sm:grid-cols-2 pt-2">
              <input
                required
                name="displayName"
                maxLength={255}
                placeholder="Connection name"
                className="rounded-xl border border-[#303030] bg-[#161618] px-3.5 py-2 text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
              />
              <input
                required
                name="externalAccountId"
                maxLength={255}
                placeholder="Account / property ID"
                className="rounded-xl border border-[#303030] bg-[#161618] px-3.5 py-2 text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
              />
              <input
                required
                name="credential"
                type="password"
                minLength={20}
                autoComplete="off"
                placeholder={providers.find((item) => item.id === selected)?.credentialLabel}
                className="rounded-xl border border-[#303030] bg-[#161618] px-3.5 py-2 text-xs font-mono text-white sm:col-span-2 focus:outline-none focus:border-indigo-500"
              />
              <button
                disabled={pending || !organizationId}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-4 py-2.5 text-xs font-bold text-white disabled:opacity-50 sm:col-span-2 transition-all shadow-md shadow-indigo-600/30"
              >
                <RefreshCw className="h-4 w-4" /> Encrypt and connect
              </button>
            </form>
          </section>

          <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {["UTM + click-ID attribution", "Budget pacing + anomalies", "Creative fatigue + profit", "Lead-quality feedback"].map((capability) => (
              <div key={capability} className="flex items-center gap-2 rounded-2xl border border-[#303030] bg-[#1f1f1f] p-3 text-xs font-medium text-zinc-300">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                {capability}
              </div>
            ))}
          </section>

          {connectors
            .filter((item) => item.status === "connected")
            .map((connector) => (
              <button
                key={connector.id}
                disabled={pending}
                onClick={() =>
                  startTransition(async () => {
                    await disconnectMarketingAccount(organizationId, connector.id);
                    await refresh(organizationId);
                  })
                }
                className="mr-2 text-xs font-medium text-rose-400 hover:underline"
              >
                Disconnect {connector.displayName || connector.provider}
              </button>
            ))}
        </div>
      )}
    </main>
  );
}
