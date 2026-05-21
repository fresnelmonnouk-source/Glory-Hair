'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Orb } from './shared/Orb';
import { CrownMark } from './shared/CrownMark';
import { WigCard } from './shared/WigCard';
import { WIGS } from '@/lib/wigs-data';

type Route = 'home' | 'catalog' | 'product' | 'cart' | 'checkout' | 'auth' | 'account' | 'admin' | 'wishlist' | 'tryon' | 'journal';

interface CartItem {
  id: string;
  name: string;
  cat: string;
  style: string;
  price: number;
  color: string;
  shape: 'round' | 'wavy' | 'curly' | 'long';
  qty: number;
}

export function GloryHairApp() {
  const [route, setRoute] = useState<Route>('home');
  const [selectedWig, setSelectedWig] = useState<typeof WIGS[0]>(WIGS[0]!);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [showTryOn, setShowTryOn] = useState(false);
  const [elodieChatOpen, setElodieChatOpen] = useState(false);
  const [elodieMessages] = useState<
    Array<{ role: 'user' | 'bot'; content: React.ReactNode; quickReplies?: string[] }>
  >([
    {
      role: 'bot',
      content: (
        <>
          Bonjour, je suis <strong>Élodie</strong> ✨<br />
          Votre styliste personnelle Glory Hair. Comment puis-je vous accompagner aujourd'hui ?
        </>
      ),
      quickReplies: ['Trouver ma perruque', 'Lancer un essayage', 'Suivi de commande', 'Conseils morpho'],
    },
  ]);

  const goProduct = (wig: typeof WIGS[0]) => {
    setSelectedWig(wig);
    setRoute('product');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const addToCart = (wig: typeof WIGS[0]) => {
    const existingItem = cartItems.find((item) => item.id === wig.id);
    if (existingItem) {
      setCartItems(cartItems.map((item) => (item.id === wig.id ? { ...item, qty: item.qty + 1 } : item)));
    } else {
      setCartItems([
        ...cartItems,
        {
          id: wig.id,
          name: wig.name,
          cat: wig.cat,
          style: wig.style,
          price: wig.price,
          color: wig.color,
          shape: wig.shape,
          qty: 1,
        },
      ]);
    }
  };

  const toggleWishlist = (wigId: string) => {
    setWishlistIds((ids) => (ids.includes(wigId) ? ids.filter((id) => id !== wigId) : [...ids, wigId]));
  };

  // Nav component
  const Nav = () => (
    <nav className="nav glass">
      <div onClick={() => setRoute('home')} style={{ cursor: 'pointer' }}>
        <CrownMark size={26} />
      </div>
      <div className="nav-links">
        <a className={route === 'home' ? 'active' : ''} onClick={() => setRoute('home')}>
          Maison
        </a>
        <a className={route === 'catalog' ? 'active' : ''} onClick={() => setRoute('catalog')}>
          Catalogue
        </a>
        <a className={route === 'tryon' ? 'active' : ''} onClick={() => setRoute('tryon')}>
          Essayage virtuel
        </a>
        <a className={route === 'journal' ? 'active' : ''} onClick={() => setRoute('journal')}>
          Journal
        </a>
      </div>
      <div className="nav-actions">
        <button
          className="icon-btn"
          onClick={() => setElodieChatOpen(!elodieChatOpen)}
          title="Élodie"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </button>

        <button
          className="icon-btn"
          onClick={() => setRoute('wishlist')}
          title="Favoris"
          style={{ position: 'relative' }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill={wishlistIds.length > 0 ? 'var(--terracotta)' : 'none'}
            stroke={wishlistIds.length > 0 ? 'var(--terracotta)' : 'currentColor'}
            strokeWidth="1.6"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          {wishlistIds.length > 0 && <span className="dot" style={{ background: 'var(--terracotta)' }}></span>}
        </button>

        <button className="icon-btn" onClick={() => setRoute('account')} title="Mon compte">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
          >
            <circle cx="12" cy="7" r="4" />
            <path d="M5.5 21a6.5 6.5 0 0 1 13 0" />
          </svg>
        </button>

        <button className="icon-btn" onClick={() => setRoute('cart')} title="Panier" style={{ position: 'relative' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
            <path d="M3 6h18" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
          {cartItems.length > 0 && <span className="dot"></span>}
        </button>

        <button className="btn btn-primary btn-sm" style={{ marginLeft: 8 }} onClick={() => setRoute('admin')}>
          Admin
        </button>
      </div>
    </nav>
  );

  // Try-on page
  const TryOnPage = ({ onSelectWig, goProduct, wishlistIds, onToggleWishlist }: {
    onSelectWig: (w: typeof WIGS[0]) => void
    goProduct: (w: typeof WIGS[0]) => void
    wishlistIds: string[]
    onToggleWishlist: (id: string) => void
  }) => (
    <div style={{ maxWidth: 1320, margin: '0 auto', padding: '48px 40px 120px' }}>
      <div style={{ textAlign: 'center', marginBottom: 64 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '6px 16px', background: 'var(--surface)', borderRadius: 999, fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--ink-soft)', marginBottom: 24, boxShadow: 'var(--sh-1)' }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--gold)', display: 'inline-block' }}></span>
          Essayage hybride · Basic &amp; Premium
        </div>
        <h1 style={{ fontFamily: 'var(--f-display)', fontSize: 'clamp(48px, 6vw, 88px)', lineHeight: .97, letterSpacing: '-.025em', marginBottom: 24 }}>
          Essayez avant<br />
          <span className="italic" style={{ color: 'var(--gold-deep)' }}>d'acheter.</span>
        </h1>
        <p style={{ fontSize: 17, color: 'var(--ink-soft)', maxWidth: 540, margin: '0 auto', lineHeight: 1.6 }}>
          Choisissez une perruque ci-dessous et lancez l'essayage. En Basic c'est instantané et gratuit — en Premium, l'IA génère un rendu photo-réaliste.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, maxWidth: 640, margin: '40px auto 0' }}>
          {[
            { badge: '⚡ Basic', badgeBg: 'rgba(92,200,92,.1)', badgeColor: '#3a7a32', badgeBorder: 'rgba(92,200,92,.3)', title: 'Gratuit & instantané', items: ['Overlay en < 1 seconde', 'Traitement 100 % local', 'Illimité, aucun compte requis'] },
            { badge: '✨ Premium', badgeBg: 'rgba(184,135,70,.1)', badgeColor: 'var(--gold-deep)', badgeBorder: 'rgba(184,135,70,.35)', title: '1er essai offert', items: ['Rendu photo-réaliste par IA', 'Stability AI · qualité studio', 'Prêt à partager sur les réseaux'] },
          ].map(c => (
            <div key={c.badge} style={{ padding: '24px 22px', background: 'var(--surface)', borderRadius: 'var(--r-lg)', border: `1px solid ${c.badgeBorder}`, textAlign: 'left' }}>
              <div style={{ display: 'inline-flex', padding: '4px 12px', background: c.badgeBg, border: `1px solid ${c.badgeBorder}`, borderRadius: 999, fontSize: 11, color: c.badgeColor, fontWeight: 600, letterSpacing: '.06em', marginBottom: 14 }}>{c.badge}</div>
              <div style={{ fontFamily: 'var(--f-display)', fontSize: 20, marginBottom: 14 }}>{c.title}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {c.items.map(i => (
                  <div key={i} style={{ fontSize: 13, color: 'var(--ink-soft)', display: 'flex', gap: 8 }}>
                    <span style={{ color: c.badgeColor, flexShrink: 0 }}>✓</span> {i}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="section-head" style={{ marginBottom: 32 }}>
          <div>
            <div className="section-eyebrow">Toute la collection · {WIGS.length} perruques</div>
            <h2>Choisissez votre <span className="italic" style={{ color: 'var(--gold-deep)' }}>couronne</span></h2>
          </div>
        </div>

        <div className="wig-grid">
          {WIGS.map(w => (
            <div key={w.id} style={{ position: 'relative' }}>
              <WigCard wig={w} onClick={() => goProduct(w)} wishlisted={wishlistIds.includes(w.id)} onToggleWishlist={toggleWishlist} />
              <button
                onClick={() => onSelectWig(w)}
                style={{
                  position: 'absolute', bottom: 20, left: 16, right: 16,
                  padding: '11px 0',
                  background: 'var(--ink)',
                  color: 'var(--bg-warm)',
                  border: 'none',
                  borderRadius: 999,
                  fontSize: 12,
                  fontWeight: 500,
                  letterSpacing: '.04em',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  transition: 'opacity .2s, transform .2s',
                  opacity: 0,
                  zIndex: 5,
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = '1'; (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = '0'; (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)'; }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>
                Essayer
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Journal page
  const JournalPage = () => (
    <section className="section">
      <div className="section-head">
        <div>
          <div className="section-eyebrow">Journal</div>
          <h2>Conseils &amp; <span className="italic" style={{ color: 'var(--gold-deep)' }}>inspirations</span></h2>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
        {[
          { t: "5 textures pour l'été", c: 'Tendances', i: 'var(--hair-4)', s: 'curly' },
          { t: 'Trouver sa morphologie', c: 'Guide', i: 'var(--hair-2)', s: 'wavy' },
          { t: "L'entretien d'une lace front", c: 'Soin', i: 'var(--hair-1)', s: 'long' },
        ].map(p => (
          <article key={p.t} style={{ background: 'var(--surface)', borderRadius: 'var(--r-lg)', padding: 24, border: '1px solid var(--line-soft)' }}>
            <div style={{ aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, background: 'var(--bg-warm)', borderRadius: 'var(--r-md)', overflow: 'hidden' }}>
              <div style={{ width: '60%', height: '60%' }}><Orb color={p.i} shape={p.s as any} /></div>
            </div>
            <div style={{ fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--gold-deep)', marginBottom: 6 }}>{p.c}</div>
            <h3 style={{ fontFamily: 'var(--f-display)', fontSize: 24, letterSpacing: '-.01em' }}>{p.t}</h3>
            <div style={{ fontSize: 13, color: 'var(--ink-soft)', marginTop: 8 }}>5 min de lecture</div>
          </article>
        ))}
      </div>
    </section>
  );

  // Home screen
  const HomeScreen = () => {
    const stageRef = useRef<HTMLDivElement>(null);
    const [mouse, setMouse] = useState({ x: 0, y: 0 });

    useEffect(() => {
      const handleMove = (e: MouseEvent) => {
        if (!stageRef.current) return;
        const rect = stageRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
        setMouse({ x, y });
      };
      window.addEventListener('mousemove', handleMove);
      return () => window.removeEventListener('mousemove', handleMove);
    }, []);

    const px = (depth: number) => `translate3d(${mouse.x * depth}px, ${mouse.y * depth}px, 0)`;

    return (
      <>
        <section className="hero">
          <div className="hero-grid">
            <div>
              <div className="hero-eyebrow">
                <span className="pulse"></span>
                Nouvelle collection · Été 2026
              </div>
              <h1>
                Votre beauté,<br />
                <span className="italic">votre couronne.</span>
              </h1>
              <p className="hero-sub">
                Perruques premium en cheveux humains. Essayage hybride : Basic gratuit en 1 seconde, ou Premium
                photo-réaliste par IA — 1er essai offert. Conseils d'Élodie 24h/24.
              </p>
              <div className="hero-cta">
                <button className="btn btn-primary" onClick={() => setRoute('catalog')}>
                  Découvrir le catalogue
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14m-6-7 7 7-7 7" />
                  </svg>
                </button>
                <button className="btn btn-ghost" onClick={() => setRoute('tryon')}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <path d="M23 7l-7 5 7 5V7z" />
                    <rect x="1" y="5" width="15" height="14" rx="2" />
                  </svg>
                  Essayer en direct
                </button>
              </div>
              <div className="hero-stats">
                <div>
                  <div className="stat-num">
                    87<span className="italic">k+</span>
                  </div>
                  <div className="stat-lbl">Essayages virtuels</div>
                </div>
                <div>
                  <div className="stat-num">
                    4.9<span className="italic">★</span>
                  </div>
                  <div className="stat-lbl">Sur 12k+ avis</div>
                </div>
                <div>
                  <div className="stat-num">
                    48<span className="italic">h</span>
                  </div>
                  <div className="stat-lbl">Livraison France</div>
                </div>
              </div>
            </div>

            <div className="hero-stage" ref={stageRef}>
              <div className="stage-floor"></div>

              <div className="wig-float" style={{ top: '15%', left: '50%', transform: `translateX(-50%) ${px(12)}`, width: 340, height: 340, animationDelay: '0s' }}>
                <Orb color="var(--hair-2)" shape="long" />
              </div>

              <div className="wig-float" style={{ top: '8%', left: '5%', transform: px(20), width: 130, height: 130, animationDelay: '1.5s' }}>
                <Orb color="var(--hair-4)" shape="curly" />
              </div>

              <div className="wig-float" style={{ top: '12%', right: '5%', transform: px(18), width: 120, height: 120, animationDelay: '0.8s' }}>
                <Orb color="var(--hair-1)" shape="wavy" />
              </div>

              <div className="wig-float" style={{ bottom: '15%', left: '8%', transform: px(25), width: 100, height: 100, animationDelay: '2.2s' }}>
                <Orb color="var(--hair-5)" shape="wavy" />
              </div>

              <div className="wig-float" style={{ bottom: '20%', right: '8%', transform: px(15), width: 110, height: 110, animationDelay: '0.4s' }}>
                <Orb color="var(--hair-3)" shape="curly" />
              </div>

              <div className="glass" style={{ position: 'absolute', top: '52%', right: '0%', padding: '14px 18px', borderRadius: 18, transform: px(30), display: 'flex', alignItems: 'center', gap: 12, fontSize: 13 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, var(--gold-light), var(--gold-deep))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </div>
                <div>
                  <div style={{ fontWeight: 500 }}>IA Face Mesh</div>
                  <div style={{ fontSize: 11, color: 'var(--ink-mute)' }}>468 points · temps réel</div>
                </div>
              </div>

              <div className="glass" style={{ position: 'absolute', top: '70%', left: '0%', padding: '12px 16px', borderRadius: 18, transform: px(22), fontSize: 13 }}>
                <div style={{ fontSize: 10, color: 'var(--ink-mute)', textTransform: 'uppercase', letterSpacing: '.1em' }}>Aura Lace 18"</div>
                <div style={{ fontFamily: 'var(--f-display)', fontSize: 22, marginTop: 2 }}>289 €</div>
              </div>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="section-head">
            <div>
              <div className="section-eyebrow">Best-sellers</div>
              <h2>
                Couronnes de la <span className="italic" style={{ color: 'var(--gold-deep)' }}>saison</span>
              </h2>
            </div>
            <button className="btn btn-ghost" onClick={() => setRoute('catalog')}>
              Voir tout
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14m-6-7 7 7-7 7" />
              </svg>
            </button>
          </div>
          <div className="wig-grid">
            {WIGS.slice(0, 4).map((w) => (
              <WigCard key={w.id} wig={w} onClick={() => goProduct(w)} wishlisted={wishlistIds.includes(w.id)} onToggleWishlist={toggleWishlist} />
            ))}
          </div>
        </section>

        <footer className="foot">
          <div className="display">
            Votre beauté, <span className="italic">votre couronne.</span>
          </div>
          <div>Glory Hair · Maison de perruques · © 2026</div>
        </footer>
      </>
    );
  };

  // Catalog screen
  const CatalogScreen = () => {
    const [activeCat, setActiveCat] = useState('all');
    const cats = ['all', 'Lace Front', 'Full Lace', '360 Lace', 'Closure', 'Headband'];
    const filtered = activeCat === 'all' ? WIGS : WIGS.filter((w) => w.cat === activeCat);

    return (
      <section className="section">
        <div className="section-head">
          <div>
            <div className="section-eyebrow">Catalogue · {filtered.length} pièces</div>
            <h2>
              Toute la <span className="italic" style={{ color: 'var(--gold-deep)' }}>collection</span>
            </h2>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            {cats.map((c) => (
              <button
                key={c}
                onClick={() => setActiveCat(c)}
                className={activeCat === c ? 'btn btn-dark btn-sm' : 'btn btn-ghost btn-sm'}
              >
                {c === 'all' ? 'Tout' : c}
              </button>
            ))}
          </div>
        </div>
        <div className="wig-grid">
          {filtered.map((w) => (
            <WigCard key={w.id} wig={w} onClick={() => goProduct(w)} wishlisted={wishlistIds.includes(w.id)} onToggleWishlist={toggleWishlist} />
          ))}
        </div>
      </section>
    );
  };

  // Product screen - Simplified version
  const ProductScreen = () => {
    const [color, setColor] = useState(selectedWig.swatches[0]);
    const [size, setSize] = useState('M');

    const sizes = [
      { id: 'XS', cm: '52', stock: true },
      { id: 'S', cm: '54', stock: true },
      { id: 'M', cm: '56', stock: true },
      { id: 'L', cm: '58', stock: true },
      { id: 'XL', cm: '60', stock: false },
    ];

    const colorNames: Record<string, string> = {
      'var(--hair-1)': 'Noir Onyx',
      'var(--hair-2)': 'Châtain Espresso',
      'var(--hair-3)': 'Miel Doré',
      'var(--hair-4)': 'Blond Sable',
      'var(--hair-5)': 'Prune Bordeaux',
    };

    return (
      <section className="product">
        <div style={{ marginBottom: 24, display: 'flex', gap: 8, fontSize: 13, color: 'var(--ink-soft)' }}>
          <span>Catalogue</span>
          <span>·</span>
          <span>{selectedWig.cat}</span>
          <span>·</span>
          <span style={{ color: 'var(--ink)' }}>{selectedWig.name}</span>
        </div>
        <div className="product-grid">
          <div className="product-stage">
            <Orb color={color} shape={selectedWig.shape} style={{ width: '60%', height: '60%' }} />
            <div className="glass" style={{ position: 'absolute', top: 20, right: 20, padding: '10px 14px', borderRadius: 14, fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase' }}>
              <span style={{ color: 'var(--gold-deep)', marginRight: 8 }}>●</span>
              Face
            </div>
            <div className="glass" style={{ position: 'absolute', bottom: 80, left: 20, padding: '8px 14px', borderRadius: 14, fontSize: 12 }}>
              <span style={{ color: '#5a8a4a' }}>● En stock</span> · Exp. 48h
            </div>
          </div>

          <div className="product-info">
            <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
              <span style={{ padding: '4px 10px', borderRadius: 999, background: 'var(--ink)', color: 'var(--bg-warm)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '.08em' }}>{selectedWig.cat}</span>
              <span style={{ padding: '4px 10px', borderRadius: 999, background: 'var(--surface)', color: 'var(--ink-soft)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '.08em', border: '1px solid var(--line)' }}>Cheveux humains</span>
            </div>

            <h1>{selectedWig.name}</h1>
            <div style={{ fontSize: 15, color: 'var(--ink-soft)', marginTop: 10 }}>{selectedWig.style} · Densité 150% · Bébé hairs naturels</div>

            <div className="product-rating">
              <span className="stars">★★★★★</span>
              <span>
                {selectedWig.rating} ({selectedWig.reviews} avis)
              </span>
              <span>·</span>
              <span>{Math.round(selectedWig.reviews * 12)} essayages virtuels</span>
            </div>

            <div className="price">
              {selectedWig.price} €
              {selectedWig.was && <span className="price-was">{selectedWig.was} €</span>}
            </div>

            <div className="opt-block">
              <div className="opt-label">
                <span>Coloris</span>
                <strong>{colorNames[color] || 'Personnalisé'}</strong>
              </div>
              <div className="color-row">
                {selectedWig.swatches.map((c) => (
                  <div
                    key={c}
                    className={`color-chip ${color === c ? 'active' : ''}`}
                    style={{ background: `radial-gradient(circle at 30% 25%, color-mix(in srgb, ${c} 100%, white 30%) 0%, ${c} 60%, color-mix(in srgb, ${c} 100%, black 30%) 100%)` }}
                    onClick={() => setColor(c)}
                  />
                ))}
              </div>
            </div>

            <div className="opt-block">
              <div className="opt-label">
                <span>Taille de bonnet</span>
                <strong>
                  {size} · {sizes.find((s) => s.id === size)?.cm} cm
                </strong>
              </div>
              <div className="size-row">
                {sizes.map((s) => (
                  <button
                    key={s.id}
                    className={`size-btn ${size === s.id ? 'active' : ''} ${!s.stock ? 'oos' : ''}`}
                    onClick={() => s.stock && setSize(s.id)}
                  >
                    {s.id}
                  </button>
                ))}
              </div>
            </div>

            <div className="product-actions">
              <button className="btn btn-dark" onClick={() => addToCart(selectedWig)}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                  <path d="M3 6h18" />
                </svg>
                Ajouter au panier · {selectedWig.price}€
              </button>
              <button className="btn btn-ghost" style={{ padding: '14px 20px' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  };

  // Try-on Modal
  const TryOnModal = ({ wig, onClose }: { wig: typeof WIGS[0]; onClose: () => void }) => {
    const [step, setStep] = useState<'mode' | 'quality' | 'consent' | 'processing' | 'result'>('mode');
    const [mode, setMode] = useState<'camera' | 'photo' | null>(null);
    const [quality, setQuality] = useState<'basic' | 'premium' | null>(null);
    const [consent, setConsent] = useState({ essential: false, storage: false, improvement: false, premiumAI: false });
    const [progress, setProgress] = useState(0);
    const [tryColor, setTryColor] = useState(wig.swatches[0]);

    const startProcessing = () => {
      setStep('processing');
      setProgress(0);
      const duration = quality === 'basic' ? 1400 : 5000;
      const tick = 80;
      const step = 100 / (duration / tick);
      const iv = setInterval(() => {
        setProgress((p) => {
          const next = p + step;
          if (next >= 100) {
            clearInterval(iv);
            setTimeout(() => setStep('result'), 200);
            return 100;
          }
          return next;
        });
      }, tick);
    };

    return (
      <div className="modal-backdrop" onClick={onClose}>
        <div className="modal" onClick={(e) => e.stopPropagation()}>
          <button className="modal-close" onClick={onClose}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>

          <div className="try-canvas">
            {step === 'mode' && (
              <div className="tryon-step">
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: 11, letterSpacing: '.15em', textTransform: 'uppercase', color: 'var(--gold-light)', marginBottom: 12, opacity: 0.8 }}>Étape 1 / 3</p>
                  <h3 style={{ fontFamily: 'var(--f-display)', fontSize: 34, lineHeight: 1.05, color: 'white' }}>
                    Comment souhaitez-vous<br />
                    <span style={{ fontStyle: 'italic', color: 'var(--gold-light)' }}>essayer ?</span>
                  </h3>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, width: '100%', maxWidth: 460 }}>
                  <button className="tryon-mode-btn" onClick={() => { setMode('camera'); setStep('quality'); }}>
                    <div className="tryon-mode-icon">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                        <rect x="3" y="5" width="18" height="14" rx="2" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    </div>
                    <div style={{ fontWeight: 500, fontSize: 15, color: 'white' }}>Caméra en direct</div>
                    <div style={{ fontSize: 12, opacity: 0.55, color: 'white', marginTop: 3 }}>Essayage en temps réel</div>
                  </button>
                  <button className="tryon-mode-btn" onClick={() => { setMode('photo'); setStep('quality'); }}>
                    <div className="tryon-mode-icon">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <circle cx="9" cy="9" r="2" />
                        <path d="m21 15-5-5L5 21" />
                      </svg>
                    </div>
                    <div style={{ fontWeight: 500, fontSize: 15, color: 'white' }}>Importer une photo</div>
                    <div style={{ fontSize: 12, opacity: 0.55, color: 'white', marginTop: 3 }}>Depuis votre galerie</div>
                  </button>
                </div>
              </div>
            )}

            {step === 'quality' && (
              <div className="tryon-step">
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: 11, letterSpacing: '.15em', textTransform: 'uppercase', color: 'var(--gold-light)', marginBottom: 12, opacity: 0.8 }}>Étape 2 / 3</p>
                  <h3 style={{ fontFamily: 'var(--f-display)', fontSize: 34, lineHeight: 1.05, color: 'white' }}>
                    Choisissez votre<br />
                    <span style={{ fontStyle: 'italic', color: 'var(--gold-light)' }}>qualité d'essayage</span>
                  </h3>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, width: '100%', maxWidth: 480 }}>
                  <button className="tryon-quality-btn basic" onClick={() => { setQuality('basic'); setStep('consent'); }}>
                    <div className="tryon-quality-badge green">GRATUIT ∞</div>
                    <div className="tryon-quality-emoji">⚡</div>
                    <div style={{ fontWeight: 600, fontSize: 18, color: 'white', marginBottom: 6 }}>Basic</div>
                    <div style={{ fontSize: 12, opacity: 0.65, color: 'white', lineHeight: 1.5, marginBottom: 16 }}>Overlay instantané. Testez plusieurs styles en quelques secondes.</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                      {["Moins d'1 seconde", 'Traitement 100 % local', 'Illimité & gratuit'].map((f) => (
                        <div key={f} style={{ fontSize: 11, display: 'flex', gap: 8, alignItems: 'center', color: 'white', opacity: 0.8 }}>
                          <span style={{ color: '#6cd964' }}>✓</span> {f}
                        </div>
                      ))}
                    </div>
                  </button>
                  <button className="tryon-quality-btn premium" onClick={() => { setQuality('premium'); setStep('consent'); }}>
                    <div className="tryon-quality-badge gold">1ER ESSAI GRATUIT</div>
                    <div className="tryon-quality-emoji">✨</div>
                    <div style={{ fontWeight: 600, fontSize: 18, color: 'white', marginBottom: 6 }}>Premium</div>
                    <div style={{ fontSize: 12, opacity: 0.65, color: 'white', lineHeight: 1.5, marginBottom: 16 }}>Photo-réaliste généré par IA. Qualité studio, prêt à partager sur les réseaux.</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                      {['Rendu photo-réaliste', 'IA générative (Stability AI)', 'Idéal pour les réseaux'].map((f) => (
                        <div key={f} style={{ fontSize: 11, display: 'flex', gap: 8, alignItems: 'center', color: 'white', opacity: 0.8 }}>
                          <span style={{ color: 'var(--gold-light)' }}>✓</span> {f}
                        </div>
                      ))}
                    </div>
                  </button>
                </div>
                <button onClick={() => setStep('mode')} style={{ color: 'rgba(255,255,255,.4)', fontSize: 13, background: 'none', border: 'none', cursor: 'pointer', marginTop: -8 }}>← Retour</button>
              </div>
            )}

            {step === 'consent' && (
              <div className="tryon-step" style={{ gap: 20, overflowY: 'auto' }}>
                <div style={{ width: 52, height: 52, borderRadius: 15, background: 'linear-gradient(135deg, var(--gold-light), var(--gold-deep))', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.6">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: 11, letterSpacing: '.15em', textTransform: 'uppercase', color: 'var(--gold-light)', marginBottom: 10, opacity: 0.8 }}>Étape 3 / 3 · Confidentialité</p>
                  <h3 style={{ fontFamily: 'var(--f-display)', fontSize: 28, lineHeight: 1.05, color: 'white', marginBottom: 10 }}>
                    Protection de <span style={{ fontStyle: 'italic', color: 'var(--gold-light)' }}>vos données</span>
                  </h3>
                  <p style={{ fontSize: 13, opacity: 0.65, color: 'white', maxWidth: 360, lineHeight: 1.55 }}>
                    {quality === 'basic' ? 'L\'essayage Basic est 100 % local. Aucune image ne quitte votre appareil.' : 'Le mode Premium envoie votre photo à Stability AI (USA) pour la génération. Votre consentement explicite est requis.'}
                  </p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%', maxWidth: 420 }}>
                  {[
                    { k: 'essential', t: "Traitement de l'image pour l'essayage", s: 'Obligatoire', req: true },
                    ...(quality === 'premium' ? [{ k: 'premiumAI', t: 'Envoi à Stability AI pour la génération IA', s: 'Requis pour mode premium', req: true, highlight: true }] : []),
                  ].map((c: any) => (
                    <label key={c.k} style={{ display: 'flex', gap: 12, padding: '12px 14px', background: c.highlight ? 'rgba(184,135,70,.12)' : 'rgba(255,255,255,.06)', border: `1px solid ${c.highlight ? 'rgba(184,135,70,.35)' : 'rgba(255,255,255,.09)'}`, borderRadius: 12, cursor: 'pointer', alignItems: 'flex-start' }}>
                      <input type="checkbox" checked={(consent as any)[c.k] || false} onChange={(e) => setConsent({ ...consent, [c.k]: e.target.checked })} style={{ marginTop: 2, accentColor: 'var(--gold)', flexShrink: 0 }} />
                      <div>
                        <div style={{ fontSize: 13, color: 'white', display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                          {c.t}
                          {c.req && <span style={{ fontSize: 9, letterSpacing: '.08em', background: c.highlight ? 'var(--gold)' : 'rgba(255,255,255,.15)', color: c.highlight ? 'var(--ink)' : 'white', padding: '2px 6px', borderRadius: 999, fontWeight: 600 }}>REQUIS</span>}
                        </div>
                        <div style={{ fontSize: 11, opacity: 0.5, color: 'white', marginTop: 3 }}>{c.s}</div>
                      </div>
                    </label>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 10, width: '100%', maxWidth: 420 }}>
                  <button onClick={() => setStep('quality')} className="btn btn-ghost" style={{ padding: '14px 18px', color: 'white', borderColor: 'rgba(255,255,255,.2)', flexShrink: 0 }}>
                    ←
                  </button>
                  <button className="btn btn-primary" style={{ flex: 1 }} disabled={!consent.essential} onClick={startProcessing}>
                    {quality === 'premium' ? 'Lancer · 1er essai gratuit' : "Lancer l'essayage"}
                  </button>
                </div>
              </div>
            )}

            {step === 'processing' && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 32, color: 'white', padding: 48 }}>
                <div style={{ position: 'relative', width: 120, height: 120, flexShrink: 0 }}>
                  <svg style={{ position: 'absolute', inset: 0, transform: 'rotate(-90deg)' }} width="120" height="120" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,.08)" strokeWidth="4" />
                    <circle cx="60" cy="60" r="52" fill="none" stroke="var(--gold-light)" strokeWidth="4" strokeDasharray={String(2 * Math.PI * 52)} strokeDashoffset={String(2 * Math.PI * 52 * (1 - progress / 100))} strokeLinecap="round" style={{ transition: 'stroke-dashoffset .4s linear' }} />
                  </svg>
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontFamily: 'var(--f-display)', fontSize: 28, lineHeight: 1 }}>{Math.round(progress)}</span>
                    <span style={{ fontSize: 11, opacity: 0.5 }}>%</span>
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: 'var(--f-display)', fontSize: 24, marginBottom: 8 }}>{quality === 'basic' ? 'Essayage en cours…' : 'Génération IA…'}</div>
                  <div style={{ fontSize: 13, opacity: 0.6, minHeight: 20 }}>{quality === 'basic' ? 'Analyse des 468 points…' : 'Génération IA en cours…'}</div>
                </div>
              </div>
            )}

            {step === 'result' && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 24, padding: 48 }}>
                <div style={{ position: 'relative', width: '68%', aspectRatio: '3/4', alignSelf: 'center' }}>
                  <div className="try-face"></div>
                  <div className="try-wig wavy" style={{ background: `radial-gradient(ellipse at 50% 30%, color-mix(in srgb, ${tryColor} 100%, white 25%) 0%, ${tryColor} 50%, color-mix(in srgb, ${tryColor} 100%, black 30%) 100%)` }}>
                    <div style={{ position: 'absolute', inset: 0, borderRadius: 'inherit', background: `repeating-conic-gradient(from -90deg at 50% -20%, transparent 0deg, color-mix(in srgb, ${tryColor} 100%, white 15%) 1deg, transparent 3deg)`, mixBlendMode: 'overlay', opacity: 0.6 }}></div>
                  </div>
                  <div style={{ position: 'absolute', bottom: -10, right: -10, padding: '5px 12px', background: 'linear-gradient(135deg, var(--gold), var(--gold-deep))', borderRadius: 999, fontSize: 10, color: 'white', fontWeight: 600, letterSpacing: '.06em', boxShadow: '0 4px 12px rgba(184,135,70,.4)' }}>
                    ✨ Ultra-Réaliste
                  </div>
                </div>

                <div style={{ fontSize: 14, color: 'white' }}>Résultat fantastique ! 🎉</div>

                <div style={{ display: 'flex', gap: 10 }}>
                  <button className="btn btn-primary" onClick={() => addToCart(wig)}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                      <path d="M3 6h18" />
                    </svg>
                    Ajouter au panier
                  </button>
                  <button className="btn btn-ghost" style={{ color: 'white', borderColor: 'rgba(255,255,255,.2)' }} onClick={() => { setStep('mode'); setQuality(null); setMode(null); }}>
                    Recommencer
                  </button>
                  <button className="btn btn-ghost" style={{ color: 'white', borderColor: 'rgba(255,255,255,.2)' }} onClick={onClose}>
                    Fermer
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="try-side">
            <div>
              <div style={{ fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--gold-deep)' }}>Essayage virtuel hybride</div>
              <h3 style={{ marginTop: 6 }}>{wig.name}</h3>
              <div className="sub">{wig.cat} · {wig.style} · {wig.price} €</div>
            </div>
            {step === 'result' && (
              <div>
                <div className="opt-label" style={{ marginBottom: 10 }}>
                  <span>Coloris</span>
                </div>
                <div className="color-row">
                  {wig.swatches.map((c) => (
                    <div key={c} className={`color-chip ${tryColor === c ? 'active' : ''}`} style={{ background: `radial-gradient(circle at 30% 25%, color-mix(in srgb, ${c} 100%, white 30%) 0%, ${c} 60%, color-mix(in srgb, ${c} 100%, black 30%) 100%)` }} onClick={() => setTryColor(c)} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Checkout Screen
  const CheckoutScreen = () => {
    const [step, setStep] = useState(1);
    const [address, setAddress] = useState('');
    const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'fedapay'>('stripe');

    const subtotal = cartItems.reduce((s, i) => s + i.price * i.qty, 0);
    const shipping = subtotal >= 150 ? 0 : 9.9;
    const total = subtotal + shipping;

    return (
      <section className="section">
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <h2 style={{ marginBottom: 40 }}>
            Finaliser votre <span className="italic" style={{ color: 'var(--gold-deep)' }}>commande</span>
          </h2>

          {/* Progress indicator */}
          <div style={{ display: 'flex', gap: 0, marginBottom: 40, borderRadius: 'var(--r-lg)', overflow: 'hidden', border: '1px solid var(--line)' }}>
            {[1, 2, 3].map((s) => (
              <div key={s} style={{ flex: 1, padding: '16px', textAlign: 'center', background: step >= s ? 'var(--gold-light)' : 'var(--bg-warm)', color: step >= s ? 'white' : 'var(--ink-soft)', fontWeight: step === s ? 600 : 400, cursor: 'pointer' }} onClick={() => setStep(s)}>
                {s === 1 ? 'Adresse' : s === 2 ? 'Livraison' : 'Paiement'}
              </div>
            ))}
          </div>

          {step === 1 && (
            <div className="section" style={{ padding: 0 }}>
              <h3 style={{ marginBottom: 24 }}>Adresse de livraison</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 600 }}>
                <input type="text" placeholder="Rue et numéro" style={{ padding: '12px 16px', border: '1px solid var(--line)', borderRadius: 'var(--r-md)', fontFamily: 'var(--f-body)', fontSize: 14 }} />
                <input type="text" placeholder="Code postal et ville" style={{ padding: '12px 16px', border: '1px solid var(--line)', borderRadius: 'var(--r-md)', fontFamily: 'var(--f-body)', fontSize: 14 }} />
                <input type="text" placeholder="Pays" style={{ padding: '12px 16px', border: '1px solid var(--line)', borderRadius: 'var(--r-md)', fontFamily: 'var(--f-body)', fontSize: 14 }} />
                <button className="btn btn-primary" onClick={() => setStep(2)}>
                  Continuer vers la livraison
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14m-6-7 7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="section" style={{ padding: 0 }}>
              <h3 style={{ marginBottom: 24 }}>Méthode de livraison</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 600 }}>
                {[
                  { id: 'standard', label: 'Livraison standard', desc: '3-5 jours', price: 9.9 },
                  { id: 'express', label: 'Livraison express', desc: '1-2 jours', price: 19.9 },
                  { id: 'free', label: 'Livraison gratuite', desc: '5-7 jours', price: 0, disabled: subtotal < 150 },
                ].map((opt) => (
                  <label key={opt.id} style={{ padding: '16px', border: '1px solid var(--line)', borderRadius: 'var(--r-md)', cursor: opt.disabled ? 'not-allowed' : 'pointer', opacity: opt.disabled ? 0.5 : 1, display: 'flex', gap: 12, alignItems: 'center' }}>
                    <input type="radio" disabled={opt.disabled} style={{ accentColor: 'var(--gold)' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 500 }}>{opt.label}</div>
                      <div style={{ fontSize: 12, color: 'var(--ink-soft)' }}>{opt.desc}</div>
                    </div>
                    <div style={{ fontWeight: 600 }}>{opt.price === 0 ? 'Gratuit' : `+${opt.price}€`}</div>
                  </label>
                ))}
              </div>
              <button className="btn btn-primary" style={{ marginTop: 32 }} onClick={() => setStep(3)}>
                Continuer vers le paiement
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14m-6-7 7 7-7 7" />
                </svg>
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="section" style={{ padding: 0 }}>
              <h3 style={{ marginBottom: 24 }}>Méthode de paiement</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 600, marginBottom: 32 }}>
                <label style={{ padding: '16px', border: paymentMethod === 'stripe' ? '2px solid var(--gold)' : '1px solid var(--line)', borderRadius: 'var(--r-md)', cursor: 'pointer', display: 'flex', gap: 12, alignItems: 'center', background: paymentMethod === 'stripe' ? 'rgba(184,135,70,.05)' : 'transparent' }}>
                  <input type="radio" checked={paymentMethod === 'stripe'} onChange={() => setPaymentMethod('stripe')} style={{ accentColor: 'var(--gold)' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 500 }}>Carte bancaire (Stripe)</div>
                    <div style={{ fontSize: 12, color: 'var(--ink-soft)' }}>Visa, Mastercard, Amex</div>
                  </div>
                </label>
                <label style={{ padding: '16px', border: paymentMethod === 'fedapay' ? '2px solid var(--gold)' : '1px solid var(--line)', borderRadius: 'var(--r-md)', cursor: 'pointer', display: 'flex', gap: 12, alignItems: 'center', background: paymentMethod === 'fedapay' ? 'rgba(184,135,70,.05)' : 'transparent' }}>
                  <input type="radio" checked={paymentMethod === 'fedapay'} onChange={() => setPaymentMethod('fedapay')} style={{ accentColor: 'var(--gold)' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 500 }}>FedaPay (Mobile Money)</div>
                    <div style={{ fontSize: 12, color: 'var(--ink-soft)' }}>Orange Money, Moov, MTN...</div>
                  </div>
                </label>
              </div>
              <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '16px' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                Payer {total.toFixed(2)} € avec {paymentMethod === 'stripe' ? 'Stripe' : 'FedaPay'}
              </button>
              <p style={{ fontSize: 12, color: 'var(--ink-mute)', textAlign: 'center', marginTop: 16 }}>Votre paiement est sécurisé et chiffré.</p>
            </div>
          )}
        </div>
      </section>
    );
  };

  // Wishlist Screen
  const WishlistScreen = () => {
    const items = WIGS.filter((w) => wishlistIds.includes(w.id));

    if (items.length === 0) {
      return (
        <section className="section" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24, textAlign: 'center' }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--surface)', border: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--ink-mute)" strokeWidth="1.4">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </div>
          <h2 style={{ fontSize: 36, marginBottom: 10 }}>
            Aucun <span className="italic" style={{ color: 'var(--gold-deep)' }}>favori</span>
          </h2>
          <p style={{ color: 'var(--ink-soft)', fontSize: 15 }}>Cliquez sur le ♡ d'une perruque pour la retrouver ici.</p>
          <button className="btn btn-primary" onClick={() => setRoute('catalog')}>
            Explorer le catalogue
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14m-6-7 7 7-7 7" />
            </svg>
          </button>
        </section>
      );
    }

    return (
      <section className="section">
        <div className="section-head">
          <div>
            <div className="section-eyebrow">Mes favoris</div>
            <h2>{items.length} perruque{items.length > 1 ? 's' : ''} sauvegardée{items.length > 1 ? 's' : ''}</h2>
          </div>
        </div>
        <div className="wig-grid">
          {items.map((w) => (
            <WigCard key={w.id} wig={w} onClick={() => goProduct(w)} wishlisted={true} onToggleWishlist={toggleWishlist} />
          ))}
        </div>
      </section>
    );
  };

  // Account Screen
  const AccountScreen = () => {
    const [tab, setTab] = useState<'orders' | 'profile'>('orders');

    return (
      <section className="section">
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 48, padding: '32px', background: 'var(--surface)', borderRadius: 'var(--r-xl)', border: '1px solid var(--line-soft)', boxShadow: 'var(--sh-1)' }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg, var(--gold-light), var(--gold-deep))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontFamily: 'var(--f-display)', fontSize: 28, flexShrink: 0 }}>
            YD
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: 32, letterSpacing: '-.01em' }}>Yasmine <span className="italic" style={{ color: 'var(--gold-deep)' }}>Diallo</span></h2>
            <p style={{ color: 'var(--ink-soft)', fontSize: 14, marginTop: 4 }}>yasmine@example.com · Membre depuis avril 2026</p>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={() => { setRoute('home'); }}>
            Se déconnecter
          </button>
        </div>

        <div style={{ display: 'flex', gap: 4, marginBottom: 32, borderBottom: '1px solid var(--line)', paddingBottom: 0 }}>
          {['orders', 'profile'].map((t: any) => (
            <button key={t} onClick={() => setTab(t)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 20px', borderRadius: '12px 12px 0 0', background: tab === t ? 'var(--surface)' : 'transparent', border: tab === t ? '1px solid var(--line)' : '1px solid transparent', borderBottom: tab === t ? '1px solid var(--surface)' : '1px solid transparent', marginBottom: tab === t ? -1 : 0, cursor: 'pointer', fontSize: 13, fontWeight: tab === t ? 500 : 400, color: tab === t ? 'var(--ink)' : 'var(--ink-soft)', transition: 'all .2s' }}>
              {t === 'orders' ? '📦 Commandes' : '👤 Profil'}
            </button>
          ))}
        </div>

        {tab === 'orders' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[{ id: 'GH-2026-00847', date: '15 mai 2026', items: ['Aura Lace 18"', 'Velours 16"'], total: 548, status: 'livré' }].map((order) => (
              <div key={order.id} style={{ padding: '24px 28px', background: 'var(--surface)', borderRadius: 'var(--r-lg)', border: '1px solid var(--line-soft)', display: 'flex', alignItems: 'center', gap: 24 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 8 }}>
                    <span style={{ fontWeight: 600, fontSize: 14 }}>{order.id}</span>
                    <span style={{ fontSize: 12, padding: '3px 10px', borderRadius: 999, background: 'rgba(92,200,92,.08)', color: '#3a7a32', fontWeight: 500 }}>{order.status}</span>
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--ink-soft)', marginBottom: 4 }}>{order.items.join(' · ')}</div>
                  <div style={{ fontSize: 12, color: 'var(--ink-mute)' }}>{order.date}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'var(--f-display)', fontSize: 24 }}>{order.total} €</div>
                </div>
                <button className="btn btn-ghost btn-sm">Détails</button>
              </div>
            ))}
          </div>
        )}

        {tab === 'profile' && (
          <div style={{ maxWidth: 600, display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 500, marginBottom: 8, color: 'var(--ink-soft)' }}>Prénom</label>
              <input type="text" defaultValue="Yasmine" style={{ width: '100%', padding: '12px 16px', border: '1px solid var(--line)', borderRadius: 'var(--r-md)', fontFamily: 'var(--f-body)', fontSize: 14 }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 500, marginBottom: 8, color: 'var(--ink-soft)' }}>Email</label>
              <input type="email" defaultValue="yasmine@example.com" style={{ width: '100%', padding: '12px 16px', border: '1px solid var(--line)', borderRadius: 'var(--r-md)', fontFamily: 'var(--f-body)', fontSize: 14 }} />
            </div>
            <button className="btn btn-primary">Enregistrer les modifications</button>
          </div>
        )}
      </section>
    );
  };

  // Admin Screen
  const AdminScreen = () => {
    return (
      <section className="section">
        <div style={{ marginBottom: 36 }}>
          <div className="section-eyebrow">Tableau de bord</div>
          <h2 style={{ fontSize: 40, letterSpacing: '-.02em' }}>
            Bonjour, <span className="italic" style={{ color: 'var(--gold-deep)' }}>Admin.</span>
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 36 }}>
          {[
            { label: 'CA ce mois', value: '14 820 €', delta: '+18%' },
            { label: 'Commandes', value: '51', delta: '+12%' },
            { label: 'Essayages', value: '1 243', delta: '+34%' },
            { label: 'Nouveaux clients', value: '89', delta: '-3%' },
          ].map((k) => (
            <div key={k.label} style={{ padding: '22px 24px', background: 'var(--surface)', borderRadius: 'var(--r-lg)', border: '1px solid var(--line-soft)' }}>
              <div style={{ fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--ink-mute)', marginBottom: 8 }}>{k.label}</div>
              <div style={{ fontFamily: 'var(--f-display)', fontSize: 30, letterSpacing: '-.01em', marginBottom: 6 }}>{k.value}</div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: k.delta.startsWith('+') ? '#3a7a32' : 'var(--terracotta)', background: k.delta.startsWith('+') ? 'rgba(92,200,92,.08)' : 'rgba(200,113,88,.08)', padding: '2px 8px', borderRadius: 999 }}>{k.delta}</span>
              </div>
            </div>
          ))}
        </div>

        <button className="btn btn-primary" onClick={() => setRoute('home')}>
          Retour au site
        </button>
      </section>
    );
  };

  // Cart screen - Simplified
  const CartScreen = () => {
    const subtotal = cartItems.reduce((s, i) => s + i.price * i.qty, 0);
    const shipping = subtotal >= 150 ? 0 : 9.9;
    const total = subtotal + shipping;

    if (cartItems.length === 0) {
      return (
        <section className="section" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24, textAlign: 'center' }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--surface)', border: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--ink-mute)" strokeWidth="1.4">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <path d="M3 6h18" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
          </div>
          <div>
            <h2 style={{ fontSize: 36, marginBottom: 10 }}>
              Votre panier est <span className="italic" style={{ color: 'var(--gold-deep)' }}>vide.</span>
            </h2>
            <p style={{ color: 'var(--ink-soft)', fontSize: 15 }}>Explorez notre catalogue et trouvez votre couronne.</p>
          </div>
          <button className="btn btn-primary" onClick={() => setRoute('catalog')}>
            Découvrir le catalogue
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14m-6-7 7 7-7 7" />
            </svg>
          </button>
        </section>
      );
    }

    return (
      <section className="section">
        <div style={{ marginBottom: 40 }}>
          <div className="section-eyebrow">Votre panier</div>
          <h2 style={{ fontSize: 'clamp(36px,4vw,56px)', letterSpacing: '-.02em' }}>
            {cartItems.length} article{cartItems.length > 1 ? 's' : ''}{' '}
            <span className="italic" style={{ color: 'var(--gold-deep)' }}>sélectionné{cartItems.length > 1 ? 's' : ''}</span>
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 40, alignItems: 'start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {cartItems.map((item) => (
              <div key={item.id} style={{ display: 'flex', gap: 20, padding: 20, background: 'var(--surface)', borderRadius: 'var(--r-lg)', border: '1px solid var(--line-soft)', alignItems: 'center' }}>
                <div style={{ width: 80, height: 80, flexShrink: 0, borderRadius: 16, background: 'var(--bg-warm)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  <div style={{ width: '80%', height: '80%' }}>
                    <Orb color={item.color} shape={item.shape} showShadow={false} />
                  </div>
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
                    <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 999, background: 'var(--bg-warm)', color: 'var(--ink-soft)', border: '1px solid var(--line)' }}>{item.cat}</span>
                  </div>
                  <div style={{ fontFamily: 'var(--f-display)', fontSize: 20, letterSpacing: '-.01em' }}>{item.name}</div>
                  <div style={{ fontSize: 13, color: 'var(--ink-mute)', marginTop: 3 }}>
                    {item.style} · Taille M
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                  <button
                    onClick={() => {
                      if (item.qty === 1) {
                        setCartItems(cartItems.filter((i) => i.id !== item.id));
                      } else {
                        setCartItems(cartItems.map((i) => (i.id === item.id ? { ...i, qty: i.qty - 1 } : i)));
                      }
                    }}
                    style={{ width: 32, height: 32, borderRadius: '50%', border: '1px solid var(--line)', background: 'var(--surface)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, color: 'var(--ink-soft)' }}
                  >
                    −
                  </button>
                  <span style={{ width: 24, textAlign: 'center', fontWeight: 500 }}>{item.qty}</span>
                  <button
                    onClick={() => setCartItems(cartItems.map((i) => (i.id === item.id ? { ...i, qty: i.qty + 1 } : i)))}
                    style={{ width: 32, height: 32, borderRadius: '50%', border: '1px solid var(--line)', background: 'var(--surface)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, color: 'var(--ink-soft)' }}
                  >
                    +
                  </button>
                </div>

                <div style={{ textAlign: 'right', flexShrink: 0, minWidth: 80 }}>
                  <div style={{ fontFamily: 'var(--f-display)', fontSize: 22 }}>{item.price * item.qty} €</div>
                  {item.qty > 1 && <div style={{ fontSize: 11, color: 'var(--ink-mute)' }}>{item.price} € × {item.qty}</div>}
                </div>

                <button
                  onClick={() => setCartItems(cartItems.filter((i) => i.id !== item.id))}
                  style={{ flexShrink: 0, width: 32, height: 32, borderRadius: '50%', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-mute)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = 'var(--terracotta)')}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = 'var(--ink-mute)')}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 6h18m-2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          <div style={{ position: 'sticky', top: 100, background: 'var(--surface)', borderRadius: 'var(--r-xl)', padding: 32, border: '1px solid var(--line-soft)', boxShadow: 'var(--sh-2)' }}>
            <h3 style={{ fontFamily: 'var(--f-display)', fontSize: 26, marginBottom: 24 }}>Récapitulatif</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                <span style={{ color: 'var(--ink-soft)' }}>Sous-total</span>
                <span>{subtotal} €</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                <span style={{ color: 'var(--ink-soft)' }}>Livraison</span>
                <span style={{ color: shipping === 0 ? '#3a7a32' : 'var(--ink)' }}>{shipping === 0 ? 'Gratuite' : `${shipping.toFixed(2)} €`}</span>
              </div>
              <div style={{ height: 1, background: 'var(--line)' }}></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 500 }}>Total</span>
                <span style={{ fontFamily: 'var(--f-display)', fontSize: 26 }}>{total.toFixed(2)} €</span>
              </div>
            </div>

            <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '18px' }} onClick={() => setRoute('checkout')}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              Passer la commande · {total.toFixed(2)} €
            </button>
          </div>
        </div>
      </section>
    );
  };

  return (
    <>
      <Nav />
      {route === 'home' && <HomeScreen />}
      {route === 'catalog' && <CatalogScreen />}
      {route === 'product' && <ProductScreen />}
      {route === 'cart' && <CartScreen />}
      {route === 'checkout' && <CheckoutScreen />}
      {route === 'admin' && <AdminScreen />}
      {route === 'account' && <AccountScreen />}
      {route === 'wishlist' && <WishlistScreen />}
      {route === 'tryon' && <TryOnPage onSelectWig={(w) => { setSelectedWig(w); setShowTryOn(true); }} goProduct={goProduct} wishlistIds={wishlistIds} onToggleWishlist={toggleWishlist} />}
      {route === 'journal' && <JournalPage />}

      {/* Try-on modal overlay */}
      {showTryOn && <TryOnModal wig={selectedWig} onClose={() => setShowTryOn(false)} />}

      {/* Élodie Chat Widget */}
      {elodieChatOpen && (
        <div className="elodie-panel">
          <div className="elodie-head">
            <div className="elodie-avatar"></div>
            <div>
              <strong>Élodie</strong>
              <small>Styliste IA · répond en moyenne en 2s</small>
            </div>
            <button className="elodie-close" onClick={() => setElodieChatOpen(false)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
          <div className="elodie-messages">
            {elodieMessages.map((m, i) => (
              <div key={i} className={`msg ${m.role}`}>
                {m.content}
              </div>
            ))}
          </div>
          <div className="elodie-input">
            <input placeholder="Écrivez à Élodie…" />
            <button className="elodie-send">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 2 11 13" />
                <path d="M22 2l-7 20-4-9-9-4z" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
