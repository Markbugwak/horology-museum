import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowRight, ArrowUpRight, Menu, X } from 'lucide-react';

const WatchModel = lazy(() => import('./components/WatchModel'));

const exhibits = [
  {
    number: '01',
    name: 'The Diver',
    period: 'DIVE WATCH STUDY',
    category: 'ELAPSED-TIME BEZEL',
    detail: 'A clear minute scale and high-contrast markers make elapsed time easy to read. On a real dive watch, the bezel is a practical timing tool—not merely decoration.',
    copy: 'A dial built for quick reading, with elapsed time kept close at hand.',
  },
  {
    number: '02',
    name: 'The Racer',
    period: 'CHRONOGRAPH STUDY',
    category: 'ELAPSED-TIME COUNTERS',
    detail: 'A chronograph adds a separate timing function to a conventional time display. Subdials record elapsed intervals, while the main hands continue to show the time of day.',
    copy: 'A layered dial separates ordinary time from measured intervals.',
  },
  {
    number: '03',
    name: 'The Traveler',
    period: 'DUAL-TIME STUDY',
    category: 'SECOND TIME ZONE',
    detail: 'A second hour hand and a 24-hour scale can show another time zone alongside local time. The layout is useful when coordinating across distant places.',
    copy: 'A second time zone sits alongside local time, not in place of it.',
  },
];

const components = [
  { number: '01', title: 'THE BEZEL', summary: 'Frames the dial; on a timing watch, its scale can track elapsed minutes.', heading: 'A scale with a job.', note: 'A timing bezel lets the wearer mark a starting point and read elapsed time at a glance. Its markings matter only when they remain legible and easy to align.' },
  { number: '02', title: 'THE CRYSTAL', summary: 'A clear cover that protects the dial from contact and everyday wear.', heading: 'Clarity is structural.', note: 'The crystal is part of the watch’s protection system. Material, shape, thickness, and coatings affect how clearly the dial can be read and how well the surface withstands wear.' },
  { number: '03', title: 'THE DIAL & HANDS', summary: 'Contrast, markers, and hand shapes turn movement into readable information.', heading: 'Designed to be read.', note: 'Dial design is a practical exercise in hierarchy. Hand length, marker position, contrast, and spacing should make the time clear before decorative details ask for attention.' },
  { number: '04', title: 'THE CASE', summary: 'The outer shell supports the watch and protects its internal parts.', heading: 'Protection by design.', note: 'The case holds the movement and provides the structure for the crystal, crown, and back. Its proportions also determine how the watch sits on the wrist.' },
];

const timeline = [
  { date: 'c. 1500', title: 'Time becomes portable', copy: 'Spring-driven portable clocks emerge in Europe, freeing timekeeping from a fixed wall or tower.' },
  { date: '1675', title: 'A spring improves the balance', copy: 'The balance spring helps regulate a watch’s oscillation, opening the way to more consistent timekeeping.' },
  { date: 'EARLY 1900s', title: 'The wristwatch finds its place', copy: 'Wristwatches become increasingly practical for timing, coordination, and situations where a pocket watch is inconvenient.' },
  { date: '1969', title: 'Quartz changes the equation', copy: 'Quartz wristwatches reach the market, bringing a different approach to accuracy, maintenance, and mass production.' },
  { date: 'TODAY', title: 'Mechanics remains a craft', copy: 'Mechanical watches continue to be studied for movement design, finishing, repair, and the relationship between form and function.' },
];

function Header({ activeSection }: { activeSection: string }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <a className="wordmark" href="#top" aria-label="Horology home">
        <span className="mark" aria-hidden="true">H</span>
        <span>HOROLOGY<small>AN INDEPENDENT WATCH MUSEUM</small></span>
      </a>
      <button
        className="mobile-menu"
        type="button"
        onClick={() => setOpen(!open)}
        aria-label={open ? 'Close navigation' : 'Open navigation'}
        aria-expanded={open}
        aria-controls="primary-navigation"
      >
        {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
      </button>
      <nav id="primary-navigation" className={open ? 'nav-links open' : 'nav-links'} onClick={() => setOpen(false)}>
        <a className={activeSection === 'collection' ? 'active' : ''} href="#collection">COLLECTION</a>
        <a className={activeSection === 'anatomy' ? 'active' : ''} href="#anatomy">ANATOMY</a>
        <a className={activeSection === 'timeline' ? 'active' : ''} href="#timeline">HISTORY</a>
        <a className={activeSection === 'about' ? 'active nav-visit' : 'nav-visit'} href="#about">ABOUT</a>
      </nav>
    </header>
  );
}

