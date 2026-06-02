import sys

with open("index.html", "r") as f:
    html = f.read()

def extract_node(html_str, start_str):
    start_idx = html_str.find(start_str)
    if start_idx == -1: return None
    
    # Simple tag matching
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

# For col2, we need the one that doesn't have is--products or is--ad. 
# There's only one like this. We find it by finding col2_start and ensuring it's exactly that.
idx = html.find(col2_start)
while idx != -1:
    # Ensure it's exactly '<div class="nav-bar__bottom-col">'
    # Let's just find the first one that appears after col1
    if html[idx:idx+len(col2_start)] == col2_start:
        col2 = extract_node(html[idx:], col2_start)
        break
    idx = html.find(col2_start, idx + 1)

col3 = extract_node(html, col3_start)

if not (col1 and col2 and col3):
    print("Failed to find columns!")
    sys.exit(1)

# Construct the correct branches HTML
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

# Now we need to REPLACE everything inside nav-bar__bottom-overflow
# Wait, let's just find the start of nav-bar__bottom-overflow and the end of it.
start_overflow = html.find('<div class="nav-bar__bottom-overflow">')
if start_overflow == -1:
    print("Cannot find overflow div")
    sys.exit(1)

# Find the matching closing div for nav-bar__bottom-overflow
# Actually, nav-bar__bottom-overflow is probably broken. Let's just truncate the file from the start of nav-bar__bottom-overflow,
# and insert our new content, then insert the closing tags for the nav.

# Let's find what comes after the nav.
end_nav = html.find('</nav>')
if end_nav == -1:
    print("Cannot find </nav>")
    sys.exit(1)

# The structure before nav-bar__bottom-overflow is fine.
head = html[:start_overflow + len('<div class="nav-bar__bottom-overflow">\n')]

tail = """              </div>
            </div>
          </div>
        </div>
      </nav>"""

tail_idx = html.find('<section class="hero-3d-scene">')
if tail_idx != -1:
    tail += "\n" + html[tail_idx:]
else:
    print("Cannot find next section!")
    sys.exit(1)

with open("index.html", "w") as f:
    f.write(head + new_content + "\n" + tail)

print("Rebuilt index.html!")
