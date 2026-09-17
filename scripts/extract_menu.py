"""
Builds data/menu.json from the owner's master pricing workbook.
Only the customer-facing "Daddu's Biryani Table Rates" columns (G/H/I of Sheet6)
are read. Aggregator rates, commission maths and every other sheet are ignored,
so nothing internal can leak onto the website.

Usage:  python scripts/extract_menu.py path/to/Menu.xlsx
"""
import json, math, re, sys, openpyxl

SRC = sys.argv[1]
ws = openpyxl.load_workbook(SRC)['Sheet6']

def clean_name(s):
    s = s.replace('Hydrabadi', 'Hyderabadi').replace('Lakhnavi', 'Lucknowi')
    s = s.replace('Biryanii', 'Biryani').replace('Lollypop', 'Lollipop').replace('Kolkatai', 'Kolkata')
    s = s.replace('Smal)l', 'Small').replace('Kabab', 'Kebab')
    s = re.sub(r'\s*-\s*', ' – ', s) if ' - ' in s or '-' in s else s
    s = re.sub(r'\s{2,}', ' ', s).strip()
    return s

rows = {}
for r in range(5, ws.max_row + 1):
    v = [ws.cell(r, c).value for c in range(2, 10)]  # B..I
    if v[4] is None:
        continue
    rows[r] = v

def num(val, r):
    """Resolve a table-rate cell: numbers, '--', or the few simple formulas in the sheet."""
    if val is None or val == '--':
        return None
    if isinstance(val, (int, float)):
        return int(val)
    f = str(val)
    m = re.fullmatch(r'=CEILING\(H(\d+)\*([\d.]+),(\d+)\)', f)
    if m:
        base = num(ws.cell(int(m.group(1)), 8).value, int(m.group(1)))
        step = int(m.group(3))
        return int(math.ceil(base * float(m.group(2)) / step) * step)
    m = re.fullmatch(r'=H(\d+)\*(\d+)', f)
    if m:
        return num(ws.cell(int(m.group(1)), 8).value, int(m.group(1))) * int(m.group(2))
    m = re.fullmatch(r'=([\d+]+)', f)
    if m:
        return sum(int(x) for x in m.group(1).split('+'))
    raise ValueError(f'Unhandled formula {f} at row {r}')

def slug(s):
    return re.sub(r'[^a-z0-9]+', '-', s.lower()).strip('-')

IMAGES = {
    'Chicken Dum Biryani – Lucknowi (Drum Stick)': 'chicken-lucknowi-biryani',
    'Chicken Dum Biryani – Hyderabadi (Drum Stick)': 'chicken-hyderabadi-biryani',
    'Chicken Dum Biryani – Kolkata (Drum Stick)': 'kolkata-biryani',
    'Chicken Dum Mumbai Twist Biryani (Curry Cut)': 'mumbai-twist-biryani',
    'Mutton Yakhni Pulao': 'mutton-yakhni-pulao',
    'Egg Biryani (Hyderabadi)': 'egg-biryani',
    'Veg Dum Biryani – Hyderabadi': 'veg-hyderabadi-biryani',
    'Veg Dum Biryani – Lucknowi': 'veg-lucknowi-biryani',
    'Soyabean Dum Biryani': 'soya-chunks-biryani',
    'Shami Kebab (Chicken)': 'chicken-shami-kebab',
    'Seekh Kebab (Chicken)': 'chicken-seekh-kebab',
}

items, per_kg = [], {}
for r, (typ, chan, l2, grp, name, g, h, i) in rows.items():
    if chan == 'Bulk':
        base = clean_name(name)
        per_kg[base] = num(i, r)

