import { useEffect, useState } from 'react';
import { ArrowDown, ArrowRight, ArrowUpRight, Clock3, Compass, Menu, X } from 'lucide-react';
import WatchModel from './components/WatchModel';

const exhibits = [
  { number: '01', name: 'Submariner', year: '1953', category: 'THE DIVER', copy: 'A tool watch made for the underwater world, built around legibility, water resistance, and confident simplicity.' },
  { number: '02', name: 'Cosmograph Daytona', year: '1963', category: 'THE RACER', copy: 'Born from the world of motorsport, a chronograph designed to measure elapsed time at speed.' },
  { number: '03', name: 'GMT-Master', year: '1955', category: 'THE TRAVELER', copy: 'A second time zone turns a wristwatch into a companion for crossing borders and keeping connected.' },
];

function Header() {
  const [open, setOpen] = useState(false);
  return <header className="site-header">
    <a className="wordmark" href="#top" aria-label="Horology home"><span className="mark">H</span><span>HOROLOGY<small>THE WATCH MUSEUM</small></span></a>
    <button className="mobile-menu" onClick={() => setOpen(!open)} aria-label="Toggle navigation">{open ? <X /> : <Menu />}</button>
    <nav className={open ? 'nav-links open' : 'nav-links'} onClick={() => setOpen(false)}>
      <a href="#collection">COLLECTION</a><a href="#anatomy">ANATOMY</a><a href="#timeline">HISTORY</a>
      <a className="nav-visit" href="#about">ABOUT THE PROJECT <ArrowUpRight size={14} /></a>
    </nav>
  </header>;
}

