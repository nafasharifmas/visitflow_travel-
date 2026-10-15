import React, { useEffect, useRef, useState } from 'react';
import '../aventis.css';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

// --- Curated High-Definition Imagery ---
const IMAGES = {
  hero_base: 'https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?auto=format&fit=crop&w=2400&q=90',
  about_lifestyle: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1600&q=85',
  yacht_motor: 'https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?auto=format&fit=crop&w=1600&q=85',
  yacht_sailing: 'https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?auto=format&fit=crop&w=1600&q=85',
  yacht_catamaran: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1600&q=85',
  experience_swimmer: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=85',
  dest_newport: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=1200&q=85',
  dest_bahamas: 'https://images.unsplash.com/photo-1548574505-5e239809ee19?auto=format&fit=crop&w=1200&q=85',
  dest_mediterranean: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=85',
  dest_french_riviera: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1200&q=85',
  cta_lounge_sunset: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1920&q=85',
  avatar_emily: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=85'
};

// --- Fleet Vessel Data ---
interface YachtData {
  id: string;
  name: string;
  category: 'motor' | 'sailing' | 'catamaran';
  tag: string;
  image: string;
  subImages: [string, string];
  specs: string;
  length: string;
  guests: string;
  cabins: string;
  crew: string;
  rate: string;
  description: string;
  amenities: string[];
}

const FLEET_DATA: YachtData[] = [
  {
    id: 'meridian',
    name: 'The Meridian',
    category: 'motor',
    tag: 'MOTOR YACHT',
    image: IMAGES.yacht_motor,
    subImages: [IMAGES.cta_lounge_sunset, IMAGES.about_lifestyle],
    specs: '164 FT / 50M • 12 GUESTS • 6 CABINS • CREW OF 11',
    length: '164 FT / 50M',
    guests: '12 Guests',
    cabins: '6 Master Suites',
    crew: 'Crew of 11',
    rate: 'From $145,000 / week',
    description: 'An architectural triumph on water, The Meridian features an expansive tri-deck layout, infinity plunge pool on the flybridge, and beach club tender garage.',
    amenities: ['Jacuzzi on Sundeck', 'Stabilizers at Anchor', 'Michelin Trained Chef', 'High-speed Chase Tender', 'Seabobs & Foilboards', 'Cinema Lounge']
  },
  {
    id: 'ocean-breeze',
    name: 'Ocean Breeze',
    category: 'sailing',
    tag: 'SAILING YACHT',
    image: IMAGES.yacht_sailing,
    subImages: [IMAGES.experience_swimmer, IMAGES.dest_newport],
    specs: '120 FT / 36M • 8 GUESTS • 4 CABINS • CREW OF 6',
    length: '120 FT / 36M',
    guests: '8 Guests',
    cabins: '4 Staterooms',
    crew: 'Crew of 6',
    rate: 'From $85,000 / week',
    description: 'Combining pure aerodynamic performance with handcrafted teak finishes, Ocean Breeze offers an authentic sailing thrill with five-star luxury amenities.',
    amenities: ['Carbon Composite Rigging', 'Hydraulic Swim Platform', 'Al Fresco Teak Dining', 'Snorkeling & Scuba Gear', 'Sonos Sound System', 'Private Wine Cellar']
  },
  {
    id: 'aqua-vida',
    name: 'Aqua Vida',
    category: 'catamaran',
    tag: 'LUXURY CATAMARAN',
    image: IMAGES.yacht_catamaran,
    subImages: [IMAGES.dest_bahamas, IMAGES.cta_lounge_sunset],
    specs: '82 FT / 25M • 10 GUESTS • 5 CABINS • CREW OF 4',
    length: '82 FT / 25M',
    guests: '10 Guests',
    cabins: '5 Oceanview Suites',
    crew: 'Crew of 4',
    rate: 'From $65,000 / week',
    description: 'Unmatched stability and sprawling deck space. Aqua Vida is designed for shallow-draft exploration of pristine Bahamian sandbars and secluded coves.',
    amenities: ['Dual Trampoline Nets', 'Flybridge Wet Bar', 'Paddleboards & Kayaks', 'Zero-Emission Solar Aux', 'Watermaker & Ice Machine', 'Gourmet Galley']
  }
];

// --- Destination Data ---
const DESTINATIONS_DATA = [
  {
    id: 'newport',
    title: 'Newport',
    subtitle: 'Rhode Island, USA',
    image: IMAGES.dest_newport,
    description: 'Gilded Age maritime prestige, world-renowned regattas, and classic New England cobblestone charm.'
  },
  {
    id: 'bahamas',
    title: 'The Bahamas',
    subtitle: 'Caribbean',
    image: IMAGES.dest_bahamas,
    description: '365 crystalline cays in the Exumas, luminous sandbars, and swimming with nurse sharks in azure lagoons.'
  },
  {
    id: 'mediterranean',
    title: 'Mediterranean',
    subtitle: 'Europe',
    image: IMAGES.dest_mediterranean,
    description: 'Dramatic Amalfi cliffs, secluded Positano coves, and sunset cocktails overlooking pastel harbor villages.'
  },
  {
    id: 'french_riviera',
    title: 'French Riviera',
    subtitle: 'Monaco & Saint-Tropez',
    image: IMAGES.dest_french_riviera,
    description: 'The epicenter of superyacht glamour, Michelin-starred seaside dining, and legendary Mediterranean bays.'
  }
];

