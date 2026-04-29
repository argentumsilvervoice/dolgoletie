import { useState } from "react";
import { useAuth, getMemoryToken } from "@/context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import SubscribeModal from "@/components/SubscribeModal";

interface Issue {
  id: number;
  issueNumber: number;
  title: string;
  description?: string;
  pdfUrl: string;
  publishedAt: string;
  month: string;
}

function SubBadge({ type }: { type: string }) {
  const labels: Record<string, string> = {
    digital: "Электронная подписка",
    print: "Печатная + электронная",
    both: "Комплект",
  };
  return (
    <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ background: "hsl(4 57% 31% / 0.1)", color: "var(--color-garnet)" }}>
      {labels[type] || type}
    </span>
  );
}

export default function CabinetPage() {
  const { subscriber, logout, refreshMe } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [showLogin, setShowLogin] = useState(false);
  const [editAddress, setEditAddress] = useState(false);
  const [addressVal, setAddressVal] = useState(subscriber?.address || "");
  const [savingAddr, setSavingAddr] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["/api/issues"],
    queryFn: async () => {
      const token = getMemoryToken();
      if (!token) throw new Error("Не авторизован");
      const res = await fetch("/api/issues", { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error("Ошибка загрузки");
      return res.json() as Promise<{ issues: Issue[] }>;
    },
    enabled: !!subscriber,
  });

  const saveAddress = async () => {
    if (!addressVal.trim()) return;
    setSavingAddr(true);
    const token = getMemoryToken();
    try {
      const res = await fetch("/api/me/address", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ address: addressVal }),
      });
      if (res.ok) {
        await refreshMe();
        setEditAddress(false);
        toast({ title: "Адрес сохранён" });
      }
    } catch {
      toast({ title: "Ошибка сохранения", variant: "destructive" });
    } finally {
      setSavingAddr(false);
    }
  };

  if (!subscriber) {
    return (
      <div className="section-pad min-h-[70vh] flex flex-col items-center justify-center">
        <div className="text-center max-w-sm">
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none" className="mx-auto mb-6" style={{ opacity: 0.25 }}>
            <circle cx="32" cy="24" r="16" stroke="currentColor" strokeWidth="2"/>
            <path d="M8 56c0-13.3 10.7-24 24-24s24 10.7 24 24" stroke="currentColor" strokeWidth="2"/>
          </svg>
          <h2 className="display-heading mb-3" style={{ fontSize: "var(--text-xl)" }}>Личный кабинет</h2>
          <p className="text-sm mb-6" style={{ color: "var(--color-text-muted)" }}>
            Войдите или оформите подписку, чтобы получить доступ ко всем выпускам журнала
          </p>
          <button onClick={() => setShowLogin(true)} className="btn-primary px-8" data-testid="cabinet-login-btn">
            Войти / Подписаться
          </button>
        </div>
        {showLogin && <SubscribeModal onClose={() => setShowLogin(false)} />}
      </div>
    );
  }

  const issues = data?.issues || [];

  return (
    <div className="section-pad">
      <div className="container-main">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="display-heading mb-1" style={{ fontSize: "var(--text-xl)" }}>
              Добро пожаловать, {subscriber.name.split(" ")[0]}
            </h1>
            <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>Личный кабинет подписчика</p>
          </div>
          <div className="flex items-center gap-3">
            <SubBadge type={subscriber.subscriptionType} />
            <button onClick={() => { logout(); navigate("/"); }} className="text-sm hover:opacity-70 transition-opacity" style={{ color: "var(--color-text-muted)" }} data-testid="btn-logout">
              Выйти
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Sidebar: subscriber info */}
          <div className="lg:col-span-1 space-y-4">
            {/* Profile card */}
            <div className="rounded-xl border p-6" style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--card))" }}>
              <h2 className="font-semibold mb-4" style={{ fontFamily: "var(--font-display)", fontSize: "1.15rem" }}>Мои данные</h2>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-xs mb-0.5" style={{ color: "var(--color-text-muted)" }}>Имя</p>
                  <p className="font-medium">{subscriber.name}</p>
                </div>
                <div>
                  <p className="text-xs mb-0.5" style={{ color: "var(--color-text-muted)" }}>Email</p>
                  <p className="font-medium">{subscriber.email}</p>
                </div>
                {subscriber.phone && (
                  <div>
                    <p className="text-xs mb-0.5" style={{ color: "var(--color-text-muted)" }}>Телефон</p>
                    <p className="font-medium">{subscriber.phone}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs mb-0.5" style={{ color: "var(--color-text-muted)" }}>Подписчик с</p>
                  <p className="font-medium">{new Date(subscriber.createdAt).toLocaleDateString("ru-RU", { year: "numeric", month: "long", day: "numeric" })}</p>
                </div>
              </div>
            </div>

            {/* Address card */}
            {(subscriber.subscriptionType === "print" || subscriber.subscriptionType === "both") && (
              <div className="rounded-xl border p-6" style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--card))" }}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold" style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem" }}>Адрес доставки</h2>
                  {!editAddress && (
                    <button onClick={() => { setEditAddress(true); setAddressVal(subscriber.address || ""); }} className="text-xs hover:opacity-70 transition-opacity" style={{ color: "var(--color-garnet)" }} data-testid="btn-edit-address">
                      Изменить
                    </button>
                  )}
                </div>
                {editAddress ? (
                  <div>
                    <textarea
                      className="input-field resize-none mb-3 text-sm"
                      rows={3}
                      value={addressVal}
                      onChange={e => setAddressVal(e.target.value)}
                      placeholder="Город, улица, дом, кв., индекс"
                      data-testid="input-address-edit"
                    />
                    <div className="flex gap-2">
                      <button onClick={saveAddress} disabled={savingAddr} className="btn-primary py-2 px-4 text-xs flex-1 justify-center" data-testid="btn-save-address">
                        {savingAddr ? "..." : "Сохранить"}
                      </button>
                      <button onClick={() => setEditAddress(false)} className="btn-outline py-2 px-4 text-xs" data-testid="btn-cancel-address">Отмена</button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm" style={{ color: subscriber.address ? undefined : "var(--color-text-muted)" }}>
                    {subscriber.address || "Адрес не указан"}
                  </p>
                )}
              </div>
            )}

            {/* Cabinet info */}
            <div className="rounded-xl p-5 text-sm" style={{ background: "hsl(4 57% 31% / 0.06)", border: "1px solid hsl(4 57% 31% / 0.18)" }}>
              <p className="font-semibold mb-1" style={{ color: "var(--color-garnet)" }}>📖 Ваши выпуски</p>
              <p style={{ color: "var(--color-text-muted)" }}>Скачивайте PDF в любое время — они всегда доступны в вашем кабинете.</p>
            </div>
          </div>

          {/* Main: issues grid */}
          <div className="lg:col-span-2">
            <h2 className="font-semibold mb-6" style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem" }}>
              Все выпуски журнала
            </h2>

            {isLoading ? (
              <div className="grid sm:grid-cols-2 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="rounded-xl border h-40 animate-pulse" style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--muted))" }} />
                ))}
              </div>
            ) : issues.length === 0 ? (
              <div className="text-center py-16" style={{ color: "var(--color-text-muted)" }}>
                <p>Выпуски скоро появятся</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {issues.map(issue => (
                  <div key={issue.id} className="card-issue" data-testid={`issue-card-${issue.id}`}>
                    {/* Issue header */}
                    <div className="px-5 py-3 border-b flex items-center justify-between" style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--muted) / 0.5)" }}>
                      <span className="text-xs font-medium" style={{ color: "var(--color-text-muted)" }}>{issue.month}</span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: "hsl(4 57% 31% / 0.1)", color: "var(--color-garnet)" }}>
                        №{issue.issueNumber}
                      </span>
                    </div>
                    <div className="p-5">
                      <h3 className="font-semibold mb-1.5 leading-snug" style={{ fontFamily: "var(--font-display)", fontSize: "1.05rem" }}>
                        {issue.title}
                      </h3>
                      {issue.description && (
                        <p className="text-xs mb-4 leading-relaxed" style={{ color: "var(--color-text-muted)" }}>{issue.description}</p>
                      )}
                      <a
                        href={issue.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary py-2 px-4 text-xs inline-flex items-center gap-1.5"
                        data-testid={`download-issue-${issue.id}`}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                          <polyline points="7 10 12 15 17 10"/>
                          <line x1="12" y1="15" x2="12" y2="3"/>
                        </svg>
                        Скачать PDF
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
