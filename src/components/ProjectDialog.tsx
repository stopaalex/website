import { useEffect, useRef } from 'react';
import content from '../../content/site.json';
type Project = typeof content.projects[number];
export default function ProjectDialog({ project, close }: { project: Project | null; close: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => { if (project) { ref.current?.showModal(); document.body.style.overflow = 'hidden'; } return () => { document.body.style.overflow = ''; }; }, [project]);
  return <dialog ref={ref} onClose={close} onClick={e => { if(e.target === e.currentTarget) ref.current?.close(); }} aria-labelledby="project-title">
    {project && <article className="case-study"><button className="close-dialog" onClick={() => ref.current?.close()} aria-label={content.workHeading.close}>✕</button><img src={project.image} alt={project.imageAlt} width="1440" height="810"/><div className="case-body"><p className="eyebrow">{project.category}</p><h2 id="project-title">{project.title}</h2><p className="case-summary">{project.summary}</p>{[['roleLabel','role'],['challengeLabel','challenge'],['approachLabel','approach'],['outcomeLabel','outcome']].map(([label,key])=><section key={key}><h3 className="eyebrow">{content.workHeading[label as keyof typeof content.workHeading]}</h3><p>{project[key as 'role'|'challenge'|'approach'|'outcome']}</p></section>)}<a className="text-link" href={project.source} target="_blank" rel="noreferrer">{content.workHeading.sourceLabel} ↗</a></div></article>}
  </dialog>;
}
