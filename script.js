const axios = require('axios');

const artistIds = [];

const params = {
    grant_type: 'client_credentials'
}

const spotifyAuthorization = "";
const api_access_secret = '';

const options = {
    method: 'POST',
    headers: {
        'Authorization': spotifyAuthorization,
        'content-type': 'application/x-www-form-urlencoded'
    },
    data: 'grant_type=client_credentials',
    url: 'https://accounts.spotify.com/api/token'
}

const getQueryParam = (key, stringList) => {
    let idString = key;
    idString+='=';
    for(let x = 0; x<stringList.length-1; x++){
        idString+=stringList[x];
        idString+=','
    }
    idString+=stringList[stringList.length-1];
    return idString;
}

const getAllAlbumIds = async (artistIds, Header) => {
    const albumIds = [];

    for(const artistId of artistIds){
        const res = await axios.get(`https://api.spotify.com/v1/artists/${artistId}/albums?include_groups=album&limit=50`, Header)
        res.data.items.forEach(albumObjectSimplified=>{
            albumIds.push(albumObjectSimplified.id);
        });
    }

    return albumIds;
}

const getFullAlbumObjects = async (arrayOfAlbumIdArrays, Header) => {
    const albumObjectArray = [];

    for(const albumIdArray of arrayOfAlbumIdArrays){
        const idString = getQueryParam('ids', albumIdArray);
        const res = await axios.get(`https://api.spotify.com/v1/albums?${idString}`, Header);
        res.data.albums.forEach(albumObjectFull=>{
            albumObjectArray.push(albumObjectFull);
        });
    }

    return albumObjectArray;
}

const getAlbumIdForPost = (prevArray, albumIds, artist) => {
    albumIds.forEach((album)=>{
        prevArray.push({artistId: artist.artistId, artistName: artist.artistName, albumId: album.id, albumName: album.name})
    });
    return prevArray;
}


axios(options)
    .then(async (res)=>{
        const artists = [
            {artistName: "Tory Lanez", artistId: '2jku7tDXc6XoB6MO2hFuqg'},
            {artistName: "Travis Scott", artistId: '0Y5tJX1MQlPlqiwlOH1tJY'}, 
            {artistName: "Saint Jhn", artistId: '0H39MdGGX6dbnnQPt6NQkZ'}, 
            {artistName: "Sheff G", artistId: '1tG7s7S4sq2eFFW0QZyLbm'}, 
            {artistName: "Maggie Rogers", artistId: '4NZvixzsSefsNiIqXn0NDe'}
        ]
        Header = {
            headers: {'Authorization': `Bearer ${res.data.access_token}`}
        }
        let albumIds = [];
        let artistIdAlbumIdMap = [];
        for(const artist of artists){
            const res = await axios.get(`https://api.spotify.com/v1/artists/${artist.artistId}/albums?include_groups=album&limit=50`, Header)
            artistIdAlbumIdMap = getAlbumIdForPost(artistIdAlbumIdMap, res.data.items, artist);
            res.data.items.forEach(albumObjectSimplified=>{
                albumIds.push(albumObjectSimplified.id);
            });
        }

        const arrayOfAlbumIdArrays = [];
        while(albumIds.length > 20){
            const newArr = albumIds.slice(0,20);
            albumIds = albumIds.slice(20);
            arrayOfAlbumIdArrays.push(newArr);
        }
        arrayOfAlbumIdArrays.push(albumIds);

        const fullAlbumObjectsArray = await getFullAlbumObjects(arrayOfAlbumIdArrays, Header);

        const date = new Date();

        const popularityEvents = fullAlbumObjectsArray.map((obj)=>{
            return {
                id: obj.id,
                name: obj.name,
                popularity: obj.popularity,
                date: date.getFullYear() + '/' + String(date.getMonth() + 1).padStart(2, '0') + '/' + String(date.getDate()).padStart(2, '0')
            } // yyyy/mm/dd date.getFullYear() + '/' + String(date.getMonth() + 1).padStart(2, '0') + '/' + String(date.getDate()).padStart(2, '0')
        });

        const albumMap = {} 
        popularityEvents.forEach((popularityEvent)=>{
            if(albumMap.hasOwnProperty(popularityEvent.name)){
                if(popularityEvents.popularity > albumMap[popularityEvent.name].popularity){
                    albumMap[popularityEvent.name] = popularityEvent;
                }
            }
            else{
                albumMap[popularityEvent.name] = popularityEvent;
            }
        });

        const updatedPopularityEvents = Object.values(albumMap)
        artistIdAlbumIdMap = artistIdAlbumIdMap.filter((pair)=>{
            let match = false;
            for(let x =0; x<updatedPopularityEvents.length; x++){
                if(updatedPopularityEvents[x].id == pair.albumId){
                    match = true;
                    break;
                }
            }
            return match;
        });
        //console.log(artistIdAlbumIdMap) https://spotifypopularitytracker.herokuapp.com http://127.0.0.1:5000/
        // 
        axios.post('http://127.0.0.1:5000/', { data: updatedPopularityEvents, api_access_secret })
            .then((res)=>{
                console.log(res.data)
            })
            .catch(err=>{
                console.log("First ERROR")
                console.log(err.response.data)
            })

        axios.post('http://127.0.0.1:5000/', { data: artistIdAlbumIdMap, api_access_secret })
            .then((res)=>{
                console.log(res.data)
            })
            .catch(err=>{
                console.log("SECOND ERROR")
                console.log(err.response.data)
            })
    })
    .catch(err=>{
        console.log(err);
    });

