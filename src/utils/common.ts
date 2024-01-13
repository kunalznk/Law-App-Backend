export const buildSuccessMessage = (resData : unknown) => {
  return {
        data : {
        status : "SUCCESS",
        data: resData,
    },
    statusCode : 200
  }
}

export const buildFailMessage = (e : Error | any) => {
  console.log("Error", e)
  let error;
  return {
       data : { 
        status : "FAIL",
        message : e?.name,
        error
    } ,
    statusCode : 200
    }
}
