const http = require('http');
const https = require('https');

const PORT = process.env.PORT || 3000;

// Simulation d'une base de données utilisateur
const users = [];

// Fonction pour hacher un mot de passe
const hashPassword = async (password) => {
  // Implémentation de la fonction de hachage
};

// Fonction pour effectuer une requête GET à l'API Musixmatch
const getLyrics = () => {
  const options = {
    hostname: 'api.musixmatch.com',
    path: '/ws/1.1/track.search?q_lyrics=love&f_has_lyrics=true&page_size=1&page=1&apikey=9e5b8bc4ed53d27be2455ea5f1138687',
    method: 'GET',
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        resolve(JSON.parse(data));
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
};

// Création du serveur HTTP
const server = http.createServer((req, res) => {
  if (req.url === '/register' && req.method === 'POST') {
    // Gestion de l'inscription
  } else if (req.url === '/login' && req.method === 'POST') {
    // Gestion de la connexion 
  } else if (req.url === '/lyrics' && req.method === 'GET') {
    // Obtenir les paroles d'une chanson aléatoire depuis l'API Musixmatch
    getLyrics()
      .then((data) => {
        const track = data.track_list[0].track;
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ artist: track.artist_name, title: track.track_name, lyrics: track.lyrics_body }));
      })
      .catch((error) => {
        console.error(error);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Error fetching lyrics');
      });
  } else {
    // Route inconnue
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

// Démarrage du serveur
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});