function App() {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const reveal = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('is-visible');
    }), { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach(el => reveal.observe(el));
    return () => reveal.disconnect();
  }, []);
  return <div id="top">
    <Header />
    <main>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow"><span className="eyebrow-line" /> AN INDEPENDENT HOROLOGY EXPERIENCE · 001</p>
          <h1>TIME IS<br /><em>ENGINEERED.</em></h1>
          <p className="hero-desc">A closer look at the objects that turn precision into an art form. Explore the history, design, and mechanics behind iconic watches.</p>
          <div className="hero-actions"><a className="button button-light" href="#collection">EXPLORE THE COLLECTION <ArrowRight size={16} /></a><a className="text-link" href="#anatomy">DISCOVER THE MECHANICS <ArrowDown size={15} /></a></div>
          <div className="hero-meta"><div><strong>100+</strong><span>YEARS OF INNOVATION</span></div><div><strong>01 / 03</strong><span>FEATURED EXHIBITS</span></div></div>
        </div>
        <div className="hero-stage">
          <div className="stage-orbit orbit-one" /><div className="stage-orbit orbit-two" />
          <div className="stage-index"><span>FIG. 001</span><span>MECHANICAL STUDY</span></div>
          <WatchModel />
          <div className="stage-caption"><span>01 — THE INSTRUMENT</span><span>STAINLESS STEEL / AUTOMATIC</span></div>
        </div>
        <a className="scroll-cue" href="#intro"><span>SCROLL TO BEGIN</span><ArrowDown size={15} /></a>
      </section>

      <section id="intro" className="intro section-pad reveal">
        <p className="eyebrow">BEYOND THE DIAL</p>
        <div className="intro-grid"><h2>More than a way<br />to tell <em>time.</em></h2><div><p className="body-copy">A fine watch is a meeting point of engineering, material, and human ambition. Every surface has a purpose. Every movement is a small world of coordinated parts.</p><p className="body-copy muted">This independent digital museum is a study in watchmaking—not a store, and not an official brand website.</p><a href="#anatomy" className="inline-link">LOOK INSIDE THE WATCH <ArrowRight size={15} /></a></div></div>
      </section>

      <section id="anatomy" className="anatomy section-pad">
        <div className="anatomy-head reveal"><div><p className="eyebrow">A STUDY IN COMPONENTS</p><h2>Every part has<br />a <em>purpose.</em></h2></div><p className="body-copy muted">Scroll through the section and watch the layers separate. Drag the model to inspect it from another angle.</p></div>
        <div className="anatomy-grid"><div className="component-list">
          {[['01','THE BEZEL','Frames the dial and can serve as a timing scale.'],['02','THE CRYSTAL','A transparent barrier protecting the dial.'],['03','THE DIAL & HANDS','The display layer: designed for fast, clear reading.'],['04','THE CASE','The protective shell that houses the mechanism.']].map((part, i) => <button key={part[0]} onClick={() => setActive(i)} className={active === i ? 'component-row selected' : 'component-row'}><span>{part[0]}</span><span><strong>{part[1]}</strong><small>{part[2]}</small></span><ArrowUpRight size={16} /></button>)}
        </div><div className="anatomy-note"><span className="note-index">FIELD NOTE / 0{active + 1}</span><h3>{['A measured edge.','Clarity under pressure.','The face of precision.','Protection by design.'][active]}</h3><p>{['The bezel creates a strong visual frame and, on many tool watches, helps track elapsed time.','A watch crystal must balance transparency with resistance to everyday impact and abrasion.','Dial layout, contrast, indices, and hand geometry work together to make time readable at a glance.','The case protects delicate components from dust, moisture, and physical contact while defining the watch silhouette.'][active]}</p><div className="note-rule" /><span className="note-foot">INTERACTIVE MODEL · CONCEPTUAL STUDY</span></div></div>
      </section>

      <section id="collection" className="collection section-pad">
        <div className="section-heading reveal"><div><p className="eyebrow">THE EXHIBITION</p><h2>Icons of <em>purpose.</em></h2></div><span className="section-count">01—03 / SELECTED PIECES</span></div>
        <div className="exhibit-grid">{exhibits.map(item => <article className="exhibit-card reveal" key={item.number}><div className="exhibit-art"><div className="art-ring" /><div className="art-watch"><div className="art-dial"><span className="art-hand hand-a" /><span className="art-hand hand-b" /><span className="art-pin" /></div></div><span className="art-serial">H / {item.number}</span><span className="art-year">{item.year}</span></div><div className="exhibit-info"><div className="exhibit-kicker"><span>{item.number} / {item.category}</span><span>{item.year}</span></div><h3>{item.name}</h3><p>{item.copy}</p><a href="#timeline" className="inline-link">EXPLORE THE STORY <ArrowUpRight size={15} /></a></div></article>)}</div>
      </section>

      <section id="timeline" className="timeline section-pad">
        <div className="timeline-intro reveal"><p className="eyebrow">A BRIEF HISTORY</p><h2>Built around<br /><em>human progress.</em></h2><p className="body-copy muted">A timeline of changing needs, new ideas, and the relentless pursuit of more reliable timekeeping.</p></div>
        <div className="timeline-items"><div className="timeline-item reveal"><span>1905</span><div><h3>A new beginning</h3><p>Hans Wilsdorf establishes a watch business in London, focused on portable precision timekeeping.</p></div><Clock3 /></div><div className="timeline-item reveal"><span>1926</span><div><h3>Designed for the elements</h3><p>The Oyster case introduces an influential approach to protecting a wristwatch from dust and water.</p></div><Compass /></div><div className="timeline-item reveal"><span>1950s–60s</span><div><h3>Tools for a changing world</h3><p>Divers, pilots, explorers, and racers inspire purpose-built watch designs for specialized needs.</p></div><Clock3 /></div><div className="timeline-item reveal"><span>TODAY</span><div><h3>Mechanics meets culture</h3><p>Mechanical watches remain enduring objects of craft, engineering, identity, and design.</p></div><Compass /></div></div>
      </section>

      <section id="about" className="closing section-pad"><p className="eyebrow">THE ART OF KEEPING TIME</p><h2>Look closer.<br /><em>Time rewards it.</em></h2><a className="button button-light" href="#top">RETURN TO THE EXHIBIT <ArrowUpRight size={16} /></a><div className="closing-orbit" /></section>
    </main>
    <footer className="footer"><a className="wordmark" href="#top"><span className="mark">H</span><span>HOROLOGY<small>THE WATCH MUSEUM</small></span></a><p>An independent educational project. Not affiliated with Rolex SA.</p><span>DESIGNED TO EXPLORE TIME.</span></footer>
  </div>;
}

export default App;