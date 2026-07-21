const asynchandler = (fn)=>{
    return async(req,res,next)=>{
        try{
            await fn(req,res,next);
        }
        catch(error){

            console.log(error.stack);

            res.status(500).json({
                success:false,
                message:error.message
            });
        }
    }
}

export default asynchandler;