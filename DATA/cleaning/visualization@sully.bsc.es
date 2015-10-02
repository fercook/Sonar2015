import mysql.connector 
#import matplotlib.pyplot as plt
import datetime
import math
import random
from multiprocessing import Pool
import sys
import time
from functools import partial
import os

def hex2int(hexmac):
    n = int(hexmac.replace(':', ''), 16)
    return n

def int2hex(intmac):
    st='%012x'%intmac
    st=':'.join(s.encode('hex') for s in st.decode('hex'))
    return st.upper()

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
    
    
class DB:
    cursor = None
    boxes = []
    cnx = None
    def __init__(self):
        self.cnx = mysql.connector.connect(user='root',database='sonar',port=3307, password='bsccns01')
        self.cursor=self.cnx.cursor()
        query=("SELECT * FROM tbox_mac")
        self.cursor.execute(query)
        self.boxes = self.cursor.fetchall()        
    def close(self):
        self.cursor.close()
        self.cnx.close()
    def getListOfMacs(self):
        # Check if mac is in hex string???
        query=("SELECT DISTINCT device_mac FROM tbox_events_log")
        self.cursor=self.cnx.cursor()
        self.cursor.execute(query)
        listofmacs = self.cursor.fetchall()
        return [x[0] for x in listofmacs]
    def getMacBoxes(self, mac):
        # Check if mac is in hex string???
        #### TWO VERSIONS; I DONT KNOW WHICH ONE IS FASTER
        query=("SELECT DISTINCT box_mac_id FROM tbox_events_log WHERE device_mac="+str(mac))
        self.cursor=self.cnx.cursor()
        self.cursor.execute(query)
        boxes = self.cursor.fetchall()
        return [x[0] for x in boxes]
    def getUniqueBoxes(self,timeline):
        boxesSet = set()
        for dat in timeline:
            boxesSet.add(dat[0])
        boxes=list(boxesSet)
        return boxes
    def getTimeline(self, mac):
        # Check if mac is in hex string???
        query=("SELECT * FROM tbox_events_log WHERE device_mac="+str(mac)+" ORDER BY event_time ASC")
        self.cursor=self.cnx.cursor()
        self.cursor.execute(query)
        timeline = self.cursor.fetchall()
        return timeline
    def getSplitTimeline(self, mac):
        timeline=self.getTimeline(mac)
        boxes=self.getUniqueBoxes(timeline)
        curves=[]
        for box in boxes:
            curves.append({"box":box, "times": [], "signals": []})
            for event in timeline:
                if (event[0]==box):
                    curves[-1]["times"].append( event[1] )
                    curves[-1]["signals"].append( event[3] )                
        return curves

    

def plotran():
    ranmac=random.randint(0,len(macs)-1)
    curves=db.getSplitTimeline(macs[ranmac])
    for cc in curves:
        plt.plot(cc["times"], simpleMovingAverage(cc["times"],cc["signals"],tau=120.0),'-o')
    plt.show()
    return macs[ranmac],curves
    
def isLong(mac):
    mydb=DB()
    timeline = mydb.getTimeline(mac)
    mydb.close()
    return mac,((timeline[-1][1]-timeline[0][1]).total_seconds() ) #10 minutes?

def isLongList(idxstart,maclist,chunksize):
    mydb=DB()
    mylist=maclist[idxstart*chunksize:(idxstart+1)*chunksize]
    myout=[]
    mytotal=len(mylist)
    for n in range(mytotal):
        if ((8*n)%total == 0):
            print ("Proc "+str(os.getpid())+" done "+str(100.0*n*8/total)+" %")
        mac=mylist[n]
        timeline = mydb.getTimeline(mac)
        myout.append( [mac, (timeline[-1][1]-timeline[0][1]).total_seconds()  ] )
    mydb.close()
    return myout
    
if __name__ == '__main__':    
    start=time.time()
    db=DB()
    macs=db.getListOfMacs()
    macs=macs[0:64]
    db.close()
    print ("Total rows: "+str(len(macs)))
    print ("DB init took "+str(time.time()-start)+" secs")
    start=time.time()
    procs=int(sys.argv[1])
    total = len(macs)-len(macs)%procs #We will miss some records at the end
    chunksize = total/procs
    p=Pool(processes=procs)
    partialisLongList = partial( isLongList,maclist=macs,chunksize=chunksize) 
    out = p.map(partialisLongList, xrange(procs) )
    p.close()
    p.join()
    print ("Processing took "+str(time.time()-start)+" secs")
    fo=open('total_times_x_mac.csv','w')
    for s in out:
        for mac,val in s:
            fo.write(str(mac)+', '+str(val)+'\n')
    fo.close()
    #print (out)

    
'''

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
'''
