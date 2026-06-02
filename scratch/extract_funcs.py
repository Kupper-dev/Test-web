import re

file_path = "/Users/usuario/.gemini/antigravity-ide/brain/645d5622-bdb3-4674-84ed-9cd579cea970/.system_generated/steps/896/content.md"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Let's search for functions and print them
def print_func(name):
    pos = content.find(name)
    if pos == -1:
        print(f"NOT FOUND: {name}")
        return
    # Find start of function keyword
    func_start = content.rfind("function", 0, pos)
    if func_start == -1 or (pos - func_start) > 50:
        # Fallback to pos
        func_start = pos
    # Find next function or end of line/file
    next_func = content.find("function", pos + len(name))
    if next_func == -1:
        next_func = len(content)
    
    extracted = content[func_start:next_func].strip()
    # clean trailing characters if needed, but this is fine
    print(f"=== FUNCTION {name} ===")
    print(extracted[:2000]) # limit output length
    print("="*40)

for f in ["initRotateButtonsCalc", "initRotateButtonsAnim", "initLazyVideos", "initCSSMarquee"]:
    print_func(f)
