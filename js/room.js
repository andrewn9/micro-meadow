var peer;

function initPeer() {
    let savedPeerData = JSON.parse(sessionStorage.getItem('peerData'));

    if (savedPeerData) {
        peer = new Peer(savedPeerData.id, {
            metadata: savedPeerData.metadata
        });
    } else {
        peer = new Peer({
            metadata: {
                username: 'Guest'
            }
        });
    }

    document.getElementById("username").innerText = 'username: ' + peer.options.metadata.username;
    let ishost = document.getElementById("host");
    if (ishost) {
        let url = new URL(window.location.href);
        ishost.innerText = 'host?: ' + (peer.id===url.searchParams.get("id"));
    }

    peer.on('open', function(id) {
        console.log('My peer ID is: ' + id);
        console.log('My peer username is: ' +  peer.options.metadata.username);
    });
}

function savePeerData() {
    let peerData = {
        id: peer.id,
        metadata: peer.options.metadata
    };
    sessionStorage.setItem('peerData', JSON.stringify(peerData));
}

function changeUsername() {
    let newUsername = document.getElementById('usernameInput').value;

    if (peer) {
        peer.options.metadata = {
            ...peer.options.metadata, // Preserve other properties
            username: newUsername
        };

        savePeerData();

        console.log('Username changed to: ' + newUsername);
        document.getElementById("username").innerText = 'username: ' + peer.options.metadata.username;

    } else {
        console.error('Peer not initialized');
    }
}

window.onload = initPeer;

function hostGame() {
    savePeerData();
    var gameId = peer.id;
    window.location.href = 'game.html?id=' + peer.id;
}
