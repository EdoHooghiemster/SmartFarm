# Import SPI library (for hardware SPI) and MCP3008 library.
import Adafruit_GPIO.SPI as SPI
import Adafruit_MCP3008

# Import DHT library
import Adafruit_DHT as DHT

SPI_PORT = 0
SPI_DEVICE = 0
DHT_PIN = 13

import RPi.GPIO as gp
from time import sleep

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

class Main:
    def __init__(self):
        spi = SPI.SpiDev(SPI_PORT, SPI_DEVICE)
        mcp = Adafruit_MCP3008.MCP3008(spi = spi)
        s = SoilMoistureSensor("SMS3", "%", mcp, 2)
        a = Actuator("soilSensors", 6)
        while True:
            a.on();
            sleep(0.5)
            print(s.name + ": " + str(s.read()))
            a.off()
            sleep(2)

Main()  
