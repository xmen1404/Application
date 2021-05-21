from TravelingSalesmanProblem import *

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
routes, utility, distance, elapsedTime = tsp.performEvolution(numIterations, numOffsprings, numPopulation, mutationFactor) 
# numIterations, numOffsprings, numPopulation, mutationFactor

currentCity = 0
route = ''
for itr in range(len(routes)):
	currentCity = routes[itr]
	route = route + '->' + str(currentCity)
print ("===== 20200855 - Nguyen Thanh Vinh =====")
print ("Routes : %s" %(route))
print ("Distance : ", distance)
print ("Elapsed time : ", elapsedTime, "secs")
