from PIL import Image # voor plaatjes

def countPixels(img, region):
    box = img.crop(region) # selecteer regio
    boxHSV = box.convert("HSV") # converteer naar HSV-kleurruimte (H = hue)
    his = boxHSV.histogram() # genereer lijst van aantal pixels per kleur
    return sum(his[70:100]) # groen zit tussen de H = 70 en H = 100

# genereer 3x2 regio's
regions = []
for i in range(3):
    for j in range(2):
        regions.append((157 * i, 157 * j, 157 * i + 157, 157 * j + 157))

img = Image.open("image.png") # laad plaatje
for i in regions:
    print(countPixels(img, i))