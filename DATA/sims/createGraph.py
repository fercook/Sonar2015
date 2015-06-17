import random
import uuid
import json
import math

tendency_to_stay = 0.7
num_personas = 10000
num_salas = 6
time_steps = 30*60 # In Minutes
sampling_frequency = 15 # In minutes
prob_leaving = 0.8


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



separated_log = open("test_graph.json",'w') #Open file
rooms = []
links = []
macbase = "de:de:de:de:de:"
macs=[]
for n in range(10):
    macs.append(macbase+(str(n).zfill(2)))

emacs = macs
print (emacs)
emacs.append("entry")
emacs.append("exit")

graph=[]
for day in range(18,20):
    for hour in range(10,24):
        for period in range(4):
            minutes = max(min(int(period*15+2*2*(random.random()-0.5)),59),0)
            sdate = "2015-06-"+str(day)+" "+str(hour)+":"+str(minutes).zfill(2)+":12"
            edate = "2015-06-"+str(day)+" "+str(hour)+":"+str(minutes).zfill(2)+":49"
            entry={ "time_start": sdate, "time_end":edate }            
            ppl = math.sin(3.1415*(hour-19)/12)
            total_public = num_personas*ppl*ppl
            rooms = []
            links = []
            for mac in macs:
                room = {"name": mac, "devices": total_public,  "very_high": int(total_public*0.2), "high": int(total_public*0.6), "low": int(total_public*0.05),"medium": int(total_public*0.15)}
                rooms.append(room)            
            for s in emacs:
                for e in emacs:
                    link = { "start_room": s, "end_room": e,  "value": int(total_public*0.2*random.random()) }
                    links.append(link)
            entry["rooms"] = rooms
            entry["links"] = links
            graph.append(entry)
          
djson = { "graph":  graph  }
                
separated_log.write(json.dumps(djson))

