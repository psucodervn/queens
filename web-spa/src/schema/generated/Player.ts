// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 3.0.33
// 

import { Schema, type, ArraySchema, MapSchema, SetSchema, DataChange } from '@colyseus/schema';


export class Player extends Schema {
    @type("string") public id!: string;
    @type("string") public name!: string;
    @type("uint8") public status!: number;
    @type("boolean") public active!: boolean;
    @type("string") public submitted!: string;
    @type("int64") public submittedAt!: number;
    @type("int32") public eloRating!: number;
}
