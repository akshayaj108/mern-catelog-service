import config from "config";
import { KafkaMessageBroker } from "../../config/kafka";
import { MessageProducerBroker } from "../../types/broker";

let messageProducer: MessageProducerBroker | null = null;

export function createMessageBroker(): MessageProducerBroker {
  // making singletone
  if (!messageProducer) {
    messageProducer = new KafkaMessageBroker("catelog-service", [
      config.get("kafka.broker"),
    ]);
  }

  return messageProducer;
}
