from flask import Flask, request, Response
import time
from flask_sqlalchemy import SQLAlchemy
from secrets import database_uri, api_access_secret

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = database_uri

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

class AlbumPopularityEvent(db.Model):
    __tablename__ = 'PopularityEvent'
    id = db.Column(db.Integer, primary_key=True)
    albumId = db.Column(db.String(50))
    albumPopularity = db.Column(db.Integer)
    date = db.Column(db.String(50))

    def __init__(self, albumId, albumPopularity, date):
        self.albumId = albumId
        self.albumPopularity = albumPopularity
        self.date = date

class AlbumArtistMapping(db.Model):
    __tablename__ = 'AlbumArtistMap'
    id = db.Column(db.Integer,primary_key=True)
    albumId = db.Column(db.String(50))
    artistId = db.Column(db.String(50))
    artistName = db.Column(db.String(50))
    albumName = db.Column(db.String(75))

    def __init__(self, albumId, artistId, artistName, albumName):
        self.albumId = albumId
        self.artistId = artistId
        self.artistName = artistName
        self.albumName = albumName

@app.route('/add_album_popularities', methods=['POST'])
def addAlbumPopularities():
    if(request.method == 'POST'):
        if(request.get_json()['api_access_secret'] == api_access_secret):
            dataArray = request.get_json()['data']
            for albumObj in dataArray:
                row = AlbumPopularityEvent(albumObj['id'], albumObj['popularity'], albumObj['date'])
                db.session.add(row)
            db.session.commit()
            return(Response("{'message':'SUCCESS'}", status=200, mimetype='application/json'))
        else:
            return(Response("{'message':'INCORRECT API ACCESS SECRET'}", status=401, mimetype='application/json'))

    
    
@app.route('/update_album_artist_map', methods=['POST'])
def updateAlbumArtistMap():
    if(request.method == 'POST'):
        if(request.get_json()['api_access_secret'] == api_access_secret):
            dataArray = request.get_json()['data']
            db.session.query(AlbumArtistMapping).delete()
            for albumArtistMapObj in dataArray:
                row = AlbumArtistMapping(albumArtistMapObj['albumId'], albumArtistMapObj['artistId'], albumArtistMapObj['artistName'], albumArtistMapObj['albumName'])
                db.session.add(row)
            db.session.commit()
            return(Response("{'message':'SUCCESS'}", status=200, mimetype='application/json'))
        else:
            return(Response("{'message':'INCORRECT API ACCESS SECRET'}", status=401, mimetype='application/json'))

@app.route('/get_all_album_data', methods=['GET'])
def getAllAlbumData():
    if(request.method == 'GET'):
        if(request.get_json()['api_access_secret'] == api_access_secret):
            artistsMapArr = db.session.query(AlbumArtistMapping).all()
            artistsMapDict = {}
            for artistMap in artistsMapArr:
                artistsMapDict[artistMap.artistId] = artistMap.artistName
            allArtistIds = list(artistsMapDict.keys())
            returnObj = {}
            for artistId in allArtistIds:
                returnObj[artistId] = {"artistName": artistsMapDict[artistId], 'albumIds': {}}
                artistAlbumIds = []
                for artistMap in artistsMapArr:
                    if(artistId == artistMap.artistId):
                        artistAlbumIds.append(artistMap.albumId)
                print(artistAlbumIds)

                artistAlbumIds = list(dict.fromkeys(artistAlbumIds)) # elim duplicate entries
                for albumId in artistAlbumIds:
                    returnObj[artistId]['albumIds'][albumId] = {"albumName": False, "popularities": []}
            res = db.session.query(AlbumPopularityEvent, AlbumArtistMapping).join(AlbumArtistMapping, AlbumPopularityEvent.albumId == AlbumArtistMapping.albumId).all()
            for event, mapping in res:
                if(returnObj[mapping.artistId]['albumIds'][event.albumId]['albumName'] == False):
                    returnObj[mapping.artistId]['albumIds'][event.albumId]['albumName'] = mapping.albumName
                returnObj[mapping.artistId]['albumIds'][event.albumId]['popularities'].append({"popularity": event.albumPopularity, "date": event.date})
            
            return(returnObj)
        else:
            return(Response("{'message':'INCORRECT API ACCESS SECRET'}", status=401, mimetype='application/json'))
