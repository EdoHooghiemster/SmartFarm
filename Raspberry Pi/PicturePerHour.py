import os
from PIL import Image # voor plaatjes
from datetime import date
from datetime import datetime
from datetime import timedelta
from timeloop import Timeloop

#variables
now = datetime.now()
today = date.today()
currentTime = now.strftime("%H:%M:%S")
currentDate = today.strftime("%Y-%m-%d")
currentDateTime = currentDate + "_" + currentTime
pictureFullName = "smartFarm_" + currentDateTime + ".jpg"
tl = Timeloop()

# print(pictureFullName) 

#async task loops
@tl.job(interval=timedelta(seconds=10))
def monitorFarm():
    print("Monitor shizzle every 2 seconds")

@tl.job(interval=timedelta(seconds=300))
def makePicture():
    print(pictureFullName) 
    os.system("raspistill -n -t 1 -o pictures/"+ pictureFullName)

if __name__ == "__main__":
    tl.start(block=True)

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