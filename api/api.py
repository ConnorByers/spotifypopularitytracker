from flask import Flask, request
import time
from flask_sqlalchemy import SQLAlchemy
from secrets import database_uri

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = database_uri

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

class AlbumPopularityEvent(db.Model):
    __tablename__ = 'PopularityEvent'
    id = db.Column(db.Integer, primary_key=True)
    albumId = db.Column(db.String(50))
    albumName = db.Column(db.String(75))
    albumPopularity = db.Column(db.Integer)
    date = db.Column(db.String(50))

    def __init__(self, albumId, albumName, albumPopularity, date):
        self.albumId = albumId
        self.albumName = albumName
        self.albumPopularity = albumPopularity
        self.date = date

class AlbumArtistMapping(db.Model):
    __tablename__ = 'AlbumArtistMap'
    id = db.Column(db.Integer,primary_key=True)
    albumId = db.Column(db.String(50))
    artistId = db.Column(db.String(50))
    artistName = db.Column(db.String(50))

    def __init__(self, albumId, artistId, artistName):
        self.albumId = albumId
        self.artistId = artistId
        self.artistName = artistName

@app.route('/add_album_popularities', methods=['POST'])
def addAlbumPopularities():
    if(request.method == 'POST'):
        dataArray = request.get_json()['data']
        for albumObj in dataArray:
            row = AlbumPopularityEvent(albumObj['id'], albumObj['name'], albumObj['popularity'], albumObj['date'])
            db.session.add(row)
        db.session.commit()
    return('GOOD')
    
@app.route('/update_album_artist_map', methods=['POST'])
def updateAlbumArtistMap():
    if(request.method == 'POST'):
        dataArray = request.get_json()['data']
        db.session.query(AlbumArtistMapping).delete()
        for albumArtistMapObj in dataArray:
            row = AlbumArtistMapping(albumArtistMapObj['albumId'], albumArtistMapObj['artistId'], albumArtistMapObj['artistName'])
            db.session.add(row)
        db.session.commit()
        return('GOOD')

@app.route('/get_all_album_data', methods=['GET'])
def getAllAlbumData():
    if(request.method == 'GET'):
        artistsMapArr = db.session.query(AlbumArtistMapping).all()
        artistsMapDict = {}
        for artistMap in artistsMapArr:
            artistsMapDict[artistMap.artistId] = artistMap.artistName
        allArtistIds = list(artistsMapDict.keys())
        returnObj = {}
        for artistId in allArtistIds:
            returnObj[artistId] = {"artistName": artistsMapDict[artistId], "popularities": []}
        res = db.session.query(AlbumPopularityEvent, AlbumArtistMapping).join(AlbumArtistMapping, AlbumPopularityEvent.albumId == AlbumArtistMapping.albumId).all()
        for event, mapping in res:
            returnObj[mapping.artistId]["popularities"].append({"popularity": event.albumPopularity, "date": event.date, "album": event.albumName})
        
        return(returnObj)
