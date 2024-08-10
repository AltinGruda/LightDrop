LightDrop gives you the power to securely share your files with your friends.

Live app at: https://lightdrop.vercel.app

## How it works
- Peer 1 creates an offer for a connection between them. This results in a SDP object (session description protocol) which contains the data of the peer to peer connection
- The data gets saved in a server to be read by the other peer which can be done by creating an answer.
- This process is called signaling. The signaling server allows 2 peers to allow sharing data between them.

### Reminder
This application is still on the development phase.

To do:
- [x] Basic user registration and discovery
- [x] Implement user connection and signaling
- [x] Implement file transfer
