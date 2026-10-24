"""Copy lesson resources and discover future lessons. Never modifies the lessons."""
import json
import re
import shutil
from pathlib import Path

APP = Path(__file__).resolve().parents[1]
ROOT = APP.parent
DIST = APP / 'dist'
mapping_path = APP / 'chapter-map.json'
mapping = json.loads(mapping_path.read_text())
resources = []
folders = sorted(p for p in ROOT.iterdir() if p.is_dir() and re.match(r'^(Lesson|Chapter)_', p.name))
if not folders:
    raise SystemExit('No Lesson_* or Chapter_* folders found beside dsa-lab; existing bundled resources were preserved.')
for folder in folders:
    if not folder.is_dir():
        continue
    entry = {'folder': folder.name, 'chapter': mapping.get(folder.name), 'images': [], 'notes': [], 'java': []}
    for source in sorted(folder.rglob('*')):
        if not source.is_file() or source.suffix.lower() not in {'.png', '.jpg', '.jpeg', '.webp', '.gif', '.md', '.java'}:
            continue
        relative = source.relative_to(ROOT)
        dest = DIST / 'assets' / relative
        dest.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(source, dest)
        record = {'path': 'assets/' + relative.as_posix(), 'name': source.relative_to(folder).as_posix()}
        kind = 'notes' if source.suffix == '.md' else 'java' if source.suffix == '.java' else 'images'
        entry[kind].append(record)
    if entry['chapter'] is None:
        notes = '\n'.join((folder / r['name']).read_text(errors='replace')[:4000] for r in entry['notes'])
        match = re.search(r'book\s+chapter\s*[:#-]?\s*(\d+)', notes, re.I) or re.match(r'Chapter_(\d+)', folder.name, re.I)
        if match and 1 <= int(match[1]) <= 20:
            entry['chapter'] = int(match[1])
    resources.append(entry)
DIST.mkdir(exist_ok=True)
(DIST / 'lesson-assets.json').write_text(json.dumps(resources, indent=2))
print(f'Synced {len(resources)} lessons: {sum(len(r["images"]) for r in resources)} images, '
      f'{sum(len(r["java"]) for r in resources)} Java files, {sum(len(r["notes"]) for r in resources)} notes.')
