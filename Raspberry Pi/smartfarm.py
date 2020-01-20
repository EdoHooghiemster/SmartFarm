from OpenGL.GL import * # pylint: disable=W0614
from OpenGL.GLUT import * # pylint: disable=W0614
from datetime import datetime
import RPi.GPIO as gp
import Adafruit_GPIO.SPI as SPI
import Adafruit_MCP3008
import Adafruit_DHT as DHT
from time import sleep
import requests

WINDOW_WIDTH = 480
WINDOW_HEIGHT = 320
TITLE_HEIGHT = 20
CELL_WIDTH = (WINDOW_WIDTH - 10) / 3
CELL_HEIGHT = (WINDOW_HEIGHT - TITLE_HEIGHT - 10) / 2

RAINTIME = 1.0

SPI_PORT = 0
SPI_DEVICE = 0
DHT_PIN = 13
V1_PIN = 19
V2_PIN = 16
V3_PIN = 26
V4_PIN = 20
LIGHT_PIN = 21
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
        s = SoilMoistureSensor("SMS2", "%", mcp, 1)
        self.sensors.append(s)
        s = SoilMoistureSensor("SMS3", "%", mcp, 2)
        self.sensors.append(s)
        s = LightSensor("Light", "lux", mcp, 3)
        self.sensors.append(s)
        s = TemperatureSensor("Temperature", "C")
        self.sensors.append(s)
        s = HumiditySensor("Humidity", "%")
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
        self.interface = Interface(self)
    
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
        self.turnOff("soilsensors")
        return data

    def reportSensors(self):
        data = self.readSensors()
        jsonData = {
            "lightIntensity" : data[3],
            "temperature": data[4],
            "humidity": data[5]
        }
        url = "https://europe-west1-smartbroeikas.cloudfunctions.net/api/sensordatabroeikas/EJxhMpFqwRPo2WAz1rx8"
        res = requests.post(url, data = jsonData)
        if res.status_code != 200:
            print("Error posting data")
        else:
            print(res.text)

    def loop(self):
        while (True):
            self.reportSensors()
            sleep(10)

class Box:
    def __init__(self, x, y, big, name, soilHumidity, plantGrowth):
        self.x = x
        self.y = y
        self.big = big
        self.name = name
        self.soilHumidity = soilHumidity
        self.plantGrowth = plantGrowth

class Interface:
    def __init__(self, main):
        self.main = main
        self.temp = 21.01234567
        self.hum = 65
        self.light = 30
        self.boxes = []
        self.boxes.append(Box(0, 0, True, "Tomaat", 10, 30))
        self.boxes.append(Box(2, 0, False, "Tuinkers", 50, 60))
        self.boxes.append(Box(2, 1, False, "Basilicum", 99, 90))
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
        self.drawText(270, WINDOW_HEIGHT - 18, str(datetime.now().strftime("%d/%m/%Y %H:%M:%S")))
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

    def drawSoilHumidity(self, x, y, perc):
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
            self.drawSoilHumidity(box.x * CELL_WIDTH + 65, box.y * CELL_HEIGHT + 150, box.soilHumidity)
            self.drawPlantGrowth(box.x * CELL_WIDTH + 50, box.y * CELL_HEIGHT + 50, box.plantGrowth)
        else:
            self.drawText(box.x * CELL_WIDTH + 20, box.y * CELL_HEIGHT + 120, box.name)
            self.drawSoilHumidity(box.x * CELL_WIDTH + 20, box.y * CELL_HEIGHT + 20, box.soilHumidity)
            self.drawPlantGrowth(box.x * CELL_WIDTH + 80, box.y * CELL_HEIGHT + 30, box.plantGrowth)

    def drawBoxes(self):
        glLineWidth(1)
        for i in range(3):
            for j in range(2):
                glColor(0.2, 0.2, 0.2) # dark grey
                self.drawRectangle(i * CELL_WIDTH + 10, j * CELL_HEIGHT + 10)
                glColor(0.5, 0.5, 0.5) # grey
                self.drawRectangle(i * CELL_WIDTH + 10, j * CELL_HEIGHT + 10, True)
        for i in self.boxes:
            self.drawBox(i)        

    def draw(self):
        glClear(GL_COLOR_BUFFER_BIT)
        self.drawTitle()
        self.drawBoxes()
        glFlush()

    def update(self, var):
        data = self.main.readSensors()
        self.light = data[3]
        self.temp = data[4]
        self.hum = data[5]
        for i in self.boxes:
            i.soilHumidity = (i.soilHumidity - 1) % 100
            i.plantGrowth = (i.plantGrowth + 1) % 100
        glutPostRedisplay()
        glutTimerFunc(1000, self.update, 0)

    def click(self, button, state, x, y):
        pass
Main()