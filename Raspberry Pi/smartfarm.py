# Import SPI library (for hardware SPI) and MCP3008 library.
import Adafruit_GPIO.SPI as SPI
import Adafruit_MCP3008

import tkinter as tk

CHANNELS = 8
SPI_PORT = 0
SPI_DEVICE = 0

class MainWindow(tk.Frame):
    def __init__(self, master):
        tk.Frame.__init__(self, master)               
        self.master = master
        self.master.title("SmartFarm")
        self.readOut = []
        for i in range(CHANNELS):
            label = tk.Label(self.master, text = "Channel " + str(i))
            label.grid(row = i, column = 0)
            entry = tk.Entry(self.master, state = "readonly", width = 5)
            entry.grid(row = i, column = 1)
            self.readOut.append(entry)

class Main:
    def __init__(self):
        spi = SPI.SpiDev(SPI_PORT, SPI_DEVICE)
        self.mcp = Adafruit_MCP3008.MCP3008(spi = spi)
        self.root = tk.Tk()
        self.window = MainWindow(self.root)
        self.displayData()
        self.root.mainloop()
    
    def getData(self):
        data = []
        for i in range(CHANNELS):
            data.append(self.mcp.read_adc(i))
        return data
    
    def displayData(self):
        data = self.getData()
        for i in range(len(data)):
            v = tk.StringVar()
            self.window.readOut[i]["textvariable"] = v
            v.set(data[i])
        self.root.after(500, self.displayData)

Main()
