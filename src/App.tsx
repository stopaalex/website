import WorkShowcase from './components/WorkShowcase';
import Hero from './components/Hero';
import { lazy, Suspense, useEffect, useState, type CSSProperties } from 'react';
import content from '../content/site.json';
const ProjectDialog = lazy(() => import('./components/ProjectDialog'));
const Arrow = () => <span aria-hidden="true">↗</span>;
export default function App() {
  const [project, setProject] = useState<typeof content.projects[number] | null>(null);
  const [translated, setTranslated] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const {profile,approach,about,experiment,contact} = content;
  useEffect(() => { const observer = new IntersectionObserver(entries => entries.forEach(entry => {if(entry.isIntersecting) {entry.target.classList.add('visible'); observer.unobserve(entry.target);}}), {threshold: .08}); document.querySelectorAll('.reveal').forEach(el => observer.observe(el)); return () => observer.disconnect(); }, []);
  const theme = Object.fromEntries(Object.entries(content.theme).map(([key,value])=>[`--${key}`,value])) as CSSProperties;
  return <div style={theme} id="top"><a href="#main" className="skip-link">Skip to content</a>
    <header className="site-header"><a className="wordmark" href="#top" aria-label={`${profile.name} home`}>alex stopa<span>®</span></a><button className="menu-toggle" aria-expanded={menuOpen} aria-controls="navigation" onClick={()=>setMenuOpen(!menuOpen)}>{menuOpen?'Close':'Menu'}</button><nav id="navigation" className={menuOpen?'open':''} aria-label="Main navigation">{(['work','approach','about'] as const).map(key=><a key={key} href={`#${key}`} onClick={()=>setMenuOpen(false)}>{content.navigation[key]}</a>)}<a href="#contact" className="nav-contact" onClick={()=>setMenuOpen(false)}>{content.navigation.contact}<Arrow/></a></nav></header>
    <main id="main"><Hero />
    <div className="highlights section-pad">{content.highlights.map(item=><div key={item.value}><strong>{item.value}</strong><span>{item.label}</span></div>)}</div>
    <WorkShowcase open={setProject} />
    <section id="approach" className="approach section-pad"><div className="section-heading reveal"><p className="eyebrow">{approach.eyebrow}</p><div><h2 className="preserve-lines">{approach.title}</h2><p>{approach.intro}</p></div></div><div className="translation reveal"><div className="translation-top"><span className="eyebrow">{translated?approach.humanLabel:approach.technicalLabel}</span><button className="translate-toggle" role="switch" aria-checked={translated} onClick={()=>setTranslated(!translated)}><span className="switch-track"><span/></span>{approach.toggleLabel}</button></div><p key={String(translated)}>{translated?approach.human:approach.technical}</p><span className="translation-foot">{translated?'Complexity, translated.':'The architecture behind the idea.'} <span aria-hidden="true">↔</span></span></div><div className="principles">{approach.items.map(item=><article key={item.number} className="reveal"><span className="eyebrow">/{item.number}</span><h3>{item.title}</h3><p>{item.body}</p></article>)}</div></section>
    <section id="about" className="about section-pad"><div className="about-intro reveal"><p className="eyebrow">{about.eyebrow}</p><h2>{about.title}</h2><p>{about.body}</p><p>{about.second}</p><a className="text-link" href={profile.resume} target="_blank" rel="noreferrer">{about.resumeLabel}<Arrow/></a><div className="skills">{about.skills.map(skill=><span key={skill}>{skill}</span>)}</div></div><div className="timeline">{about.history.map(item=><article className="reveal" key={item.company}><p className="eyebrow">{item.period}</p><h3>{item.company}</h3><h4>{item.role}</h4><p>{item.description}</p></article>)}</div></section>
    <aside className="experiment section-pad reveal"><div className="experiment-icon" aria-hidden="true">✳</div><div><p className="eyebrow">{experiment.eyebrow}</p><h2 className="preserve-lines">{experiment.title}</h2><p>{experiment.body}</p></div></aside>
    <section id="contact" className="contact section-pad"><p className="eyebrow">{contact.eyebrow}</p><a className="contact-title" href={`mailto:${profile.email}`}><h2 className="preserve-lines">{contact.title}</h2><span className="contact-arrow"><Arrow/></span></a><div className="contact-bottom"><a href={`mailto:${profile.email}`} className="text-link">{contact.cta} <Arrow/></a><div><a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a><a href={profile.github} target="_blank" rel="noreferrer">GitHub ↗</a><a href={profile.resume} target="_blank" rel="noreferrer">Resume ↗</a></div></div></section></main>
    <footer className="section-pad"><span>© {new Date().getFullYear()} {profile.name}</span><span>{contact.footer}</span><a href="#top">{contact.back} ↑</a></footer>{project && <Suspense fallback={<div className="loading-note" role="status">Opening project…</div>}><ProjectDialog project={project} close={()=>setProject(null)}/></Suspense>}</div>;
}



