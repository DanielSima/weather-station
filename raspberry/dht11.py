#!/usr/bin/python
import sys
import Adafruit_DHT
import time
import _mysql
import datetime

sensor = Adafruit_DHT.DHT11
pin = 4
host='mydbinstance.caikea6db5cp.eu-central-1.rds.amazonaws.com'
user='dan192000'
passwd=''
db='dan192000'
port=3306

try:
    connection = _mysql.connect(host, user, passwd, db, port)

    if connection.open:

        date = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
		
		#the function somehow returns two values
        humidity, temperature = Adafruit_DHT.read_retry(sensor, pin)
		
		#this executes the insert
        connection.query('insert into `weather_dashboard`(date,temperature,humidity) ' + 
            'values(\'' + date +'\','+ str(int(temperature)) +','+ str(int(humidity)) +')')
except:
    print ("Error while connecting to MySQL");
	