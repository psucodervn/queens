import { Schema, type } from "@colyseus/schema";

export class Message extends Schema {
  @type("string") senderId: string;
  @type("string") content: string;

  constructor(senderId: string, content: string) {
    super();
    this.senderId = senderId;
    this.content = content;
  }
}
