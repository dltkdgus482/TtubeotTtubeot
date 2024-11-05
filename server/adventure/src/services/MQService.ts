import dotenv from 'dotenv';
import amqp from 'amqplib';

dotenv.config();

class MQService {
  private channel: amqp.Channel | undefined;
  private rabbitMQUrl = process.env.RABBITMQ_HOST || 'amqp://localhost';
  private rabbitMQPassword = process.env.RABBITMQ_PASSWORD || 'guest';
  private rabbitMQUser = process.env.RABBITMQ_USER || 'guest';

  constructor(private exchangeName: string) { }

  async init() {
    const connection = await amqp.connect('amqp://' + this.rabbitMQUser + ':' + this.rabbitMQPassword + '@' + this.rabbitMQUrl);
    this.channel = await connection.createChannel();
    await this.channel.assertExchange(this.exchangeName, 'fanout', { durable: false });
  }

  async publish(event: any) {
    if (!this.channel) {
      throw new Error("Channel is not initialized");
    }
    this.channel.publish(this.exchangeName, '', Buffer.from(JSON.stringify(event)));
  }

  async subscribe(queueName: string, handler: (msg: any) => void) {
    if (!this.channel) {
      throw new Error("Channel is not initialized");
    }

    const queue = await this.channel.assertQueue(queueName);
    await this.channel.bindQueue(queue.queue, this.exchangeName, '');

    this.channel.consume(queue.queue, (msg) => {
      if (msg) {
        handler({ originalMsg: msg, content: JSON.parse(msg.content.toString()) });
      }
    });
  }


  async check(msg: any) {
    if (!this.channel) {
      throw new Error("Channel is not initialized");
    }
    this.channel.ack(msg);
  }
}

export default MQService;
