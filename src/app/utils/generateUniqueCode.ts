import { User } from "../module/users/user.model";

export const generateUniqueCode = async () => {
    const year = new Date().getFullYear().toString().slice(-2); 
    const prefix = `${year}`; 
  
   
    const lastUser = await User.findOne({ code: { $regex: `^${prefix}` } })
      .sort({ code: -1 })
      .exec();
  
    
    let nextNumber = 1; 
    if (lastUser) {
      const lastCode = lastUser?.code ? parseInt(lastUser.code.slice(2), 10) : 0; 
      nextNumber = lastCode + 1; 
    }
  
    
    const newCode = `${prefix}${nextNumber.toString().padStart(4, '0')}`;
  
    return newCode;
  };
  