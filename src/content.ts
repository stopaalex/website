import source from '../content/site.json';

// Keep authored asset paths portable between localhost, Pages, and custom domains.
const content = structuredClone(source);
const asset = (path: string) => import.meta.env.BASE_URL + path.replace(/^\//, '');
content.profile.resume = asset(content.profile.resume);
for (const project of content.projects) {
  project.image = asset(project.image);
  project.previewImage = asset(project.previewImage);
  for (const media of project.media) media.image = asset(media.image);
}
export default content;
