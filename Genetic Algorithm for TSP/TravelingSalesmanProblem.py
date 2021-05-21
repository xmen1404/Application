from GeneticAlgorithmProblem import *
import random
import math
import time
import csv
from functools import cmp_to_key
import matplotlib.pyplot as plt
import sys

def compare(item1, item2): 
		return item1[1] - item2[1]

class TravelingSalesmanProblem(GeneticAlgorithmProblem):
    
	genes = []
	dicLocations = list()
	gui = ''
	best = ''
	time = 0
	temperature = 1000
    
	def __init__(self, data_mode,csvfile,numCities, height, width, time):
		self.time = time
		if data_mode == 'Random':
			for itr in range(numCities):
				x = random.uniform(0, width)
				y = random.uniform(0, height)
				coordinate = [x, y]
				self.dicLocations[itr] = coordinate
		elif data_mode == 'Load':
			with open(csvfile, 'r') as my_csv:
				contents = list(csv.reader(my_csv, delimiter=","))
				for itr in range(len(contents)):
					x , y= contents[itr][0],contents[itr][1]
					self.dicLocations.append([float(x),float(y)])
	def registerGUI(self, gui):
		self.gui = gui


	def check(self, instance): # DONE for phase 2
		genotype = instance.getGenotype()
    	
		total_dist = 0.0
		for itr in range(0, len(genotype)): 
			u = genotype[itr]
			v = 0
			if itr < len(genotype) - 1:
				v = genotype[itr + 1]
			total_dist += self.calculateDistance(self.dicLocations[u], self.dicLocations[v])
		return total_dist

	def performEvolution(self, numIterations, numOffsprings, numPopulation, mutationFactor): # DONE phase 2
		if self.gui != '':
			self.gui.start()

		startTime = time.time()
		population = self.createInitialPopulation(numPopulation, len(self.dicLocations)) # change this

		best_fitness_lst = list()
		while True:
			self.temperature = max(1.00, 0.98 * self.temperature)
			if self.best != '': 
				print(self.calculateTotalDistance(self.best))
			currentTime = time.time()
			if (currentTime - startTime) >= self.time:
				break
			offsprings = {}
			mate_pool = self.selectParents(population, numOffsprings) 
			for itr in range(numOffsprings):
			    # Put a correct method name and an argument
			    # HInt: You need a parent to create an offspring
				[p1, p2] = mate_pool[itr]

			    # After selecting a parent pair, you need to create
			    # an offspring. How to do that?
			    # Hint: You need to exchange the genotypes from parents
				offsprings[itr] = self.crossoverParents(p1, p2) 				# DONE phase 2
			    
			    # factor = int(mutationFactor * len(self.dicLocations.keys()))
			    # You need to add a little bit of chagnes in the
			    # genotype to see a potential random evolution
			    # this does not need information from either population
			    # or parent
				offsprings[itr] = self.mutation(offsprings[itr], mutationFactor)					# DONE phase 2

			    # After creating an offspring set, what do you have to
			    # perform?
			    # HINT: You need to put the offspring in the population
			population = self.substitutePopulation(population, offsprings, mutationFactor)		# DONE phase 2

			# which method do you need to use the best solution? and
			# from where?
			mostFittest = self.findBestSolution(population) 
			
			self.best = mostFittest

			if len(best_fitness_lst) < 5000: 
				best_fitness_lst.append(self.calculateTotalDistance(mostFittest))
		

		if self.gui != '': # remember to change this before submit (take 1 more tab here)
			self.gui.update()

		# plt.plot(range(len(best_fitness_lst)), best_fitness_lst)
		# plt.xlabel('Generations')
		# plt.ylabel('Best Total Distance')
		# plt.show()

		print(self.calculateTotalDistance(self.best))

		endTime = time.time()
		return self.best.getGenotype(), self.fitness(self.best), self.calculateTotalDistance(self.best), (endTime - startTime)

	def fitness(self, instance): # DONE for phase 3
		return 1.0 / self.calculateTotalDistance(instance)
    
	def calculateTotalDistance(self, instance): # DONE for phase 3

        # This genotype is created based upon a position based encoding
		# Fill in the following blanks to complete this method
		genotype = instance.getGenotype()
		distance = 0.0
		for itr in range(len(genotype)): # calculate all n edges
			currentCity = genotype[itr]
			nextCity = 0
			if itr < len(genotype) - 1:
				nextCity = genotype[itr + 1]
			distance = distance + self.calculateDistance(self.dicLocations[currentCity], self.dicLocations[nextCity])
		return distance
    
	def calculateDistance(self, coordinate1, coordinate2):	# DONE for phase 3
        # how to calculate the distance between two cities?
		# how to calculate the squre and the square root?
		return math.sqrt( (coordinate1[0]-coordinate2[0])*(coordinate1[0]-coordinate2[0]) + (coordinate1[1]-coordinate2[1])*(coordinate1[1]-coordinate2[1]) )

	def getPotentialGenes(self): # DONE for phase 3
		return self.dicLocations.keys()

	def rearrange(self, W_init):
		Found = True
	    
		while (Found):
			Found = False
			for i in range(len(W_init)):
				a = self.dicLocations[W_init[i]]
				b = self.dicLocations[W_init[(i + 1) % len(W_init)]]

				for j in range(i - 1):
					u = self.dicLocations[W_init[j]]
					v = self.dicLocations[W_init[j + 1]]

					if (self.calculateDistance(u, v) + self.calculateDistance(a, b) > self.calculateDistance(u, a) + self.calculateDistance(v, b)):
						l = j + 1
						r = i
						while (l < r):
							W_init[l], W_init[r] = W_init[r], W_init[l]
							l += 1
							r -= 1
						Found = True
						break
				if (Found):
					break
		while W_init[0] != 0: 
			W_init.append(W_init[0])
			del W_init[0]
		return  W_init

	def createInitialPopulation(self, numPopulation, numCities): # DONE for phase 3
		population = []
		visit = [0 for s in range(numCities)]
		for itr in range(0, numCities): 
			instance = GeneticAlgorithmInstance()

			genotype = list()
			genotype.append(0)
			visit[0] = 1
			if itr > 0: 
				genotype.append(itr)
				visit[itr] = 1

			while len(genotype) < numCities: 
				min_dist = 999999999.0
				min_id = -1
				cur_city = genotype[-1]
				for nxt_city in range(numCities): 
					if visit[nxt_city] == 0: 
						if ((min_id == -1) | (min_dist > self.calculateDistance(self.dicLocations[cur_city], self.dicLocations[nxt_city]))) > 0: 
							min_id = nxt_city
							min_dist = self.calculateDistance(self.dicLocations[cur_city], self.dicLocations[nxt_city])
				genotype.append(min_id)
				visit[min_id] = 1
			for i in range(numCities): 
				visit[i] = 0
			genotype = self.rearrange(genotype)
			instance.setGenotype(genotype)
			instance = self.mutation(instance, 1)
			instance = self.mutation(instance, 0.9)
			instance = self.mutation(instance, 0.8)
			# instance = self.mutation(instance, 0.7)
			population.append(instance)

		numPopulation -= numCities
		for itr in range(numPopulation):
			instance = GeneticAlgorithmInstance()

			genotype = list(range(1, numCities))
			random.shuffle(genotype)
			genotype.append(0)
			genotype[0], genotype[-1] = genotype[-1], genotype[0]

			instance.setGenotype(genotype)
			population.append(instance)

		return population
        
	def findBestSolution(self, population): # DONE for phase 3
		idxMaximum = -1
		max = -99999
		for itr in range(len(population)):
			if max < self.fitness(population[itr]):
				max = self.fitness(population[itr])
				idxMaximum = itr

		res = GeneticAlgorithmInstance()
		genotype = population[idxMaximum].getGenotype()
		ngenotype = list(range(len(genotype)))
		for itr in range(len(genotype)): 
			ngenotype[itr] = genotype[itr]
		res.setGenotype(ngenotype)
		return res
    
	def selectParents(self, population, numOffsprings): # DONE for phase 2
    	# We need to select numOffsprings pair of parent
		fitness_lst = list(range(len(population)))
		fitness_total = 0.0
		for i in range(len(population)): 
			fitness_lst[i] = math.exp(self.fitness(population[i]) / self.temperature)
			fitness_total += fitness_lst[i]

		mate_pool = list(range(numOffsprings))
		for itr in range(numOffsprings): 
			prob = random.uniform(0, fitness_total)
			p1 = None
			tmp_sum = 0.0
			for i in range(len(population)): 
				tmp_sum += fitness_lst[i]
				if tmp_sum >= prob: 
					p1 = i
					break
			p2 = p1
			while p2 == p1: 
				prob = random.uniform(0, fitness_total)
				tmp_sum = 0.0
				for i in range(len(population)): 
					tmp_sum += fitness_lst[i]
					if tmp_sum >= prob: 
						p2 = i
						break
			# print(p1, p2)
			mate_pool[itr] = [population[p1], population[p2]]
		return mate_pool

	def crossoverParents(self, instance1, instance2): # DONE for phase 3
		genotype1 = instance1.getGenotype()
		genotype2 = instance2.getGenotype()
		newInstance = GeneticAlgorithmInstance()

		left, right = random.randint(0, len(genotype1) - 1), random.randint(0, len(genotype1) - 1)
		if left > right: 
			left, right = right, left

		path = list(range(len(genotype1)))
		visit = [0 for s in range(len(genotype1))]
		for i in range(left, right + 1): 
			path[i] = genotype1[i]
			visit[path[i]] = 1
		visit[0] = 1

		ptr = 1
		for i in range(1, len(genotype1)):  
			if ((left <= i) & (i <= right)) > 0: 
				continue

			while visit[genotype2[ptr]] == 1: 
				ptr += 1

			path[i] = genotype2[ptr]
			visit[genotype2[ptr]] = 1

		newInstance.setGenotype(path)
		return newInstance

	def mutation(self, instance, factor): # DONE for phase 2
		genotype = instance.getGenotype()
		prob = random.uniform(0, 1)
		if prob > factor: 
			return instance

		left, right = 0, 0
		while (left == right): 
			left, right = random.randint(1, len(genotype) - 1), random.randint(1, len(genotype) - 1) 
		if left > right: 
			left, right = right, left

		genotype[left], genotype[right] = genotype[right], genotype[left]
		instance.setGenotype(genotype)

		return instance
    

	def substitutePopulation(self, population, children, mutationFactor): # DONE for phase 3
		tmp = list()
		for x in population: 
			tmp.append([x, self.fitness(x)])
		tmp = sorted(tmp, key=cmp_to_key(compare))

		for i in range(len(population)): 
			population[i] = tmp[i][0]
		prob = random.uniform(0, 1)
		if prob <= 0.1: 
			random.shuffle(population)

		for itr in range(len(children)):
			prob = random.uniform(0, 1)
			if prob <= 0.01: 
				genotype = children[itr].getGenotype()
				genotype = self.rearrange(genotype)
				children[itr].setGenotype(genotype)
			population[itr] = children[itr]
		return population
