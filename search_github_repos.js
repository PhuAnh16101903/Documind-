const https = require('https');

function searchRepos(q) {
  return new Promise((resolve) => {
    https.get('https://api.github.com/search/repositories?q=' + encodeURIComponent(q), { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve(json.items ? json.items.slice(0, 8).map(r => ({ full_name: r.full_name, desc: r.description, updated: r.updated_at, url: r.html_url })) : json.message);
        } catch(e) { resolve(e.message); }
      });
    });
  });
}

(async () => {
  console.log('Search 1:', await searchRepos('neu career ai'));
  console.log('Search 2:', await searchRepos('neu career'));
  console.log('Search 3:', await searchRepos('Internship_Connect'));
})();
