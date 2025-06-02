# Companion Matcher

## Prerequisites

Node.js - 18.x (includes npm)

## Get Code

git clone <your‑repo‑url> dog‑companion‑matcher
cd dog‑companion‑matcher

## Install deps

Run installation for each sub-projects and keep the terminal sopen after completion for the next step

### Terminal 1 – back‑end deps

cd server
npm install

### Terminal 2 – front‑end deps

cd client
npm install

## Start the Servers

### Terminal 1 - API

npm run dev
- If you want to testt he health of the host: curl http://localhost:4000/api/health

### Terminal 2 - React

npm run dev

## SMmke Test the MVP

- Enter a few traits (Labrador, Large, Friendly).
- Click “Find Matches.”
- You should see sample Atlanta dogs ranked with a % score. For right now, the dog data is hard coded, so navigate to dogs.json, add/edit entries, and save. Smoke test again!

## TODO (For Developers)

CUrrently, I have just hardcoded two dogs and tehir metadata. I need to add real data from shelters through public APIs like from Petfinder API or Atlanta shelter RSS feeds!
