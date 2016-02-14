import Hapi from 'hapi';
import chalk from 'chalk';
import vision from 'vision';
import handlebars from 'handlebars';
import {db, URL} from './db';

db(); // invoke db function to connect mongoDB.

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
    reply.view('index');
  }
})

server.route({
  method: 'GET',
  path: '/{url}',
  handler: (request, reply) => {

    var shortenUrl = encodeURIComponent(request.params.url);

    URL.findOne({shorten_url: shortenUrl}, (err, url) => {

      if (err) {
        reply({message: err});
      } else {
        reply.redirect(url.original_url);
      }
    });
  }
});

server.route({
  method: 'POST',
  path: '/',
  handler: (request, reply) => {

    var originalUrl = request.payload.url;

    URL.count({}, (err, num) => {

      let shorter = new URL({
        original_url: originalUrl,
        shorten_url: num + 1
      });

      shorter.save(err => {

        if (err) {
          reply({message: err});
        } else {
          reply(`Shortend URL is : ${server.info.uri}/${shorter.shorten_url}`);
        }

      });
    });
  }
});

server.start(err => {

  if (err) {
    throw err;
  }

  console.log(chalk.green(`Server is running at ${server.info.uri}`));
})
