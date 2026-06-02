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
    return html_str[start_idx:i] # return till end if missing

col2_start = '<div class="nav-bar__bottom-col">'
idx = html.find(col2_start)
# need to skip the is--products one
while idx != -1:
    if html[idx:idx+len(col2_start)] == col2_start:
        col2 = extract_node(html[idx:], col2_start)
        break
    idx = html.find(col2_start, idx + 1)

print("COL2 length:", len(col2))
print("COL2 end content:")
print(col2[-200:])
