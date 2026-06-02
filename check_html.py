from html.parser import HTMLParser

class MyHTMLParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.stack = []
        self.errors = []
        
    def handle_starttag(self, tag, attrs):
        if tag not in ['img', 'br', 'hr', 'input', 'meta', 'link']:
            self.stack.append((tag, self.getpos()))
            
    def handle_endtag(self, tag):
        if not self.stack:
            self.errors.append(f"Extra closing tag </{tag}> at {self.getpos()}")
            return
            
        last_tag, pos = self.stack[-1]
        if last_tag == tag:
            self.stack.pop()
        else:
            self.errors.append(f"Mismatched tag: expected </{last_tag}> from {pos}, got </{tag}> at {self.getpos()}")

parser = MyHTMLParser()
with open("index.html") as f:
    parser.feed(f.read())

if parser.errors:
    for e in parser.errors:
        print(e)
else:
    print("Tags balanced!")
    print(f"Unclosed tags remaining: {len(parser.stack)}")
    for tag in parser.stack:
        print(tag)
