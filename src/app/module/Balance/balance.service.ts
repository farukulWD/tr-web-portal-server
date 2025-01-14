import AppError from "../../errors/AppError";
import { Dealer } from "../dealer/dealer.model";
import { IBalance } from "./balance.interface";
import { Balance } from "./balance.model";
import httpStatus from 'http-status';



const addBalanceService = async(paylod:IBalance)=>{

    if (!paylod.dealer) {
        throw new AppError(httpStatus.BAD_REQUEST,"Dealer is require")
    }
    if (!paylod.amount) {
        throw new AppError(httpStatus.BAD_REQUEST,"Amount is require")
    }
    if (!paylod.transactionNo) {
        throw new AppError(httpStatus.BAD_REQUEST,"Transaction No is require")
    }
    if (!paylod.senderBank) {
        throw new AppError(httpStatus.BAD_REQUEST,"Sender Bank is require")
    }
    if (!paylod.receivedBank) {
        throw new AppError(httpStatus.BAD_REQUEST,"Received Bank is require")
    }
    if (!paylod.addedBy) {
        throw new AppError(httpStatus.BAD_REQUEST,"Creator is require")
    }


    const findDealer = await Dealer.findById({_id:paylod.dealer})
    if (!findDealer) {
        throw new AppError(httpStatus.BAD_REQUEST,"Opps!! Dealer not found")
    }

    const result = await Balance.create(paylod)

    return result

}


const getBalanceServices = async()=>{
    const result = await Balance.find().populate("addedBy dealer")
    return result
}



export const BalanceServices = {
    addBalanceService,
    getBalanceServices
  };
  