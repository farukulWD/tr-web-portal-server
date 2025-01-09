import { Document, Schema, Types } from "mongoose";
export interface IAttendance extends Document {
    userId: Schema.Types.ObjectId;
    photoHash: string;
    createdAt: Date;
}

export interface ILocation extends Document {
    attendanceId: Schema.Types.ObjectId;
    location: {
      latitude: number;
      longitude: number;
    };
    timestamp: Date;
  }
  