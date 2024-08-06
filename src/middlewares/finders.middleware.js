import { ErrorHandel } from "../utils/index.js";

export const getDocument = (model) => {
  return async (req , res , next) => {
    const {name} = req.body 
    if(name) {
      const document = await model.findOne({name});
      if (document) next(new ErrorHandel("this name already exist", 400));
    }
    next()
  };
}