import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { Link, Route, Switch, useLocation } from 'wouter';
import { ArrowDown, ArrowRight, ArrowUpRight, Clock3, Coffee, Instagram, MapPin, Menu as MenuIcon, X } from 'lucide-react';

type MenuCategory = 'All' | 'Coffee & tea' | 'From the kitchen' | 'Something sweet';
type MenuItem = { name: string; detail: string; price: string; category: Exclude<MenuCategory, 'All'>; note?: string };

const menuItems: MenuItem[] = [
  { name: 'House cappuccino', detail: 'Double espresso, silky milk, a little cocoa', price: '₹190', category: 'Coffee & tea', note: 'House favourite' },
  { name: 'Flat white', detail: 'A double shot with beautifully fine milk', price: '₹210', category: 'Coffee & tea' },
  { name: 'Cardamom cold brew', detail: 'Slow-steeped coffee, cardamom cream', price: '₹230', category: 'Coffee & tea' },
  { name: 'Masala chai', detail: 'Black tea, ginger, warming whole spices', price: '₹150', category: 'Coffee & tea' },
  { name: 'Avocado & sourdough', detail: 'Whipped avocado, herbs, chilli oil', price: '₹360', category: 'From the kitchen', note: 'All day' },
  { name: 'Morrow breakfast plate', detail: 'Soft eggs, toast, greens, house relish', price: '₹420', category: 'From the kitchen' },
  { name: 'Roasted tomato tartine', detail: 'Slow-roasted tomato, ricotta, basil', price: '₹340', category: 'From the kitchen' },
  { name: 'Almond croissant', detail: 'Baked golden each morning, filled with frangipane', price: '₹220', category: 'Something sweet', note: 'Baked daily' },
  { name: 'Olive oil cake', detail: 'Citrus, soft crumb, a spoon of crème fraîche', price: '₹240', category: 'Something sweet' },
  { name: 'Chocolate hazelnut cookie', detail: 'Brown butter, dark chocolate, flaky salt', price: '₹160', category: 'Something sweet' },
];
const featuredItems = [
  { name: 'House cappuccino', detail: 'Double espresso, silky milk, a little cocoa', price: '₹190', image: '/products/house-cappuccino.webp', alt: 'Cappuccino in a handmade ivory ceramic cup', note: 'House favourite' },
  { name: 'Avocado & sourdough', detail: 'Whipped avocado, herbs, chilli oil', price: '₹360', image: '/products/avocado-sourdough.webp', alt: 'Avocado toast with herbs on a ceramic plate', note: 'All day' },
  { name: 'Almond croissant', detail: 'Baked golden each morning, filled with frangipane', price: '₹220', image: '/products/almond-croissant.webp', alt: 'Golden almond croissant on a ceramic plate', note: 'Baked daily' },
];
const categories: MenuCategory[] = ['All', 'Coffee & tea', 'From the kitchen', 'Something sweet'];
const navItems = [{ label: 'Home', href: '/' }, { label: 'Our story', href: '/about' }, { label: 'Menu', href: '/menu' }, { label: 'Find us', href: '/contact' }];
const announcementMessages = [
  'A little pause in your day, made fresh daily',
  'Thoughtful coffee, fresh from our kitchen',
  'Good things, shared slowly',
];

const pageMeta: Record<string, { title: string; description: string }> = {
  '/': { title: 'Maison Morrow Café | Good mornings, long afternoons', description: 'A warm neighbourhood café for thoughtful coffee, honest food and room to stay awhile.' },
  '/about': { title: 'Our story | Maison Morrow Café', description: 'Meet the spirit of Maison Morrow: a neighbourhood café made for good coffee, honest food and unhurried company.' },
  '/menu': { title: 'The menu | Maison Morrow Café', description: 'Explore the Maison Morrow sample menu: coffee and tea, kitchen favourites and something sweet.' },
  '/contact': { title: 'Visit & contact | Maison Morrow Café', description: 'Find sample café hours and contact details for Maison Morrow, and prepare a note to the café.' },
};

