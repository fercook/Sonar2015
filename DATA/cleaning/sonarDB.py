import mysql.connector 
#import matplotlib.pyplot as plt
import datetime
#from rooms import roomList

def hex2int(hexmac):
    n = int(hexmac.replace(':', ''), 16)
    return n

def int2hex(intmac):
    st='%012x'%intmac
    st=':'.join(s.encode('hex') for s in st.decode('hex'))
    return st.upper()

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
    def query(self,aquery):
        self.cursor=self.cnx.cursor()
        self.cursor.execute(aquery)
        return self.cursor.fetchall()
