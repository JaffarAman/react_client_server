export const SignupAction = (data)=>{
    return (dispatch)=>{
            dispatch({
                type:"USER SIGNUP",
                payload : data
            })
    }
}

export const LoginAction = (data)=>{
    console.log("redux data", data);
    return (dispatch)=>[

                dispatch({
                    type:"USER LOGIN",
                    payload : data
                })

        ]
}