function AnnouncementBanner() {
  const [activeMessage, setActiveMessage] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotionPreference = () => setReducedMotion(mediaQuery.matches);
    updateMotionPreference();
    mediaQuery.addEventListener('change', updateMotionPreference);
    return () => mediaQuery.removeEventListener('change', updateMotionPreference);
  }, []);

  useEffect(() => {
    if (paused || reducedMotion) return;
    const interval = window.setInterval(() => {
      setActiveMessage((current) => (current + 1) % announcementMessages.length);
    }, 4800);
    return () => window.clearInterval(interval);
  }, [paused, reducedMotion]);

  return <div className="bg-[#405b47] px-4 py-2.5 text-center text-[10px] font-semibold uppercase tracking-[.16em] text-[#f6f0e3] sm:text-[11px]" data-testid="banner-hours" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>
    <span className="sr-only">A little pause in your day. Open every day, 8am to 8pm. Sample café hours.</span>
    <div className="mx-auto flex min-h-4 flex-wrap items-center justify-center gap-x-2 gap-y-0.5" aria-hidden="true">
      <span className="grid min-h-4 min-w-[min(100%,340px)] place-items-center sm:min-w-[355px]">
        {announcementMessages.map((message, index) => <span key={message} className={`col-start-1 row-start-1 will-change-transform transition-[opacity,transform] duration-[850ms] ease-[cubic-bezier(.22,1,.36,1)] ${activeMessage === index ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'}`}>{message}</span>)}
      </span>
      <span className="inline-flex items-center gap-2 whitespace-nowrap"><span className="text-[#c7cfb8]">·</span><span>Open every day, 8am–8pm</span></span>
    </div>
  </div>;
}

function SiteHeader() {
  const [location] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => setMenuOpen(false), [location]);
  return <>
    <AnnouncementBanner />
    <header className="site-header sticky top-0 z-50 flex items-center border-b border-[#dfd6c6] bg-[#f5f0e6]/95 px-5 backdrop-blur-md md:px-10" data-testid="site-header">
      <div className="mx-auto flex w-full max-w-[1330px] items-center justify-between">
        <Link href="/" className="group flex items-center gap-3 no-underline" aria-label="Maison Morrow home" data-testid="link-brand-home">
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#8b967e] text-[#405b47] transition-transform group-hover:rotate-[-8deg]"><Coffee size={19} strokeWidth={1.5} /></span>
          <span className="leading-[1.02]"><span className="serif block text-[19px] font-semibold tracking-[-.04em] text-[#493326]">maison morrow</span><span className="mt-1 block text-[8px] font-semibold uppercase tracking-[.22em] text-[#73806b]">coffee · kitchen · company</span></span>
        </Link>
        <nav className="hidden items-center gap-9 lg:flex" aria-label="Main navigation">
          {navItems.map((item) => <Link key={item.href} className="nav-link text-[12px] font-semibold tracking-[.07em] text-[#594a3c] no-underline transition-colors hover:text-[#405b47]" href={item.href} aria-current={location === item.href ? 'page' : undefined} data-testid={`link-nav-${item.label.toLowerCase().replaceAll(' ', '-')}`}>{item.label}</Link>)}
          <Link href="/contact" className="ml-1 inline-flex items-center gap-2 rounded-full bg-[#49382b] px-5 py-3 text-[11px] font-semibold tracking-[.04em] text-[#fbf6ec] no-underline transition-colors hover:bg-[#405b47]" data-testid="button-visit-us">Come say hello <ArrowUpRight size={14} /></Link>
        </nav>
        <button className="flex h-11 w-11 items-center justify-center rounded-full border border-[#d7cdbb] text-[#493326] lg:hidden" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen} aria-controls="mobile-navigation" onClick={() => setMenuOpen(!menuOpen)} data-testid="button-mobile-menu">{menuOpen ? <X size={20} /> : <MenuIcon size={20} />}</button>
      </div>
      {menuOpen && <nav id="mobile-navigation" className="absolute left-0 right-0 top-full flex flex-col gap-1 border-b border-[#ded4c3] bg-[#f5f0e6] px-6 pb-5 pt-2 shadow-[0_14px_25px_rgba(59,43,30,.08)] lg:hidden" aria-label="Mobile navigation">{navItems.map((item) => <Link key={item.href} href={item.href} className="rounded-lg px-3 py-3 text-sm font-semibold text-[#49382b] no-underline hover:bg-[#e9e3d7]" aria-current={location === item.href ? 'page' : undefined} data-testid={`mobile-nav-${item.label.toLowerCase().replaceAll(' ', '-')}`}>{item.label}</Link>)}</nav>}
    </header>
  </>;
}

