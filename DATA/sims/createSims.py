import random
import uuid
import json
import math

tendency_to_stay = 0.7
num_personas = 500
num_salas = 6
time_steps = 3600*12 # In Seconds
sampling_frequency = 30 # In seconds
rango_potencia = 100 # DB?
fidelidad_antenas = 0.5
prob_leaving = 0.8

dynamic_population = True

room_probabilities = [0.0, 0.05, 0.05, 0.25, 0.45, 0.15, 0.05]
for room in range(1,len(room_probabilities)):
    room_probabilities[room]=room_probabilities[room]+room_probabilities[room-1]

def pick_room(prev_room):
    new_room=prev_room
    while(new_room == prev_room):
        ran = random.random()
        for room in range(1,num_salas+1):
            if (ran<room_probabilities[room] and ran>=room_probabilities[room-1]):
                new_room = room 
    return new_room

class Person:
    id = 0
    sala = 0
    personality = 0.0
    potencia = 0.0
    last_change = 0.0
    #
    def __init__(this,sala):
        this.sala = sala
        this.id = uuid.uuid1()
        this.personality = 1-(tendency_to_stay+(1-tendency_to_stay)*random.random())
        this.potencia = random.random()*rango_potencia
    #
    def cambiar(this,time):
        cambio = random.random()
        # Typical change after an hour is Gaussian, shorter for smaller personality
        changerate = (time-this.last_change)*this.personality/(3600)
        changeprobability = math.exp(-0.5*changerate*changerate) 
        this.potencia = random.random()*rango_potencia
        if (cambio>changeprobability):
            this.sala = pick_room(this.sala)
            this.last_change = time
            return True
        return False
    #
    def to_dic(this,time):
        return { "room": this.sala, "id": str(this.id), "time": time, "power": this.potencia}

def delete_by_indices(lst, indices):
    indices_as_set = set(indices)
    return [ lst[i] for i in xrange(len(lst)) if i not in indices_as_set ]


personas = []
if (not dynamic_population):
    for n in range(num_personas):
        personas.append(Person(4))

separated_log = open("separated.json",'w') #Open file
#joined_log = open("joined.json",'w') #Open file
separated_times = []
joined_times = []
sigma = 2.0*3600 # 3 hs width
enter_peak = 4.0*3600 # at 4 pm
exit_peak = 9.0*3600 # at 9 pm
for t in range(time_steps/sampling_frequency):
    if (dynamic_population):
        # New people
        time = ((t*sampling_frequency)-enter_peak)/sigma
        new_people = int(sampling_frequency*(num_personas*math.exp(-0.5*time)/(math.sqrt(2)*sigma)))
        for n in range(new_people):
            personas.append(Person(4))
        time = ((t*sampling_frequency)-exit_peak)/sigma
        num_exit_people = int(prob_leaving*sampling_frequency*len(personas)*math.exp(-0.5*time)/(math.sqrt(2)*sigma))    
        exit_people = []
        for n in range(num_exit_people):
            exit_people.append( int(num_exit_people * random.random()) )
        personas = delete_by_indices(personas, exit_people)
    for p in personas:
        p.cambiar(t*sampling_frequency)
        pickup = random.random()
        if (pickup < fidelidad_antenas):
            #print (p.to_dic(t))
            separated_times.append(p.to_dic(t))
separated_log.write(json.dumps(separated_times))

print (str(len(personas))+" people entered")