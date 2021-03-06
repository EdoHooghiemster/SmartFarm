from OpenGL.GL import * # pylint: disable=W0614
from OpenGL.GLUT import * # pylint: disable=W0614
from datetime import datetime
from datetime import timedelta
from timeloop import Timeloop

import RPi.GPIO as gp
import Adafruit_GPIO.SPI as SPI
import Adafruit_MCP3008
import Adafruit_DHT as DHT
from time import sleep
import requests
from PIL import Image

WINDOW_WIDTH = 480
WINDOW_HEIGHT = 320
TITLE_HEIGHT = 20
CELL_WIDTH = (WINDOW_WIDTH - 10) / 3
CELL_HEIGHT = (WINDOW_HEIGHT - TITLE_HEIGHT - 10) / 2

RAINTIME = 1.0
IMAGE = "images/image.jpg"
URL = "https://europe-west1-smartbroeikas.cloudfunctions.net/api/"

SPI_PORT = 0
SPI_DEVICE = 0
DHT_PIN = 14
V1_PIN = 21
V2_PIN = 20
V3_PIN = 26
V4_PIN = 19
LIGHT_PIN = 19
SOIL_PIN = 6

class Sensor:
    def __init__(self, name, unit):
        self.name = name
        self.unit = unit
        self.rawValue = 0.0
        self.value = 0.0

    def calibrationFunction(self, x):
        return x
    
    def getReadout(self):
        return str(round(self.value)) + " " + self.unit

class AnalogSensor(Sensor):
    def __init__(self, name, unit, mcp, channel):
        super().__init__(name, unit)
        self.mcp = mcp
        self.channel = channel

    def read(self):
        self.rawValue = self.mcp.read_adc(self.channel)
        self.value = self.calibrationFunction(self.rawValue)
        return self.value

class DigitalSensor(Sensor):
    def __init__(self, name, unit):
        super().__init__(name, unit)

class LightSensor(AnalogSensor):
    def __init__(self, name, unit, mcp, channel):
        super().__init__(name, unit, mcp, channel)

    def calibrationFunction(self, x):
        return x / 10.23

class SoilMoistureSensor(AnalogSensor):
    def __init__(self, name, unit, mcp, channel):
        super().__init__(name, unit, mcp, channel)

    def calibrationFunction(self, x):
        return x / 10.23
        
class TemperatureSensor(DigitalSensor):
    def __init__(self, name, unit):
        super().__init__(name, unit)
        self.sensor = DHT.DHT22
        
    def read(self):
        dummy, self.rawValue = DHT.read_retry(self.sensor, DHT_PIN)
        self.value = self.rawValue
        return self.value

class HumiditySensor(DigitalSensor):
    def __init__(self, name, unit):
        super().__init__(name, unit)
        self.sensor = DHT.DHT22

    def read(self):
        self.rawValue, dummy = DHT.read_retry(self.sensor, DHT_PIN)
        self.value = self.rawValue
        return self.value

class Actuator:
    def __init__(self, name, gpio):
        self.name = name
        self.gpio = gpio
        self.value = gp.LOW
        gp.setmode(gp.BCM)
        gp.setup(gpio, gp.OUT)

    def set(self, value):
        self.value = value
        gp.output(self.gpio, value)

    def on(self):
        self.set(gp.HIGH)
    
    def off(self):
        self.set(gp.LOW)