function SiteFooter() {
  return <footer className="bg-[#49382b] px-6 py-8 text-[#f3eee3]" data-testid="site-footer">
    <div className="mx-auto flex max-w-[1200px] flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
      <Link href="/" className="serif text-[19px] tracking-[-.04em] text-[#f6f0e5] no-underline" data-testid="link-footer-home">maison morrow<span className="ml-2 font-sans text-[9px] uppercase tracking-[.14em] text-[#c2c6b5]">coffee · kitchen · company</span></Link>
      <p className="text-[10px] text-[#d1c8b8]">A neighbourhood kind of place. <span className="mx-2">·</span> © Maison Morrow 2025</p>
      <a href="#top" onClick={(event) => { event.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="inline-flex items-center gap-2 text-[10px] font-semibold text-[#e3dacb] no-underline hover:text-white" data-testid="link-back-top">Back to top <ArrowUpRight size={12} /></a>
    </div>
  </footer>;
}

function PageTitle({ eyebrow, title, lead }: { eyebrow: string; title: ReactNode; lead: string }) {
  return <div className="border-b border-[#ded5c6] bg-[#e9e1d3] px-6 py-16 md:px-10 md:py-20">
    <div className="mx-auto max-w-[1160px]"><p className="eyebrow mb-4 text-[#718064]">{eyebrow}</p><h1 className="serif max-w-[850px] text-[clamp(3.2rem,7vw,6rem)] leading-[1.02] tracking-[-.06em] text-[#493326]" data-testid="page-heading">{title}</h1><p className="mt-6 max-w-[570px] text-[14px] leading-7 text-[#65594b]" data-testid="page-intro">{lead}</p></div>
  </div>;
}

function HomePage() {
  return <div className="page-enter">
    <section className="relative overflow-hidden bg-[#e9e1d3]" data-testid="section-home">
      <div className="mx-auto grid min-h-[640px] max-w-[1440px] grid-cols-1 md:min-h-[690px] md:grid-cols-[.92fr_1.08fr]">
        <div className="relative z-10 flex flex-col justify-center px-7 pb-12 pt-16 sm:px-12 md:pl-[max(3rem,calc((100vw-1220px)/2))] md:pr-8 md:py-16">
          <p className="eyebrow reveal mb-7 flex items-center gap-3 text-[#637457]" data-testid="text-hero-kicker"><span className="h-px w-8 bg-[#7b886d]"></span>A neighbourhood café, with a little elsewhere</p>
          <h1 className="serif reveal delay-1 max-w-[620px] text-[clamp(3.5rem,7.1vw,6.5rem)] leading-[.97] tracking-[-.065em] text-[#493326]" data-testid="heading-hero">Good mornings.<br /><em className="font-medium text-[#627456]">Long</em> afternoons.</h1>
          <p className="reveal delay-2 mt-7 max-w-[390px] text-[15px] leading-[1.8] text-[#65594b]" data-testid="text-hero-description">A warm little corner for the first coffee, the mid-day reset, and all the good things in between.</p>
          <div className="reveal delay-2 mt-9 flex flex-wrap items-center gap-5">
            <Link href="/menu" className="inline-flex items-center gap-3 rounded-full bg-[#49382b] px-6 py-4 text-[12px] font-semibold text-[#fbf6ec] no-underline transition-all hover:gap-4 hover:bg-[#405b47]" data-testid="button-explore-menu">Explore the menu <ArrowRight size={15} /></Link>
            <Link href="/about" className="text-[12px] font-semibold text-[#49382b] underline decoration-[#9b917e] underline-offset-4 hover:text-[#405b47]" data-testid="link-hero-story">A little about us</Link>
          </div>
          <div className="mt-14 flex items-center gap-4 border-t border-[#d4cabb] pt-5 text-[10px] font-semibold uppercase tracking-[.15em] text-[#776958]">
            <span className="flex -space-x-2" aria-hidden="true"><span className="h-7 w-7 rounded-full border-2 border-[#e9e1d3] bg-[#b2b5a1]"></span><span className="h-7 w-7 rounded-full border-2 border-[#e9e1d3] bg-[#c79e7c]"></span><span className="h-7 w-7 rounded-full border-2 border-[#e9e1d3] bg-[#7c876b]"></span></span>
            <span>Your table is waiting</span><span className="text-[#9b917e]">·</span><span>Est. with love</span>
          </div>
        </div>
        <div className="hero-image relative min-h-[410px] overflow-hidden md:min-h-[690px]" data-testid="image-hero-wrap">
          <img src="/maison-morrow-hero.png" alt="A cappuccino and fresh almond croissant on a sunlit café table" className="absolute inset-0 h-full w-full object-cover object-[58%_center]" data-testid="img-cafe-hero" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#2f281d]/30 via-transparent to-[#2f281d]/5"></div>
          <div className="absolute bottom-8 left-7 flex items-center gap-3 rounded-full border border-white/35 bg-[#f8f2e7]/90 px-4 py-3 text-[#48372a] backdrop-blur-sm md:bottom-10 md:left-10" data-testid="badge-hero-prompt"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#64775a] text-[#fffaf0]"><ArrowDown size={15} /></span><span><span className="block text-[9px] font-bold uppercase tracking-[.15em]">Take your time</span><span className="mt-0.5 block text-[10px] text-[#796d5f]">There’s nowhere else to be.</span></span></div>
          <span className="absolute right-7 top-8 rounded-full border border-white/40 bg-[#f8f2e7]/80 px-4 py-2 text-[9px] font-bold uppercase tracking-[.17em] text-[#544537] backdrop-blur-sm">Coffee, made with care</span>
        </div>
      </div>
    </section>
    <section className="border-y border-[#dfd6c6] bg-[#f7f3eb] px-6 py-7 md:px-10" aria-label="Our approach"><div className="mx-auto flex max-w-[1160px] flex-wrap items-center justify-center gap-x-12 gap-y-4 text-center text-[10px] font-semibold uppercase tracking-[.16em] text-[#6b6254] md:justify-between"><span data-testid="text-value-coffee">Thoughtful coffee</span><span className="hidden h-1 w-1 rounded-full bg-[#809070] md:block"></span><span data-testid="text-value-seasonal">Seasonal little plates</span><span className="hidden h-1 w-1 rounded-full bg-[#809070] md:block"></span><span data-testid="text-value-neighbourhood">Made for the neighbourhood</span><span className="hidden h-1 w-1 rounded-full bg-[#809070] md:block"></span><span data-testid="text-value-slow">Always room to stay</span></div></section>
    <section className="bg-[#f7f3eb] px-6 py-20 md:px-10 md:py-28" data-testid="section-featured-menu">
      <div className="mx-auto max-w-[1160px]">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow mb-4 text-[#718064]">A little taste of Morrow</p>
            <h2 className="serif max-w-[700px] text-4xl leading-[1.08] tracking-[-.05em] text-[#493326] md:text-6xl" data-testid="heading-featured-menu">Good things, <em className="text-[#68795b]">made slowly.</em></h2>
            <p className="mt-5 max-w-[470px] text-[14px] leading-7 text-[#75695b]">A few favourites for your first visit—or the next one.</p>
          </div>
          <Link href="/menu" className="inline-flex w-fit items-center gap-3 border-b border-[#aab09b] pb-2 text-[11px] font-semibold text-[#536749] no-underline transition-all hover:gap-5" data-testid="link-featured-full-menu">See the full menu <ArrowRight size={14} /></Link>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3 md:gap-6">
          {featuredItems.map((item) => <article key={item.name} className="group overflow-hidden border border-[#e2d9ca] bg-[#fcfaf5]" data-testid={`card-featured-${item.name.toLowerCase().replaceAll(' ', '-')}`}>
            <div className="relative aspect-[4/3] overflow-hidden bg-[#e9e1d3]">
              <img src={item.image} alt={item.alt} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
              <span className="absolute left-4 top-4 rounded-full bg-[#f8f2e7]/95 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[.14em] text-[#536749]">{item.note}</span>
            </div>
            <div className="p-5 sm:p-6">
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="serif text-[1.4rem] leading-tight tracking-[-.035em] text-[#493326]">{item.name}</h3>
                <span className="shrink-0 text-[12px] font-semibold text-[#536749]">{item.price}</span>
              </div>
              <p className="mt-2 text-[12px] leading-6 text-[#75695b]">{item.detail}</p>
            </div>
          </article>)}
        </div>
        <p className="mt-5 text-[10px] leading-5 text-[#847969]" data-testid="text-featured-menu-note">Menu and prices shown are sample content.</p>
      </div>
    </section>
    <section className="bg-[#e9e1d3] px-6 py-20 md:px-10 md:py-28" data-testid="section-home-atmosphere">
      <div className="mx-auto grid max-w-[1160px] gap-9 lg:grid-cols-[1.1fr_.9fr] lg:items-stretch lg:gap-14">
        <div className="group relative min-h-[340px] overflow-hidden bg-[#d6c8b3] md:min-h-[500px] lg:min-h-[560px]" data-testid="image-home-interior-wrap">
          <img src="/maison-morrow-interior.webp" alt="Sunlit café interior with a curved walnut banquette and window-side table" loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#2f281d]/45 via-transparent to-[#2f281d]/10"></div>
          <span className="absolute bottom-6 left-6 rounded-full border border-white/35 bg-[#f8f2e7]/90 px-4 py-2.5 text-[9px] font-bold uppercase tracking-[.15em] text-[#49382b] backdrop-blur-sm">A little room to breathe</span>
        </div>
        <div className="flex flex-col justify-between gap-10 py-1 md:py-6">
          <div>
            <p className="eyebrow mb-5 text-[#718064]">The Morrow feeling</p>
            <h2 className="serif max-w-[520px] text-[clamp(2.8rem,5vw,4.6rem)] leading-[1.05] tracking-[-.055em] text-[#493326]" data-testid="heading-home-atmosphere">A little corner <em className="text-[#68795b]">to take it slow.</em></h2>
            <p className="mt-6 max-w-[480px] text-[14px] leading-7 text-[#65594b]">Settle in with a good cup, something warm from the kitchen, and a moment before the day begins again.</p>
            <Link href="/about" className="mt-7 inline-flex items-center gap-3 border-b border-[#aab09b] pb-2 text-[11px] font-semibold text-[#536749] no-underline transition-all hover:gap-5" data-testid="link-home-atmosphere-story">Meet our little café <ArrowRight size={14} /></Link>
          </div>
          <div className="grid grid-cols-[112px_minmax(0,1fr)] gap-4 border-t border-[#d4cabb] pt-5 sm:grid-cols-[145px_1fr] sm:items-center">
            <img src="/maison-morrow-window-table.webp" alt="A cappuccino and pastry beside an open café window" loading="lazy" className="aspect-[4/3] w-full object-cover" />
            <div>
              <p className="eyebrow mb-2 text-[#718064]">For the little moments</p>
              <p className="text-[12px] leading-6 text-[#75695b]">A first sip in the sun. One more page. One more coffee before you go.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section className="px-6 py-20 md:px-10 md:py-28" data-testid="home-invitation"><div className="mx-auto grid max-w-[1120px] gap-7 md:grid-cols-[1fr_auto] md:items-end"><div><p className="eyebrow mb-4 text-[#718064]">A small invitation</p><h2 className="serif max-w-[760px] text-4xl leading-tight tracking-[-.045em] text-[#493326] md:text-6xl">Come for the coffee.<br /><em className="text-[#68795b]">Stay because the light is lovely.</em></h2></div><Link href="/contact" className="inline-flex w-fit items-center gap-3 border-b border-[#aab09b] pb-2 text-[11px] font-semibold text-[#536749] no-underline transition-all hover:gap-5" data-testid="link-home-contact">Find your way here <ArrowRight size={14} /></Link></div></section>
  </div>;
}

function AboutPage() {
  return <div className="page-enter" data-testid="page-about">
    <PageTitle eyebrow="A place to land" title={<>A little bit of <em className="text-[#68795b]">somewhere.</em></>} lead="A neighbourhood café with the pace of a long morning and the warmth of a familiar table." />
    <section className="relative overflow-hidden px-6 py-20 md:px-10 md:py-32" data-testid="section-about">
      <div className="pointer-events-none absolute -right-16 top-2 select-none serif text-[28rem] leading-none text-[#e9e3d7]" aria-hidden="true">m</div>
      <div className="relative mx-auto grid max-w-[1120px] gap-12 md:grid-cols-[.7fr_1.3fr] md:gap-24">
        <div className="pt-2"><p className="eyebrow mb-5 text-[#718064]">The Morrow feeling</p><h2 className="serif max-w-[360px] text-5xl leading-[1.08] tracking-[-.05em] text-[#493326] md:text-[4.2rem]" data-testid="heading-about">Come as<br />you <em className="text-[#68795b]">are.</em></h2><div className="mt-9 flex items-center gap-3 text-[11px] font-semibold text-[#6c6357]"><span className="h-px w-9 bg-[#809070]"></span>There’s room at the table</div></div>
        <div className="relative max-w-[615px] pt-2 md:pt-8">
          <p className="serif text-[1.55rem] leading-[1.55] tracking-[-.02em] text-[#574536] md:text-[1.8rem]" data-testid="text-about-lead">Maison Morrow is the kind of café you find once, then keep coming back to.</p>
          <p className="mt-6 text-[14px] leading-[1.9] text-[#75695b]" data-testid="text-about-body">Inspired by the easy rhythm of European cafés and rooted in the life of our own neighbourhood, we make good coffee, honest food and space for whatever your day needs. A quiet table to work at. A pastry after school. One more cup before you go.</p>
          <p className="mt-4 text-[14px] leading-[1.9] text-[#75695b]">No occasion required. Pull up a chair, bring a book, stay a little longer.</p>
          <div className="mt-10 grid grid-cols-2 gap-5 border-t border-[#dbd2c3] pt-6 sm:grid-cols-3"><div><p className="serif text-[1.5rem] text-[#4e6248]">Every day</p><p className="mt-1 text-[10px] uppercase tracking-[.12em] text-[#837667]">A fresh beginning</p></div><div><p className="serif text-[1.5rem] text-[#4e6248]">Good things</p><p className="mt-1 text-[10px] uppercase tracking-[.12em] text-[#837667]">Made with care</p></div><div className="col-span-2 sm:col-span-1"><p className="serif text-[1.5rem] text-[#4e6248]">Your place</p><p className="mt-1 text-[10px] uppercase tracking-[.12em] text-[#837667]">Right around the corner</p></div></div>
        </div>
      </div>
    </section>
    <section className="bg-[#405b47] px-6 py-16 text-[#f7f1e5] md:px-10 md:py-20" data-testid="section-quote"><div className="mx-auto grid max-w-[1120px] gap-8 md:grid-cols-[1fr_auto] md:items-center"><div><p className="eyebrow mb-5 text-[#c5ceb9]">A small invitation</p><p className="serif max-w-[730px] text-[2.1rem] leading-[1.25] tracking-[-.035em] md:text-[3rem]" data-testid="text-cafe-manifesto">“Come for the coffee. Stay because the light is lovely.”</p></div><Link href="/menu" className="inline-flex w-fit items-center gap-3 border-b border-[#b5c0a9] pb-2 text-[11px] font-semibold text-[#f7f1e5] no-underline transition-all hover:gap-5" data-testid="link-story-menu">Take a look at the menu <ArrowRight size={14} /></Link></div></section>
  </div>;
}

function MenuPage() {
  const [activeCategory, setActiveCategory] = useState<MenuCategory>('All');
  const visibleItems = activeCategory === 'All' ? menuItems : menuItems.filter((item) => item.category === activeCategory);
  return <div className="page-enter" data-testid="page-menu">
    <PageTitle eyebrow="A few good things" title={<>The menu, <em className="text-[#68795b]">for now.</em></>} lead="Made for slow mornings and long lunches. The good stuff changes with the season." />
    <section className="bg-[#e8e1d5] px-6 py-14 md:px-10 md:py-20" data-testid="section-menu">
      <div className="mx-auto max-w-[1160px]">
        <div className="mb-10 flex flex-col justify-between gap-7 md:mb-12 md:flex-row md:items-end"><div><p className="eyebrow mb-4 text-[#718064]">Made in our little kitchen</p><h2 className="serif text-4xl tracking-[-.05em] text-[#493326] md:text-5xl">Something for <em className="text-[#68795b]">every hour.</em></h2><p className="mt-4 max-w-[460px] text-[13px] leading-6 text-[#75695b]">A short list of house favourites, morning bakes and things worth lingering over.</p></div><p className="max-w-[245px] border-l border-[#aab09b] pl-4 text-[10px] leading-[1.7] text-[#75695b]" data-testid="text-sample-menu-disclaimer">A little note: menu and prices are sample content, ready for your real favourites.</p></div>
        <div className="mb-9 flex flex-wrap gap-2" role="group" aria-label="Filter menu by category" data-testid="menu-category-filters">{categories.map((category) => <button key={category} type="button" onClick={() => setActiveCategory(category)} aria-pressed={activeCategory === category} className={`rounded-full border px-4 py-2.5 text-[10px] font-semibold transition-colors ${activeCategory === category ? 'border-[#405b47] bg-[#405b47] text-[#faf6ed]' : 'border-[#cfc5b4] bg-transparent text-[#665b4d] hover:border-[#718064] hover:text-[#405b47]'}`} data-testid={`button-filter-${category.toLowerCase().replaceAll(/[^a-z]+/g, '-')}`}>{category}</button>)}</div>
        <div className="grid gap-x-12 md:grid-cols-2" data-testid="menu-items-list">{visibleItems.map((item) => <article key={item.name} className="group border-t border-[#cfc5b4] py-5 transition-colors hover:border-[#7d8a70]" data-testid={`menu-item-${item.name.toLowerCase().replaceAll(/[^a-z]+/g, '-')}`}><div className="flex items-start justify-between gap-5"><div><div className="flex flex-wrap items-center gap-2"><h3 className="serif text-[19px] tracking-[-.02em] text-[#493326]">{item.name}</h3>{item.note && <span className="rounded-full bg-[#d8ddce] px-2 py-1 text-[8px] font-bold uppercase tracking-[.12em] text-[#536749]">{item.note}</span>}</div><p className="mt-1.5 text-[11px] leading-5 text-[#776b5c]">{item.detail}</p></div><span className="pt-1 font-serif text-[16px] text-[#596c4f]" data-testid={`text-price-${item.name.toLowerCase().replaceAll(/[^a-z]+/g, '-')}`}>{item.price}</span></div></article>)}</div>
        <div className="mt-9 flex flex-col justify-between gap-4 border-t border-[#cfc5b4] pt-5 text-[10px] text-[#776b5c] sm:flex-row sm:items-center"><span>Plant-based milk and decaf, always welcome.</span><span>Ask us about today’s bake.</span></div>
      </div>
    </section>
  </div>;
}

function ContactPage() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'fallback' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  async function handleContactSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get('name') || '');
    const email = String(form.get('email') || '');
    const message = String(form.get('message') || '');
    setStatus('sending');
    setStatusMessage('Sending your note…');
    try {
      const response = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, email, message }) });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.message || 'We could not send your note.');
      event.currentTarget.reset();
      setStatus('sent');
      setStatusMessage(result.message || 'Thanks — your note has been received.');
    } catch (error) {
      const subject = encodeURIComponent(`A note from ${name}`);
      const body = encodeURIComponent(`${message}\n\nFrom: ${name}\nEmail: ${email}`);
      window.location.href = `mailto:hello@maisonmorrow.example?subject=${subject}&body=${body}`;
      setStatus('fallback');
      setStatusMessage(error instanceof Error ? `${error.message} Your email app is opening instead.` : 'Your email app is opening instead.');
    }
  }
  return <div className="page-enter" data-testid="page-contact">
    <PageTitle eyebrow="We’ll put the kettle on" title={<>See you <em className="text-[#68795b]">soon?</em></>} lead="For a table, a question, or just to say hello. We’d love to hear from you." />
    <section className="px-6 py-14 md:px-10 md:py-20" data-testid="section-contact"><div className="mx-auto max-w-[1120px]">
      <div className="mb-10"><p className="eyebrow mb-3 text-[#718064]">Come by or drop us a line</p><h2 className="serif text-3xl tracking-[-.04em] text-[#493326] md:text-4xl">Your table is waiting.</h2></div>
      <div className="grid overflow-hidden rounded-[4px] border border-[#ded5c6] bg-[#f8f4ec] md:grid-cols-[.9fr_1.1fr]">
        <div className="bg-[#eee8dc] p-7 sm:p-10 md:p-12">
          <div className="space-y-8">
            <div className="flex gap-4"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#dce1d4] text-[#52674a]"><MapPin size={17} /></span><div><h3 className="text-[11px] font-bold uppercase tracking-[.12em] text-[#49382b]">Come by</h3><p className="mt-2 text-[13px] leading-6 text-[#75695b]" data-testid="text-address">[Add café street address]<br />[City, PIN code]</p><p className="mt-1 text-[10px] text-[#8b7d6c]">Address placeholder — update before opening.</p></div></div>
            <div className="flex gap-4"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#dce1d4] text-[#52674a]"><Clock3 size={17} /></span><div><h3 className="text-[11px] font-bold uppercase tracking-[.12em] text-[#49382b]">When we’re here</h3><p className="mt-2 text-[13px] leading-6 text-[#75695b]">Every day<br />8:00 am – 8:00 pm</p><p className="mt-1 text-[10px] text-[#8b7d6c]">Sample hours — please confirm.</p></div></div>
            <div className="flex gap-4"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#dce1d4] text-[#52674a]"><Coffee size={17} /></span><div><h3 className="text-[11px] font-bold uppercase tracking-[.12em] text-[#49382b]">A note or a call</h3><a className="mt-2 block text-[13px] text-[#536749] underline underline-offset-4" href="mailto:hello@maisonmorrow.example" data-testid="link-contact-email">hello@maisonmorrow.example</a><a className="mt-1 block text-[13px] text-[#536749] underline underline-offset-4" href="tel:+910000000000" data-testid="link-contact-phone">[Add phone number]</a><p className="mt-2 max-w-[235px] text-[10px] leading-5 text-[#8b7d6c]">Email and phone are owner placeholders. Please replace before publishing.</p></div></div>
          </div>
          <div className="mt-10 border-t border-[#d8cfbf] pt-6"><a href="https://www.instagram.com/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-[11px] font-semibold text-[#536749] no-underline hover:underline" data-testid="link-instagram"><Instagram size={15} /> Find us on Instagram <ArrowUpRight size={12} /></a><p className="mt-2 text-[9px] text-[#8b7d6c]">Replace with your café’s Instagram profile.</p></div>
        </div>
        <div className="p-7 sm:p-10 md:p-12">
          <p className="eyebrow mb-3 text-[#718064]">Drop us a line</p><h3 className="serif text-[2rem] tracking-[-.04em] text-[#493326]">We’re all ears.</h3>
          <p className="mt-3 max-w-[420px] text-[11px] leading-5 text-[#827564]">Send a note directly to the café. If the secure form service is unavailable, your email app will open with the message ready.</p>
          <form className="mt-7 space-y-5" onSubmit={handleContactSubmit} data-testid="form-contact">
            <div><label className="mb-2 block text-[10px] font-bold uppercase tracking-[.12em] text-[#655848]" htmlFor="contact-name">Your name</label><input id="contact-name" name="name" required autoComplete="name" className="w-full border-0 border-b border-[#d7cdbc] bg-transparent px-0 py-3 text-[13px] text-[#493326] outline-none placeholder:text-[#aa9f8f] focus:border-[#617555]" placeholder="How should we say hello?" data-testid="input-contact-name" /></div>
            <div><label className="mb-2 block text-[10px] font-bold uppercase tracking-[.12em] text-[#655848]" htmlFor="contact-email">Your email</label><input id="contact-email" name="email" type="email" required autoComplete="email" className="w-full border-0 border-b border-[#d7cdbc] bg-transparent px-0 py-3 text-[13px] text-[#493326] outline-none placeholder:text-[#aa9f8f] focus:border-[#617555]" placeholder="you@example.com" data-testid="input-contact-email" /></div>
            <div><label className="mb-2 block text-[10px] font-bold uppercase tracking-[.12em] text-[#655848]" htmlFor="contact-message">What’s on your mind?</label><textarea id="contact-message" name="message" required rows={3} className="w-full resize-y border-0 border-b border-[#d7cdbc] bg-transparent px-0 py-3 text-[13px] text-[#493326] outline-none placeholder:text-[#aa9f8f] focus:border-[#617555]" placeholder="A question, a booking, a nice thought…" data-testid="input-contact-message"></textarea></div>
            <button type="submit" disabled={status === 'sending'} className="inline-flex items-center gap-3 rounded-full bg-[#49382b] px-6 py-3.5 text-[11px] font-semibold text-[#fbf6ec] transition-colors hover:bg-[#405b47] disabled:cursor-wait disabled:opacity-70" data-testid="button-contact-submit">{status === 'sending' ? 'Sending…' : 'Send your note'} <ArrowRight size={14} /></button>
            {status !== 'idle' && <p className={`text-[11px] leading-5 ${status === 'error' ? 'text-red-700' : 'text-[#536749]'}`} role="status" data-testid="status-contact-handoff">{statusMessage}</p>}
          </form>
        </div>
      </div>
    </div></section>
  </div>;
}

function NotFound() {
  return <div className="page-enter min-h-[55vh] px-6 py-24 text-center" data-testid="page-not-found"><p className="eyebrow text-[#718064]">A wrong turn</p><h1 className="serif mt-4 text-5xl text-[#493326]">This page isn’t here.</h1><Link href="/" className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#49382b] px-6 py-3 text-sm text-[#fbf6ec] no-underline" data-testid="link-not-found-home">Back home <ArrowRight size={15} /></Link></div>;
}

function App() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    const meta = pageMeta[location] ?? { title: 'Page not found | Maison Morrow Café', description: 'The page you’re looking for could not be found.' };
    document.title = meta.title;
    const description = document.querySelector('meta[name="description"]');
    if (description) description.setAttribute('content', meta.description);
  }, [location]);
  return <div id="top" className="min-h-[100dvh]">
    <SiteHeader />
    <main>
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/about" component={AboutPage} />
        <Route path="/menu" component={MenuPage} />
        <Route path="/contact" component={ContactPage} />
        <Route component={NotFound} />
      </Switch>
    </main>
    <SiteFooter />
  </div>;
}

export default App;
