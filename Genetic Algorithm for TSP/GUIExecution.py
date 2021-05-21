from TravelingSalesmanProblem import *
from TravelingSalesmanProblemGUI import *

speed = 1000
#data_mode = 'Random'
data_mode = 'Load'
csvfile = "TSP1.csv"
height = 800
width = 800
cities = 15
time = 10
mutationFactor = 0.4
numIterations = 100
numOffsprings = 80 # 80%
numPopulation = 100 # 100%

tsp = TravelingSalesmanProblem(data_mode,csvfile,cities,height, width, time)
gui = TravelingSalesmanProblemGUI(tsp, speed, height, width)
routes, utility, distance, elapsedTime = tsp.performEvolution(numIterations, numOffsprings, numPopulation, mutationFactor) 

currentCity = 0
route = ''
for itr in range(len(route)):
    route = route + '->' + str(currentCity)
    currentCity = routes[currentCity]
print ("===== 20200855 - Nguyen Thanh Vinh =====")
print ("Routes : %s" %(route))
print ("Distance : ", distance)
print ("Elapsed time : ", elapsedTime, "secs")
