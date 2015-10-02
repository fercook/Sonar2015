import datetime
import math
import random
import sys
import time
from functools import partial
import os

def exponentialMovingAverage(times,values,tau=120.0):
    out=[0.0 for x in values]
    out[0] = values[0]
    for j in range(1,len(values)):
        w = math.exp(-(times[j] - times[j-1]).total_seconds() / tau)
        out[j] = out[j-1] * w + values[j-1] * (1-w)
    return out

def simpleMovingAverage(times,values,tau=120.0):
    out=[0.0 for x in values]
    left = 0 
    roll_area = left_area = values[0] * tau 
    out[0] = values[0]
    for right in range(1,len(values)):
        #// Expand interval on right end
        roll_area = roll_area + values[right-1] * (times[right] - times[right-1]).total_seconds()
        #// Remove truncated area on left end
        roll_area = roll_area - left_area
        #// Shrink interval on left end
        t_left_new = times[right]- datetime.timedelta(seconds=tau)
        while ( times[left] <= t_left_new ):
            roll_area = roll_area - values[left] * (times[left+1] - times[left]).total_seconds()
            left = left + 1        
        #// Add truncated area on left end
        left_area = values[max(1, left-1)] * ( times[left]- t_left_new).total_seconds()
        roll_area = roll_area + left_area
        #// Save SMA value for current time window
        out[right] = roll_area / tau
    return out
 

def maxMovingAverage(times,values,tau=300.0):
    out=[0.0 for x in values]
    for center in range(len(values)):
        current_max = values[center]
        for right in range(center+1, len(values)):
            if ((times[right]-times[center]).total_seconds()>tau/2):
                break
            current_max=max(current_max,values[right])
        for left in range(center-1,-1,-1):
            if ((times[center]-times[left]).total_seconds()>tau/2):
                break
            current_max=max(current_max,values[left])
        out[center]=current_max    
    return out
 

    

# (box:0, time_stamp:1, mac:2, signal:3)    
def maxAverageSignal(timeline,tau=300.0, bias=0.75):
    out=[None for x in timeline]
    for center in range(len(timeline)):
        current_max = timeline[center][3] #Signal
        max_box = timeline[center][0]
        for right in range(center+1, len(timeline)):
            if ((timeline[right][1]-timeline[center][1]).total_seconds()>bias*tau):
                break
            if (timeline[right][3] > current_max):
                current_max=timeline[right][3]
                max_box=timeline[right][0]
        for left in range(center-1,-1,-1):
            if ((timeline[center][1]-timeline[left][1]).total_seconds()>tau*(1-bias)):
                break
            if (timeline[left][3] > current_max):
                current_max=timeline[left][3]
                max_box=timeline[left][0]
        out[center]=[timeline[center][1], max_box, current_max]
    return out



slotWidth=3
#datetime.timedelta(minutes=slotWidth)
totalMinutes=3*10*60 #=3*3*2*2*2*5*5

def slotIdxFromDate(date):
    
def dateFromSlotIdx(idx):
    slotsPerDay = 10*60/slotWidth
    slotsPerHour = 60/slotWidth
    day = 18 + int(idx/slotsPerDay)
    
    
    

#EXPORT TO CLEAN CSV FOR MAHOUT    
fo=open("mahout.csv",'w')
fo.write("mac,time,room,signal\n")
n=0
for mac in macs:
    if (vendor(mac)!="SPOOF"):
        n=n+1
        if (n%1000==0):
            print (n)
        timeline=db.getTimeline(mac)
        avgTimeline=maxAverageSignal(timeline)
        for event in avgTimeline:
            outStr=str(mac)
            for datum in event:
                outStr=outStr+', '+str(datum)
            fo.write(outStr+'\n')

            
fo.close()
    
def plotRandomMac():
    ranmac=random.randint(0,len(macs)-1)
    curves=db.getSplitTimeline(macs[ranmac])
    for cc in curves:
        plt.plot(cc["times"], simpleMovingAverage(cc["times"],cc["signals"],tau=120.0),'-o')
    plt.show()
    return macs[ranmac],curves



