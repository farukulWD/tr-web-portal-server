import AppError from "../../errors/AppError";
import { sendImageToCloudinary } from "../../utils/sendImageToCloudinary";
import { User } from "../users/user.model";
import { IAttendance, ILocation } from "./attendence.interface";
import { Attendance } from "./attendence.model";
import httpStatus from 'http-status';
import { Location } from "./location.modal";

const createAttendanceIntoDb = async (file: any, payload: IAttendance) => {

    try {
        //set  generated id

        const existingUser = await User.findOne({ _id: payload.userId });
        if (file) {
            const imageName = `${existingUser?.name}-${Date.now()}`;
            const path = file?.path;

            //send image to cloudinary
            const { secure_url } = await sendImageToCloudinary(imageName, path);
            payload.photoHash = secure_url as string;
        }


        if (existingUser) {
            throw new AppError(httpStatus.BAD_REQUEST, 'The user already created');
        }

        // create a user (transaction-1)
        const newUser = await Attendance.create(payload); // array

        return newUser;
    } catch (err: any) {

        throw new Error(err);
    }
};

const saveLocation = async (payload: ILocation) => {
    try {
        const location = await Location.create(payload);
        return location;
    } catch (err: any) {
        throw new Error(err);
    }
}


export const AttendanceServices = {
    createAttendanceIntoDb,
    saveLocation
}
