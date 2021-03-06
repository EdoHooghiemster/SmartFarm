from OpenGL.GL import * # pylint: disable=W0614
from OpenGL.GLUT import * # pylint: disable=W0614
from datetime import datetime
import requests

WINDOW_WIDTH = 480
WINDOW_HEIGHT = 320
TITLE_HEIGHT = 20
CELL_WIDTH = (WINDOW_WIDTH - 10) / 3
CELL_HEIGHT = (WINDOW_HEIGHT - TITLE_HEIGHT - 10) / 2

URL = "https://europe-west1-smartbroeikas.cloudfunctions.net/api/"

class Box:
    def __init__(self, dock, big, token, plantID):
        self.x = (dock - 1) // 2
        self.y = (dock - 1) % 2
        self.big = big
        self.token = token
        self.plantID = plantID
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

class Interface:
    def __init__(self):
        self.temp = 21.01234567
        self.hum = 65
        self.light = 30
        self.boxes = self.login()
        glutInit()
        #glutInitDisplayMode(GLUT_MULTISAMPLE)
        glutInitWindowSize(WINDOW_WIDTH, WINDOW_HEIGHT)
        glutCreateWindow("SmartFarm".encode("ascii"))
        #glutFullScreen()
        glBlendFunc(GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA)
        glEnable(GL_BLEND)
        glEnable(GL_LINE_SMOOTH)
        glOrtho(0, WINDOW_WIDTH, 0, WINDOW_HEIGHT, -1, 1) 
        glClearColor(0, .2, 0, 0) # dark green
        glutDisplayFunc(self.draw)
        glutMouseFunc(self.click)
        glutTimerFunc(1000, self.update, 0)
        glutMainLoop()

    def login(self):
        url = URL + "login"
        data = {
            "email": "damian@gmail.com",
            "password": "wachtwoord"
        }
        res = requests.post(url, data = data)
        if res.status_code != 200:
            print("Unable to log in")
            return
        token = res.text[1:-1]
        url = URL + "details"
        headers = {
            "Authorization": "Bearer " + token
        }
        res = requests.get(url, headers = headers)
        if res.status_code != 200:
            print("Unable to get user details")
            return
        userDetails = res.json()
        broeikas = userDetails["Broeikas"][0]
        self.farmID = broeikas["Id"]
        boxes = []
        for i in range(1, 7):
            plantID = broeikas["dock" + str(i)]
            if str(plantID) != "0":
                big = (i == 1) # nog aanpassen, uit stekker halen
                boxes.append(Box(i, big, token, plantID))
        return boxes
        
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
        for i in self.boxes:
            self.drawBox(i)        

    def draw(self):
        glClear(GL_COLOR_BUFFER_BIT)
        self.drawTitle()
        self.drawBoxes()
        glFlush()

    def update(self, var):
        self.hum = (self.hum + 1) % 100
        self.light = (self.light + 1) % 60
        self.temp = (self.temp - 14.5) % 10 + 15.0
        for i in self.boxes:
            i.soilHumidity = (i.soilHumidity - 1) % 100
            i.plantGrowth = (i.plantGrowth + 1) % 100
        glutPostRedisplay()
        glutTimerFunc(1000, self.update, 0)

    def click(self, button, state, x, y):
        pass

Interface()