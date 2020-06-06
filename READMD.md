### Multiplayer requirements:

- Player 1 clicks on **"Starts multiplayer game"**, once started it will perform a **GET** request on **"/connect"** endpoint to get clientid back from the server **[DONE]**

- Server receives the **GET** request, generates the clientid and sends it back to player 1 **[DONE]**

- Player 1 assigns the player.id to id from the response from **"/connect"** endpoint **[DONE]**

- Player 1 wait for a timeout of 1 minute, if the timeout of 1 minute has been reached. The frontend will show error, **"Second player did not connect"**

- Player 2 clicks on **"Join multiplayer game"**, player 2's frontend client will perform the same **GET** request on **"/connect"** endpoint to get clientid back from the server

- Server receives the **GET** request, generates the clientid and sends it back to player 2

- Player 2 assigns the player2.id to id from the response from **"/connect"** endpoint

- Player 2 wait for a timeout of 1 minute, if the timeout of 1 minute has been reached. The frontend will show error, **"Could not connect"**

- On server side if the clients.length >= 2, send player 1 object to player 2, send player 2 object to player 1

**TO DO:**
- Manage when the game ends for both clients, (possibly have a timed game or when one of the player reaches a certain score, first to 100)
