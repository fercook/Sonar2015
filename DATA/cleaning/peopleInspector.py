# Get total times for mac addresses
macTimes={}
fi=open('total_times_x_mac.csv','r')
for line in fi:
    sline=line.split(',')
    macTimes[int(sline[0])]=float(sline[1])        

macs=totaltimes.keys()
times=[]
days=[18,19,20]
n=0
for mac in macs:
    if (n%1000==0):
        print (str(n)); 
    n=n+1
    timeline = db.getTimeline(mac)
    for day in days:
        presence=[]        
        tim=[event for event in timeline if event[1].day==day]
        if (len(tim)>0):
            presence.append( mac )
            presence.append( day )
            presence.append( tim[0][1].strftime("%H:%M:%S") )            
            presence.append( tim[-1][1].strftime("%H:%M:%S") )            
            presence.append( (tim[-1][1]-tim[0][1]).total_seconds()/60 )
#        else:
        times.append(presence)


    
    
fo=open('timesperday.csv','w')
fo.write("control, mac, day, hour_in, hour_out, total_minutes")
for item in times:
    out="0"
    for dat in item:
        out=out+', '+str(dat)
    fo.write(out+'\n')

fo.close()




fo=open('timesperday_structured.csv','w')
fo.write("mac, hour_in_18, hour_out_18, total_minutes_18, hour_in_19, hour_out_19, total_minutes_19, hour_in_20, hour_out_20, total_minutes_20\n")
def writeitem(item):
    out=str(item[0])
    for dat in item[1:]:
        out=out+', '+str(dat)
    fo.write(out+'\n')    

    

    
def daysobj(item):
    obj={}
    obj["mac"]=item[0]
    obj["in18"]=item[1]; obj["out18"]=item[2]; obj["seconds18"]=item[3]
    obj["in19"]=item[4]; obj["out19"]=item[5]; obj["seconds19"]=item[6]
    obj["in20"]=item[7]; obj["out20"]=item[8]; obj["seconds20"]=item[9]
    return obj



blank=[None, None, 0.0]
times_per_day=[]
times_obj=[]
times_per_mac={}
for item in times:
    outlist=[item[0]]
    if (len(item)==5):
        if (item[1]==18):
            outlist=outlist+item[2:5]+blank+blank
        if (item[1]==19):
            outlist=outlist+blank+item[2:5]+blank
        if (item[1]==20):
            outlist=outlist+blank+blank+item[2:5]
    elif(len(item)==10):
        if (item[1]==18 and item[6]==19):
            outlist=outlist+item[2:5]+item[7:10]+blank
        if (item[1]==19 and item[6]==20):
            outlist=outlist+blank+item[2:5]+item[7:10]
        if (item[1]==18 and item[6]==20):
            outlist=outlist+item[2:5]+blank+item[7:10]
    elif(len(item)==15):
        outlist=outlist+item[2:5]+item[7:10]+item[12:15]
    writeitem(outlist)
    times_per_day.append(outlist)
    times_obj.append(daysobj(outlist))
    times_per_mac[outlist[0]]=daysobj(outlist)






fo=open('timesperday.csv','w')
fo.write("control, mac, day, hour_in, hour_out, total_minutes")
def putout(item):
    out="0"
    for dat in item:
        out=out+', '+str(dat)
    fo.write(out+'\n')    

    
for item in times:
    if (len(item)==5):
        putout(item)
    elif(len(item)==10):
        putout(item[0:5])
        putout(item[5:10])
    elif(len(item)==15):
        putout(item[0:5])
        putout(item[5:10])
        putout(item[10:15])

fo.close()
    
    
    
    
for item in times:
    if (len(item)==5):
        putout(item)
    elif(len(item)==10):
        putout(item[0:5])
        putout(item[5:10])
    elif(len(item)==15):
        putout(item[0:5])
        putout(item[5:10])
        putout(item[10:15])
    
    
    
# MAC vender
fi=open("brands.txt",'r')
brands={}
for line in fi:
    try:
        sline=line.split('(hex)')
        mac=sline[0].replace('-',':').replace('"','').strip()
        company=sline[1].strip()
        brands[mac]=company
    except:
        print (line)

        
def vendor(mac):
    smac=int2hex(mac)[0:8]
    if (smac in brands):
        return brands[smac]
    else:
        return "SPOOF"


fo=open("brands.csv",'w')    
fo.write("Mac, Vendor")
for mac in macs:
    fo.write(str(mac)+', '+vendor(mac)+'\n')

fo.close()
    