export default function Landing() {
  // Navigation & Scroll states
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Hero Scrubber states
  const [heroStage, setHeroStage] = useState<0 | 1 | 2>(0);
  const [heroProgress, setHeroProgress] = useState(0.15); // 15% to 100%
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const runwayRef = useRef<HTMLDivElement | null>(null);
  const currentFrameRef = useRef(0);
  const targetFrameRef = useRef(0);
  const heroImageRef = useRef<HTMLImageElement | null>(null);
  const isImageLoadedRef = useRef(false);

  // Fleet Filter & Modals
  const [fleetFilter, setFleetFilter] = useState<'all' | 'motor' | 'sailing' | 'catamaran'>('all');
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedYachtModal, setSelectedYachtModal] = useState<YachtData | null>(null);
  const [storyModalOpen, setStoryModalOpen] = useState(false);
  const [bookingPrefYacht, setBookingPrefYacht] = useState('The Meridian (164ft Motor)');
  const [searchQuery, setSearchQuery] = useState('');
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  // Counter stats animation
  const statsRef = useRef<HTMLDivElement | null>(null);
  const [statsAnimated, setStatsAnimated] = useState(false);
  const [statNumbers, setStatNumbers] = useState({ vessels: 0, destinations: 0, satisfaction: 0, years: 0 });

  // Custom Cursor
  const cursorDotRef = useRef<HTMLDivElement | null>(null);
  const cursorRingRef = useRef<HTMLDivElement | null>(null);
  const ringPosRef = useRef({ x: -100, y: -100, currentX: -100, currentY: -100 });

  // -------------------------------------------------------------
  // Custom Trailing Cursor Physics (Lerp Damping Factor 0.15)
  // -------------------------------------------------------------
  useEffect(() => {
    if (typeof window === 'undefined' || window.matchMedia('(pointer: coarse)').matches) return;

    let animId: number;

    const handleMouseMove = (e: MouseEvent) => {
      ringPosRef.current.x = e.clientX;
      ringPosRef.current.y = e.clientY;
      if (cursorDotRef.current) {
        cursorDotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }
    };

    const updateCursor = () => {
      const ring = ringPosRef.current;
      ring.currentX += (ring.x - ring.currentX) * 0.15;
      ring.currentY += (ring.y - ring.currentY) * 0.15;

      if (cursorRingRef.current) {
        cursorRingRef.current.style.transform = `translate3d(${ring.currentX}px, ${ring.currentY}px, 0)`;
      }
      animId = requestAnimationFrame(updateCursor);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    animId = requestAnimationFrame(updateCursor);

    // Interactive Hover Listeners
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('a, button, input, select, .destination-card, .yacht-card, .search-chip')) {
        document.body.classList.add('cursor-hover');
      } else {
        document.body.classList.remove('cursor-hover');
      }
    };

    window.addEventListener('mouseover', handleMouseOver, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      cancelAnimationFrame(animId);
      document.body.classList.remove('cursor-hover');
    };
  }, []);

  // -------------------------------------------------------------
  // Hero Image Preloading & Canvas Engine Setup
  // -------------------------------------------------------------
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = IMAGES.hero_base;
    img.onload = () => {
      heroImageRef.current = img;
      isImageLoadedRef.current = true;
    };
  }, []);

  // -------------------------------------------------------------
  // 2D Canvas Scrubbing Engine with Damping 0.085 and Cover Math
  // -------------------------------------------------------------
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas, { passive: true });

    // Render loop
    const render = () => {
      // Damping formula: currentFrame += (targetFrame - currentFrame) * 0.085
      currentFrameRef.current += (targetFrameRef.current - currentFrameRef.current) * 0.085;
      const progress = Math.max(0, Math.min(1, currentFrameRef.current / 239));

      const cw = canvas.width;
      const ch = canvas.height;
      ctx.clearRect(0, 0, cw, ch);

      const img = heroImageRef.current;
      if (img && isImageLoadedRef.current) {
        // Base cover math:
        const baseScale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
        
        // Cinematic camera motion simulation:
        // Subtle drone zoom & panning as vessel glides through turquoise waters
        const droneZoom = 1 + progress * 0.16;
        const scale = baseScale * droneZoom;
        const dw = img.naturalWidth * scale;
        const dh = img.naturalHeight * scale;

        // Dynamic camera tracking offset following yacht motion
        const panX = (progress - 0.5) * (cw * 0.12);
        const panY = (progress - 0.5) * (ch * 0.06);

        const dx = (cw - dw) / 2 + panX;
        const dy = (ch - dh) / 2 + panY;

        ctx.save();
        ctx.drawImage(img, dx, dy, dw, dh);

        // Specular Sun Shimmer & Water Highlights (NO dark overlay, preserving raw sunlit sea)
        const shimmerAlpha = 0.08 + Math.sin(progress * Math.PI * 4) * 0.04;
        const grad = ctx.createLinearGradient(cw * 0.3, 0, cw * 0.7, ch);
        grad.addColorStop(0, `rgba(255, 255, 255, ${shimmerAlpha})`);
        grad.addColorStop(0.5, 'rgba(255, 255, 255, 0)');
        grad.addColorStop(1, `rgba(223, 190, 136, ${shimmerAlpha * 0.6})`);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, cw, ch);

        ctx.restore();
      } else {
        // High-end fallback azure gradient while asset primes
        const fallbackGrad = ctx.createLinearGradient(0, 0, cw, ch);
        fallbackGrad.addColorStop(0, '#0E3B5C');
        fallbackGrad.addColorStop(0.5, '#165B8C');
        fallbackGrad.addColorStop(1, '#0C2A44');
        ctx.fillStyle = fallbackGrad;
        ctx.fillRect(0, 0, cw, ch);
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  // -------------------------------------------------------------
  // Scroll Listener: Track Runway Progress & Scrolled Header
  // -------------------------------------------------------------
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;

      // Scrolled header trigger > 60px
      setIsScrolled(scrollY > 60);

      // Hero runway scroll tracking
      const runway = runwayRef.current;
      if (runway) {
        const rect = runway.getBoundingClientRect();
        const totalDistance = runway.offsetHeight - window.innerHeight;
        const traveled = Math.max(0, -rect.top);
        const p = Math.min(1, Math.max(0, traveled / totalDistance));

        // Update targetFrame: p * 239
        targetFrameRef.current = p * 239;

        // 3 Content Scroll Stages (Solid Opacity, No Dimming):
        // Stage 1 (p < 0.33), Stage 2 (0.33 <= p < 0.67), Stage 3 (p >= 0.67)
        if (p < 0.33) {
          setHeroStage(0);
        } else if (p < 0.67) {
          setHeroStage(1);
        } else {
          setHeroStage(2);
        }

        // HUD Progress Bar: 15% to 100%
        setHeroProgress(15 + p * 85);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // -------------------------------------------------------------
  // Animated Stat Counters (IntersectionObserver)
  // -------------------------------------------------------------
  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !statsAnimated) {
          setStatsAnimated(true);

          const duration = 1800;
          const startTime = performance.now();

          const animateCounters = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(1, elapsed / duration);
            // Ease out cubic
            const easeOut = 1 - Math.pow(1 - progress, 3);

            setStatNumbers({
              vessels: Math.round(120 * easeOut),
              destinations: Math.round(35 * easeOut),
              satisfaction: Math.round(98 * easeOut),
              years: Math.round(25 * easeOut)
            });

            if (progress < 1) {
              requestAnimationFrame(animateCounters);
            }
          };

          requestAnimationFrame(animateCounters);
        }
      },
      { threshold: 0.35 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [statsAnimated]);

  // -------------------------------------------------------------
  // Keyboard Escape Handler for Modals
  // -------------------------------------------------------------
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSearchModalOpen(false);
        setBookingModalOpen(false);
        setSelectedYachtModal(null);
        setStoryModalOpen(false);
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filtered Fleet
  const filteredFleet = FLEET_DATA.filter(
    (item) => fleetFilter === 'all' || item.category === fleetFilter
  );

  // Search Results
  const searchResults = DESTINATIONS_DATA.concat(
    FLEET_DATA.map((y) => ({
      id: y.id,
      title: y.name,
      subtitle: `${y.tag} • ${y.rate}`,
      image: y.image,
      description: y.description
    }))
  ).filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openBookingFor = (vesselName: string) => {
    setBookingPrefYacht(vesselName);
    setSelectedYachtModal(null);
    setBookingModalOpen(true);
    setBookingConfirmed(false);
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingConfirmed(true);
    setTimeout(() => {
      setBookingModalOpen(false);
      setBookingConfirmed(false);
    }, 2800);
  };

  return (
    <div className="aventis-root">
      {/* 4.1 Custom Luxury Trailing Cursor */}
      <div id="cursor-dot" ref={cursorDotRef} />
      <div id="cursor-ring" ref={cursorRingRef} />

      {/* =========================================================
          3.1 Header & Navigation (Edge-to-Edge Full-Width)
          ========================================================= */}
      <header id="main-header" className={isScrolled ? 'scrolled' : ''}>
        <a href="#hero-runway" className="nav-brand" aria-label="Aventis Yacht Charters Home">
          {/* Nautical 8-Point Helm Monogram Vector SVG */}
          <svg className="brand-helm-icon" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="24" cy="24" r="14" stroke="#C59B5F" strokeWidth="2.2" />
            <circle cx="24" cy="24" r="4.5" fill="#C59B5F" />
            <circle cx="24" cy="24" r="1.5" fill="#070F17" />
            <path d="M24 2V10M24 38V46M2 24H10M38 24H46M8.44 8.44L14.1 14.1M33.9 33.9L39.56 39.56M39.56 8.44L33.9 14.1M14.1 33.9L8.44 39.56" stroke="#DFBE88" strokeWidth="2.2" strokeLinecap="round" />
            <polygon points="24,6 26.5,14 24,12 21.5,14" fill="#C59B5F" />
          </svg>
          <div className="brand-text">
            <span className="brand-title">AVENTIS</span>
            <span className="brand-subtitle">YACHT CHARTERS</span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav aria-label="Primary Navigation">
          <ul className="nav-menu">
            <li><a href="#hero-runway" className="nav-link active">Home</a></li>
            <li><a href="#fleet" className="nav-link">Yachts</a></li>
            <li><a href="#destinations" className="nav-link">Destinations</a></li>
            <li><a href="#experiences" className="nav-link">Experience</a></li>
            <li><a href="#about" className="nav-link">About</a></li>
            <li><a href="#contact" className="nav-link">Contact</a></li>
          </ul>
        </nav>

        {/* Actions */}
        <div className="nav-actions">
          {/* Interactive Search Modal Trigger */}
          <button
            className="btn-search-trigger"
            aria-label="Open search dialog"
            onClick={() => setSearchModalOpen(true)}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>

          {/* Book CTA Button */}
          <button
            className="btn-gold"
            onClick={() => openBookingFor('The Meridian (164ft Motor)')}
          >
            Book a Yacht <span>&rarr;</span>
          </button>

          {/* Mobile Hamburger */}
          <button
            className="btn-hamburger"
            aria-label="Open mobile navigation"
            onClick={() => setMobileMenuOpen(true)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        </div>
      </header>

      {/* =========================================================
          3.2 Hero Section (Scroll-Scrubbed Canvas Video Runway)
          300vh runway with sticky 100vh viewport frame
          ========================================================= */}
      <section id="hero-runway" ref={runwayRef}>
        <div className="hero-sticky-frame">
          {/* 2D Canvas Layer - Pure sunlit sea, NO full-screen dark tint */}
          <canvas id="hero-canvas" ref={canvasRef} />

          {/* Subtle vignette for header and bottom HUD legibility without darkening water */}
          <div className="hero-vignette-subtle" />

          {/* Bottom-Right Anchored Content: Solid Opacity Constraint */}
          <div className="hero-content-stage">
            {/* Stage 1 (p < 0.33) */}
            <div className={`hero-stage-panel ${heroStage === 0 ? 'active' : ''}`}>
              <div className="hero-eyebrow">BESPOKE PRIVATE CHARTERS</div>
              <h1 className="hero-headline">Extraordinary Journeys</h1>
              <p className="hero-desc">
                Curated maritime voyages handcrafted for those who demand the finest in luxury yachting.
              </p>
              <div className="hero-buttons">
                <a href="#fleet" className="btn-gold">Explore The Fleet &rarr;</a>
                <button className="btn-outline-gold" onClick={() => setStoryModalOpen(true)}>
                  Watch Story &#9658;
                </button>
              </div>
            </div>

            {/* Stage 2 (0.33 <= p < 0.67) */}
            <div className={`hero-stage-panel ${heroStage === 1 ? 'active' : ''}`}>
              <div className="hero-eyebrow">OCEANIC EXCELLENCE</div>
              <h1 className="hero-headline">Unrivaled Freedom</h1>
              <p className="hero-desc">
                Chart your own horizon across pristine archipelagos with Michelin-trained private crews.
              </p>
              <div className="hero-buttons">
                <a href="#destinations" className="btn-gold">View Destinations &rarr;</a>
                <button className="btn-outline-gold" onClick={() => openBookingFor('The Meridian')}>
                  Inquire Now &rarr;
                </button>
              </div>
            </div>

            {/* Stage 3 (p >= 0.67) */}
            <div className={`hero-stage-panel ${heroStage === 2 ? 'active' : ''}`}>
              <div className="hero-eyebrow">THE PINNACLE OF LUXURY</div>
              <h1 className="hero-headline">Endless Horizons</h1>
              <p className="hero-desc">
                Immerse yourself in timeless coastal elegance where world-class service meets absolute serenity.
              </p>
              <div className="hero-buttons">
                <button className="btn-gold" onClick={() => openBookingFor('Custom Itinerary')}>
                  Begin Journey &rarr;
                </button>
                <a href="#experiences" className="btn-outline-gold">Charter Guide &rarr;</a>
              </div>
            </div>
          </div>

          {/* Hero Bottom HUD: Newport on Left | 01 02 03 + Progress Bar on Right */}
          <div className="hero-hud-location">
            <svg className="hud-compass-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 19 21 12 17 5 21 12 2"></polygon>
            </svg>
            <span>NEWPORT, NEW ENGLAND</span>
          </div>

          <div className="hero-hud-stage-tracker">
            <span className={`hud-stage-num ${heroStage === 0 ? 'active' : ''}`}>01</span>
            <span className={`hud-stage-num ${heroStage === 1 ? 'active' : ''}`}>02</span>
            <span className={`hud-stage-num ${heroStage === 2 ? 'active' : ''}`}>03</span>
            <div className="hud-progress-rail">
              <div className="hud-progress-fill" style={{ width: `${heroProgress}%` }} />
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          3.3 Section 2: About (A Legacy of Pure Maritime Luxury)
          ========================================================= */}
      <section id="about" className="aventis-section about-section">
        <div className="aventis-container">
          <div className="about-grid">
            {/* Left Visual with "Since 1988" Cursive Badge */}
            <div className="about-visual-col">
              <div className="about-image-wrapper">
                <img
                  src={IMAGES.about_lifestyle}
                  alt="Aventis luxury lifestyle aboard yacht teak deck"
                  className="about-image"
                  loading="lazy"
                />
                <div className="about-image-overlay" />
                <span className="about-heritage-badge">Since 1988</span>
              </div>
            </div>

            {/* Right Narrative */}
            <div className="about-narrative-col">
              <span className="aventis-eyebrow">OUR HERITAGE</span>
              <h2 className="serif-h2 about-title">A Legacy of Pure Maritime Luxury</h2>
              <p className="about-body">
                For more than three decades, Aventis has set the gold standard in private yacht charters. Combining discreet five-star hospitality with the world's most prestigious maritime fleet, we craft tailor-made ocean journeys that transcend ordinary travel.
              </p>
              <p className="about-body">
                Headquartered along the storied docks of Newport, Rhode Island, our brokerage provides unfettered access to coveted anchorages, secluded coves, and world-class crew members dedicated to fulfilling your every whim.
              </p>

              {/* 4-Stat Animated Counter Grid */}
              <div className="about-stats-grid" ref={statsRef}>
                <div className="stat-item">
                  <div className="stat-number-wrap">
                    <span>{statNumbers.vessels}</span>+
                  </div>
                  <span className="stat-label">Fleet Vessels</span>
                </div>
                <div className="stat-item">
                  <div className="stat-number-wrap">
                    <span>{statNumbers.destinations}</span>+
                  </div>
                  <span className="stat-label">Global Destinations</span>
                </div>
                <div className="stat-item">
                  <div className="stat-number-wrap">
                    <span>{statNumbers.satisfaction}</span>%
                  </div>
                  <span className="stat-label">Client Satisfaction</span>
                </div>
                <div className="stat-item">
                  <div className="stat-number-wrap">
                    <span>{statNumbers.years}</span>
                  </div>
                  <span className="stat-label">Years of Excellence</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          3.4 Section 3: Featured Fleet (Handpicked Vessels)
          ========================================================= */}
      <section id="fleet" className="aventis-section fleet-section">
        <div className="aventis-container">
          <div className="fleet-header">
            <span className="aventis-eyebrow">THE FLEET</span>
            <h2 className="serif-h2 fleet-title">Exceptional Craftsmanship on Every Horizon</h2>
            
            {/* Interactive Tab Pills: All, Motor, Sailing, Catamarans */}
            <div className="fleet-filter-nav">
              <button
                className={`fleet-tab-btn ${fleetFilter === 'all' ? 'active' : ''}`}
                onClick={() => setFleetFilter('all')}
              >
                All
              </button>
              <button
                className={`fleet-tab-btn ${fleetFilter === 'motor' ? 'active' : ''}`}
                onClick={() => setFleetFilter('motor')}
              >
                Motor Yachts
              </button>
              <button
                className={`fleet-tab-btn ${fleetFilter === 'sailing' ? 'active' : ''}`}
                onClick={() => setFleetFilter('sailing')}
              >
                Sailing Yachts
              </button>
              <button
                className={`fleet-tab-btn ${fleetFilter === 'catamaran' ? 'active' : ''}`}
                onClick={() => setFleetFilter('catamaran')}
              >
                Catamarans
              </button>
            </div>
          </div>

          {/* 3 Signature Yacht Cards Grid */}
          <div className="fleet-cards-grid">
            {filteredFleet.map((yacht) => (
              <div
                key={yacht.id}
                className="yacht-card"
                onClick={() => setSelectedYachtModal(yacht)}
              >
                <div className="yacht-card-visual">
                  <img src={yacht.image} alt={yacht.name} className="yacht-card-img" loading="lazy" />
                  <span className="yacht-tag-pill">{yacht.tag}</span>
                </div>
                <div className="yacht-card-body">
                  <h3 className="yacht-card-title">{yacht.name}</h3>
                  <div className="yacht-specs-line">{yacht.specs}</div>
                  <div className="yacht-card-footer">
                    <div className="yacht-rate-wrap">
                      <span className="rate-label">Charter Rate</span>
                      <span className="rate-val">{yacht.rate}</span>
                    </div>
                    <div className="yacht-action-circle" title="View vessel specifications">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="7" y1="17" x2="17" y2="7"></line>
                        <polyline points="7 7 17 7 17 17"></polyline>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          3.5 Section 4: Split Experiences (The Art of Bespoke Yachting)
          Full-bleed split section (50vw / 50vw)
          ========================================================= */}
      <section id="experiences" className="experience-split-section">
        {/* Left Visual Column with Aerial Swimmer & Pulsing Play Badge */}
        <div className="experience-visual-col">
          <img
            src={IMAGES.experience_swimmer}
            alt="Crystalline azure lagoon swimmer aerial shot"
            className="experience-bg-img"
            loading="lazy"
          />
          <button
            className="experience-play-trigger"
            aria-label="Play Aventis bespoke experience reel"
            onClick={() => setStoryModalOpen(true)}
          >
            <div className="pulse-ring" />
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
          </button>
        </div>

        {/* Right Features Column with 4 Bespoke Gold Highlights */}
        <div className="experience-features-col">
          <span className="aventis-eyebrow">TAILORED VOYAGES</span>
          <h2 className="serif-h2 experience-title">Crafted Moments on Open Water</h2>
          
          <div className="experience-list-grid">
            {/* Feature 1 */}
            <div className="experience-item">
              <div className="experience-icon-wrap">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
                </svg>
              </div>
              <div className="experience-item-content">
                <h4>Bespoke Itineraries</h4>
                <p>Custom routing to secluded bays, untouched anchorages, and private harbors away from crowded coastlines.</p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="experience-item">
              <div className="experience-icon-wrap">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
                  <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
                  <line x1="6" y1="1" x2="6" y2="4"></line>
                  <line x1="10" y1="1" x2="10" y2="4"></line>
                  <line x1="14" y1="1" x2="14" y2="4"></line>
                </svg>
              </div>
              <div className="experience-item-content">
                <h4>Michelin-Trained Private Chefs</h4>
                <p>World-class culinary experiences tailored to your dietary palate, paired with rare vintage selections.</p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="experience-item">
              <div className="experience-icon-wrap">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 12c1.5-1.5 3.5-2 5-2s3.5.5 5 2 3.5 2 5 2 3.5-.5 5-2"></path>
                  <path d="M2 18c1.5-1.5 3.5-2 5-2s3.5.5 5 2 3.5 2 5 2 3.5-.5 5-2"></path>
                  <circle cx="12" cy="5" r="3"></circle>
                </svg>
              </div>
              <div className="experience-item-content">
                <h4>Curated Water Toys & Tenders</h4>
                <p>Seabobs, hydrofoils, jetskis, deep-sea diving gear, and high-speed chase tenders for endless ocean exploration.</p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="experience-item">
              <div className="experience-icon-wrap">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path>
                  <path d="M2 12h20"></path>
                </svg>
              </div>
              <div className="experience-item-content">
                <h4>Certified Master Captains</h4>
                <p>Highly credentialed navigators ensuring supreme safety, discreet passage, and VIP port clearances.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          3.6 Section 5: Top Destinations
          CRITICAL ZERO DROP SHADOW CUTOFF ARCHITECTURE
          ========================================================= */}
      <section id="destinations" className="aventis-section destinations-section">
        <div className="aventis-container">
          <div className="destinations-layout">
            {/* Left Column */}
            <div className="destinations-left-col">
              <span className="aventis-eyebrow destinations-eyebrow">TOP DESTINATIONS</span>
              <h2 className="serif-h2 destinations-title">Iconic Places Extraordinary Journeys</h2>
              <p className="destinations-desc">
                From Newport's historic coastline to hidden gems around the world, discover breathtaking destinations by sea.
              </p>
              <button
                className="btn-gold"
                onClick={() => setSearchModalOpen(true)}
              >
                Explore Destinations &rarr;
              </button>

              <div className="destinations-nav-row">
                <button className="dest-nav-btn dest-prev-btn" aria-label="Previous Destination">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                  </svg>
                </button>
                <button className="dest-nav-btn dest-next-btn" aria-label="Next Destination">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </button>
              </div>
            </div>

            {/* Right Column: Swiper with unclipped drop shadow CSS padding architecture */}
            <div className="destinations-slider-wrapper">
              <Swiper
                id="destinations-slider"
                modules={[Navigation, Autoplay]}
                navigation={{
                  prevEl: '.dest-prev-btn',
                  nextEl: '.dest-next-btn'
                }}
                autoplay={{ delay: 4500, disableOnInteraction: false }}
                spaceBetween={28}
                slidesPerView={1.15}
                breakpoints={{
                  640: { slidesPerView: 1.8, spaceBetween: 24 },
                  993: { slidesPerView: 2.2, spaceBetween: 28 },
                  1280: { slidesPerView: 2.6, spaceBetween: 32 }
                }}
              >
                {DESTINATIONS_DATA.map((dest) => (
                  <SwiperSlide key={dest.id}>
                    <div
                      className="destination-card"
                      onClick={() => openBookingFor(`Destination: ${dest.title}`)}
                    >
                      <div className="dest-card-visual">
                        <img src={dest.image} alt={dest.title} className="dest-card-img" loading="lazy" />
                        <div className="dest-card-overlay">
                          <h3 className="dest-card-title">{dest.title}</h3>
                          <span className="dest-card-subtitle">{dest.subtitle}</span>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          3.7 Section 6: Panoramic CTA Lounge Banner
          ========================================================= */}
      <section
        className="lounge-cta-section"
        style={{ backgroundImage: `url(${IMAGES.cta_lounge_sunset})` }}
      >
        <div className="lounge-cta-overlay" />
        <div className="aventis-container">
          <div className="lounge-cta-content">
            <span className="aventis-eyebrow aventis-eyebrow-right">YOUR PERSONAL SANCTUARY</span>
            <h2 className="lounge-cta-title">The Ocean Awaits. Plan Your Bespoke Escape.</h2>
            <button
              className="btn-gold"
              onClick={() => openBookingFor('Consultation')}
            >
              Inquire With A Charter Broker &rarr;
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================
          3.8 Section 7: Testimonials
          ========================================================= */}
      <section className="testimonials-section">
        <div className="aventis-container">
          <span className="quote-emblem">&ldquo;</span>
          <Swiper
            modules={[Pagination, Autoplay]}
            pagination={{
              clickable: true,
              el: '.testimonial-pagination',
              bulletClass: 'test-bullet',
              bulletActiveClass: 'active'
            }}
            autoplay={{ delay: 6000, disableOnInteraction: false }}
            slidesPerView={1}
            loop={true}
          >
            <SwiperSlide>
              <blockquote className="testimonial-quote-text">
                &ldquo;Sailing the Mediterranean with Aventis surpassed every expectation. The crew’s discretion, the culinary artistry, and the vessel's immaculate finish made it an unforgettable journey.&rdquo;
              </blockquote>
              <div className="testimonial-author-box">
                <img src={IMAGES.avatar_emily} alt="Lady Emily Vance" className="author-avatar" loading="lazy" />
                <div className="author-details">
                  <div className="author-name">Lady Emily Vance</div>
                  <div className="author-location">Monaco Charter Client</div>
                </div>
              </div>
            </SwiperSlide>

            <SwiperSlide>
              <blockquote className="testimonial-quote-text">
                &ldquo;From navigating secluded Bahamian sandbars to the private chef's five-course tasting menus at anchor, Aventis redefines what luxury yachting should feel like.&rdquo;
              </blockquote>
              <div className="testimonial-author-box">
                <img src={IMAGES.avatar_emily} alt="Lord Harrison Sterling" className="author-avatar" loading="lazy" />
                <div className="author-details">
                  <div className="author-name">Lord Harrison Sterling</div>
                  <div className="author-location">Exumas Expedition Client</div>
                </div>
              </div>
            </SwiperSlide>

            <SwiperSlide>
              <blockquote className="testimonial-quote-text">
                &ldquo;An extraordinary voyage along the Amalfi Coast. Flawless concierge service, breathtaking private anchorages, and absolute serenity throughout our week at sea.&rdquo;
              </blockquote>
              <div className="testimonial-author-box">
                <img src={IMAGES.avatar_emily} alt="Sophia De Luca" className="author-avatar" loading="lazy" />
                <div className="author-details">
                  <div className="author-name">Sophia De Luca</div>
                  <div className="author-location">Geneva & Amalfi Client</div>
                </div>
              </div>
            </SwiperSlide>
          </Swiper>

          <div className="testimonial-pagination" />
        </div>
      </section>

      {/* =========================================================
          3.9 Section 8: Press & Media Recognition Bar
          ========================================================= */}
      <section className="press-bar-section">
        <div className="aventis-container">
          <div className="press-logos-row">
            <span className="press-wordmark">ARCHITECTURAL DIGEST</span>
            <span className="press-wordmark">ROBB REPORT</span>
            <span className="press-wordmark">YACHTING WORLD</span>
            <span className="press-wordmark">FORBES LIFE</span>
            <span className="press-wordmark">BOAT INTERNATIONAL</span>
          </div>
        </div>
      </section>

      {/* =========================================================
          3.10 Section 9: Modern Luxury Footer
          Strict constraint: NO "Site by" or agency credits
          ========================================================= */}
      <footer id="contact" className="aventis-footer">
        <div className="aventis-container">
          <div className="footer-grid">
            {/* Col 1: Brand */}
            <div className="footer-col">
              <a href="#hero-runway" className="nav-brand">
                <svg className="brand-helm-icon" viewBox="0 0 48 48" fill="none">
                  <circle cx="24" cy="24" r="14" stroke="#C59B5F" strokeWidth="2.2" />
                  <circle cx="24" cy="24" r="4.5" fill="#C59B5F" />
                  <path d="M24 2V10M24 38V46M2 24H10M38 24H46M8.44 8.44L14.1 14.1M33.9 33.9L39.56 39.56M39.56 8.44L33.9 14.1M14.1 33.9L8.44 39.56" stroke="#DFBE88" strokeWidth="2.2" strokeLinecap="round" />
                </svg>
                <div className="brand-text">
                  <span className="brand-title">AVENTIS</span>
                  <span className="brand-subtitle">YACHT CHARTERS</span>
                </div>
              </a>
              <p className="footer-brand-bio">
                Crafting extraordinary maritime journeys with bespoke itineraries and world-class hospitality since 1988.
              </p>
            </div>

            {/* Col 2: Fleet Links */}
            <div className="footer-col">
              <h5>The Fleet</h5>
              <ul className="footer-links-list">
                <li><a href="#fleet" onClick={() => setFleetFilter('motor')}>Motor Yachts</a></li>
                <li><a href="#fleet" onClick={() => setFleetFilter('sailing')}>Sailing Yachts</a></li>
                <li><a href="#fleet" onClick={() => setFleetFilter('catamaran')}>Luxury Catamarans</a></li>
                <li><a href="#fleet" onClick={() => setFleetFilter('all')}>Mega Yachts</a></li>
                <li><a href="#fleet" onClick={() => setFleetFilter('all')}>New Additions</a></li>
              </ul>
            </div>

            {/* Col 3: Destinations */}
            <div className="footer-col">
              <h5>Destinations</h5>
              <ul className="footer-links-list">
                <li><a href="#destinations">Newport & New England</a></li>
                <li><a href="#destinations">The Bahamas</a></li>
                <li><a href="#destinations">French Riviera</a></li>
                <li><a href="#destinations">Amalfi Coast</a></li>
                <li><a href="#destinations">Greek Cyclades</a></li>
              </ul>
            </div>

            {/* Col 4: Newsletter & Contact */}
            <div className="footer-col">
              <h5>Charter Concierge</h5>
              <p className="footer-brand-bio" style={{ margin: '0 0 16px' }}>
                Receive curated seasonal itineraries.
              </p>
              <form
                className="newsletter-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  alert('Thank you for subscribing to Aventis Seasonal Itineraries.');
                }}
              >
                <input
                  type="email"
                  placeholder="Enter email address"
                  className="newsletter-input"
                  required
                />
                <button type="submit" className="newsletter-submit" aria-label="Subscribe">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </button>
              </form>

              <div className="footer-contact-info">
                <div>+1 (800) 555-YACHT</div>
                <div>charter@aventisyachts.com</div>
                <div>Commercial Wharf, Newport, RI</div>
              </div>
            </div>
          </div>

          {/* Bottom Bar: STRICT CONSTRAINT - NO "SITE BY" OR AGENCY CREDITS */}
          <div className="footer-bottom-bar">
            <span>&copy; 2026 Aventis Yacht Charters. All rights reserved.</span>
            <div className="footer-legal-links">
              <a href="#hero-runway">Privacy Policy</a>
              <a href="#hero-runway">Terms of Charter</a>
              <a href="#hero-runway">Maritime Safety</a>
            </div>
          </div>
        </div>
      </footer>

      {/* =========================================================
          4.2 Interactive Modals
          ========================================================= */}

      {/* 1. Search Modal (#search-modal) */}
      {searchModalOpen && (
        <div className="modal-backdrop" onClick={() => setSearchModalOpen(false)}>
          <div className="search-modal-container" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close-btn"
              onClick={() => setSearchModalOpen(false)}
              aria-label="Close search"
            >
              &times;
            </button>
            <span className="aventis-eyebrow">DISCOVER THE FLEET & DESTINATIONS</span>
            <input
              type="text"
              className="search-modal-input"
              placeholder="Where would you like to sail?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
            <div className="search-chips-row">
              <span className="search-chip" onClick={() => setSearchQuery('Bahamas')}>Bahamas</span>
              <span className="search-chip" onClick={() => setSearchQuery('Motor')}>50m+ Motor Yachts</span>
              <span className="search-chip" onClick={() => setSearchQuery('Mediterranean')}>Summer in Greece</span>
              <span className="search-chip" onClick={() => setSearchQuery('Catamaran')}>Catamarans</span>
              <span className="search-chip" onClick={() => setSearchQuery('Newport')}>Newport Classic</span>
            </div>

            {searchQuery && (
              <div style={{ marginTop: '32px', textAlign: 'left', maxHeight: '300px', overflowY: 'auto' }}>
                <div style={{ color: 'var(--color-gold)', fontSize: '12px', fontWeight: 600, letterSpacing: '1px', marginBottom: '12px' }}>
                  SEARCH RESULTS ({searchResults.length})
                </div>
                {searchResults.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      padding: '12px 16px',
                      background: 'rgba(255, 255, 255, 0.04)',
                      borderRadius: '8px',
                      marginBottom: '8px',
                      cursor: 'pointer'
                    }}
                    onClick={() => {
                      setSearchModalOpen(false);
                      openBookingFor(item.title);
                    }}
                  >
                    <img src={item.image} alt={item.title} style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '6px' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ color: '#fff', fontWeight: 600 }}>{item.title}</div>
                      <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '13px' }}>{item.subtitle}</div>
                    </div>
                    <span className="btn-outline-gold" style={{ padding: '6px 16px', fontSize: '12px' }}>Inquire &rarr;</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. Charter Booking Modal (#booking-modal) */}
      {bookingModalOpen && (
        <div className="modal-backdrop" onClick={() => setBookingModalOpen(false)}>
          <div className="booking-modal-box" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close-btn"
              onClick={() => setBookingModalOpen(false)}
              aria-label="Close booking modal"
            >
              &times;
            </button>
            <span className="aventis-eyebrow">CHARTER INQUIRY</span>
            <h3>Plan Your Bespoke Voyage</h3>
            <p>Our private brokerage concierge will tailor your vessel, crew, and routing within 24 hours.</p>

            {bookingConfirmed ? (
              <div style={{ padding: '40px 20px', textAlign: 'center', background: 'rgba(197, 155, 95, 0.1)', borderRadius: '12px', border: '1px solid var(--border-gold)' }}>
                <div style={{ color: 'var(--color-gold)', fontSize: '32px', marginBottom: '12px' }}>&#10003;</div>
                <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', color: '#fff', marginBottom: '8px' }}>Inquiry Received</h4>
                <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px', margin: 0 }}>
                  A senior charter broker from our Newport office will reach out to you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit}>
                <div className="booking-form-grid">
                  <div>
                    <label className="booking-field-label">Preferred Yacht</label>
                    <select
                      className="booking-select-control"
                      value={bookingPrefYacht}
                      onChange={(e) => setBookingPrefYacht(e.target.value)}
                    >
                      <option value="The Meridian (164ft Motor)">The Meridian (164ft Motor Yacht)</option>
                      <option value="Ocean Breeze (120ft Sail)">Ocean Breeze (120ft Sailing Yacht)</option>
                      <option value="Aqua Vida (82ft Catamaran)">Aqua Vida (82ft Luxury Catamaran)</option>
                      <option value="Custom Itinerary / Any Vessel">Custom Itinerary / Any Vessel</option>
                    </select>
                  </div>

                  <div>
                    <label className="booking-field-label">Target Destination</label>
                    <select className="booking-select-control" defaultValue="Newport & New England">
                      <option value="Newport & New England">Newport & New England</option>
                      <option value="The Bahamas & Exumas">The Bahamas & Exumas</option>
                      <option value="Amalfi Coast & Capri">Amalfi Coast & Capri</option>
                      <option value="French Riviera & Monaco">French Riviera & Monaco</option>
                      <option value="Greek Cyclades">Greek Cyclades</option>
                    </select>
                  </div>

                  <div>
                    <label className="booking-field-label">Charter Dates</label>
                    <input type="text" className="booking-input-control" placeholder="e.g. June 15 - June 22" required />
                  </div>

                  <div>
                    <label className="booking-field-label">Number of Guests</label>
                    <input type="number" min="1" max="24" defaultValue="8" className="booking-input-control" required />
                  </div>

                  <div>
                    <label className="booking-field-label">Full Name</label>
                    <input type="text" className="booking-input-control" placeholder="Lord / Lady / Mr / Ms" required />
                  </div>

                  <div>
                    <label className="booking-field-label">Email or Telephone</label>
                    <input type="text" className="booking-input-control" placeholder="brokerage contact info" required />
                  </div>

                  <div className="form-full">
                    <label className="booking-field-label">Special Requests & Dietary Preferences</label>
                    <textarea
                      className="booking-input-control"
                      rows={3}
                      placeholder="Michelin-star chef menu, seabobs, specific anchorages, helipad transfers..."
                    />
                  </div>
                </div>

                <button type="submit" className="btn-gold" style={{ width: '100%', padding: '16px' }}>
                  Submit Confidential Charter Request &rarr;
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 3. Yacht Details Modal */}
      {selectedYachtModal && (
        <div className="modal-backdrop" onClick={() => setSelectedYachtModal(null)}>
          <div className="yacht-modal-box" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close-btn"
              onClick={() => setSelectedYachtModal(null)}
              aria-label="Close yacht specifications"
            >
              &times;
            </button>
            <div className="yacht-modal-header">
              <span className="aventis-eyebrow">{selectedYachtModal.tag}</span>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '36px', color: '#fff', margin: '4px 0 12px' }}>
                {selectedYachtModal.name}
              </h3>
              <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '15px', lineHeight: 1.6 }}>
                {selectedYachtModal.description}
              </p>
            </div>

            <div className="yacht-modal-gallery">
              <img src={selectedYachtModal.image} alt={selectedYachtModal.name} className="yacht-modal-img-main" />
              <div className="yacht-modal-gallery-side">
                <img src={selectedYachtModal.subImages[0]} alt="Interior lounge" className="yacht-modal-img-sub" />
                <img src={selectedYachtModal.subImages[1]} alt="Teak deck dining" className="yacht-modal-img-sub" />
              </div>
            </div>

            <div className="yacht-modal-specs-grid">
              <div className="modal-spec-item">
                <span className="modal-spec-label">Length</span>
                <span className="modal-spec-val">{selectedYachtModal.length}</span>
              </div>
              <div className="modal-spec-item">
                <span className="modal-spec-label">Capacity</span>
                <span className="modal-spec-val">{selectedYachtModal.guests}</span>
              </div>
              <div className="modal-spec-item">
                <span className="modal-spec-label">Accommodations</span>
                <span className="modal-spec-val">{selectedYachtModal.cabins}</span>
              </div>
              <div className="modal-spec-item">
                <span className="modal-spec-label">Crew</span>
                <span className="modal-spec-val">{selectedYachtModal.crew}</span>
              </div>
            </div>

            <div style={{ marginBottom: '28px' }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-gold)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '12px' }}>
                Included Vessel Amenities
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                {selectedYachtModal.amenities.map((amenity, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(255, 255, 255, 0.85)', fontSize: '14px' }}>
                    <span style={{ color: 'var(--color-gold)' }}>&#9670;</span> {amenity}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-light)', paddingTop: '20px' }}>
              <div>
                <span style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)', textTransform: 'uppercase' }}>Weekly Charter Rate</span>
                <div style={{ fontSize: '20px', fontWeight: 600, color: 'var(--color-gold)' }}>{selectedYachtModal.rate}</div>
              </div>
              <button
                className="btn-gold"
                onClick={() => openBookingFor(selectedYachtModal.name)}
              >
                Request This Vessel &rarr;
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Story Video Modal */}
      {storyModalOpen && (
        <div className="modal-backdrop" onClick={() => setStoryModalOpen(false)}>
          <div style={{ maxWidth: '880px', width: '100%', position: 'relative' }} onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close-btn"
              onClick={() => setStoryModalOpen(false)}
              aria-label="Close story"
            >
              &times;
            </button>
            <div style={{ borderRadius: '16px', overflow: 'hidden', boxShadow: '0 24px 60px rgba(0,0,0,0.8)', border: '1px solid var(--border-gold)', background: '#070F17' }}>
              <img
                src={IMAGES.experience_swimmer}
                alt="Aventis maritime cinema"
                style={{ width: '100%', height: '440px', objectFit: 'cover' }}
              />
              <div style={{ padding: '32px', background: '#0E1B28' }}>
                <span className="aventis-eyebrow">THE AVENTIS WAY</span>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', color: '#fff', margin: '6px 0 12px' }}>
                  A Symphony of Wind, Sea, and Absolute Discretion
                </h3>
                <p style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '15px', lineHeight: 1.6, margin: 0 }}>
                  Every voyage begins with a private conversation with our master charter brokers. From mapping private anchorages in Greece to sourcing rare vintages for your teak aft deck, our standard is perfection.
                </p>
                <div style={{ marginTop: '24px', display: 'flex', gap: '16px' }}>
                  <button className="btn-gold" onClick={() => { setStoryModalOpen(false); setBookingModalOpen(true); }}>
                    Plan Your Journey &rarr;
                  </button>
                  <button className="btn-outline-gold" onClick={() => setStoryModalOpen(false)}>
                    Close Reel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Slide-Out Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-drawer-overlay" onClick={() => setMobileMenuOpen(false)}>
          <div className="mobile-drawer-panel" onClick={(e) => e.stopPropagation()}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <a href="#hero-runway" className="nav-brand" onClick={() => setMobileMenuOpen(false)}>
                  <svg className="brand-helm-icon" viewBox="0 0 48 48" fill="none" style={{ width: '32px', height: '32px' }}>
                    <circle cx="24" cy="24" r="14" stroke="#C59B5F" strokeWidth="2.2" />
                    <circle cx="24" cy="24" r="4" fill="#C59B5F" />
                  </svg>
                  <span className="brand-title" style={{ fontSize: '20px' }}>AVENTIS</span>
                </a>
                <button
                  className="modal-close-btn"
                  style={{ position: 'static', width: '36px', height: '36px' }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  &times;
                </button>
              </div>

              <div className="mobile-drawer-links">
                <a href="#hero-runway" onClick={() => setMobileMenuOpen(false)}>Home</a>
                <a href="#fleet" onClick={() => setMobileMenuOpen(false)}>Yachts</a>
                <a href="#destinations" onClick={() => setMobileMenuOpen(false)}>Destinations</a>
                <a href="#experiences" onClick={() => setMobileMenuOpen(false)}>Experience</a>
                <a href="#about" onClick={() => setMobileMenuOpen(false)}>About</a>
                <a href="#contact" onClick={() => setMobileMenuOpen(false)}>Contact</a>
              </div>
            </div>

            <div>
              <button
                className="btn-gold"
                style={{ width: '100%', marginBottom: '14px' }}
                onClick={() => {
                  setMobileMenuOpen(false);
                  setBookingModalOpen(true);
                }}
              >
                Book a Yacht &rarr;
              </button>
              <div style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '12px', textAlign: 'center' }}>
                Newport, Rhode Island • +1 (800) 555-YACHT
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
