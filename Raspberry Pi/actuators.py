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

class Main:
    def __init__(self):
        actuators = []
        a = Actuator("valve1", 19)
        actuators.append(a)
        a = Actuator("valve2", 16)
        actuators.append(a)
        a = Actuator("valve3", 26)
        actuators.append(a)
        a = Actuator("valve4", 20)
        actuators.append(a)
        a = Actuator("light", 21)
        actuators.append(a)
        a = Actuator("soilSensors", 6)
        actuators.append(a)

        for a in actuators:
            a.on()
            sleep(1)
            a.off()
            sleep(1)

Main()
