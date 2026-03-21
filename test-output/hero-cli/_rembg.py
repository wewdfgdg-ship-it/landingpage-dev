
import sys
from rembg import remove
from PIL import Image
import numpy as np, io

raw_path = sys.argv[1]
out_path = sys.argv[2]

with open(raw_path, 'rb') as f:
    data = f.read()
result = remove(data)
img = Image.open(io.BytesIO(result)).convert('RGBA')
arr = np.array(img)
alpha = arr[:,:,3]
rows = np.any(alpha > 0, axis=1)
cols = np.any(alpha > 0, axis=0)
r0, r1 = np.where(rows)[0][[0,-1]]
c0, c1 = np.where(cols)[0][[0,-1]]
cropped = img.crop((c0, r0, c1+1, r1+1))
cropped.save(out_path, 'PNG')
print(f'  {img.size} -> {cropped.size}')
