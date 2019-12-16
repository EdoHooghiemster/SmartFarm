# Import SPI library (for hardware SPI) and MCP3008 library.
import Adafruit_GPIO.SPI as SPI
import Adafruit_MCP3008

class Sensor:
    def __init__(self, name, unit):
        self.name = name
        self.unit = unit
        self.rawValue = 0.0
        self.value = 0.0

    def calibrationFunction(self, x):
        return x
    
    def getReadout(self):
        return str(self.value) + " " + self.unit

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
        
class TemperatureSensor(DigitalSensor):
    def __init__(self, name, unit):
        super().__init__(name, unit)

class HumiditySensor(DigitalSensor):
    def __init__(self, name, unit):
        super().__init__(name, unit)

class Main:
    def __init__(self):
        spi = SPI.SpiDev(SPI_PORT, SPI_DEVICE)
        mcp = Adafruit_MCP3008.MCP3008(spi = spi)
        sensors = []
        s = SoilMoistureSensor("SMS1", "%", mcp, 0)
        sensors.append(s)
        s = SoilMoistureSensor("SMS2", "%", mcp, 1)
        sensors.append(s)
        s = SoilMoistureSensor("SMS3", "%", mcp, 2)
        sensors.append(s)
        s = LightSensor("Light", "lux", mcp, 3)
        sensors.append(s)

        data = [s.read() for s in sensors]
        for s in sensors:
            print(s.name + ": " + s.getReadout())

Main()  
