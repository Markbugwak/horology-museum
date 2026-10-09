import { useEffect, useState } from 'react';
import { ArrowDown, ArrowRight, ArrowUpRight, Menu, X } from 'lucide-react';
import WatchModel from './components/WatchModel';

const exhibits = [
  { number: '01', name: 'The Diver', year: '1950s', category: 'ROTATING TIMING BEZEL', detail: 'A purpose-built archetype for underwater legibility, with a minute track, luminous markers, and a high-contrast dial.', copy: 'A clear, rugged instrument designed around elapsed time and readability in low light.' },
  { number: '02', name: 'The Racer', year: '1960s', category: 'CHRONOGRAPH DIAL', detail: 'A motorsport-inspired layout with three subdials for elapsed seconds, minutes, and hours.', copy: 'A precision instrument inspired by the pace and measurement of the racetrack.' },
  { number: '03', name: 'The Traveler', year: '1950s–70s', category: 'DUAL-TIME BEZEL', detail: 'A two-tone 24-hour bezel and an additional hand make a second time zone easy to read at a glance.', copy: 'A companion for crossing time zones while keeping home time in view.' },
];

function Header({ activeSection }: { activeSection: string }) {
  const [open, setOpen] = useState(false);
  return <header className="site-header">
    <a className="wordmark" href="#top" aria-label="Horology home"><span className="mark">H</span><span>HOROLOGY<small>THE WATCH MUSEUM</small></span></a>
    <button className="mobile-menu" onClick={() => setOpen(!open)} aria-label="Toggle navigation">{open ? <X /> : <Menu />}</button>
    <nav className={open ? 'nav-links open' : 'nav-links'} onClick={() => setOpen(false)}>
      <a className={activeSection === "collection" ? "active" : ""} href="#collection">THE COLLECTION</a><a className={activeSection === "anatomy" ? "active" : ""} href="#anatomy">CRAFTSMANSHIP</a><a className={activeSection === "timeline" ? "active" : ""} href="#timeline">OUR STORY</a>
      <a className={`nav-visit ${activeSection === "about" ? "active" : ""}`} href="#about">ABOUT HOROLOGY</a>
    </nav>
  </header>;
}

