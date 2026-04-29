export default function Footer() {
  return (
    <footer className="border-t mt-auto" style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--card))" }}>
      <div className="container-main py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <p style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", fontWeight: 600 }}>
            Основы <span style={{ color: "var(--color-garnet)" }}>долголетия</span>
          </p>
          <p className="text-sm mt-1" style={{ color: "var(--color-text-muted)" }}>Ваш путеводитель к естественному оздоровлению</p>
        </div>
        <div className="flex flex-col gap-1 text-sm" style={{ color: "var(--color-text-muted)" }}>
          <p>Менеджер проекта: Кузнецова Анна</p>
          <a href="tel:+79153806129" className="hover:opacity-80 transition-opacity">+7 (915) 380-61-29</a>
          <a href="mailto:kniga_izdat@rambler.ru" className="hover:opacity-80 transition-opacity">kniga_izdat@rambler.ru</a>
        </div>
        <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
          © {new Date().getFullYear()} Журнал «Основы долголетия»
        </p>
      </div>
    </footer>
  );
}
