import {useEffect,useRef} from 'react';
import content from '../content';
export default function Hero(){
 const ref=useRef<HTMLElement>(null);
 useEffect(()=>{
  const element=ref.current!,query=matchMedia('(prefers-reduced-motion: reduce)');
  let frame=0,rect=element.getBoundingClientRect(),x=rect.width*.73,y=rect.height*.45,targetX=x,targetY=y;
  const paint=()=>{frame=0;x+=(targetX-x)*.12;y+=(targetY-y)*.12;element.style.setProperty('--pointer-x',`${x}px`);element.style.setProperty('--pointer-y',`${y}px`);element.style.setProperty('--mx',`${(x/rect.width-.5)*28}px`);element.style.setProperty('--my',`${(y/rect.height-.5)*22}px`);if(Math.abs(targetX-x)+Math.abs(targetY-y)>.15)frame=requestAnimationFrame(paint)};
  const schedule=()=>{if(!frame)frame=requestAnimationFrame(paint)};
  const enter=()=>{rect=element.getBoundingClientRect()};
  const move=(event:PointerEvent)=>{if(query.matches||event.pointerType==='touch')return;targetX=event.clientX-rect.left;targetY=event.clientY-rect.top;targetX=Math.max(0,Math.min(rect.width,targetX));targetY=Math.max(0,Math.min(rect.height,targetY));schedule()};
  const reset=()=>{targetX=rect.width*.73;targetY=rect.height*.45;if(!query.matches)schedule()};
  const observer=new IntersectionObserver(([entry])=>{element.classList.toggle('hero-in-view',entry.isIntersecting);if(!entry.isIntersecting){cancelAnimationFrame(frame);frame=0}});observer.observe(element);
  const resize=new ResizeObserver(()=>{rect=element.getBoundingClientRect();reset()});resize.observe(element);
  element.addEventListener('pointerenter',enter);element.addEventListener('pointermove',move);element.addEventListener('pointerleave',reset);
  return()=>{cancelAnimationFrame(frame);observer.disconnect();resize.disconnect();element.removeEventListener('pointerenter',enter);element.removeEventListener('pointermove',move);element.removeEventListener('pointerleave',reset)};
 },[]);
 return <section ref={ref} className="immersive-hero identity-hero hero-in-view" aria-labelledby="hero-title"><div className="hero-noise" aria-hidden="true"/><div className="hero-pointer-light" aria-hidden="true"/><div className="hero-reveal-grid" aria-hidden="true"/><div className="hero-constellation" aria-hidden="true"><i/><i/><i/><i/><i/><i/></div><div className="hero-orbital-text" aria-hidden="true">ENGINEERING / HUMAN UNDERSTANDING / ENGINEERING / HUMAN UNDERSTANDING /</div><div className="identity-field" aria-hidden="true"><span className="identity-layer layer-back">AS</span><span className="identity-layer layer-middle">AS</span><span className="identity-layer layer-front">AS</span><span className="identity-axis axis-horizontal"/><span className="identity-axis axis-vertical"/></div><div className="immersive-top"><p className="eyebrow"><span className="live-dot"/>{content.profile.role}</p><p className="eyebrow">{content.profile.location}</p></div><div className="immersive-copy"><p className="hero-overline">{content.profile.name}</p><h1 id="hero-title"><span>{content.hero.headline[0]}</span><br/><span>{content.hero.headline[1]} <em>{content.hero.headline[2]}</em></span></h1><p className="immersive-intro">{content.hero.intro}</p></div><div className="immersive-bottom"><a href="#work" className="hero-scroll"><span className="scroll-track"><span/></span><span>{content.hero.scrollLabel}<small>{content.hero.scrollDetail}</small></span><span className="scroll-arrow" aria-hidden="true">↓</span></a></div></section>
}






