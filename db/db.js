var connectionString = 'postgres://localhost:5432/test';
var pgp = require('pg-promise')();
var db = pgp(connectionString);

module.exports={db};
