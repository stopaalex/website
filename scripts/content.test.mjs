import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,access} from 'node:fs/promises';
const root=new URL('../',import.meta.url),data=JSON.parse(await readFile(new URL('content/site.json',root),'utf8'));
test('all project and resume assets exist',async()=>{for(const path of [data.profile.resume,...data.projects.flatMap(p=>[p.image,p.previewImage])])await access(new URL('public'+path,root))});
test('project IDs are unique and colors are valid',()=>{assert.equal(new Set(data.projects.map(p=>p.id)).size,data.projects.length);Object.values(data.theme).forEach(c=>assert.match(c,/^#[a-f0-9]{6}$/i))});

