export const sanitizedData = (data) => {
  return {
    _id: data._id,
    firstName: data.firstName,
    lastName: data.lastName,
    userName : data.userName , 
    email: data.email,
    image: data.image
    
  };
}