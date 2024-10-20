# Stream-with-friends

Stream movie and video torrents with friends in realtime using webrtc and webtorrents libraries.

## Note

I wrote this project after graduating high school when I was not as experienced in tech, hence there are tons of errors and blunders in this code.

Yes, I know firebase config variables are in code, don't expect them to work.

## Techstack

- Vanilla JS
- Firebase
- WebRTC
- WebTorrents
- Bootstrap

## How this project works

- This project uses a room based architecture, where users create rooms and others join the room using a generated id.
- Each user in a room can either communicate by voice or chat
- Each room has a host user that has control over video playback. The host user can be transferred manually or automatically if the host leaves the room.
- The project is completely serverless and only relies on firebase realtime database.
- The WebRTC setup is a many to many connection among all users in the room.

## WebRTC Setup
- The realtime database contains webrtc candinates of each individual user in the room.
- When a user joins a room, their webrtc ICE candinates are stored in the realtime database and they use the ICE candinates in the database to connect to each individual user in the room.
- Other users in the room receive an update event from the database and use the ICE candinates to connect to the joining user.
- This setup does not have a TURN server fallback.