for r, (typ, chan, l2, grp, name, g, h, i) in rows.items():
    veg = typ == 'Veg'
    raw = str(name)
    small, large = num(g, r), num(h, r)
    note = None
    if typ == 'Beverages':
        section = 'beverages'
    elif chan == 'Bulk':
        section = 'bulk'
    elif l2 == 'Biryanis' and 'Tawa' not in grp and 'Anda' not in raw:
        section = 'biryani'
    elif l2 in ('Biryanis', 'Tawa Pulao'):
        section = 'tawa'
    else:
        section = {'Starters': 'starters', 'Rolls': 'rolls', 'Combos': 'combos'}[l2]

    display = raw
    desc = None
    serves = None
    if section == 'combos':
        lines = [x.strip() for x in raw.split('\n') if x.strip()]
        serves = re.search(r'Sufficient for ([^)]+)', str(grp)).group(1)
        size = 'Large' if str(grp).split('\n')[0].strip().endswith('-L') else 'Small'
        biryanis = [clean_name(x) for x in lines if 'Biryani' in x]
        styles = []
        for b in biryanis:
            m = re.search(r'(Lucknowi|Hyderabadi|Kolkata|Mumbai Twist|Mumbai|Yakhni|Awadhi|Soyabean)', b)
            styles.append(m.group(1) if m else 'Soyabean')
        kind = 'Paneer' if 'Paneer' in raw else ('Mutton' if 'Mutton' in raw else ('Chicken' if 'Chicken' in raw else 'Veg'))
        display = f"{kind} {' + '.join(dict.fromkeys(styles))} Combo ({size})"
        desc = [clean_name(x) for x in lines]
        large = None
    else:
        # Kebab rows list "6 pc (L) / 3 pc (S)" with the large price first
        m = re.search(r'(\d+) pc \(L\) / (\d+) pc \(S\)', raw)
        if m:
            note = f"Small {m.group(2)} pc · Large {m.group(1)} pc"
            small, large = large, small
            display = raw[:m.start()]
        elif section == 'starters' and small and large and small > large:
            small, large = large, small
            display = re.sub(r'\s*\d+\s*pc\.?', '', raw).replace('()', '')
        display = clean_name(display)
        pm = re.search(r'\((Desi Ghee Preparation[^)]*|Made with 200 g Paneer)\)', display)
        if pm:
            note = pm.group(1).replace('Boiled Egg', 'boiled egg').replace('Aalu', 'aloo')
            display = display.replace(f'({pm.group(1)})', '').strip()
        display = re.sub(r'\s{2,}', ' ', display).strip()

    item = {
        'id': slug(display) + ('-bulk' if section == 'bulk' else ''),
        'name': display, 'section': section, 'group': clean_name(str(grp)) if section != 'combos' else ('Veg' if veg else 'Non-veg'),
        'veg': veg if typ != 'Beverages' else True,
        'prices': {k: v for k, v in (('small', small if section != 'bulk' else None), ('large', large if section != 'bulk' else None), ('perKg', num(i, r) if section == 'bulk' else None)) if v},
    }
    if note: item['note'] = note
    if desc: item['includes'] = desc
    if serves: item['serves'] = serves
    if display in IMAGES: item['image'] = f"/images/dishes/{IMAGES[display]}.webp"
    if section == 'biryani':
        key = display
        kg = per_kg.get(clean_name(raw)) or per_kg.get(key)
        if kg: item['prices']['perKg'] = kg
    items.append(item)

# final tidy-ups
FIX = {'7 up': '7Up', 'Thums up': 'Thums Up', 'Shami Kebab (Veg) (6pc.)': 'Shami Kebab (Veg)'}
for it in items:
    it['name'] = FIX.get(it['name'], it['name'])
    pr = it['prices']
    if set(pr) == {'small'}:
        it['prices'] = {'price': pr['small']}
    if it.get('note'):
        n = it['note']
        it['note'] = n[0] + n[1:].lower() if 'pc' not in n else n
    if it['section'] == 'beverages':
        it.pop('veg', None)

# de-duplicate ids (the sheet re-uses a couple of combo names)
seen = {}
for it in items:
    n = seen.get(it['id'], 0); seen[it['id']] = n + 1
    if n: it['id'] += f'-{n+1}'

json.dump(items, open('data/menu.json', 'w'), indent=2, ensure_ascii=False)
from collections import Counter
print(len(items), Counter(i['section'] for i in items))
