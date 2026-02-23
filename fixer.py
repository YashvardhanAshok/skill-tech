import os
import re

FOLDER = r"SkillSnap/dbs/resume - html/auto"

NEW_HEAD = """<head>
<meta charset="utf-8"/>
<title>Yashvardhan Ashok - Resume</title>
<link href="resume_index.css" media="screen" rel="stylesheet" type="text/css"/>
</head>"""

# regex to match entire <head>...</head> block
HEAD_REGEX = re.compile(r"<head.*?>.*?</head>", re.IGNORECASE | re.DOTALL)

fixed = 0

for filename in os.listdir(FOLDER):
    if not filename.lower().endswith(".html"):
        continue

    path = os.path.join(FOLDER, filename)

    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    # replace head block
    if HEAD_REGEX.search(content):
        content = HEAD_REGEX.sub(NEW_HEAD, content)
    else:
        # if no head found, insert after <html>
        content = re.sub(
            r"<html.*?>",
            lambda m: m.group(0) + "\n" + NEW_HEAD,
            content,
            count=1,
            flags=re.IGNORECASE,
        )

    with open(path, "w", encoding="utf-8") as f:
        f.write(content)

    fixed += 1

print(f"✅ Cleaned {fixed} HTML files")