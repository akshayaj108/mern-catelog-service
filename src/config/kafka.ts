import config from "config";
import { Kafka, KafkaConfig, Producer } from "kafkajs";
import { MessageProducerBroker } from "../types/broker";

export class KafkaMessageBroker implements MessageProducerBroker {
  private producer: Producer;

  constructor(clientId: string, brokers: string[]) {
    let kafkaConfig: KafkaConfig = {
      clientId,
      brokers
    };
    if(process.env.NODE_ENV === "production"){
      kafkaConfig = {
        ...kafkaConfig,
        ssl: true,
        connectionTimeout: 45000, //45 sec ref by ofc docs,
        sasl: {
          mechanism: "plain",
          username: config.get("kafka.sasl.username"),
          password: config.get("kafka.sasl.password")
        }
      }
    }
    //refer by docs of kafka js
    const kafka = new Kafka(kafkaConfig);
    this.producer = kafka.producer();
  }

  async connect() {
    await this.producer.connect();
  }

  async disconnect() {
    if (this.producer) {
      await this.producer.disconnect();
    }
  }

  async sendMessage(topic: string, message: string, key?: string) {
    const brockerMessage: { value: string, key?: string} = {
      value: message
    };
    if(key){
      brockerMessage.key = key
    }
    await this.producer.send({
      topic,
      messages: [brockerMessage],
    });
  }
}
