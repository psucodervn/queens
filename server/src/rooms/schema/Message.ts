import { Schema, type } from "@colyseus/schema";

export class Message extends Schema {
  @type("string") id: string;
  @type("string") senderId: string;
  @type("string") senderName: string;
  @type("string") content: string;

  constructor(senderId: string, senderName: string, content: string) {
    super();
    this.id = `${senderId}-${Date.now()}`;
    this.senderId = senderId;
    this.senderName = senderName;
    this.content = content;
  }
}
