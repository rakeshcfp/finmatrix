import os
import zipfile
import shutil

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
ZIP_NAME = 'finmatrix-production-deploy.zip'
ZIP_PATH = os.path.join(ROOT_DIR, ZIP_NAME)

print("--- Building POSIX-Compliant Linux Deployable ZIP for Hostinger ---")

# Files to include directly in root
FILES_TO_INCLUDE = [
    'index.html',
    'about.html',
    'contact.html',
    'editorial-policy.html',
    'privacy-policy.html',
    'terms-of-service.html',
    'disclaimer.html',
    'metrics-tracker.html',
    'sitemap.xml',
    'robots.txt',
    'favicon.ico',
    'favicon.svg',
    'site.webmanifest',
    '_headers',
    '_redirects',
    'netlify.toml',
    '.htaccess',
    'subscribe.php',
    'go.php',
    'package.json',
    'unzip.php',
    'fix-dirs.php',
    'llms.txt',
    'llms-full.txt'
]

# Directories to include recursively
DIRS_TO_INCLUDE = [
    'css',
    'js',
    'config',
    'calculators',
    'embed',
    'assets',
    'articles',
    'downloads',
    'src'
]

if os.path.exists(ZIP_PATH):
    os.remove(ZIP_PATH)

total_files = 0

with zipfile.ZipFile(ZIP_PATH, 'w', compression=zipfile.ZIP_DEFLATED) as zipf:
    # 1. Add root files
    for filename in FILES_TO_INCLUDE:
        file_path = os.path.join(ROOT_DIR, filename)
        if os.path.exists(file_path):
            # Posix forward slash
            arcname = filename.replace('\\', '/')
            zipf.write(file_path, arcname)
            print(f"[OK] Added: {arcname}")
            total_files += 1

    # 2. Add directories recursively with forward slashes
    for dirname in DIRS_TO_INCLUDE:
        dir_path = os.path.join(ROOT_DIR, dirname)
        if os.path.exists(dir_path):
            for root, dirs, files in os.walk(dir_path):
                for f in files:
                    full_p = os.path.join(root, f)
                    rel_p = os.path.relpath(full_p, ROOT_DIR)
                    # CRITICAL: Force POSIX forward slashes so Linux/Apache extracts as real folders!
                    posix_arcname = rel_p.replace('\\', '/')
                    zipf.write(full_p, posix_arcname)
                    print(f"[OK] Added: {posix_arcname}")
                    total_files += 1


size_bytes = os.path.getsize(ZIP_PATH)
size_mb = size_bytes / (1024 * 1024)

print("\n" + "="*50)
print(f" SUCCESS: Created {ZIP_NAME}")
print(f" Total files: {total_files}")
print(f" File Size: {size_bytes:,} bytes ({size_mb:.2f} MB)")
print(" Guaranteed POSIX forward slashes ('/') for Linux/Hostinger compatibility!")
print("="*50 + "\n")