class Main:
    def __init__(self):
        spi = SPI.SpiDev(SPI_PORT, SPI_DEVICE)
        mcp = Adafruit_MCP3008.MCP3008(spi = spi)
        self.sensors = []
        s = SoilMoistureSensor("SMS1", "%", mcp, 0)
        self.sensors.append(s)
        s = SoilMoistureSensor("SMS2", "%", mcp, 3)
        self.sensors.append(s)
        s = SoilMoistureSensor("SMS5", "%", mcp, 1)
        self.sensors.append(s)
        s = SoilMoistureSensor("SMS6", "%", mcp, 2)
        self.sensors.append(s)
        s = LightSensor("Light", "lux", mcp, 7)
        self.sensors.append(s)
        s = TemperatureSensor("Temperature", "C")
        self.sensors.append(s)
        s = HumiditySensor("Humidity", "%")
        self.sensors.append(s)
        s = AnalogSensor("DET12", "", mcp, 4)
        self.sensors.append(s)
        s = AnalogSensor("DET56", "", mcp, 5)
        self.sensors.append(s)
        self.actuators = []
        a = Actuator("valve1", V1_PIN)
        self.actuators.append(a)
        a = Actuator("valve2", V2_PIN)
        self.actuators.append(a)
        a = Actuator("valve3", V3_PIN)
        self.actuators.append(a)
        a = Actuator("valve4", V4_PIN)
        self.actuators.append(a)
        a = Actuator("light", LIGHT_PIN)
        self.actuators.append(a)
        a = Actuator("soilSensors", SOIL_PIN)
        self.actuators.append(a)
        self.lightOn = False
        self.token = self.getToken()
        self.boxes = self.getBoxes()
        tl = Timeloop()
        tl._add_job(self.everyHour, timedelta(seconds = 60))
        tl._add_job(self.everyMinute, timedelta(seconds = 10))
        tl.start()
        self.interface = Interface(self)
        self.interface.start()

    def getToken(self):
        url = URL + "login"
        data = {
            "email": "damian@gmail.com",
            "password": "wachtwoord"
        }
        res = requests.post(url, data = data)
        if res.status_code != 200:
            print("Unable to log in")
            return
        return res.text[1:-1]

    def getBoxes(self):
        url = URL + "details"
        headers = {
            "Authorization": "Bearer " + self.token
        }
        res = requests.get(url, headers = headers)
        if res.status_code != 200:
            print("Unable to get user details")
            return
        userDetails = res.json()
        broeikas = userDetails["Broeikas"][0]
        self.farmID = broeikas["Id"]
        self.minimumLightIntensity = int(broeikas["minimumLightIntensity"])
        self.lightsOn = datetime.strptime(broeikas["lightsOn"], "%H:%M:%S").time()
        self.lightsOff = datetime.strptime(broeikas["lightsOff"], "%H:%M:%S").time()
        boxes = []
        humSensors = [0, 1, -1, -1, 2, 3]
        detSensors = [7, 7, -1, -1, 8, 8]
        for i in range(1, 7):
            plantID = broeikas["dock" + str(i)]
            if str(plantID) != "0":
                big = self.sensors[detSensors[i - 1]].read() < 10   
                self.turnOn("soilSensors")
                if self.sensors[detSensors[i - 1]].read() < 1000:
                    big = False
                self.turnOff("soilSensors")
                boxes.append(Box(i, big, self.token, plantID, humSensors[i - 1]))
        return boxes

    def rain(self, valve):
        if (valve < 1) or (valve > 4):
            return
        self.actuators[valve - 1].on()
        sleep(RAINTIME)
        self.actuators[valve - 1].off()

    def turnOn(self, name):
        for i in self.actuators:
            if i.name == name:
                i.on()

    def turnOff(self, name):
        for a in self.actuators:
            if a.name == name:
                a.off()

    def readSensors(self):
        self.turnOn("soilSensors")
        sleep(0.5)
        data = [s.read() for s in self.sensors]
        self.turnOff("soilSensors")
        return data

    def reportSensors(self, data):
        jsonData = {
            "lightIntensity": int(data[4]),
            "temperature": str(round(data[5], 1)),
            "humidity": int(data[6])
        }
        url = URL + "sensordatabroeikas/" + self.farmID
        res = requests.post(url, data = jsonData)
        if res.status_code != 200:
            print("Error posting data")

    def takePicture(self):
        os.system("raspistill -n -t 1000 -o " + IMAGE)

    def postPicture(self):
        headers = {
	        "Authorization": "Bearer " + self.token
        }
        with open(IMAGE, mode = "rb") as file: 
            imageData = file.read()
        files = {"file": ("myFarm.jpg", imageData, "image/jpeg")}
        url = URL + "broeikas/image/" + self.farmID
        res = requests.post(url, headers = headers, files = files)
        if res.status_code != 200:
            print("Error posting picture")

    def countPixels(self, img, region):
        box = img.crop(region) # selecteer regio
        boxHSV = box.convert("HSV") # converteer naar HSV-kleurruimte (H = hue)
        his = boxHSV.histogram() # genereer lijst van aantal pixels per kleur
        return min(100, sum(his[70:150]) // 3750) # groen zit tussen de H = 70 en H = 100

    def measurePlantGrowth(self):
        regions = [
            (1763, 1160, 2529, 1896),
            (1751, 262, 2518, 1032),
            (902, 1196, 1689, 1942),
            (854, 278, 1644, 1044),
            (2, 1166, 793, 1930),
            (11, 266, 800, 1055)]
        self.takePicture()
        img = Image.open(IMAGE)
        return [self.countPixels(img, i) for i in regions]

    def everyMinute(self):
        plantGrowth = self.measurePlantGrowth()
        data = self.readSensors()
        for i in self.boxes:
            i.plantGrowth = plantGrowth[i.dock - 1]
            i.soilHumidity = data[i.sensor]
            i.reportPlantData()
        self.interface.light = data[4]
        self.interface.temp = data[5]
        self.interface.hum = data[6]
        self.reportSensors(data)
        self.boxes = self.getBoxes()
        now = datetime.now().time()
        if data[4] < self.minimumLightIntensity and now > self.lightsOn and now < self.lightsOff:
            self.turnOn("light")
        else:
            self.turnOff("light")

    def everyHour(self):
        for i in self.boxes:
            i.checkWatering(self)
        self.postPicture()

class Box:
    def __init__(self, dock, big, token, plantID, sensor):
        self.dock = dock
        self.x = (dock - 1) // 2
        self.y = 1 - (dock - 1) % 2 - (1 if big else 0)
        self.big = big
        self.token = token
        self.plantID = plantID
        self.sensor = sensor
        self.name = ""
        self.soilHumidity = 0
        self.plantGrowth = 0
        self.desiredHumidity = 0
        self.getPlantData()

    def getPlantData(self):
        url = URL + "plant/" + self.plantID
        headers = {
            "Authorization": "Bearer " + self.token
        }
        res = requests.get(url, headers = headers)
        if res.status_code != 200:
            print("Unable to get plant data")
            return
        plant = res.json()
        self.name = plant["body"]
        self.soilHumidity = int(float(plant["currentSoilMoisture"]))
        self.plantGrowth = int(float(plant["growthPercentage"]))
        self.desiredHumidity = int(float(plant["desiredSoilMoisture"]))
        
    def checkWatering(self, main):
        if self.soilHumidity < self.desiredHumidity:
            if self.big:
                if self.x == 0:
                    main.rain(1)
                    main.rain(2)
                if self.x == 1:
                    pass
                if self.x == 2:
                    main.rain(3)
                    main.rain(4)
            else:
                if self.x == 0 and self.y == 0:
                    main.rain(1)
                if self.x == 0 and self.y == 1:
                    main.rain(2)
                if self.x == 2 and self.y == 0:
                    main.rain(3)
                if self.x == 2 and self.y == 1:
                    main.rain(4)

    def reportPlantData(self):
        data = {
            "currentSoilMoisture": int(self.soilHumidity),
            "growthPercentage": int(self.plantGrowth)
        }
        url = URL + "sensordataplant/" + self.plantID
        res = requests.post(url, data = data)
        if res.status_code != 200:
            print("Error posting data")

class Interface:
    def __init__(self, main):
        self.main = main
        self.temp = 21.01234567
        self.hum = 65
        self.light = 30
        
    def start(self):
        glutInit()
        #glutInitDisplayMode(GLUT_MULTISAMPLE)
        #glutInitWindowSize(WINDOW_WIDTH, WINDOW_HEIGHT)
        glutCreateWindow("SmartFarm".encode("ascii"))
        glutFullScreen()
        glBlendFunc(GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA)
        glEnable(GL_BLEND)
        glEnable(GL_LINE_SMOOTH)
        glOrtho(0, WINDOW_WIDTH, 0, WINDOW_HEIGHT, -1, 1) 
        glClearColor(0, .2, 0, 0) # dark green
        glutDisplayFunc(self.draw)
        glutMouseFunc(self.click)
        glutTimerFunc(1000, self.update, 0)
        glutMainLoop()

    def drawText(self, x, y, text):
        glPushMatrix()
        glTranslate(x, y, 0)
        glScale(0.15, 0.15, 1)
        glDisable(GL_MULTISAMPLE)
        glLineWidth(2)
        for i in text:
            if i == "°":
                glPushMatrix()
                glTranslate(10, 70, 0)
                glScale(0.5, 0.5, 1)
                glutStrokeCharacter(GLUT_STROKE_ROMAN, ord("o"))
                glPopMatrix()
                glTranslate(50, 0, 0)
            elif i == " ":
                glTranslate(50, 0, 0)
            else:
                glutStrokeCharacter(GLUT_STROKE_ROMAN, ord(i))
        glEnable(GL_MULTISAMPLE)
        glPopMatrix()

    def drawThermometer(self, x, y):
        glColor(1, 0, 0)
        glLineWidth(1)
        glPushMatrix()
        glTranslate(x, y, 0)
        glScale(2.5, 2.5, 0)
        glPolygonMode(GL_FRONT, GL_FILL)
        glBegin(GL_POLYGON)
        glVertex(1.5, 2, 0)
        glVertex(2, 1.5, 0)
        glVertex(2, 0.5, 0)
        glVertex(1.5, 0, 0)
        glVertex(0.5, 0, 0)
        glVertex(0, 0.5, 0)
        glVertex(0, 1.5, 0)
        glVertex(0.5, 2, 0)
        glEnd()
        glRectf(0.5, 2, 1.5, 5)
        glPolygonMode(GL_FRONT, GL_LINE)
        glRectf(0.5, 1, 1.5, 8)
        glPopMatrix()

    def drawDrop(self, x, y):
        glColor(0, 0, 1)
        glPushMatrix()
        glTranslate(x, y, 0)
        glScale(4, 4, 0)
        glPolygonMode(GL_FRONT, GL_FILL)
        self.drawDropShape()
        glPopMatrix()

    def drawSun(self, x, y):
        glColor(1, 1, 0)
        glPushMatrix()
        glTranslate(x, y, 0)
        glScale(4, 4, 0)
        glPolygonMode(GL_FRONT, GL_FILL)
        glBegin(GL_POLYGON)
        glVertex(0.5, 2, 0)
        glVertex(1.5, 2, 0)
        glVertex(2, 1.5, 0)
        glVertex(2, 0.5, 0)
        glVertex(1.5, 0, 0)
        glVertex(0.5, 0, 0)
        glVertex(0, 0.5, 0)
        glVertex(0, 1.5, 0)
        glEnd()
        glLineWidth(1)
        glBegin(GL_LINES)
        glVertex(1, 2.4)
        glVertex(1, 3.1)
        glVertex(2, 2)
        glVertex(2.5, 2.5)
        glVertex(2.4, 1)
        glVertex(3.1, 1)
        glVertex(2, 0)
        glVertex(2.5, -0.5)
        glVertex(1, -0.4)
        glVertex(1, -1.1)
        glVertex(0, 0)
        glVertex(-0.5, -0.5)
        glVertex(-0.4, 1)
        glVertex(-1.1, 1)
        glVertex(0, 2)
        glVertex(-0.5, 2.5)
        glEnd()
        glPopMatrix()

    def drawTitle(self):
        glColor(0, 0.7, 0.9) # light blue
        glPolygonMode(GL_FRONT, GL_FILL)
        glRectf(0, WINDOW_HEIGHT, WINDOW_WIDTH, WINDOW_HEIGHT - TITLE_HEIGHT)
        glColor(0, 0, 0) # black
        self.drawText(45, WINDOW_HEIGHT - 18, str(round(self.temp, 1)) + "°C")
        self.drawText(135, WINDOW_HEIGHT - 18, str(round(self.hum)) + "%")
        self.drawText(205, WINDOW_HEIGHT - 18, str(round(self.light)) + " lux")
        self.drawText(300, WINDOW_HEIGHT - 18, str(datetime.now().strftime("%d/%m/%Y %H:%M")))
        glLineWidth(2)
        glBegin(GL_LINES)
        for i in range(1, 4):
            glVertex(3, WINDOW_HEIGHT - 5 * i, 0)
            glVertex(13, WINDOW_HEIGHT - 5 * i, 0)
        glEnd()
        self.drawThermometer(35, WINDOW_HEIGHT - 20)
        self.drawDrop(125, WINDOW_HEIGHT - 18)
        self.drawSun(193, WINDOW_HEIGHT - 14)

    def drawDropShape(self, outline = False):
        if outline:
            glBegin(GL_LINE_LOOP)
        else:
            glBegin(GL_POLYGON)
        glVertex(1, 4, 0)
        glVertex(2, 1.5, 0)
        glVertex(2.1, 1, 0)
        glVertex(2, 0.5, 0)
        glVertex(1.8, 0.2, 0)
        glVertex(1.5, 0, 0)
        glVertex(1, -0.1, 0)
        glVertex(0.5, 0, 0)
        glVertex(0.2, 0.2, 0)
        glVertex(0, 0.5, 0)
        glVertex(-0.1, 1, 0)
        glVertex(0, 1.5, 0)
        glEnd()

    def drawSoilHumidity(self, x, y, perc, desired):
        glColor(0.5, 0.5, 1) # light blue
        glPolygonMode(GL_FRONT, GL_FILL)
        glPushMatrix()
        glTranslate(x, y, 0)
        glScale(20, 20, 0)
        self.drawDropShape()
        glEnable(GL_SCISSOR_TEST)
        glScissor(int(x) - 2, int(y) - 2, 50, int(0.82 * perc))
        glColor(0, 0, 1) # blue
        self.drawDropShape()
        glDisable(GL_SCISSOR_TEST)
        glLineWidth(2)
        self.drawDropShape(True)
        glColor(1, 0, 0) # red
        glBegin(GL_LINES)
        glVertex(-0.1, -0.1 + 0.041 * desired, 0)
        glVertex(2.1, -0.1 + 0.041 * desired, 0)
        glEnd()
        glColor(0, 0, 0) # black
        glScale(0.04, 0.04, 1)
        self.drawText(5, 10, str(round(perc)) + "%")
        glPopMatrix()

    def drawPlantShape(self, outline = False):
        if outline:
            glBegin(GL_LINE_LOOP)
            glVertex(1, 0, 0)
            glVertex(1, 0.5, 0)
            glVertex(0.5, 1.0, 0)
            glVertex(0.6, 1.1, 0)
            glVertex(1, 0.7, 0)
            glVertex(1, 1.2, 0)
            glVertex(0.5, 1.7, 0)
            glVertex(0.6, 1.8, 0)
            glVertex(1, 1.4, 0)
            glVertex(1, 2.4, 0)
            glVertex(1.2, 2.4, 0)
            glVertex(1.2, 1.8, 0)
            glVertex(1.6, 2.2, 0)
            glVertex(1.7, 2.1, 0)
            glVertex(1.2, 1.6, 0)
            glVertex(1.2, 1.1, 0)
            glVertex(1.6, 1.5, 0)
            glVertex(1.7, 1.4, 0)
            glVertex(1.2, 0.9, 0)
            glVertex(1.2, 0, 0)
            glEnd()
        else:
            glBegin(GL_POLYGON)
            glVertex(1, 0, 0)
            glVertex(1, 2.4, 0)
            glVertex(1.2, 2.4, 0)
            glVertex(1.2, 0, 0)
            glEnd()
            glBegin(GL_POLYGON)
            glVertex(1, 0.5, 0)
            glVertex(0.5, 1, 0)
            glVertex(0.6, 1.1, 0)
            glVertex(1, 0.7, 0)
            glEnd()
            glBegin(GL_POLYGON)
            glVertex(1, 1.2, 0)
            glVertex(0.5, 1.7, 0)
            glVertex(0.6, 1.8, 0)
            glVertex(1, 1.4, 0)
            glEnd()
            glBegin(GL_POLYGON)
            glVertex(1.2, 1.6, 0)
            glVertex(1.7, 2.1, 0)
            glVertex(1.6, 2.2, 0)
            glVertex(1.2, 1.8, 0)
            glEnd()
            glBegin(GL_POLYGON)
            glVertex(1.2, 0.9, 0)
            glVertex(1.7, 1.4, 0)
            glVertex(1.6, 1.5, 0)
            glVertex(1.2, 1.1, 0)
            glEnd()

    def drawPlantGrowth(self, x, y, perc):
        glColor(0, 0.6, 0) # middle dark green
        glPolygonMode(GL_FRONT, GL_FILL)
        glPushMatrix()
        glTranslate(x, y, 0)
        glScale(30, 30, 0)
        self.drawPlantShape()
        glEnable(GL_SCISSOR_TEST)
        glScissor(int(x) + 15, int(y), 36, int(0.72 * perc))
        glColor(0, 1, 0) # green
        self.drawPlantShape()
        glDisable(GL_SCISSOR_TEST)
        glLineWidth(1)
        self.drawPlantShape(True)
        glColor(0, 0, 0) # black
        glScale(0.03, 0.03, 1)
        self.drawText(20, -15, str(round(perc)) + "%")
        glPopMatrix()

    def drawRectangle(self, x, y, outline = False, big = False):
        if outline:
            glPolygonMode(GL_FRONT, GL_LINE)
        else:
            glPolygonMode(GL_FRONT, GL_FILL)
        if big:
            glRectf(x, y, x + WINDOW_WIDTH / 3 - 15, y + WINDOW_HEIGHT - 40)
        else:
            glRectf(x, y, x + WINDOW_WIDTH / 3 - 15, y + WINDOW_HEIGHT / 2 - 25)

            
    def drawBox(self, box):
        glLineWidth(1)
        glColor(0, 0.4, 0) # green
        self.drawRectangle(box.x * CELL_WIDTH + 10, box.y * CELL_HEIGHT + 10, False, box.big)
        glColor(0, 1, 0) # bright green
        self.drawRectangle(box.x * CELL_WIDTH + 10, box.y * CELL_HEIGHT + 10, True, box.big)
        glColor(1, 1, 0) # yellow
        if box.big:
            self.drawText(box.x * CELL_WIDTH + 20, box.y * CELL_HEIGHT + 265, box.name)
            self.drawSoilHumidity(box.x * CELL_WIDTH + 65, box.y * CELL_HEIGHT + 150, box.soilHumidity, box.desiredHumidity)
            self.drawPlantGrowth(box.x * CELL_WIDTH + 50, box.y * CELL_HEIGHT + 50, box.plantGrowth)
        else:
            self.drawText(box.x * CELL_WIDTH + 20, box.y * CELL_HEIGHT + 120, box.name)
            self.drawSoilHumidity(box.x * CELL_WIDTH + 20, box.y * CELL_HEIGHT + 20, box.soilHumidity, box.desiredHumidity)
            self.drawPlantGrowth(box.x * CELL_WIDTH + 80, box.y * CELL_HEIGHT + 30, box.plantGrowth)

    def drawBoxes(self):
        glLineWidth(1)
        for i in range(3):
            for j in range(2):
                glColor(0.2, 0.2, 0.2) # dark grey
                self.drawRectangle(i * CELL_WIDTH + 10, j * CELL_HEIGHT + 10)
                glColor(0.5, 0.5, 0.5) # grey
                self.drawRectangle(i * CELL_WIDTH + 10, j * CELL_HEIGHT + 10, True)
        for i in self.main.boxes:
            self.drawBox(i)        

    def draw(self):
        glClear(GL_COLOR_BUFFER_BIT)
        self.drawTitle()
        self.drawBoxes()
        glFlush()

    def update(self, var):
        glutPostRedisplay()
        glutTimerFunc(1000, self.update, 0)

    def click(self, button, state, x, y):
        pass
        
Main()
