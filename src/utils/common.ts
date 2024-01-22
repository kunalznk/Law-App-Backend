export const buildSuccessMessage = (resData : unknown, message ?: string) => {
  return {
        data : {
        status : "SUCCESS",
        data: resData,
        message
    },
    statusCode : 200
  }
}

export const buildFailMessage = (e : Error | any) => {
  console.log("Error", JSON.stringify(e))
  let error;
  return {
       data : { 
        status : "FAIL",
        message : e?.name,
        error
    } ,
    statusCode : 500
    }
}
