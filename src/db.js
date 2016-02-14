import mongoose from 'mongoose';
import chalk from 'chalk';

function db() {

  const db = mongoose.connect('mongodb://localhost:27017/short_url_db', err => {

    if (err) {
      console.log(chalk.red(err));
    } else {
      console.log(chalk.blue('Connected MongoDB'));
    }

    mongoose.connection.on('error', err => {
      console.log(chalk.red(`MongoDB connection error : ${err}`));
      process.exit(-1);
    });

  });

  return db;
}

const UrlSchema = new mongoose.Schema({
  original_url: String,
  shorten_url: {
    unique: true,
    type: String
  }
});

const URL = mongoose.model('Url', UrlSchema);

export {db, URL}
