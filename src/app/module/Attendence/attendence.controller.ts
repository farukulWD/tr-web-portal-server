import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AttendanceServices } from "./attendence.services";

const createAttendance = catchAsync(async (req, res) => {
    const userData = req.body;
  
    const result = await AttendanceServices.createAttendanceIntoDb(req.file, userData);
  
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'attendance created success',
      data: result,
    });
  });


//   const getUsers = catchAsync(async (req, res) => {
//     const result = await AttendanceServices.getAttendance();
  
//     sendResponse(res, {
//       statusCode: httpStatus.OK,
//       success: true,
//       message: 'User created success',
//       data: result,
//     });
//   });

const saveAttendance = async(data:any)=>{
    const result = await AttendanceServices.saveLocation(data);

}

export const AttendanceController = {
    createAttendance,
    saveAttendance
}
