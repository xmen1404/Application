from tkinter import *
import math
import threading
import time

class TravelingSalesmanProblemGUI(threading.Thread):
    root = ''
    canvas = ''
    speed = 0
    tsp = ''

    def __init__(self, tsp, speed, h, w):

        self.h = h
        self.w = w

        self.tsp = tsp
        tsp.registerGUI(self)
        threading.Thread.__init__(self)
        self.speed = 1 / speed

    def callback(self):
        self.root.quit()

    def run(self):
        self.root = Tk()
        self.root.title("KAIST IE362 Traveling Salesman Problem")
        self.root.protocol("WM_DELETE_WINDOW", self.callback)

        self.canvas = Canvas(self.root, height = self.h, width = self.w)
        self.canvas.pack()

        self.root.mainloop()

    def update(self):
        time.sleep(self.speed)
        width = int( self.canvas.cget("width") )
        height = int( self.canvas.cget("height") )
        self.canvas.create_rectangle(0,0,width,height,fill='white')
        
        self.layoutCities()
        self.layoutRoutes()

    def stop(self):
        self.root.quit()
        
    def layoutCities(self):
        cities = len(self.tsp.dicLocations)
        for itr in range(cities):
            coordinate = self.tsp.dicLocations[itr]
            self.canvas.create_rectangle(coordinate[0], coordinate[1],coordinate[0]+3, coordinate[1]+3, fill='black')

    def layoutRoutes(self):
        genotype = self.tsp.best.getGenotype()
        if genotype[0] != 0: 
            print('bug here! start wrong')

        for itr in range(len(genotype)):
            currentCity = genotype[itr]
            nextCity = 0
            if itr < len(genotype) - 1: 
                nextCity = genotype[itr + 1]

            coord1 = self.tsp.dicLocations[currentCity]
            coord2 = self.tsp.dicLocations[nextCity]
            self.canvas.create_line(coord1[0],coord1[1],coord2[0],coord2[1])