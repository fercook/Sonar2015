#from datetime import datetime
import datetime
from elasticsearch import Elasticsearch

from sonarDB import *

es = Elasticsearch()

db=DB()
db.cursor.execute("SELECT * FROM tbox_events_log") #.query("SELECT * FROM tbox_events_log")
idx=0
# Sampla datum
# (1, datetime.datetime(2015, 6, 19, 13, 45, 41), 55415220329, -79)
for sql_event in db.cursor:
    event = {
    'box_id': sql_event[0], 
    'event_time': sql_event[1], 
    'device_mac': sql_event[2], 
    'ssisignal': sql_event[3]        
    }
    res = es.index(index="sonar_events", doc_type='event', id=idx, body=event)    
    idx=idx+1
    if (idx%1000==0):
        print (str(idx)+' articles')
    
            
            
'''
# Maybe this can be done with the bulk operator
# It needs an iterator of actions, but I don't know how to do that
#
            
class SQLIterator:
    db=None
    def __init__(self,aquery=None):
        self.db=DB()
        if(aquery):
            query=aquery
        else:
            query="SELECT * FROM tbox_events_log"
        self.db.cursor.execute(query)
    def __iter__(self):
        return self
    def next(self):
        try:
            item=self.db.cursor
        
'''