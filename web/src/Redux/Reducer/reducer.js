const INITIAL_STATE = {
        user : null    
}

export const  LoginReducer   = (state = INITIAL_STATE , action)=>{

            if(action.type === "USER LOGIN"){
                return state = action.payload 
            }else{
                return state
            }


}