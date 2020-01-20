
import RPi.GPIO as gp
import Adafruit_GPIO.SPI as SPI
import Adafruit_MCP3008
import Adafruit_DHT as DHT
from time import sleep
import requests
from actuators import Actuator
from sensor import SoilMoistureSensor, LightSensor, TemperatureSensor, HumiditySensor

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
        self.loop()
    
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
        if res.status_code != 201:
            print("Error posting data")
        else:
            print(res.text)

    def loop(self):
        while (True):
            self.reportSensors()
            sleep(10)

Main()  
