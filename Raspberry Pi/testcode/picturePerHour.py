import os
import csv
from PIL import Image # voor plaatjes
from datetime import date
from datetime import datetime
from datetime import timedelta
from timeloop import Timeloop

#variables
# now = datetime.now()
# today = date.today()
# currentTime = now.strftime("%H:%M:%S")
# currentDate = today.strftime("%Y-%m-%d")
# currentDateTime = currentDate + "_" + currentTime
# pictureFullName = "smartFarm_" + currentDateTime + ".jpg"
tl = Timeloop()
entryNumber = 0
csvFile = 'growthResults.csv'
dock1 = (1763,1160,2529,1896)
dock2 = (1751,262,2518,1032)
dock3 = (902,1196,1689,1942)
dock4 = (854,278,1644,1044)
dock5 = (2,1166,793,1930)
dock6 = (11,266,800,1055)
regions = [dock1, dock2, dock3, dock4, dock5, dock6]

#async task loops
@tl.job(interval=timedelta(seconds=10))
def monitorFarm():
    print("Monitor shizzle every 10 seconds")

@tl.job(interval=timedelta(seconds=3600))
def makePicture():
    now = datetime.now()
    currentDateTime = now.strftime("%Y-%m-%d_%H:%M:%S")
    pictureFullName = "smartFarm_" + currentDateTime + ".jpg"
    global entryNumber
    entryNumber = entryNumber + 1
    print("saving: " + pictureFullName + " | next pict in 20 seconds")
    # pictureFullName = 'starry_night.jpg' 
    os.system("raspistill -n -t 1000 -o pictures/"+ pictureFullName)
    pic = Image.open(r"pictures/"+pictureFullName)
    pixCount = countPixels(pic, regions[0])
    with open(csvFile, 'a', newline='') as file:
        writer = csv.writer(file)
        writer.writerow([entryNumber, currentDateTime, pixCount])


def countPixels(img, region):
    box = img.crop(region) # selecteer regio
    boxHSV = box.convert("HSV") # converteer naar HSV-kleurruimte (H = hue)
    his = boxHSV.histogram() # genereer lijst van aantal pixels per kleur
    return sum(his[70:100]) # groen zit tussen de H = 70 en H = 100

def getLastEntry(csvFileName):
    data =[]
    row_index = 0
    with open(csvFileName, "r", encoding="utf-8", errors="ignore") as scraped:
        reader = csv.reader(scraped, delimiter=',')
        for row in reader:
            if row:  # avoid blank lines
                row_index += 1
                columns = [row[0], row[1], row[2]]
                data.append(columns)
    last_row = data[-1]
    if len(data) == 1:
        return 0
    else:
        return last_row[0]

if __name__ == "__main__":
    entryNumber = int(getLastEntry(csvFile))
    tl.start(block=True)