function App() {
  const [active, setActive] = useState(0);
  const [activeSection, setActiveSection] = useState('top');
  const [selectedExhibit, setSelectedExhibit] = useState<(typeof exhibits)[number] | null>(null);
  useEffect(() => {
    const reveal = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('is-visible');
    }), { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach(el => reveal.observe(el));
    const sections = ['top', 'anatomy', 'collection', 'timeline', 'about'].map(id => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const navObserver = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) {
        const id = visible.target.id || 'top';
        setActiveSection(id);
        if (id !== 'top' && window.location.hash !== `#${id}`) history.replaceState(null, '', `#${id}`);
        if (id === 'top' && window.location.hash) history.replaceState(null, '', window.location.pathname + window.location.search);
      }
    }, { rootMargin: '-22% 0px -58% 0px', threshold: [0, 0.15, 0.35, 0.6] });
    sections.forEach(section => navObserver.observe(section));
    return () => { reveal.disconnect(); navObserver.disconnect(); };
  }, []);
  return <div>
    <Header activeSection={activeSection} />
    <main>
      <section id="top" className="hero">
        <div className="hero-copy">
          <p className="eyebrow"><span className="eyebrow-line" /> A CURATED STUDY OF TIMEPIECES · EST. 2026</p>
          <h1>THE ART OF<br /><em>TIMEKEEPING.</em></h1>
          <p className="hero-desc">A closer look at the objects that turn precision into an art form. Explore the history, design, and mechanics behind iconic watches.</p>
          <div className="hero-actions"><a className="button button-light" href="#collection">DISCOVER THE COLLECTION <ArrowRight size={16} /></a><a className="text-link" href="#anatomy">THE ART OF WATCHMAKING <ArrowDown size={15} /></a></div>
          <div className="hero-meta"><div><strong>Centuries</strong><span>OF MECHANICAL INGENUITY</span></div><div><strong>Three</strong><span>ORIGINAL WATCH ARCHETYPES</span></div></div>
        </div>
        <div className="hero-stage">
          <div className="stage-orbit orbit-one" /><div className="stage-orbit orbit-two" />
          <div className="stage-index"><span>FIG. 001</span><span>MECHANICAL STUDY</span></div>
          <WatchModel />
          <div className="stage-caption"><span>01 — THE INSTRUMENT</span><span>STAINLESS STEEL / AUTOMATIC</span></div>
        </div>
      </section>

      <section id="intro" className="intro section-pad reveal">
        <p className="eyebrow">BEYOND THE DIAL</p>
        <div className="intro-grid"><h2>Made to be<br /><em>remembered.</em></h2><div><p className="body-copy">A fine watch is a meeting point of engineering, material, and human ambition. Every surface has a purpose. Every movement is a small world of coordinated parts.</p><p className="body-copy muted">This independent digital museum is an educational study—not a store and not affiliated with, endorsed by, or sponsored by any watch brand.</p><a href="#anatomy" className="inline-link">LOOK INSIDE THE WATCH <ArrowRight size={15} /></a></div></div>
      </section>

      <section id="anatomy" className="anatomy section-pad">
        <div className="anatomy-head reveal"><div><p className="eyebrow">A STUDY IN COMPONENTS</p><h2>Every part has<br />a <em>purpose.</em></h2></div><p className="body-copy muted">Scroll through the section and watch the layers separate. Drag the model to inspect it from another angle.</p></div>
        <div className="anatomy-grid"><div className="component-list">
          {[['01','THE BEZEL','Frames the dial and can serve as a timing scale.'],['02','THE CRYSTAL','A transparent barrier protecting the dial.'],['03','THE DIAL & HANDS','The display layer: designed for fast, clear reading.'],['04','THE CASE','The protective shell that houses the mechanism.']].map((part, i) => <button key={part[0]} onClick={() => setActive(i)} className={active === i ? 'component-row selected' : 'component-row'}><span>{part[0]}</span><span><strong>{part[1]}</strong><small>{part[2]}</small></span><ArrowUpRight size={16} /></button>)}
        </div><div className="anatomy-model"><div className="anatomy-model-frame"><WatchModel activePart={(["bezel", "crystal", "dial", "case"] as const)[active]} showHint={false} /></div><p className="anatomy-model-caption">SCROLL TO SEPARATE LAYERS · DRAG TO INSPECT</p></div><div className="anatomy-note"><span className="note-index">FIELD NOTE / 0{active + 1}</span><h3>{['A measured edge.','Clarity under pressure.','The face of precision.','Protection by design.'][active]}</h3><p>{['The bezel creates a strong visual frame and, on many tool watches, helps track elapsed time.','A watch crystal must balance transparency with resistance to everyday impact and abrasion.','Dial layout, contrast, indices, and hand geometry work together to make time readable at a glance.','The case protects delicate components from dust, moisture, and physical contact while defining the watch silhouette.'][active]}</p><div className="note-rule" /><span className="note-foot">INTERACTIVE MODEL · CONCEPTUAL STUDY</span></div></div>
      </section>

      <section id="collection" className="collection section-pad">
        <div className="section-heading reveal"><div><p className="eyebrow">THE CURATED COLLECTION</p><h2>Icons of <em>time.</em></h2></div><span className="section-count">01—03 / SELECTED PIECES</span></div>
        <div className="exhibit-grid">{exhibits.map(item => <button type="button" className={`exhibit-card reveal exhibit-${item.number}`} key={item.number} onClick={() => setSelectedExhibit(item)} aria-label={`View ${item.name} details`}><div className="exhibit-art"><div className="art-ring" /><div className={`art-watch art-watch-${item.number}`}><div className="art-dial"><span className="art-hand hand-a" /><span className="art-hand hand-b" /><span className="art-pin" />{item.number === "02" && <><span className="subdial subdial-a" /><span className="subdial subdial-b" /><span className="subdial subdial-c" /></>}{item.number === "03" && <span className="gmt-hand" />}</div></div><span className="art-feature">{item.category}</span></div><div className="exhibit-info"><div className="exhibit-kicker"><span>EXHIBIT {item.number}</span><span>{item.year}</span></div><h3>{item.name}</h3><p>{item.copy}</p><span className="inline-link">VIEW EXHIBIT <ArrowRight size={15} /></span></div></button>)}</div>
      </section>

      <section id="timeline" className="timeline section-pad">
        <div className="timeline-intro reveal"><p className="eyebrow">A BRIEF HISTORY</p><h2>Built around<br /><em>human progress.</em></h2><p className="body-copy muted">A timeline of changing needs, new ideas, and the relentless pursuit of more reliable timekeeping.</p></div>
        <div className="timeline-items"><div className="timeline-item reveal"><span>1500s</span><div><h3>Time becomes portable</h3><p>Spring-driven clocks make it possible to carry timekeeping mechanisms beyond the wall.</p></div></div><div className="timeline-item reveal"><span>1800s</span><div><h3>Precision, refined</h3><p>Advances in manufacturing and escapement design improve consistency and everyday reliability.</p></div></div><div className="timeline-item reveal"><span>1900s</span><div><h3>Purpose-built instruments</h3><p>Wristwatches evolve for diving, aviation, travel, sport, and daily life.</p></div></div><div className="timeline-item reveal"><span>TODAY</span><div><h3>Mechanics meets culture</h3><p>Mechanical watches remain enduring objects of craft, engineering, identity, and design.</p></div></div></div>
      </section>

      <section id="about" className="closing section-pad"><p className="eyebrow">THE ART OF KEEPING TIME</p><h2>Look closer.<br /><em>Time rewards it.</em></h2><a className="button button-light" href="#collection">EXPLORE THE COLLECTION <ArrowRight size={16} /></a><div className="closing-orbit" /></section>
    </main>
    <footer className="footer"><div className="footer-inner"><a className="wordmark" href="#top"><span className="mark">H</span><span>HOROLOGY<small>THE WATCH MUSEUM</small></span></a><p>Independent educational project. No affiliation with or endorsement by any watch brand. All archetypes and illustrations are original.</p><span>DESIGNED TO EXPLORE TIME.</span></div></footer>
    {selectedExhibit && <div className="modal-backdrop" onClick={() => setSelectedExhibit(null)}><section className="exhibit-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" onClick={event => event.stopPropagation()}><button className="modal-close" onClick={() => setSelectedExhibit(null)} aria-label="Close exhibit details"><X /></button><p className="eyebrow">EXHIBIT {selectedExhibit.number} · {selectedExhibit.year}</p><h2 id="modal-title">{selectedExhibit.name}</h2><p className="modal-feature">{selectedExhibit.category}</p><p>{selectedExhibit.detail}</p><p className="modal-disclaimer">An original educational archetype. Not a replica of or an endorsement by a specific manufacturer.</p><a className="inline-link" href="#anatomy" onClick={() => setSelectedExhibit(null)}>EXPLORE WATCH COMPONENTS <ArrowRight size={15} /></a></section></div>}
  </div>;
}

export default App;