import sys, os
sys.path.insert(0, "/home/user/bedardandy/coloring-book-skill/lib")
import extras, pages
from charlib import build

OUT = os.path.dirname(os.path.abspath(__file__)) + "/book"
seq = [("001-cover", extras.cover), ("002-title", extras.title_page), ("003-copyright", extras.copyright_page),
       ("004-belongs", extras.belongs_page), ("005-colortest", extras.color_test), ("006-checklist", extras.checklist),
       ("007-welcome", extras.welcome), ("008-blank", extras.blank_page),
       ("009-flag", extras.flag_page), ("010-blank", extras.blank_page)]
n = 11
for f in pages.CITIES:
    seq.append((f"{n:03d}-{f.__name__}", f)); seq.append((f"{n+1:03d}-blank", extras.blank_page)); n += 2
seq += [("051-goodbye", extras.goodbye), ("052-blank", extras.blank_page),
        ("053-family", extras.family_page), ("054-blank", extras.blank_page),
        ("055-end", extras.end_page), ("056-blank", extras.blank_page)]
BUILDERS = seq
if __name__ == "__main__":
    build(BUILDERS, OUT, only=sys.argv[1:] or None, pdf_name="Scout-Explores-Tennessee.pdf")
