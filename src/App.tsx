import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowRight, ArrowUpRight, Menu, X } from 'lucide-react';

const WatchModel = lazy(() => import('./components/WatchModel'));

const exhibits = [
  {
    number: '01',
    name: 'The Diver',
    period: 'DIVE WATCH STUDY',
    category: 'ELAPSED-TIME BEZEL',
    detail: 'The bezel’s minute scale can mark the start of an interval. On a dive watch, it is a timing instrument: its direction and markings matter as much as its appearance.',
    copy: 'Bold minute marks and a one-way bezel make elapsed time readable at a glance.',
    story: 'A dive-watch layout is built around a simple problem: underwater, elapsed time must be clear at a glance. The bezel gives the wearer a quick reference without navigating a menu or reading a small display.',
    notice: ['The zero marker is aligned with the minute hand to begin timing.', 'The minute scale is separated from the hour markers.', 'The one-way bezel convention is a safety feature on many dive watches.'],
    mechanism: 'Rotate the bezel so its zero marker meets the minute hand. As the hand moves, read elapsed minutes against the bezel scale. On many dive watches the bezel turns only counter-clockwise, so an accidental bump indicates more elapsed time rather than less.'
  },
  {
    number: '02',
    name: 'The Racer',
    period: 'CHRONOGRAPH STUDY',
    category: 'ELAPSED-TIME COUNTERS',
    detail: 'A chronograph uses pushers to start, stop, and reset a separate timing mechanism. Its subdials display elapsed intervals while the central hands continue to show the time.',
    copy: 'Three subdials record elapsed seconds and minutes without taking over the main time display.',
    story: 'A chronograph adds a stopwatch function to a watch that still tells the time. The challenge is information design: elapsed time needs its own display, but the main dial must remain readable.',
    notice: ['Pushers control start, stop, and reset on a typical chronograph.', 'Subdials separate elapsed-time readings from the main time.', 'Extra hands and scales make visual hierarchy especially important.'],
    mechanism: 'A chronograph uses a start/stop control and a reset control to operate an elapsed-time mechanism. Depending on the design, a central seconds hand and smaller registers show seconds and minutes, while the regular hour and minute hands keep showing the current time.'
  },
  {
    number: '03',
    name: 'The Traveler',
    period: 'DUAL-TIME STUDY',
    category: 'SECOND TIME ZONE',
    detail: 'A dedicated 24-hour hand can track a second time zone. Read against the 24-hour scale, it helps distinguish daytime from nighttime elsewhere.',
    copy: 'A fourth hand tracks a second time zone against a 24-hour scale.',
    story: 'Travel creates a display problem: local time matters, but home time may matter too. A dedicated 24-hour hand keeps a second zone visible without requiring the wearer to reset the main hands.',
    notice: ['The extra hand is read against a 24-hour scale.', 'A full rotation represents a complete day rather than twelve hours.', 'The 24-hour reading helps distinguish day from night in the second zone.'],
    mechanism: 'A dedicated 24-hour hand makes one full rotation per day. Read it against a 24-hour bezel or chapter ring to track another time zone; some watches let the wearer adjust that hand independently, while others use a different setting arrangement.'
  },
];

const components = [
  { number: '01', title: 'THE BEZEL', summary: 'Surrounds the crystal. A marked, rotating bezel can measure elapsed minutes without using the crown.', heading: 'Mark the elapsed minutes.', note: 'Align the bezel’s zero marker with the minute hand at the start of an interval. The elapsed minutes can then be read from the hand’s position against the bezel scale.' },
  { number: '02', title: 'THE CRYSTAL', summary: 'The transparent cover above the dial. Its material and coatings affect scratch resistance, reflections, and legibility.', heading: 'A clear barrier, not decoration.', note: 'A crystal is commonly made from mineral glass, synthetic sapphire, or acrylic. Each material trades off scratch resistance, impact behavior, cost, and ease of polishing.' },
  { number: '03', title: 'THE DIAL & HANDS', summary: 'The display: indices, numerals, and hands translate the movement’s output into a readable time.', heading: 'The display has a hierarchy.', note: 'The minute hand should reach the minute track; the hour hand should point clearly between the markers. Contrast and spacing help the wearer read the time without searching the dial.' },
  { number: '04', title: 'THE CASE', summary: 'Houses the movement and joins the crystal, crown, and caseback into one protective structure.', heading: 'The structure around the movement.', note: 'The case supports the crystal, crown, and caseback while shielding the movement. Lug shape, thickness, and diameter affect how the watch sits on the wrist.' },
];