def plotMac(mac,room=None,avg=None):
    curves=db.getSplitTimeline(mac)
    for cc in curves:
        if (avg=="Simple"):
            ys=simpleMovingAverage(cc["times"],cc["signals"],tau=120.0)
        elif (avg=="Exponential"):
            ys=exponentialMovingAverage(cc["times"],cc["signals"],tau=120.0)
        elif (avg=="Max"):
            ys=maxMovingAverage(cc["times"],cc["signals"],tau=300.0)            
        else:
            ys=cc["signals"]
        if (room):
            if (cc['box']==room):
                plt.plot(cc["times"], ys,'-o')
        else:
            plt.plot(cc["times"], ys,'-o')
    plt.show()
    #return curves
    

def plotMaxSignal(mac):
    a=maxAverageSignal(db.getTimeline(mac))
    plt.plot([x[0] for x in a],[x[1] for x in a],'-o')
    plt.show()
    
    
    
def getSignals(timeline,room=None):
    signals=[]
    if (room):
        for event in timeline:
            if (event[0]==room):
                signals.append(event[3])
    else:
        for event in timeline:
            signals.append(event[3])
    return signals



def findMaxSignal(timeline,room=None):
    signals=getSignals(timeline,room)
    if (len(signals)>0):
        return max(signals)
    else:
        return None


untext='''    
    
from sonarDB import *
db=DB()
a=db.query("SELECT DISTINCT device_mac FROM tbox_events_log WHERE box_mac_id=6")

# Get total times for mac addresses
macTimes={}
fi=open('total_times_x_mac.csv','r')
for line in fi:
    sline=line.split(',')
    macTimes[int(sline[0])]=float(sline[1])        

    
maxSignals=[]
maxTimes=[]
for caca in a:
    mac=caca[0]
    maxTimes.append(macTimes[mac])
    maxSignals.append(findMaxSignal(db.getTimeline(mac)))

#Plot only strong and long signals    
for n in range(100):
    mac=a[n][0]
    tim=db.getTimeline(mac)
    ss=findMaxSignal(tim)
    if (ss>-65 and len(tim)>3):
        plotMac(mac,6)
  '''
    
otrotext='''

#Total time including time between days
start=time.time()
db=DB()
macs=db.getListOfMacs()
print ("Total rows: "+str(len(macs)))
print ("DB init took "+str(time.time()-start)+" secs")
start=time.time()
now=start
fo=open('total_times_x_mac.csv','w')
for mac in macs[0:128]:
    lap=now
    timeline = db.getTimeline(mac)
    val = ((timeline[-1][1]-timeline[0][1]).total_seconds() )
    fo.write(str(mac)+', '+str(val)+'\n')
    now=time.time()
    print (str(mac)+": "+str(now-lap))
fo.close()



Things to try:
print ("Try with 55415223792")

LOAD A DATABASE CURSOR:
db=DB()
macs=db.getListOfMacs()


plt.show()

for n in range(1,10):
  plt.plot(cc["times"], simpleMovingAverage(cc["times"],cc["signals"],tau=n*60.0),'-o')


for n in range(1,10):
  plt.plot(cc["times"], exponentialMovingAverage(cc["times"],cc["signals"],tau=n*60.0),'-o')


for cc in curves:
  plt.plot(cc["times"], simpleMovingAverage(cc["times"],cc["signals"],tau=120.0),'-o')









import datetime
from datetime.datetime import strptime
starttime=datetime.datetime.strptime("2015-06-18 12:00:00", "%Y-%m-%d %H:%M:%S")
endtime=datetime.datetime.strptime("2015-06-18 12:00:00", "%Y-%m-%d %H:%M:%S")




tims=db.getSplitTimeline(mac)


'''


#planta=

plantamacs=db.query("SELECT DISTINCT device_mac FROM tbox_events_log WHERE box_mac_id=6")
fi=open('total_times_x_mac.csv','r')
totaltimes={}
for line in fi:
    sline=line.split(',')
    totaltimes[int(sline[0])]=float(sline[1])


    
