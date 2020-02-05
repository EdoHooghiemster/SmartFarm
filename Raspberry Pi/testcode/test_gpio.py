import RPi.GPIO as gp
from time import sleep

BCMpin = 19

gp.setmode(gp.BCM)
gp.setup(BCMpin, gp.OUT)

while True:
	gp.output(BCMpin, gp.HIGH)
	sleep(2)
	gp.output(BCMpin, gp.LOW)
	sleep(2)
