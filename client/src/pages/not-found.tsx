import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="section-pad min-h-[70vh] flex items-center justify-center">
      <div className="text-center">
        <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "var(--color-garnet)", letterSpacing: "0.18em" }}>Ошибка 404</p>
        <h1 className="display-heading mb-4" style={{ fontSize: "var(--text-xl)" }}>Страница не найдена</h1>
        <p className="text-sm mb-6" style={{ color: "var(--color-text-muted)" }}>Возможно, она была перемещена или удалена</p>
        <Link href="/" className="btn-primary">На главную</Link>
      </div>
    </div>
  );
}
