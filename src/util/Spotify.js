const clientId = '5c57e511ee1b4ece87070b7e5160570c';
const redirectUri = 'http://localhost:3000/';
let accessToken = undefined;
let expiresIn= undefined;

const Spotify = {
  getAccessToken() {
    if (accessToken) {
      return accessToken;
    }
    const urlAccessToken = window.location.href.match(/access_token=([^&]*)/);
    const urlExpiresIn = window.location.href.match(/expires_in=([^&]*)/);
    if (urlAccessToken && urlExpiresIn) {
      accessToken = urlAccessToken[1];
      expiresIn = urlExpiresIn[1];
      window.setTimeout(() => accessToken = '', expiresIn * 1000);
      window.history.pushState('Access Token', null, '/');
    } else {
      window.location = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
    }
  },

  search(term) {
    const accessToken = this.getAccessToken();
    const searchUrl = `https://api.spotify.com/v1/search?type=track&q=${term.replace(' ', '%20')}`;
    return fetch(searchUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
    .then(response => response.json())
    .then(jsonResponse => {
      if (!jsonResponse.tracks){
        return [];
      }
      return jsonResponse.tracks.items.map(track => {
        return {
          id: track.id,
          name: track.name,
          artist: track.artists[0].name,
          album: track.album.name,
          uri: track.uri
        }
      })
    });
  },

    savePlaylist(playlistName, trackURIs) {
      const accessToken = Spotify.getAccessToken();
      if(!playlistName || !trackURIs) {
        return;
      }
      const headers = {
        Authorization: `Bearer ${accessToken}`,
      };
      let userId;
      return fetch('https://api.spotify.com/v1/me', {
        headers: headers
      })
      .then(response => response.json())
      .then(jsonResponse => {
        userId = jsonResponse.id;
        return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
          method: 'POST',
          headers: headers,
          body: JSON.stringify({name: playlistName})
        })
      })
      .then(response => response.json())
      .then(jsonResponse => jsonResponse.id)
      .then(playlistId => {
        const endpoint = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;
        return fetch(endpoint, {
          headers: headers,
          method: 'POST',
          body: JSON.stringify({
            uris: trackURIs
            })
          }
        )}
      )
    }
  }

  export default Spotify;
