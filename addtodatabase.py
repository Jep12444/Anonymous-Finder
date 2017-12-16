
import tweepy
import datetime
import json
import time
from tweepy import OAuthHandler
from googleapiclient import discovery
 
import csv

consumer_key = 'm7aUlAvyIJ7iJo4pSfCfL54lE'
consumer_secret = 'R6Wv1Kwc0XBapup2RHkdrFE15H3y9USVTxXbX2aJcb2qeuOlcT'

access_token = '915698586536615936-OsZYiwl8iY0dxwnhJeR4jKnSfS0bG0u'
access_secret = 'refmc1RAYLwXmMCUb0rCtO73RPVSe1GJ5nncSY8nSuNKs'
	
API_KEY='AIzaSyALZF0wisf4F2pYla8326buj9tdUz3rgJo'
service = discovery.build('commentanalyzer', 'v1alpha1', developerKey=API_KEY)
 
auth = tweepy.OAuthHandler(consumer_key, consumer_secret)
auth.set_access_token(access_token, access_secret)
api = tweepy.API(auth)
ids = []
users = []

anonymous = open('anonymousdatabase.csv','a', encoding='utf-8')
real = open('nondatabase.csv', 'a', encoding='utf-8')
toxicUsers = open('toxicdatabase.csv','a', encoding='utf-8')

writer1 = csv.writer(anonymous)
writer2 = csv.writer(real)
writer3 = csv.writer(toxicUsers)


userList = []
userNames = []
results = []
toxic = []
inc = 0
hashtag = "BannedWords"
for status in tweepy.Cursor(api.search, q=hashtag).items(100):
	user = api.get_user(status.user.id)
	userNm = user.name
	if inc < 1:
		lastID = status.id_str
		inc += 1
	analyze_request = {
	  'comment': { 'text': status.text },
	  'requestedAttributes': {'TOXICITY': {}},
	  'languages' : ['en']
	}
	response = service.comments().analyze(body=analyze_request).execute()
	temp = response['attributeScores']
	temp2 = temp['TOXICITY']
	temp3 = temp2['spanScores']
	temp4 = temp3[0]
	temp5 = temp4['score']
	temp6 = temp5['value']
	if (temp6 < .5):
		toxic.append('Not Toxic')
	elif (temp6 >= .5 and temp6 < .75):
		toxic.append('Slightly Toxic')
	elif (temp6 >= .75 and temp6 < .9):
		toxic.append('Toxic')
	else:
		toxic.append('Very Toxic')
	userList.append(user)
	userNames.append(userNm)

i = 0
for curr_user in userList:
	
	anonVal = 0
	result = ""
	justCreated = datetime.datetime(2017, 9, 20, 0, 0)
	if (curr_user.followers_count != 0):
		ratio = curr_user.friends_count/ curr_user.followers_count
	
	if(curr_user.default_profile_image):
		anonVal += 1
	
	if(curr_user.default_profile):
		anonVal += 1
	
	if(curr_user.created_at < justCreated):
		anonVal += 1
	
	if(ratio > 5):
		anonVal += 1
		
	if(curr_user.contributors_enabled):
		anonVal += 1
	
	if(curr_user.favourites_count < 25):
		anonVal += 1
	
	if(curr_user.protected):
		anonVal -= 1
		
	if(curr_user.verified):
		result = "Not Anonymous"
	
	if(anonVal <= 1):
		result = "Not Anonymous"
	elif(anonVal > 1 and anonVal < 4):
		reslut = "Could be Anonymous"
	else:
		result = "Anonymous"


	myCsvRow=[curr_user.name, curr_user.screen_name, curr_user.statuses_count, curr_user.favourites_count, curr_user.followers_count, 
			curr_user.friends_count, curr_user.default_profile_image, curr_user.location, curr_user.created_at, curr_user.verified]	
	
	if (result == "Not Anonymous"):
		writer2.writerow(myCsvRow)
	else:
		writer1.writerow(myCsvRow)	
	
	#go through user list and add toxic ones to toxic file
	if (toxic[i] == "Toxic" or toxic[i] == "Very Toxic" or toxic[i] == "Slightly Toxic"):
		
		writer3.writerow(myCsvRow)

	i = i + 1

anonymous.close()
real.close()
toxicUsers.close()
