const jsonServer = require('json-server');
const server = jsonServer.create();
const path = require('path');
const router = jsonServer.router(path.join(__dirname, 'db/db.json'));
const middlewares = jsonServer.defaults({
  static: path.join(__dirname, '../public/assets/html') 
});

server.use(middlewares);

server.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/assets/html/index.html'));
});

server.use('/api', router);

server.listen(3000, () => {
  console.log('JSON Server is running on http://localhost:3000');
});