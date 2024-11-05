// src/services/mqService.ts
import amqp from 'amqplib';

class MQService {
  private channel: amqp.Channel | undefined;

  constructor(private exchangeName: string) { }

  async init() {
    const connection = await amqp.connect('amqp://rabbitmq');
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

    const queue = await this.channel.assertQueue(queueName, { exclusive: true });
    await this.channel.bindQueue(queue.queue, this.exchangeName, '');

    this.channel.consume(queue.queue, (msg) => {
      if (msg) {
        handler(JSON.parse(msg.content.toString()));
      }
    });
  }

  async ack(msg: any) {
    if (!this.channel) {
      throw new Error("Channel is not initialized");
    }
    this.channel.ack(msg);
  }
}

export default MQService;
