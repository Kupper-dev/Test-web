import sys

with open("index.html", "r") as f:
    html = f.read()

def extract_node(html_str, start_str):
    start_idx = html_str.find(start_str)
    if start_idx == -1: return None
    depth = 0
    i = start_idx
    while i < len(html_str):
        if html_str[i:i+4] == "<div":
            depth += 1
            i += 4
        elif html_str[i:i+6] == "</div>":
            depth -= 1
            i += 6
            if depth == 0:
                return html_str[start_idx:i]
        else:
            i += 1
    return None

col1_start = '<div class="nav-bar__bottom-col is--products">'
col2_start = '<div class="nav-bar__bottom-col">'
col3_start = '<div class="nav-bar__bottom-col is--ad">'

col1 = extract_node(html, col1_start)

idx = html.find(col2_start)
while idx != -1:
    if html[idx:idx+len(col2_start)] == col2_start:
        col2 = extract_node(html[idx:], col2_start)
        break
    idx = html.find(col2_start, idx + 1)

col3 = extract_node(html, col3_start)

if not (col1 and col2 and col3):
    print("Failed to find columns!")
    sys.exit(1)

buttons_html = """                <div class="nav-branch-buttons">
                  <button class="nav-branch-btn is--active" data-branch-btn="0">Inicio</button>
                  <button class="nav-branch-btn" data-branch-btn="1">Branch 2</button>
                  <button class="nav-branch-btn" data-branch-btn="2">Branch 3</button>
                </div>"""

branches = ""
for i in range(3):
    active = " is--active" if i == 0 else ""
    branches += f"""
                <div class="nav-branch-wrapper{active}" data-branch="{i}">
                  <div class="nav-bar__bottom-inner" data-lenis-prevent="">
                    <div class="nav-bar__bottom-row">
{col1}
{col2}
{col3}
                    </div>
                  </div>
                </div>"""

new_content = buttons_html + '\n                <div class="nav-branch-container">' + branches + '\n                </div>'

start_overflow = html.find('<div class="nav-bar__bottom-overflow">')
if start_overflow == -1:
    print("Cannot find overflow div")
    sys.exit(1)

head = html[:start_overflow + len('<div class="nav-bar__bottom-overflow">\n')]

# 5 closing divs
tail = """                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>"""

tail_idx = html.find('    </div>\n\n    <!-- Barba Page Container')
if tail_idx != -1:
    tail += "\n" + html[tail_idx:]
else:
    tail_idx = html.find('    <!-- Barba Page Container')
    if tail_idx != -1:
        tail += "\n    </div>\n\n" + html[tail_idx:]
    else:
        print("Cannot find next section!")
        sys.exit(1)

with open("index.html", "w") as f:
    f.write(head + new_content + "\n" + tail)

print("Rebuilt index.html!")
