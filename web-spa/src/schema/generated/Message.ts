// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 3.0.33
// 

import { Schema, type, ArraySchema, MapSchema, SetSchema, DataChange } from '@colyseus/schema';


export class Message extends Schema {
    @type("string") public id!: string;
    @type("string") public senderId!: string;
    @type("string") public senderName!: string;
    @type("string") public content!: string;
}
