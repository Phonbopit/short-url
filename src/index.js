import Hapi from 'hapi';
import chalk from 'chalk';
import vision from 'vision';
import handlebars from 'handlebars';
import DB from './db';

const db = DB();
const server = new Hapi.Server();

server.connection({
  host: 'localhost',
  port: 5555
});

server.register(vision, err => {

  server.views({
    engines: {
      html: handlebars
    },
    relativeTo: __dirname,
    path: 'views'
  })
});

server.route({
  method: 'GET',
  path: '/',
  handler: (request, reply) => {

    var url = encodeURIComponent(request.params.url);

    reply.view('index');

    //TODO

    // 1. find a url in database
    // 2. return original url.
  }
});

server.route({
  method: 'POST',
  path: '/',
  handler: (request, reply) => {

    var url = request.payload.url;

    //TODO

    //1. save original to database.
    //2. generate short url
  }
});

server.start(err => {

  if (err) {
    throw err;
  }

  console.log(chalk.green(`Server is running at ${server.info.uri}`));
})
