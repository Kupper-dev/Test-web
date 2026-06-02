import sys
from bs4 import BeautifulSoup

with open("index.html", "r") as f:
    html = f.read()

soup = BeautifulSoup(html, "html.parser")

# Find the three columns
col1 = soup.find("div", class_="nav-bar__bottom-col is--products")
col2 = soup.find("div", class_="nav-bar__bottom-col", attrs={"class": lambda c: "is--products" not in c and "is--ad" not in c})
col_ad = soup.find("div", class_="nav-bar__bottom-col is--ad")

if not (col1 and col2 and col_ad):
    print("Could not find all three columns!")
    sys.exit(1)

# Extract them so they are removed from their current corrupted locations
col1 = col1.extract()
col2 = col2.extract()
col_ad = col_ad.extract()

# Now find nav-branch-container and empty it
container = soup.find("div", class_="nav-branch-container")
if not container:
    print("Could not find nav-branch-container!")
    sys.exit(1)

container.clear()

# We will create 3 branches
for i in range(3):
    wrapper = soup.new_tag("div", attrs={"class": "nav-branch-wrapper" + (" is--active" if i == 0 else ""), "data-branch": str(i)})
    inner = soup.new_tag("div", attrs={"class": "nav-bar__bottom-inner", "data-lenis-prevent": ""})
    row = soup.new_tag("div", attrs={"class": "nav-bar__bottom-row"})
    
    # We must deepcopy the columns so each branch has its own instances
    import copy
    c1 = copy.copy(col1)
    c2 = copy.copy(col2)
    cad = copy.copy(col_ad)
    
    row.append(c1)
    row.append(c2)
    row.append(cad)
    
    inner.append(row)
    wrapper.append(inner)
    container.append(wrapper)

# We need to ensure we didn't leave any broken garbage behind inside nav-bar__bottom-overflow.
# Look for anything inside nav-bar__bottom-overflow that is NOT nav-branch-buttons or nav-branch-container, and remove it.
overflow = soup.find("div", class_="nav-bar__bottom-overflow")
for child in list(overflow.children):
    if child.name == "div":
        if "nav-branch-buttons" in child.get("class", []) or "nav-branch-container" in child.get("class", []):
            continue
        child.decompose()

# Write back to file
with open("index.html", "w", encoding="utf-8") as f:
    f.write(str(soup))

print("HTML structure cleanly rebuilt with BeautifulSoup!")