good_plantamacs=[]
noiseLevel = -66 # dB
minimumStay = 60 # seconds
n=0
for tup in plantamacs:
    if (n%1000==0):
        print (str(n)+' of '+str(len(plantamacs)))
    n=n+1
    mac=tup[0]
    longStay= times_per_mac[mac]["seconds18"] > minimumStay or times_per_mac[mac]["seconds19"] > minimumStay or times_per_mac[mac]["seconds20"] > minimumStay
    validVendor = True #vendor(mac) != "SPOOF"
    isNotNoise = findMaxSignal(db.getTimeline(mac)) > noiseLevel    
    if (longStay and validVendor and isNotNoise):
        good_plantamacs.append(mac)
        
        

spoof_plantamacs=[]
n=0
for tup in plantamacs:
    if (n%1000==0):
        print (str(n)+' of '+str(len(plantamacs)))
    n=n+1
    mac=tup[0]
    validVendor = vendor(mac) == "SPOOF"
    if (validVendor):
        good_plantamacs.append(mac)
        

# Data for planta:
# @1
# mac entry_time entry_exit Difference (including day info)
# @2
# Link to vendor csv
# @3
# 
n=0
planta_activity=[]
noiseLevel=-68
for mac in good_plantamacs:
    if (n%1000==0):
        print (str(n)+' of '+str(len(good_plantamacs)))
    n=n+1
    tim=db.getTimeline(mac)
    clean_tim=maxAverageSignal(tim,tau=300) #5 minute windows, items are time,box,signal
    record={}
    record["mac"]=mac
    record["hexmac"]=int2hex(mac)
    # First locate the times and durations of visits to Planta
    record["entries"]=[]
    prev_time=clean_tim[0][0]
    prev_box=clean_tim[0][1]
    if prev_box==6:
        isInside=True
        entry=[prev_time]
        curr_max_signal=clean_tim[0][2]
    else:
        isInside=False
        entry=None
    for eventIdx in range(1,len(clean_tim)):
        event=clean_tim[eventIdx]
        curr_time=event[0]
        curr_box=event[1]        
        if (curr_box==6 and prev_box!=6): #Open entry
            entry=[curr_time]
            curr_max_signal=event[2]
        elif (curr_box!=6 and prev_box==6): #Close entry
            curr_max_signal=max(curr_max_signal, event[2])
            if (curr_max_signal>noiseLevel):
                entry.append(clean_tim[eventIdx-1][0])
                entry.append((entry[1]-entry[0]).total_seconds())
                entry.append(curr_max_signal)
                record["entries"].append(entry)
            entry=None
        elif (curr_box==6 and prev_box==6):
            if ((curr_time-prev_time).total_seconds()>4*60*60): #4 hs is a good cutoff?
                entry.append(clean_tim[eventIdx-1][0])
                entry.append((entry[1]-entry[0]).total_seconds())
                entry.append(curr_max_signal)
                if (curr_max_signal>noiseLevel):
                    record["entries"].append(entry)
                entry=[curr_time]
            curr_max_signal=max(curr_max_signal, event[2])            
        prev_box=curr_box
        prev_time=curr_time
    if (curr_box==6 and prev_box==6): #we finished at planta
        if (curr_max_signal>noiseLevel):
            entry.append(clean_tim[-1][0])
            entry.append((entry[1]-entry[0]).total_seconds())
            entry.append(curr_max_signal)
            record["entries"].append(entry)
    # Now compare days at Sonar and days at Planta
    record["days_at_sonar"]=[None, None, None]
    record["times_at_sonar"]=[None, None, None]
    days=[18,19,20]
    for event in clean_tim:
        for nday in range(len(days)):               
            if (event[0].day==days[nday]):
                record["days_at_sonar"][nday]=True
                if (record["times_at_sonar"][nday]==None):
                    record["times_at_sonar"][nday]=[event[0],event[0]]
                else:    
                    if (event[0]<record["times_at_sonar"][nday][0]):
                        record["times_at_sonar"][nday][0]=event[0]
                    elif (event[0]>record["times_at_sonar"][nday][1]):
                        record["times_at_sonar"][nday][1]=event[0]
    record["days_at_planta"]=[0, 0, 0]
    for entry in record["entries"]:
        if entry[0].day!=entry[1].day:
            print ("Some problem with an entry ")
            print ([str(e) for e in entry])
        for day in range(len(days)):    
            if (entry[0].day==(18+day)):
                record["days_at_planta"][day]+=1
    planta_activity.append(record)





