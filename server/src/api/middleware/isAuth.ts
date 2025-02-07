
export default async(req, res, next) =>{

	try{
		
		//req.isAuthenticated()
		
		if(true){

			req.user = { id:'123', username: 'Ian Channer'}
			
			next()
		}
		else{

			throw new Error('Unauthorized')
		}
	}
	catch(err){

		next(err)
	}
}