import bcrypt from 'bcrypt'
import validator from 'password-validator'

/**
 * verify the password strength
 * @param password password that need to verify
 * @returns password valid or not in terms of "true" or "false"
 */
export async function passwordValidator({password}:{password:string}):Promise<boolean>{
    const passwordStructure  = new validator()
    passwordStructure
        .is().min(8)
        .is().max(30)
        .has().uppercase()
        .has().lowercase()
        .has().digits()
        .has().symbols()
        .has().not().spaces()

    const passwordResult =  passwordStructure.validate(password)
    return Boolean(passwordResult)
}

/**
 * Hash the given password
 * @param password password thats needs to be hashed
 * @returns hashhed password
 */
export async  function  passwordHashing({password}:{password:string}){
    try{
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds)
        return hashedPassword
    }
    catch(e){
        console.log('Error hashing password : ',e)
        throw new Error("Error hashing password. Please try again.")
    }
}