def esmodel(record):
    es_record={}
    es_record['days_at_sonar']={ "Thursday":record['days_at_sonar'][0], "Friday":record['days_at_sonar'][1], "Saturday":record['days_at_sonar'][2] }
    es_record['days_at_planta']={ "Thursday":record['days_at_planta'][0], "Friday":record['days_at_planta'][1], "Saturday":record['days_at_planta'][2] }    
    es_record['hexmac'] = record['hexmac']
    es_record['entries'] = record['entries']
    es_record['mac'] = record['mac']
    es_record['times_at_sonar'] = { "Thursday": record['times_at_sonar'][0], "Friday": record['times_at_sonar'][1], "Saturday": record['times_at_sonar'][2]}
    return es_record


def esentry(record):
    es_record={}
    es_record['days_at_sonar']={ "Thursday":record['days_at_sonar'][0], "Friday":record['days_at_sonar'][1], "Saturday":record['days_at_sonar'][2] }
    es_record['days_at_planta']={ "Thursday":record['days_at_planta'][0], "Friday":record['days_at_planta'][1], "Saturday":record['days_at_planta'][2] }    
    es_record['hexmac'] = record['hexmac']
    es_record['entries'] = record['entries']
    es_record['mac'] = record['mac']
    es_record['times_at_sonar'] = { "Thursday": record['times_at_sonar'][0], "Friday": record['times_at_sonar'][1], "Saturday": record['times_at_sonar'][2]}
    return es_record


#Move to Elastic Search
idx=0
for record in planta_activity:
    es_record = esmodel(record)
    res = es.index(index="planta_clean", doc_type='event', id=idx, body=es_record)    
    idx=idx+1





idx=0
for record in planta_activity:
    for entry in record['entries']:
        item={}
        item['mac']=record['hexmac']
        item['time']=entry[0]
        item['duration']=entry[2]
        item['signal']=entry[3]
        res = es.index(index="planta_entries", doc_type='event', id=idx, body=item)    
        idx=idx+1




# mac, time_in, time_out, duration, signal (ONE FOR SONAR ONE FOR PLANTA)
plantafo=open("planta_entries.csv",'w')
plantafo.write('mac, time_in, time_out, duration, signal\n')
sonarfo=open("sonar_entries.csv",'w')
sonarfo.write('mac, time_in, time_out, times_at_planta\n')
for record in planta_activity:
    for entry in record['entries']:
        out=str(record['mac'])
        out=out+', '+str(entry[0])
        out=out+', '+str(entry[1])
        out=out+', '+str(entry[2])
        out=out+', '+str(entry[3])
        plantafo.write(out+'\n')
    for day in record['times_at_sonar']:
        out=str(record['mac'])
        if (day != None):
            out=out+', '+str(day[0])
            out=out+', '+str(day[1])
            sonarfo.write(out+'\n')




plantafo=open("planta_days.csv",'w')
plantafo.write('mac, times_thu, times_fri, times_sat, total\n')
for record in planta_activity:
    out=str(record['mac'])
    for n in range(3):
        insideSonar=record['times_at_sonar'][n]
        if (insideSonar!=None):
            day=n+18
            times=0
            for entry in record['entries']:
                if entry[0].day==day:
                    times=times+1
            out=out+', '+str(times)
        else:
            out=out+', -1'
    plantafo.write(out+'\n')



plantafo.close()

stat={ 18: 
