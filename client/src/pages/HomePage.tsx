import coverWhite from "@assets/cover-white.jpeg";
import coverTable from "@assets/cover-table.jpeg";

export default function HomePage() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#f7f4ee] font-body text-[#1a1210]">
      {/* ── NAV ── */}
      <header className="sticky top-0 z-50 bg-[#f7f4ee]/90 backdrop-blur border-b border-[#e8e0d5]">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <button
            onClick={() => scrollTo("hero")}
            className="font-display text-xl font-bold tracking-tight text-[#7c2420] leading-none"
          >
            Основы<br className="hidden" /> <span className="font-normal italic">долголетия</span>
          </button>
          <nav className="hidden sm:flex items-center gap-6 text-sm text-[#4a3830]">
            <button onClick={() => scrollTo("about")} className="hover:text-[#7c2420] transition-colors">О журнале</button>
            <button onClick={() => scrollTo("topics")} className="hover:text-[#7c2420] transition-colors">Темы</button>
            <button onClick={() => scrollTo("buy")} className="hover:text-[#7c2420] transition-colors">Где купить</button>
          </nav>
          <button
            onClick={() => scrollTo("buy")}
            className="text-sm font-medium px-4 py-1.5 rounded-full bg-[#7c2420] text-[#f7f4ee] hover:bg-[#5e1b18] transition-colors"
          >
            Заказать
          </button>
        </div>
      </header>

      {/* ── HERO ── */}
      <section id="hero" className="max-w-5xl mx-auto px-6 pt-16 pb-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-[#7c2420] mb-4">
              Соединяем современные открытия и древние знания
            </p>
            <h1 className="font-display text-5xl md:text-6xl font-bold leading-tight text-[#1a1210] mb-3">
              Основы
            </h1>
            <h1 className="font-display text-5xl md:text-6xl font-normal italic leading-tight text-[#7c2420] mb-8">
              долголетия
            </h1>
            <p className="text-lg text-[#4a3830] leading-relaxed mb-8">
              Журнал о здоровье, написанный врачом с 35-летним опытом. Практические советы, сезонное питание, техники долголетия и древние методы оздоровления — в каждом выпуске.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => scrollTo("buy")}
                className="px-6 py-3 rounded-full bg-[#7c2420] text-[#f7f4ee] font-medium hover:bg-[#5e1b18] transition-colors"
              >
                Где купить
              </button>
              <button
                onClick={() => scrollTo("about")}
                className="px-6 py-3 rounded-full border border-[#c9b9ad] text-[#4a3830] font-medium hover:border-[#7c2420] hover:text-[#7c2420] transition-colors"
              >
                Узнать больше
              </button>
            </div>
          </div>

          {/* Cover image */}
          <div className="relative flex justify-center">
            <div className="relative w-64 md:w-72">
              <img
                src={coverTable}
                alt="Журнал Основы долголетия на столе"
                className="rounded-2xl shadow-2xl w-full object-cover"
              />
              {/* Floating badge */}
              <div className="absolute -bottom-4 -left-6 bg-white rounded-xl px-4 py-2 shadow-lg border border-[#e8e0d5]">
                <p className="text-xs text-[#7c2420] font-medium uppercase tracking-wide">Выпуск № 3</p>
                <p className="text-xs text-[#4a3830]">Июль 2026</p>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* ── ABOUT ── */}
      <section id="about" className="max-w-3xl mx-auto px-6 py-20">
        <div>
            <p className="text-xs font-medium uppercase tracking-widest text-[#7c2420] mb-3">О журнале</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-[#1a1210] mb-6 leading-tight">
              Ваш проводник<br/>к здоровью и долголетию
            </h2>
            <p className="text-[#4a3830] leading-relaxed mb-4">
              «Основы долголетия» — авторский журнал Ирины Леонидовны Старковой, врача превентивной медицины, мастера цигун и рефлексотерапевта с 35-летним опытом. Лауреат премии GreenAwards.
            </p>
            <p className="text-[#4a3830] leading-relaxed mb-6">
              В каждом выпуске — практические советы по оздоровлению, сезонные рецепты, упражнения для долголетия, акупрессура и методики восстановления, проверенные годами практики.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { num: "35+", label: "лет врачебной практики" },
                { num: "13", label: "выпусков журнала" },
                { num: "16+", label: "возрастной рейтинг" },
                { num: "12×", label: "в год — новый номер каждый месяц" },
              ].map((s) => (
                <div key={s.label} className="bg-white rounded-xl p-4 border border-[#e8e0d5]">
                  <p className="font-display text-2xl font-bold text-[#7c2420]">{s.num}</p>
                  <p className="text-xs text-[#4a3830] mt-0.5 leading-snug">{s.label}</p>
                </div>
              ))}
            </div>
        </div>
      </section>

      {/* ── TOPICS ── */}
      <section id="topics" className="bg-[hsl(10,25%,12%)] py-20">
        <div className="max-w-5xl mx-auto px-6">
          <p className="text-xs font-medium uppercase tracking-widest text-[#c9a898] mb-3 text-center">Что внутри</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-[#f7f4ee] mb-12 text-center leading-tight">
            Темы каждого выпуска
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
            {[
              {
                icon: "🌿",
                title: "Сезонное питание",
                desc: "Рецепты и советы по питанию с учётом сезона и индивидуальных особенностей организма.",
              },
              {
                icon: "🤲",
                title: "Акупрессура и рефлексология",
                desc: "Активные точки здоровья, техники самомассажа и работа с меридианами по авторской методике.",
              },
              {
                icon: "🏃",
                title: "Упражнения долголетия",
                desc: "Ежедневные практики цигун, дыхательные техники и мягкая гимнастика для любого возраста.",
              },
              {
                icon: "🌱",
                title: "Природное оздоровление",
                desc: "Травы, натуральные средства и народные методы профилактики заболеваний.",
              },
              {
                icon: "🧠",
                title: "Психоэмоциональное здоровье",
                desc: "Управление стрессом, качество сна и ментальные практики для гармонии и ясности ума.",
              },
              {
                icon: "💊",
                title: "Превентивная медицина",
                desc: "Современные данные о профилактике болезней в доступном изложении без медицинского жаргона.",
              },
            ].map((t) => (
              <div
                key={t.title}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors"
              >
                <div className="text-3xl mb-3">{t.icon}</div>
                <h3 className="font-display text-lg font-semibold text-[#f7f4ee] mb-2">{t.title}</h3>
                <p className="text-sm text-[#c9a898] leading-relaxed">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LATEST ISSUE feature ── */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <p className="text-xs font-medium uppercase tracking-widest text-[#7c2420] mb-3 text-center">Свежий выпуск</p>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-[#1a1210] mb-12 text-center">
          № 3 · Июль 2026
        </h2>
        <div className="grid md:grid-cols-3 gap-5">
          {[
            {
              tag: "Авторская методика ци-доктора",
              title: "Танец живительной силы: тайны веера Тайчи глазами доктора китайской медицины",
              pages: "стр. 20–24",
            },
            {
              tag: "Активные точки здоровья",
              title: "Эффективные точки при пониженном давлении",
              pages: "стр. 9",
            },
            {
              tag: "Время для себя",
              title: "Уход от культуры загара — шаг к активному долголетию",
              pages: "стр. 10–13",
            },
          ].map((a) => (
            <div
              key={a.title}
              className="bg-white rounded-2xl border border-[#e8e0d5] p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <p className="text-[10px] uppercase tracking-widest text-[#7c2420] font-medium mb-2">{a.tag}</p>
              <h3 className="font-display text-xl font-semibold text-[#1a1210] leading-snug mb-3">{a.title}</h3>
              <p className="text-xs text-[#9a8880]">{a.pages}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── WHERE TO BUY ── */}
      <section id="buy" className="bg-[#f0ebe3] py-20">
        <div className="max-w-5xl mx-auto px-6">
          <p className="text-xs font-medium uppercase tracking-widest text-[#7c2420] mb-3 text-center">Где купить</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-[#1a1210] mb-4 text-center">
            Заказать журнал
          </h2>
          <p className="text-center text-[#4a3830] mb-12 max-w-lg mx-auto">
            Печатная версия журнала доступна в магазине доктора Старковой, а также на крупных маркетплейсах.
          </p>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            {/* WB */}
            <a
              href="https://www.wildberries.ru/catalog/1194499646/detail.aspx"
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-2xl p-6 flex flex-col items-center text-center transition-all hover:shadow-lg hover:scale-[1.02]"
              style={{ background: "linear-gradient(135deg, #cb11ab 0%, #7b2d8b 100%)", border: "none" }}
            >
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mb-3">
                <span className="text-white font-bold text-sm">WB</span>
              </div>
              <h3 className="font-semibold text-white mb-1">Wildberries</h3>
              <p className="text-xs text-white/80">Купить на WB</p>
            </a>

            {/* Ozon */}
            <a
              href="https://www.ozon.ru/product/osnovy-dolgoletiya-4840394832/"
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-2xl p-6 flex flex-col items-center text-center transition-all hover:shadow-lg hover:scale-[1.02]"
              style={{ background: "linear-gradient(135deg, #005bff 0%, #0041c2 100%)", border: "none" }}
            >
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mb-3">
                <span className="text-white font-bold text-sm">OZON</span>
              </div>
              <h3 className="font-semibold text-white mb-1">Ozon</h3>
              <p className="text-xs text-white/80">Купить на Ozon</p>
            </a>

            {/* Почта России */}
            <a
              href="https://podpiska.pochta.ru/press/%D0%9F%D0%94539"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white rounded-2xl border border-[#e8e0d5] p-6 flex flex-col items-center text-center hover:border-[#0057a8] hover:shadow-md transition-all"
            >
              <div className="w-12 h-12 rounded-full bg-[#0057a8]/10 flex items-center justify-center mb-3">
                <span className="text-[#0057a8] font-bold text-xs text-center leading-tight">Почта</span>
              </div>
              <h3 className="font-semibold text-[#1a1210] mb-1">Почта России</h3>
              <p className="text-xs text-[#0057a8] font-medium">Оформить подписку</p>
            </a>
          </div>
        </div>
      </section>

      {/* ── EXPERT QUOTE ── */}
      <section className="max-w-3xl mx-auto px-6 py-20 text-center">
        <svg className="w-10 h-10 text-[#c9b9ad] mx-auto mb-6" fill="currentColor" viewBox="0 0 32 32">
          <path d="M10 8C5.6 8 2 11.6 2 16s3.6 8 8 8c2.8 0 5.2-1.4 6.6-3.6C17.4 22 18 23.4 18 25h4c0-3.4-1.4-6.4-3.6-8.6C18.8 15 19 13.6 19 12V8h-9zm16 0c-4.4 0-8 3.6-8 8s3.6 8 8 8c2.8 0 5.2-1.4 6.6-3.6.8 1.6 1.4 3 1.4 4.6h4c0-3.4-1.4-6.4-3.6-8.6.4-1.4.6-2.8.6-4.4V8h-9z" />
        </svg>
        <p className="font-display text-2xl md:text-3xl italic text-[#1a1210] leading-relaxed mb-8">
          Долголетие — это не случайность. Это ежедневный выбор: что есть, как двигаться, о чём думать. Я делюсь методиками, которые применяю для своих пациентов и учеников уже больше 35 лет.
        </p>
        <div className="flex flex-col items-center gap-1">
          <p className="font-semibold text-[#1a1210]">Ирина Леонидовна Старкова</p>
          <p className="text-sm text-[#7c2420] leading-relaxed max-w-xl mx-auto">врач двух медицин: классической и китайской · главный редактор журнала · автор методики, получившей звание лучшей методики естественного оздоровления · лектор · автор книг и изданий общим тиражом более 62 тыс. экземпляров</p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-[hsl(10,25%,12%)] text-[#c9a898]">
        <div className="max-w-5xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8 mb-8">
            <div>
              <p className="font-display text-2xl font-bold text-[#f7f4ee] mb-1">
                Основы <span className="font-normal italic text-[#c9a898]">долголетия</span>
              </p>
              <p className="text-sm text-[#9a7868]">Соединяем современные открытия и древние знания</p>
            </div>
            <div className="text-sm space-y-1">
              <p className="font-medium text-[#f7f4ee]">По вопросам заказа и сотрудничества:</p>
              <p>Кузнецова Анна</p>
              <a href="tel:+79153806129" className="hover:text-[#f7f4ee] transition-colors">+7 (915) 380-61-29</a>
              <br />
              <a href="mailto:kniga_izdat@rambler.ru" className="hover:text-[#f7f4ee] transition-colors">kniga_izdat@rambler.ru</a>
            </div>
          </div>
          <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-[#6a5248]">
            <div className="space-y-1">
              <p>Свидетельство о регистрации СМИ: серия ПИ № ФС77-91397</p>
              <p>Издатель: ООО «Код долголетия», ОГРН 1253900012992</p>
            </div>
            <p className="text-[#6a5248]">© {new Date().getFullYear()} Основы долголетия</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