const timeline = [
  { date: 'c. 1500', title: 'Portable clocks appear', copy: 'Spring-powered clocks made timekeeping portable, although early examples were bulky and far less accurate than later watches.' },
  { date: '1675', title: 'The balance spring', copy: 'The balance spring, developed in the 17th century, made the balance’s oscillations more regular and improved timekeeping.' },
  { date: 'EARLY 1900s', title: 'Wristwatches gain ground', copy: 'Wristwatches spread from specialized uses into wider civilian life during the early 20th century, helped by their convenience for checking time on the move.' },
  { date: '1969', title: 'Quartz reaches the wrist', copy: 'Commercial quartz wristwatches arrive in 1969. Their electronic timekeeping offered far greater accuracy with less routine adjustment than most mechanical watches.' },
  { date: 'TODAY', title: 'Mechanical watchmaking continues', copy: 'Mechanical watches remain objects of study for their gear trains, escapements, finishing, servicing, and the engineering choices visible through the case.' },
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
        <a className={activeSection === 'anatomy' ? 'active' : ''} href="#anatomy">ANATOMY</a>
        <a className={activeSection === 'collection' ? 'active' : ''} href="#collection">EXHIBITS</a>
        <a className={activeSection === 'timeline' ? 'active' : ''} href="#timeline">HISTORY</a>
        <a className={activeSection === 'sources' ? 'active' : ''} href="#sources">SOURCES</a>
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
  const lastTriggerRef = useRef<HTMLButtonElement | null>(null);

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

    const sectionElements = ['top', 'anatomy', 'collection', 'timeline', 'sources', 'about']
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
      if (event.key === 'Escape') {
        setSelectedExhibit(null);
        return;
      }

      if (event.key === 'Tab') {
        const dialog = document.querySelector<HTMLElement>('.exhibit-modal');
        if (!dialog) return;
        const focusable = Array.from(dialog.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ));
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);
    modalCloseRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
      lastTriggerRef.current?.focus();
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
            <p className="hero-desc">Three original watch studies and an interactive case. See how a bezel tracks elapsed minutes, how a crystal protects the dial, and how hands and markers make time readable.</p>
            <div className="hero-actions">
              <a className="button button-light" href="#collection">VIEW THE STUDIES <ArrowRight size={16} aria-hidden="true" /></a>
              <a className="text-link" href="#anatomy">OPEN THE CASE <ArrowDown size={15} aria-hidden="true" /></a>
            </div>
            <div className="hero-meta">
              <div><strong>4 components</strong><span>IN THE ANATOMY STUDY</span></div>
              <div><strong>3 exhibits</strong><span>WITH DISTINCT FUNCTIONS</span></div>
            </div>
          </div>

          <div className="hero-stage">
            <div className="stage-orbit orbit-one" aria-hidden="true" />
            <div className="stage-index"><span>STUDY 001</span><span>DIVER ARCHETYPE</span></div>
            <img
              className="hero-watch-image"
              src="/images/hero-watch.png"
              width="1200"
              height="1400"
              fetchPriority="high"
              loading="eager"
              decoding="async"
              alt="Stainless steel skeleton mechanical wristwatch with a polished multi-link bracelet, displayed on a warm cream background"
            />
            <a className="hero-model-link" href="#anatomy">INSPECT THE 3D MODEL <ArrowDown size={13} aria-hidden="true" /></a>
            <div className="stage-caption"><span>STAINLESS STEEL</span><span>CONCEPTUAL DESIGN STUDY</span></div>
          </div>
        </section>

        <section id="intro" className="intro section-pad reveal">
          <p className="eyebrow">FORM FOLLOWS FUNCTION</p>
          <div className="intro-grid">
            <h2>A compact instrument.<br /><em>Carefully arranged.</em></h2>
            <div>
              <p className="body-copy">A watch is a chain of practical decisions. The case protects the movement, the crystal shields the display, and the dial gives the hands and markers a clear job.</p>
              <p className="body-copy muted">HOROLOGY is an independent educational project. Its illustrations and interactive model are conceptual studies, not replicas of a particular manufacturer’s watch.</p>
              <a href="#anatomy" className="inline-link">STUDY THE COMPONENTS <ArrowRight size={15} aria-hidden="true" /></a>
            </div>
          </div>
        </section>

        <section id="anatomy" className="anatomy section-pad">
          <div className="anatomy-head reveal">
            <div><p className="eyebrow">ANATOMY OF A WATCH</p><h2>Four parts.<br /><em>One display.</em></h2></div>
            <p className="body-copy muted">Select a part to highlight it. Scroll to separate the outer layers, or drag the model to inspect the case from another angle.</p>
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
            <div><p className="eyebrow">THREE DESIGN STUDIES</p><h2>Three functions.<br /><em>Three layouts.</em></h2></div>
            <span className="section-count">01—03 / ORIGINAL ARCHETYPES</span>
          </div>
          <div className="exhibit-grid">
            {exhibits.map((item) => (
              <button
                type="button"
                className={`exhibit-card reveal exhibit-${item.number}`}
                key={item.number}
                onClick={(event) => { lastTriggerRef.current = event.currentTarget; setSelectedExhibit(item); }}
                aria-label={`Read about ${item.name}`}
              >
                <div className="exhibit-art">
                  <div className="art-ring" aria-hidden="true" />
                  <div className={`art-watch art-watch-${item.number}`} aria-hidden="true">
                    <div className="art-dial">
                      {Array.from({ length: 12 }, (_, index) => (
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
                  <span className="inline-link">OPEN STUDY NOTES <ArrowRight size={15} aria-hidden="true" /></span>
                </div>
              </button>
            ))}
          </div>
        </section>

        <section id="timeline" className="timeline section-pad">
          <div className="timeline-intro reveal">
            <p className="eyebrow">A SHORT HISTORY</p>
            <h2>How time<br /><em>became portable.</em></h2>
            <p className="body-copy muted">Five milestones in the shift from portable clocks to modern wristwatches.</p>
            <div className="timeline-fact"><span>A RECURRING DESIGN PROBLEM</span><p>Accuracy, legibility, and portability can pull in different directions. Every watch design balances them in its own way.</p></div>
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

        <section id="sources" className="sources section-pad">
          <div className="section-heading reveal">
            <div><p className="eyebrow">FURTHER READING</p><h2>Follow the <em>evidence.</em></h2></div>
            <span className="section-count">SOURCES & REFERENCES</span>
          </div>
          <p className="body-copy muted sources-intro">The timeline is a short orientation, not a complete history. These references provide further context for portable timekeeping, balance springs, and quartz watches.</p>
          <div className="source-list">
            <a href="https://www.britannica.com/technology/watch" target="_blank" rel="noreferrer"><span>01 / ENCYCLOPEDIA</span><strong>Watch — Encyclopaedia Britannica</strong><span>General background on watch design and development <ArrowUpRight size={15} aria-hidden="true" /></span></a>
            <a href="https://www.sciencemuseum.org.uk/objects-and-stories" target="_blank" rel="noreferrer"><span>02 / COLLECTION & STORIES</span><strong>Science Museum Group</strong><span>Objects and stories from the history of science and timekeeping <ArrowUpRight size={15} aria-hidden="true" /></span></a>
            <a href="https://www.nist.gov/pml/time-and-frequency-division" target="_blank" rel="noreferrer"><span>03 / TIME STANDARDS</span><strong>NIST Time and Frequency Division</strong><span>Technical context for modern timekeeping and frequency measurement <ArrowUpRight size={15} aria-hidden="true" /></span></a>
          </div>
        </section>

        <section id="about" className="closing section-pad">
          <p className="eyebrow">HOROLOGY / AN INDEPENDENT STUDY</p>
          <h2>Start at the case.<br />Finish at the <em>hands.</em></h2>
          <a className="button button-light" href="#collection">BACK TO THE COLLECTION <ArrowRight size={16} aria-hidden="true" /></a>
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
            <p id="modal-description">{selectedExhibit.story}</p>
            <div className="modal-section">
              <span className="note-index">HOW IT WORKS</span>
              <p>{selectedExhibit.mechanism}</p>
            </div>
            <div className="modal-section">
              <span className="note-index">WHAT TO NOTICE</span>
              <ul>{selectedExhibit.notice.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
            <p className="modal-disclaimer">{selectedExhibit.detail} This is an original educational archetype, not a replica of a specific manufacturer’s design.</p>
            <a className="inline-link" href="#anatomy" onClick={() => setSelectedExhibit(null)}>VIEW THE COMPONENTS <ArrowRight size={15} aria-hidden="true" /></a>
          </section>
        </div>
      )}
    </div>
  );
}

export default App;