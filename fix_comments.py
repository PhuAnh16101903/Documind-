import re
import os
import glob

src_dir = r"C:\Users\Admin\.gemini\antigravity\scratch\documind\frontend\src"

for filepath in glob.glob(os.path.join(src_dir, "**", "*.tsx"), recursive=True):
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    # Replace <!-- comment --> with {/* comment */}
    new_content = re.sub(r'<!--(.*?)-->', r'{/*\1*/}', content)

    if new_content != content:
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(new_content)
        print(f"Fixed: {filepath}")

print("Done fixing all TSX files!")
