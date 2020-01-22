from PIL import Image # voor plaatjes
from datetime import date
from datetime import datetime
import os

# img = Image.open('starry_night.jpg')

now = datetime.now()
today = date.today()

currentTime = now.strftime("%H:%M:%S")
currentDate = today.strftime("%b-%d-%Y")
currentDate = today.strftime("%Y-%m-%d")

# print("Current date plus time", currentDate,currentTime)

currentDateTime = currentDate + "_" + currentTime
pictureName = "smartFarm"
pictureFullName = "smartFarm_" + currentDateTime + ".jpg"
print(pictureFullName) 

# img.save(pictureFullName)
# f = open('%s.jpg' % pictureFullName, 'wb')
# print(img)

# def makePicture():
#     raspistill -o $pictureName$currentDateTime.jpg
os.system("raspistill -n -t 1 -o pictures/"+ pictureFullName +".jpg")

# def countPixels(img, region):
#     box = img.crop(region) # selecteer regio
#     boxHSV = box.convert("HSV") # converteer naar HSV-kleurruimte (H = hue)
#     his = boxHSV.histogram() # genereer lijst van aantal pixels per kleur
#     return sum(his[70:100]) # groen zit tussen de H = 70 en H = 100

# # genereer 3x2 regio's
# regions = []
# for i in range(3):
#     for j in range(2):
#         regions.append((157 * i, 157 * j, 157 * i + 157, 157 * j + 157))

# img = Image.open('test_image.png')

# for i in regions:
#     print(countPixels(img, i))
