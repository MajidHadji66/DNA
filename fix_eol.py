import os

file_path = '.husky/pre-push'

with open(file_path, 'rb') as f:
    content = f.read()

content = content.replace(b'\r\n', b'\n')

with open(file_path, 'wb') as f:
    f.write(content)

print(f"Converted {file_path} to LF")
