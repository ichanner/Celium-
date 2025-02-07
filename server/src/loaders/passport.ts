import passport from 'passport'
import { Strategy } from 'passport-google-oauth20'
import config from "../config/index"

export default () =>{

	passport.use(new Strategy({

		clientID: config.CLIENT_ID,
		clientSecret: config.CLIENT_SECRET,
		callbackURL: `${config.HOSTNAME}/auth/google/callback`,
		scope:['profile'],
		accessType:'offline',
		prompt:'consent'

	}, async (req, accessToken, refreshToken, user, done)=>{

		try{

			done(null, user)
		}
		catch(err){

			done(err, null)
		}
	}))

	passport.serializeUser((user : any, done : any)=>{

		done(null, user)
	})

	passport.deserializeUser((user : any, done : any)=>{

		done(null, user)
	})
	
}