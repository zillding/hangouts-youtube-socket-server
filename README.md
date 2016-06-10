# hangouts-youtube-socket-server

The socket server of hangouts app.

For details, please refer to project [hangouts](https://github.com/zillding/hangouts)

Deployed on [https://hangouts-youtube-socket-server.herokuapp.com/](https://hangouts-youtube-socket-server.herokuapp.com/)

=> [hangouts app](https://hangouts-zillding.herokuapp.com/)

## Docs

### Hangouts App

Following are docs for the hangouts app.

#### Action type possible values and corresponding payload data:

+ `ADD_VIDEO`: [object: video data]
+ `DELETE_VIDEO`: [number: index]
+ `PLAY`: [string: videoId]
+ `PLAY_NEXT`: no data
+ `PLAY_PREVIOUS`: no data
+ `PAUSE`: no data
+ `RESUME`: no data
+ `SYNC_TIME`: [number: play time]

#### Events received:

+ `new user`:
  ```
  {
    data: [string: roomName]
  }
  ```

+ `action`:
  ```
  {
    type: [string: one of action type values]
    data: [object|number|string: corresponding payload data]
  }
  ```

#### Events fired:

+ `welcome`:
  ```
  {
    data: {
      playlist: [array: playlist data in current room]
    }
  }
  ```

+ `action`:
  ```
  {
    type: [string: one of action type values]
    data: [object|number|string: corresponding payload data]
    senderId: [string: socket id of the sender of this action]
  }
  ```

### Admin Stats App

Following are docs for the admin stats app.

#### Events fired:

+ `init stats`:
  ```
  {
    numberOfUsers: [number: number of users of hangouts app]
    numberOfRooms: [number: number of rooms of hangouts app]
  }
  ```

+ `update user`: `+1 | -1`

+ `update room`: `+1 | -1`
