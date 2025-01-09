import mongoose, { Schema } from "mongoose";
import { IAttendance } from "./attendence.interface";

const AttendanceSchema = new Schema<IAttendance>({
    userId: { type: mongoose.Schema.Types.ObjectId ,ref: 'User', required: true },
    photoHash: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },{
    timestamps: true
  });
  
  export const Attendance = mongoose.model<IAttendance>('Attendance', AttendanceSchema);
