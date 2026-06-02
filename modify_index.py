import sys

with open("index.html", "r") as f:
    lines = f.readlines()

# 1. Add class to list items
lines = [line.replace('<li class="nav-bar__big-li">', '<li class="nav-bar__big-li nav-bar-link-list-item">') for line in lines]

# Find bounds
start_idx = -1
end_idx = -1

for i, line in enumerate(lines):
    if '<div class="nav-bar__bottom-inner" data-lenis-prevent="">' in line:
        start_idx = i
        break

# The inner block ends where nav-bar__bottom-overflow ends.
# nav-bar__bottom-overflow starts at start_idx - 1.
for i in range(start_idx, len(lines)):
    if '                </div>' in lines[i] and '              </div>' in lines[i+1] and '            </div>' in lines[i+2]:
        end_idx = i
        break

inner_block = lines[start_idx:end_idx] # This is exactly the nav-bar__bottom-inner block

buttons_html = [
    '                <div class="nav-branch-buttons">\n',
    '                  <button class="nav-branch-btn is--active" data-branch-btn="0">Inicio</button>\n',
    '                  <button class="nav-branch-btn" data-branch-btn="1">Branch 2</button>\n',
    '                  <button class="nav-branch-btn" data-branch-btn="2">Branch 3</button>\n',
    '                </div>\n'
]

branch_0_start = ['                  <div class="nav-branch-wrapper is--active" data-branch="0">\n']
branch_1_start = ['                  <div class="nav-branch-wrapper" data-branch="1">\n']
branch_2_start = ['                  <div class="nav-branch-wrapper" data-branch="2">\n']
branch_end = ['                  </div>\n']

# Reconstruct
new_lines = []
for i, line in enumerate(lines):
    if '<div class="nav-bar__bottom-overflow">' in line:
        new_lines.extend(buttons_html)
        new_lines.append(line)
        # Append branch 0 wrapper start
        new_lines.extend(branch_0_start)
    elif i == start_idx:
        # Extend the inner block for branch 0
        new_lines.extend(inner_block)
        new_lines.extend(branch_end)
        
        # Extend for branch 1
        new_lines.extend(branch_1_start)
        new_lines.extend(inner_block)
        new_lines.extend(branch_end)
        
        # Extend for branch 2
        new_lines.extend(branch_2_start)
        new_lines.extend(inner_block)
        new_lines.extend(branch_end)
    elif i > start_idx and i < end_idx:
        # Skip because we already injected it
        continue
    else:
        new_lines.append(line)

with open("index.html", "w") as f:
    f.writelines(new_lines)

print("HTML structure updated successfully.")
