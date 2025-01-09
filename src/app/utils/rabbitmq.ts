// rabbitmq.js
import * as amqp from "amqplib";
// const WorkflowEngine = require("./controller/crm/workflow/WorkflowEngine");
// const Queue = require("./model/crm/autodialer/queue");
// const QueueConfig = require("./model/crm/autodialer/autodialerConfig");
// const { sendNotifications } = require("./V2/controller/notification");

let connection: amqp.Connection;
let channel: amqp.Channel;

interface ConnectOptions {
  url: string;
}

async function connect(url: string): Promise<amqp.Channel> {
  connection = await amqp.connect(url);
  if (connection) console.log("Connected to RabbitMQ");
  channel = await connection.createChannel();
  return channel;
}

interface MessageQueueOptions {
  queue: string;
  message: string;
}

async function sendMessageQueue(queue: string, message: string): Promise<void> {
  await channel.assertQueue(queue, { durable: false });
  channel.sendToQueue(queue, Buffer.from(message));
}

interface OnMessageReceived {
  (message: string): void;
}

async function listenForMessages(queue: string, onMessageReceived: OnMessageReceived): Promise<void> {
  if (!channel) {
    throw new Error("RabbitMQ connection not established");
  }
  await channel.assertQueue(queue, { durable: false });

  channel.consume(queue, (message) => {
    if (message) {
      const content = message.content.toString();
      onMessageReceived(content);
      channel.ack(message);
    }
  });
}

async function closeRabbitMQ() {
  await channel.close();
  await connection.close();
}

// // Listen for messages in the "crm-workflow" queue
// async function handleWorkflowExecution() {
//   try {
//     await listenForMessages("crm-workflow", async (message) => {
//       const msg = JSON.parse(message);
//       if (!msg || !msg.account || !msg.lead || !msg.event || !msg.data) return;

//       console.log(`Triggering WorkflowEngine for ${msg.event}...`);
//       const workflowEngine = new WorkflowEngine(msg.account, msg.lead);
//       try {
//         await workflowEngine.triggerEvent(msg.event, msg.data);
//       } catch (e) {
//         console.error(e);
//       }
//     });
//   } catch (error) {
//     console.log(error);
//   }
// }

// // Listen for messages in the "crm-autodialer" queue
// async function handleAutodialer() {
//   return new Promise((resolve, reject) => {
//     try {
//       listenForMessages("crm-autodialer", async (message) => {
//         const msg = JSON.parse(message);
//         if (!msg || !msg.crmId || !msg.userId)
//           return reject("Invalid parameters");

//         console.log(`Fetching next callee for ${msg.userId}...`);

//         const queueConfig = await QueueConfig.findOne({
//           account_id: msg.crmId,
//         });
//         if (!queueConfig) return reject("QueueConfig not found");

//         const queue = await Queue.findOne({
//           queue_config_id: queueConfig._id,
//         });
//         if (!queue || !queue.lead_id || queue.lead_id.length === 0)
//           return reject("Queue not found or empty");

//         // Get the next lead from the queue and remove it
//         const lead = queue.lead_id.shift();
//         if (!lead) reject("No leads found in the queue");
//         await queue.save(); // Save to persist changes

//         const result = {
//           queue_config_id: queueConfig._id.toString(),
//           lead: lead.toString(),
//         };

//         console.log("Next lead assigned:", result);

//         // Resolving the Promise with the result from the first processed message
//         resolve(result);

//         // Optionally, stop listening after the first message is processed
//         // unsubscribeFromMessages("crm-autodialer"); // Uncomment if your setup supports this
//       });
//     } catch (error) {
//       console.log("Error in handleAutodialer:", error);
//       reject(error);
//     }
//   });
// }

async function handleNotifications() {
  try {
    await listenForMessages("notifications", async (message1) => {
      const message = JSON.parse(message1);

      console.log("Notification received:", message);

      // switch (message?.type) {
      //   case "notification":
      //     sendNotifications(message);
      //     break;
      //   case "newNotification":
      //     sendNewNotification(message);
      //     break;
      //   case "sendEmail":
      //     sendEmail(message);
      //     break;
      //   case "sendSms":
      //     sendSms(message);
      //     break;
      //   case "newCronEvent":
      //     newCronEvent(message);
      //     break;
      //   case "saveHistory":
      //     saveDiffObject(message);
      //     break;
      //   default:
      //     console.log("Message type not accepted");
      // }

      // console.log(`Notification processed for userTo: ${.userTo}`);
    });
  } catch (error) {
    console.error("Error handling notifications:", error);
  }
}


export const rabbitMq = {
  getChannel: () => channel,
  connect,
  sendMessageQueue,
  listenForMessages,
  closeRabbitMQ,
  // handleWorkflowExecution,
  // handleAutodialer,
  handleNotifications
}


