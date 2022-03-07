var mysql = require('mysql')

const connection = process.env.PORT
  ? mysql.createConnection({
      host: 'uzb4o9e2oe257glt.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
      user: 'a1mv92sc8uuqzzof',
      password: 'exf9l5olt80cypks',
      database: 'ikoa8irzupyxuqg1',
    })
  : mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'dogs_health',
    })

// const connection = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: '',
//   database: 'car_tracking',
// })

exports.connection = connection
