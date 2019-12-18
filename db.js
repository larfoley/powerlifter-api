// const { MongoMemoryServer } = require('mongodb-memory-server');
//
// const mongod = new MongoMemoryServer();
//
// async function run() {
//   console.log('running');
//   try {
//     const port = await mongod.getPort();
//     const dbPath = await mongod.getDbPath();
//     const dbName = await mongod.getDbName();
//     const str = await mongod.getConnectionString()
//     console.log(str);
//   } catch (e) {
//     console.log('err', e);
//   }
//
// }
//
// run()
