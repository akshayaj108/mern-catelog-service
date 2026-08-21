export interface MessageProducerBroker {
  connect: () => Promise<void>;
  disconnect: () => void;
  sendMessage: (topic: string, message: string) => Promise<void>;
}
