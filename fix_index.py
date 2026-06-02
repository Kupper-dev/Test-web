import sys

with open("index.html", "r") as f:
    html = f.read()

# Remove nav-branch-buttons from current place
buttons_html = """                <div class="nav-branch-buttons">
                  <button class="nav-branch-btn is--active" data-branch-btn="0">Inicio</button>
                  <button class="nav-branch-btn" data-branch-btn="1">Branch 2</button>
                  <button class="nav-branch-btn" data-branch-btn="2">Branch 3</button>
                </div>
"""
html = html.replace(buttons_html, "")

# Insert it inside nav-bar__bottom-overflow, and wrap branches in nav-branch-container
target = '<div class="nav-bar__bottom-overflow">'
replacement = f"""{target}
{buttons_html}                <div class="nav-branch-container">"""

html = html.replace(target, replacement)

# We need to close nav-branch-container right before nav-bar__bottom-overflow closes.
# The structure is:
#                   </div> (ends branch 2)
#                 </div> (ends nav-bar__bottom-overflow)
#               </div> (ends nav-bar__bottom)

# We can do this with a simple replace:
close_target = """                  </div>
                </div>
              </div>
            </div>"""
close_replacement = """                  </div>
                </div>
                </div>
              </div>
            </div>"""
html = html.replace(close_target, close_replacement)

with open("index.html", "w") as f:
    f.write(html)

print("Fixed HTML structure")
