from pathlib import Path
import re
import sys

root = Path(__file__).resolve().parents[1]
required = [
    'README.md', 'CONTRIBUTING.md', 'GOVERNANCE.md', 'CODE_OF_CONDUCT.md',
    'SECURITY.md', 'LICENSE', 'NOTICE.md', 'docs/README.md',
    'docs/product/PRODUCT-REQUIREMENTS.md',
    'docs/product/EXPORT-FORMATS.md',
    'docs/product/USER-DOCUMENTATION-PLAN.md',
    'docs/architecture/ARCHITECTURE.md',
    'docs/architecture/INTERACTIVE-PREVIEW-PLAYER-ENGINE.md',
    'docs/architecture/RENDERER-AND-EXPORTER.md',
    'docs/developer/IMPLEMENTATION-PLAN.md',
    'docs/developer/PLAYER-ENGINE-IMPLEMENTATION-PLAN.md',
    'docs/developer/RENDERER-EXPORTER-IMPLEMENTATION-PLAN.md',
    'docs/developer/CONFORMANCE-AND-SELF-TESTING.md',
    'docs/inventory/FULL-CAPABILITY-INVENTORY.md',
    'docs/inventory/ARCHIVE-COVERAGE-MATRIX.md',
    'docs/inventory/SUPPORTING-ARTIFACT-MANIFEST.md',
    'docs/operations/SELF-HOSTING.md',
    'docs/governance/ROADMAP.md',
    '.github/ISSUE_TEMPLATE/feature_request.md',
    '.github/ISSUE_TEMPLATE/bug_report.md',
    '.github/PULL_REQUEST_TEMPLATE.md',
    'tasks/plan.md',
    'tasks/todo.md',
]
missing = [path for path in required if not (root / path).is_file()]
if missing:
    print('Missing required files:')
    print('\n'.join(missing))
    sys.exit(1)

link_pattern = re.compile(r'\[[^\]]*\]\(([^)]+)\)')
broken = []
for markdown in root.rglob('*.md'):
    relative_parts = markdown.relative_to(root).parts
    if any(part in {'.git', 'node_modules', 'dist', 'coverage'} for part in relative_parts):
        continue
    text = markdown.read_text(encoding='utf-8')
    for target in link_pattern.findall(text):
        target = target.strip()
        if target.startswith(('http://', 'https://', 'mailto:', '#')):
            continue
        target = target.split('#', 1)[0].strip('<>')
        if not target:
            continue
        destination = (markdown.parent / target).resolve()
        if not destination.is_file():
            broken.append(f'{markdown.relative_to(root)} -> {target}')
if broken:
    print('Broken relative Markdown links:')
    print('\n'.join(broken))
    sys.exit(1)

requirements = re.findall(
    r'\bMFX-[A-Z]+-\d{3}\b',
    (root / 'docs/product/PRODUCT-REQUIREMENTS.md').read_text(encoding='utf-8'),
)
if len(requirements) < 20:
    print(f'Expected at least 20 requirements; found {len(requirements)}')
    sys.exit(1)

inventory = (root / 'docs/inventory/FULL-CAPABILITY-INVENTORY.md').read_text(encoding='utf-8')
required_inventory_sections = [
    '## 2. Project lifecycle and editor environment',
    '## 3. Reuse, style, annotation, and project knowledge',
    '## 4. Interaction, state, dynamic behavior, and responsive design',
    '## 5. Preview, player, publishing, static output, and exports',
    '## 6. Artboard projects and external design import',
    '## 7. Sharing, workspaces, comments, and notifications',
    '## 8. Design inspection and developer handoff',
    '## 9. Identity, administration, and governance',
    '## 10. Self-hosting, operations, and release engineering',
]
missing_sections = [section for section in required_inventory_sections if section not in inventory]
if missing_sections:
    print('Missing inventory sections:')
    print('\n'.join(missing_sections))
    sys.exit(1)

print(
    f'Validation passed: {len(required)} required files, {len(requirements)} requirement references, '
    f'{len(required_inventory_sections)} inventory sections, no broken relative Markdown links.'
)
