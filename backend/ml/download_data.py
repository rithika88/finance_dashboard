import kagglehub
import shutil
import os

path = kagglehub.dataset_download("entrepreneurlife/personal-finance")
print("Downloaded to:", path)
print("Files:", os.listdir(path))

dest = os.path.join(os.path.dirname(__file__), 'data')
for f in os.listdir(path):
    shutil.copy(os.path.join(path, f), dest)
    print(f"Copied {f} to {dest}")
