# Chess Club Tournament API Documentation

This document serves as the complete technical plan for the Chess Club Tournament API. It outlines the data models, API endpoints, and the core logic for managing tournaments, members, and match pairings.

---

## 1. Data Models

### Club

* `clubId`: String (Unique identifier)
* `clubName`: String
* `members`: Array of **Member** objects

### Member

* `memberId`: String (Unique identifier)
* `name`: String
* `elo`: Number (Default is 1200 for new players)

### Tournament

* `tournamentId`: String (Unique identifier)
* `tournamentName`: String
* `clubId`: String (References the club)
* `players`: Array of **Player** objects (References members participating in this tournament)
* `currentRound`: Number (Starts at 0)
* `totalRounds`: Number
* `matches`: Array of **Match** objects
* `status`: String (`pending`, `in-progress`, `completed`)
* `byePlayerId`: String (Unique identifier of the player receiving a bye in the current round, if any)

### Player (Tournament-specific data for a member)

* `memberId`: String (References the original member)
* `elo`: Number (Elo at the start of the tournament)
* `score`: Number (1 for win, 0.5 for draw, 0 for loss)
* `opponentsPlayed`: Array of `memberId` (To prevent duplicate pairings)
* `colorsPlayed`: Array of String (`white` or `black`)

### Match

* `matchId`: String (Unique identifier)
* `roundNumber`: Number
* `whitePlayerId`: String (References a player)
* `blackPlayerId`: String (References a player)
* `result`: String (`1-0`, `0-1`, `1/2-1/2`, or `pending`)

---

## 2. API Endpoints

### Clubs

* **POST** `/clubs` → Creates a new chess club.
* **POST** `/clubs/{clubId}/members` → Adds a new member to a club (default Elo = 1200).

### Tournaments

* **POST** `/tournaments` → Creates a new tournament and adds players from a club.
* **POST** `/tournaments/{tournamentId}/start` → Generates the first round pairings based on Elo.
* **POST** `/tournaments/{tournamentId}/pairings` → Generates pairings for the next round (Swiss system).
* **PATCH** `/tournaments/{tournamentId}/matches/{matchId}/result` → Updates match result and player scores.
* **GET** `/tournaments/{tournamentId}/standings` → Retrieves current standings, sorted by score.
* **POST** `/tournaments/{tournamentId}/complete-round` → Marks the current round complete, updates scores and Elo.
* **POST** `/tournaments/{tournamentId}/finish` → Finalizes the tournament and generates final rankings.

### Members

* **GET** `/members/{memberId}/history` → Retrieves complete match and tournament history of a player.

---

## 3. Pairing Logic and Features

### First Round: Elo-based Pairing

1. Fetch all players for the tournament.
2. Sort players in descending order by Elo.
3. Pair the top half against the bottom half (e.g., Player #1 vs Player #9).

### Subsequent Rounds: Swiss System Pairing

* Group players by score, from highest to lowest.
* Within each group, sort by Elo.
* Pair players within the same score group, following rules:

  * No repeat opponents.
  * Alternate colors when possible.
  * If color imbalance exists, assign the less-used color.
* If no pairing is possible within a group, float a player down to the next group.

### Elo Rating Updates

After each round, Elo is updated using the standard formula:

$R_a' = R_a + K × (S_a − E_a)$

Where:

* $R_a$ = current rating
* $R_a'$ = new rating
* $S_a$ = actual score (1, 0.5, 0)
* $E_a$ = expected score
* $K$ = development coefficient

### Bye Handling

* If an odd number of players exists, the lowest-ranked player without a previous bye is assigned a bye.
* A bye grants 1 point and no opponent for the round.

---

## 4. Tournament Flow Summary

1. **Create Club** → `/clubs`
2. **Add Members** → `/clubs/{clubId}/members`
3. **Create Tournament** → `/tournaments`
4. **Start Tournament** → `/tournaments/{tournamentId}/start`
5. **Generate Pairings (each round)** → `/tournaments/{tournamentId}/pairings`
6. **Update Match Results** → `/tournaments/{tournamentId}/matches/{matchId}/result`
7. **Complete Round** → `/tournaments/{tournamentId}/complete-round`
8. **Repeat Steps 5–7 until totalRounds reached**
9. **Finish Tournament** → `/tournaments/{tournamentId}/finish`
10. **View Standings & History** → `/tournaments/{tournamentId}/standings` and `/members/{memberId}/history`