function App() {
  const [activeComponent, setActiveComponent] = useState(0);
  const [activeSection, setActiveSection] = useState('top');
  const [selectedExhibit, setSelectedExhibit] = useState<(typeof exhibits)[number] | null>(null);
  const [anatomyModelReady, setAnatomyModelReady] = useState(false);
  const modalCloseRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

    const sectionElements = ['top', 'anatomy', 'collection', 'timeline', 'about']
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => Boolean(element));

    const sectionObserver = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (visible) setActiveSection(visible.target.id || 'top');
    }, { rootMargin: '-22% 0px -58% 0px', threshold: [0, 0.15, 0.35, 0.6] });

    sectionElements.forEach((section) => sectionObserver.observe(section));

    return () => {
      revealObserver.disconnect();
      sectionObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    const section = document.getElementById('anatomy');
    if (!section) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        setAnatomyModelReady(true);
        observer.disconnect();
      }
    }, { rootMargin: '320px 0px' });

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!selectedExhibit) return;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelectedExhibit(null);
    };

    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);
    modalCloseRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedExhibit]);

  return (
    <div>
      <Header activeSection={activeSection} />
      <main>
        <section id="top" className="hero">
          <div className="hero-copy">
            <p className="eyebrow"><span className="eyebrow-line" /> AN INDEPENDENT STUDY OF MECHANICAL WATCHES</p>
            <h1>Time, made<br /><em>mechanical.</em></h1>
            <p className="hero-desc">A closer look at the design decisions behind a watch: how its parts work, how its display is read, and how different forms solve different problems.</p>
            <div className="hero-actions">
              <a className="button button-light" href="#collection">VIEW THE STUDIES <ArrowRight size={16} aria-hidden="true" /></a>
              <a className="text-link" href="#anatomy">OPEN THE CASE <ArrowDown size={15} aria-hidden="true" /></a>
            </div>
            <div className="hero-meta">
              <div><strong>4 parts</strong><span>IN THE ANATOMY STUDY</span></div>
              <div><strong>3 forms</strong><span>BUILT AROUND DIFFERENT USES</span></div>
            </div>
          </div>

          <div className="hero-stage">
            <div className="stage-orbit orbit-one" aria-hidden="true" />
            <div className="stage-orbit orbit-two" aria-hidden="true" />
            <div className="stage-index"><span>STUDY 001</span><span>DIVER ARCHETYPE</span></div>
            <img
              className="hero-watch-image"
              src="/images/hero-watch.svg"
              width="1200"
              height="1400"
              fetchPriority="high"
              loading="eager"
              decoding="async"
              alt="Original illustration of a conceptual dive watch with a dark green dial, steel bracelet, and gold-toned bezel"
            />
            <a className="hero-model-link" href="#anatomy">INSPECT THE 3D MODEL <ArrowDown size={13} aria-hidden="true" /></a>
            <div className="stage-caption"><span>STAINLESS STEEL</span><span>CONCEPTUAL DESIGN STUDY</span></div>
          </div>
        </section>

        <section id="intro" className="intro section-pad reveal">
          <p className="eyebrow">WHY THE DETAILS MATTER</p>
          <div className="intro-grid">
            <h2>Small parts.<br /><em>Clear purpose.</em></h2>
            <div>
              <p className="body-copy">A watch is a compact system. The case protects it, the crystal keeps the display visible, and the dial turns the movement into information a person can read.</p>
              <p className="body-copy muted">HOROLOGY is an independent educational project. Its illustrations and interactive model are conceptual studies, not replicas of a particular manufacturer’s watch.</p>
              <a href="#anatomy" className="inline-link">STUDY THE COMPONENTS <ArrowRight size={15} aria-hidden="true" /></a>
            </div>
          </div>
        </section>

        <section id="anatomy" className="anatomy section-pad">
          <div className="anatomy-head reveal">
            <div><p className="eyebrow">ANATOMY OF A WATCH</p><h2>Look beneath<br /><em>the surface.</em></h2></div>
            <p className="body-copy muted">Choose a component to highlight it. Scroll through this section to separate the layers, then drag the model to inspect its shape.</p>
          </div>

          <div className="anatomy-grid">
            <div className="component-list" aria-label="Watch components">
              {components.map((part, index) => (
                <button
                  type="button"
                  key={part.number}
                  onClick={() => setActiveComponent(index)}
                  className={activeComponent === index ? 'component-row selected' : 'component-row'}
                  aria-pressed={activeComponent === index}
                >
                  <span>{part.number}</span>
                  <span><strong>{part.title}</strong><small>{part.summary}</small></span>
                  <ArrowUpRight size={16} aria-hidden="true" />
                </button>
              ))}
            </div>

            <div className="anatomy-model">
              <div className="anatomy-model-frame">
                <Suspense fallback={<div className="watch-fallback"><strong>3D WATCH STUDY</strong><span>Loading the interactive model…</span></div>}>
                  {anatomyModelReady
                    ? <WatchModel activePart={(['bezel', 'crystal', 'hands', 'case'] as const)[activeComponent]} showHint={false} />
                    : <div className="watch-fallback"><strong>3D WATCH STUDY</strong><span>The model loads as you approach this section.</span></div>}
                </Suspense>
              </div>
              <p className="anatomy-model-caption">SCROLL TO SEPARATE LAYERS · DRAG TO ROTATE</p>
            </div>

            <aside className="anatomy-note" aria-live="polite">
              <span className="note-index">COMPONENT / {components[activeComponent].number}</span>
              <h3>{components[activeComponent].heading}</h3>
              <p>{components[activeComponent].note}</p>
              <div className="note-rule" />
              <span className="note-foot">INTERACTIVE MODEL</span>
              <span className="note-foot">CONCEPTUAL STUDY</span>
            </aside>
          </div>
        </section>

        <section id="collection" className="collection section-pad">
          <div className="section-heading reveal">
            <div><p className="eyebrow">THREE DESIGN STUDIES</p><h2>Different needs.<br /><em>Different dials.</em></h2></div>
            <span className="section-count">01—03 / ORIGINAL ARCHETYPES</span>
          </div>
          <div className="exhibit-grid">
            {exhibits.map((item) => (
              <button
                type="button"
                className={`exhibit-card reveal exhibit-${item.number}`}
                key={item.number}
                onClick={() => setSelectedExhibit(item)}
                aria-label={`Read about ${item.name}`}
              >
                <div className="exhibit-art">
                  <div className="art-ring" aria-hidden="true" />
                  <div className={`art-watch art-watch-${item.number}`} aria-hidden="true">
                    <div className="art-dial">
                      {item.number !== '02' && Array.from({ length: 12 }, (_, index) => (
                        <span className="art-hour-marker" key={index} style={{ transform: `translateX(-50%) rotate(${index * 30}deg)` }} />
                      ))}
                      <span className="art-hand hand-a" />
                      <span className="art-hand hand-b" />
                      <span className="art-pin" />
                      {item.number === '02' && <><span className="subdial subdial-a" /><span className="subdial subdial-b" /><span className="subdial subdial-c" /></>}
                      {item.number === '03' && <span className="gmt-hand" />}
                    </div>
                  </div>
                  <span className="art-feature">{item.category}</span>
                </div>
                <div className="exhibit-info">
                  <div className="exhibit-kicker"><span>STUDY {item.number}</span><span>{item.period}</span></div>
                  <h3>{item.name}</h3>
                  <p>{item.copy}</p>
                  <span className="inline-link">READ THE STUDY <ArrowRight size={15} aria-hidden="true" /></span>
                </div>
              </button>
            ))}
          </div>
        </section>

        <section id="timeline" className="timeline section-pad">
          <div className="timeline-intro reveal">
            <p className="eyebrow">A SHORT HISTORY</p>
            <h2>How time<br /><em>became portable.</em></h2>
            <p className="body-copy muted">A few turning points in the long effort to make timekeeping more accurate, more useful, and easier to carry.</p>
            <div className="timeline-fact"><span>THE THREAD THROUGH IT</span><p>Accuracy, legibility, and portability keep returning as design problems. Each generation of watchmaking responds to a different need.</p></div>
          </div>
          <div className="timeline-items">
            {timeline.map((item) => (
              <article className="timeline-item reveal" key={item.date}>
                <span>{item.date}</span>
                <div><h3>{item.title}</h3><p>{item.copy}</p></div>
              </article>
            ))}
          </div>
        </section>

        <section id="about" className="closing section-pad">
          <p className="eyebrow">HOROLOGY / AN INDEPENDENT STUDY</p>
          <h2>A watch is more<br />than its <em>dial.</em></h2>
          <a className="button button-light" href="#collection">RETURN TO THE STUDIES <ArrowRight size={16} aria-hidden="true" /></a>
          <div className="closing-orbit" aria-hidden="true" />
        </section>
      </main>

      <footer className="footer">
        <div className="footer-inner">
          <a className="wordmark" href="#top" aria-label="Horology home">
            <span className="mark" aria-hidden="true">H</span>
            <span>HOROLOGY<small>AN INDEPENDENT WATCH MUSEUM</small></span>
          </a>
          <p>An independent educational project. The watch illustrations and 3D model are conceptual, not manufacturer replicas. No affiliation or endorsement is implied.</p>
          <span>DESIGN · MECHANICS · HISTORY</span>
        </div>
      </footer>

      {selectedExhibit && (
        <div className="modal-backdrop" onClick={() => setSelectedExhibit(null)}>
          <section
            className="exhibit-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
            onClick={(event) => event.stopPropagation()}
          >
            <button ref={modalCloseRef} className="modal-close" type="button" onClick={() => setSelectedExhibit(null)} aria-label="Close study"><X aria-hidden="true" /></button>
            <p className="eyebrow">STUDY {selectedExhibit.number} · {selectedExhibit.period}</p>
            <h2 id="modal-title">{selectedExhibit.name}</h2>
            <p className="modal-feature">{selectedExhibit.category}</p>
            <p id="modal-description">{selectedExhibit.detail}</p>
            <p className="modal-disclaimer">This is an original educational archetype, not a replica of a specific manufacturer’s design.</p>
            <a className="inline-link" href="#anatomy" onClick={() => setSelectedExhibit(null)}>EXPLORE THE COMPONENTS <ArrowRight size={15} aria-hidden="true" /></a>
          </section>
        </div>
      )}
    </div>
  );
}

export default App;