import mongoose, { Schema } from "mongoose";
import { ILocation } from "./attendence.interface";

const LocationSchema = new Schema<ILocation>({
    attendanceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Attendance', required: true },
    location: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
    },
    timestamp: { type: Date, default: Date.now },
  });
  
  export const Location = mongoose.model<ILocation>('Location', LocationSchema);
  