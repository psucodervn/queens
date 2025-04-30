// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 3.0.33
// 

import { Schema, type, ArraySchema, MapSchema, SetSchema, DataChange } from '@colyseus/schema';
import { Player } from './Player'

export class QueenRoomState extends Schema {
    @type("string") public displayName!: string;
    @type({ map: Player }) public players: MapSchema<Player> = new MapSchema<Player>();
    @type("uint8") public status!: number;
    @type("string") public test!: string;
    @type("int64") public gameStartedAt!: number;
    @type("int64") public gameEndedAt!: number;
}
