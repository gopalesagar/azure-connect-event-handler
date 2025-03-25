const express = require('express');
const { WebPubSubEventHandler } = require('@azure/web-pubsub-express');
require('dotenv').config();

const app = express();
const hubName = 'inveniamqahub';
const port = 8080;

// Initialize Sequelize
// const sequelize = new Sequelize({
//   dialect: 'sqlite',
//   storage: '../db/connections.db'
// });

// Define UserConnection model (allows multiple connections per user)
// const UserConnection = sequelize.define('UserConnection', {
//   userId: {
//     type: DataTypes.STRING,
//     allowNull: false
//   },
//   connectionId: {
//     type: DataTypes.STRING,
//     allowNull: false,
//     unique: true
//   }
// });

// Sync database
// sequelize.sync();

// Event handler for connection validation
const connectHandler = new WebPubSubEventHandler(hubName, {
  path: '/connect-handler',
  handleConnect: async (req, res) => {
    // const token = req.queries.authorisationToken[0];
    try {
      // const { userId } = jwt.verify(token, JWT_SECRET);
      // console.log(`User Verified - ${userId}`);
      res.success({ userId: '123456' });
    } catch (err) {
      res.fail(401);
    }
  }
});

// // WebPubSub event handler
// const handler = new WebPubSubEventHandler(hubName, {
//   path: '/eventhandler',
//   onConnected: async req => {
//     console.log(`${req.context.userId} connected with connectionId: ${req.context.connectionId}`);
//     await UserConnection.create({ userId: req.context.userId, connectionId: req.context.connectionId });
//   },
//   onDisconnected: async req => {
//     console.log(`${req.context.userId} disconnected (connectionId: ${req.context.connectionId})`);
//     await UserConnection.destroy({ where: { connectionId: req.context.connectionId } });
//   }
// });

app.use(connectHandler.getMiddleware());
// app.use(handler.getMiddleware());
app.use(express.json());

// // Send message API (sends message to all active connections of the user)
// app.post('/send/:id/:message/:count', async (req, res) => {
//   const { id, message, count } = req.params;
//   const userConnections = await UserConnection.findAll({ where: { userId: id } });

//   if (userConnections.length === 0) {
//     return res.status(404).json({ error: 'User not connected' });
//   }

//   for (let i = 0; i < parseInt(count, 10); i++) {
//     for (const connection of userConnections) {
//       await serviceClient.sendToConnection(connection.connectionId, message).catch(err => {
//         console.error(`Failed to send message to ${connection.connectionId}:`, err.message);
//       });
//     }
//   }

//   // eslint-disable-next-line max-len
//   res.json({ success: true, message: `Sent ${count} messages to user ${id} across ${userConnections.length} connections` });
// });

// // Send message API (sends message to user's all connection)
// app.post('/send/user/:id', async (req, res) => {
//   const { id } = req.params;
//   const { message, count } = req.body;

//   const userConnection = await UserConnection.findOne({ where: { userId: id } });

//   if (!userConnection) {
//     return res.status(404).json({ error: 'User not connected' });
//   }

//   for (let i = 0; i < parseInt(count, 10); i++) {
//     await serviceClient.sendToUser(id, message).catch((err) => {
//       console.error(`Failed to send message to user ${id}:`, err.message);
//     });
//   }

//   // eslint-disable-next-line max-len
//   res.json({ success: true, message: `Sent ${count} messages to user ${id} across all connections` });
// });

// app.post('/broadcast/:message/:count', async (req, res) => {
//   const { id, message, count } = req.params;
//   for (let i = 0; i < parseInt(count, 10); i++) {
//       await serviceClient.sendToAll(message).catch(err => {
//         console.error(`Failed to send message to ${connection.connectionId}:`, err.message);
//       });
//     }
//   res.json({ success: true, message: `Broadcasted ${count} messages` });
// });

// Generate negotiation token
// app.get('/negotiate', async (req, res) => {
//   const id = req.query.id;
//   if (!id) {
//     return res.status(400).send('Missing user ID');
//   }
//   const token = jwt.sign({ userId: id }, JWT_SECRET);
//   const url = `${WSS_URL}/${hubName}?authorisationToken=${token}`;
//   res.json({ url });
// });

// Start server
app.listen(port, () => console.log(`Server listening on http://localhost:${port}${connectHandler.path}`));