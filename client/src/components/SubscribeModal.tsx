import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

interface Props {
  defaultType?: string;
  onClose: () => void;
}

type Mode = "register" | "login";

export default function SubscribeModal({ defaultType = "digital", onClose }: Props) {
  const { login, register, subscriber } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [mode, setMode] = useState<Mode>("register");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "", email: "", password: "", phone: "",
    subscriptionType: defaultType || "print", address: "",
  });

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "login") {
        await login(form.email, form.password);
        toast({ title: "Добро пожаловать!", description: "Вы успешно вошли в личный кабинет." });
      } else {
        await register({
          name: form.name,
          email: form.email,
          password: form.password,
          phone: form.phone || undefined,
          subscriptionType: form.subscriptionType,
          address: form.subscriptionType !== "digital" ? form.address : undefined,
        });
        toast({ title: "Подписка оформлена!", description: "Добро пожаловать в журнал «Основы долголетия»." });
      }
      onClose();
      navigate("/cabinet");
    } catch (err: any) {
      toast({ title: "Ошибка", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(35,26,23,0.55)" }} onClick={onClose}>
      <div
        className="relative w-full max-w-md rounded-2xl shadow-xl overflow-y-auto"
        style={{ background: "hsl(var(--card))", maxHeight: "90vh" }}
        onClick={e => e.stopPropagation()}
      >
        {/* Close */}
        <button onClick={onClose} className="absolute top-4 right-4 p-1 rounded-full hover:bg-secondary transition-colors" aria-label="Закрыть" data-testid="modal-close">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>

        <div className="p-8">
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-xl)", fontWeight: 600, marginBottom: "0.25rem" }}>
            {mode === "register" ? "Оформить подписку" : "Войти в кабинет"}
          </h2>
          <p className="text-sm mb-6" style={{ color: "var(--color-text-muted)" }}>
            {mode === "register"
              ? (form.subscriptionType === "print" || form.subscriptionType === "both")
                ? "🎁 Акция до 31 мая: электронная версия в подарок при печатной подписке!"
                : "Оформите подписку и читайте все выпуски"
              : "Введите ваш email и пароль"}
          </p>

          {/* Mode toggle */}
          <div className="flex rounded-lg overflow-hidden border mb-6" style={{ borderColor: "hsl(var(--border))" }}>
            {(["register", "login"] as Mode[]).map(m => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className="flex-1 py-2 text-sm font-medium transition-colors"
                style={{
                  background: mode === m ? "var(--color-garnet)" : "transparent",
                  color: mode === m ? "#f7f4ee" : "var(--color-text-muted)",
                }}
                data-testid={`mode-${m}`}
              >
                {m === "register" ? "Подписаться" : "Войти"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {mode === "register" && (
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--color-text-muted)" }}>Имя*</label>
                <input className="input-field" value={form.name} onChange={e => set("name", e.target.value)} required placeholder="Ваше имя" data-testid="input-name" />
              </div>
            )}

            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--color-text-muted)" }}>Email*</label>
              <input type="email" className="input-field" value={form.email} onChange={e => set("email", e.target.value)} required placeholder="your@email.ru" data-testid="input-email" />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--color-text-muted)" }}>Пароль*</label>
              <input type="password" className="input-field" value={form.password} onChange={e => set("password", e.target.value)} required placeholder="Минимум 6 символов" data-testid="input-password" />
            </div>

            {mode === "register" && (
              <>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--color-text-muted)" }}>Телефон</label>
                  <input className="input-field" value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="+7 (___) ___-__-__" data-testid="input-phone" />
                </div>

                <div>
                  <label className="block text-xs font-medium mb-2" style={{ color: "var(--color-text-muted)" }}>Формат подписки*</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { value: "print", label: "Печатная", icon: "📰" },
                      { value: "digital", label: "Электронная", icon: "📱" },
                      { value: "both", label: "Комплект", icon: "✨" },
                    ].map(opt => (
                      <button
                        type="button" key={opt.value}
                        onClick={() => set("subscriptionType", opt.value)}
                        className="flex flex-col items-center gap-1 p-3 rounded-lg border text-xs font-medium transition-all"
                        style={{
                          borderColor: form.subscriptionType === opt.value ? "var(--color-garnet)" : "hsl(var(--border))",
                          background: form.subscriptionType === opt.value ? "hsl(4 57% 31% / 0.08)" : "transparent",
                          color: form.subscriptionType === opt.value ? "var(--color-garnet)" : "var(--color-text-muted)",
                        }}
                        data-testid={`sub-type-${opt.value}`}
                      >
                        <span className="text-lg">{opt.icon}</span>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {(form.subscriptionType === "print" || form.subscriptionType === "both") && (
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--color-text-muted)" }}>Адрес доставки*</label>
                    <textarea className="input-field resize-none" rows={2} value={form.address} onChange={e => set("address", e.target.value)} required placeholder="Город, улица, дом, кв., индекс" data-testid="input-address" />
                  </div>
                )}

                {(form.subscriptionType === "print" || form.subscriptionType === "both") && (
                  <p className="text-xs p-3 rounded-lg" style={{ background: "hsl(4 57% 31% / 0.07)", color: "var(--color-garnet)" }}>
                    🎁 Акция до 31 мая: электронная версия всех выпусков — <strong>в подарок</strong> при печатной подписке!
                  </p>
                )}
              </>
            )}

            <button type="submit" className="btn-primary justify-center mt-2" disabled={loading} data-testid="btn-submit">
              {loading ? "Обрабатываем..." : mode === "register" ? "Оформить подписку" : "Войти"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
