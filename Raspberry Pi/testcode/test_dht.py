import Adafruit_DHT as DHT

from time import sleep

sensor = DHT.DHT22

dhtPin = 14

while True:
	hum, temp = DHT.read_retry(sensor, dhtPin)
	print("hum: " + str(hum))
	print("temp: " + str(temp))
	sleep(1)
