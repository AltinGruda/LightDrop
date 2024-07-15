An application for peer-to-peer file sharing.

## How it works
- Peer 1 creates an offer for a connection between them. This results in a SDP object (session description protocol) which contains the data of the peer to peer connection
- The data gets saved in a server to be read by the other peer which can be done by creating an answer.
- This process is called signaling. The signaling server allows 2 peers to allow sharing data between them.

To do:
- [x] Basic user registration and discovery
- [ ] Implement user connection and signaling
- [ ] Implement file transfer
