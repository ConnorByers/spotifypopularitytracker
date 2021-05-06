# Spotify Popularity Tracker

Tracks the popularity of a set of artists' albums over time and displays the data in graphs

Built using React, Recharts, Flask, PostgreSQL and Spotify API.

Deployed using Heroku.

Currently hosted on https://spotifypopularitytracker.herokuapp.com/ - Might take some time for page to load if website hasn't been accessed in a long time due to me having a free tier Heroku account.

## How to run

1. `npm i`
2. `cd ./api`
3. Create `secrets.py`
4. In said file, define `database_uri` (from your db) and `api_access_secret` (Spotify API access secret)
5. Create a virtual environmnent for Python ( I used Python 3.8 for this project )
6. `pip install -r packages.txt`
7. `python`
8. `from app import db`
9. `db.create_all()`
10. `exit()`
11. `python -m flask run`
12. Open a new terminal in the main directory
13. `npm run start`

## Next Steps
- Add something to use/analyze the data we create
- Code a solution to the inevitable time where the amount of data will be too high for one network request. One solution could be to seperate the artists in their own page and network request.
- Add a way for a user to add an artist to track
