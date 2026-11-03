import ProjectMedia from './ProjectMedia';
import {useEffect,useRef,useState} from 'react';
import content from '../../content/site.json';
type Project=typeof content.projects[number];
export default function WorkShowcase({open}:{open:(project:Project)=>void}){
 const [active,setActive]=useState(0);const steps=useRef<(HTMLDivElement|null)[]>([]);
 useEffect(()=>{const observer=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting)setActive(Number((entry.target as HTMLElement).dataset.index))},{rootMargin:'-40% 0px -40% 0px',threshold:0});steps.current.forEach(el=>el&&observer.observe(el));return()=>observer.disconnect()},[]);
 const project=content.projects[active];
 return <section id="work" className="cinematic-work"><div className="work-sticky"><div className="work-sticky-heading"><p className="eyebrow">{content.workHeading.eyebrow}</p><span className="eyebrow">SCROLL TO EXPLORE / 0{active+1}</span></div><div className="work-scene"><div className="work-story" aria-live="polite"><span className="eyebrow">{project.category}</span><h2 key={project.id}>{project.title}</h2><p>{project.summary}</p><div className="tags">{project.tags.map(tag=><span key={tag}>{tag}</span>)}</div><button onClick={()=>open(project)} className="text-link">{content.workHeading.open}<span>↗</span></button><a className="live-site-link" href={project.liveUrl} target="_blank" rel="noreferrer">{content.workHeading.liveLabel} ↗</a><div className="work-pagination" role="group" aria-label="Choose a project">{content.projects.map((p,index)=><button aria-label={`Show ${p.title}`} aria-pressed={index===active} key={p.id} onClick={()=>{setActive(index);steps.current[index]?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'center'})}}><span>0{index+1}</span><i/></button>)}</div></div><div className="work-screens"><ProjectMedia key={project.id} project={project} open={()=>open(project)} /></div></div><div className="work-scene-footer"><span className="eyebrow">BUILT WITH THE SLYTRUNK TEAM</span><span className="eyebrow">REAL PRODUCTS. REAL PEOPLE. REAL CRAFT.</span></div></div><div className="work-scroll-steps" aria-hidden="true">{content.projects.map((p,index)=><div key={p.id} data-index={index} ref={el=>{steps.current[index]=el}}/>)}</div></section>
}


