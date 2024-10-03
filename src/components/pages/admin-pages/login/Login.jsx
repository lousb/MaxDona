import { useContext, useEffect, useState } from "react"
import "./login.css"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../../firebase/firebase";
import { useNavigate } from "react-router-dom";
import {AuthContext} from "../../../../context/AuthContext"
import { useFooter } from "../../../../context/FooterContext";

const Login = () => {

  const [error, setError] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const {dispatch} = useContext(AuthContext);
const { dispatch: dispatchFooterAction } = useFooter();      // Aliasing footer dispatch

useEffect(() => {
  dispatchFooterAction({ type: "Small" });
  return () => {
    dispatchFooterAction({ type: "Default" });
  };
}, [dispatchFooterAction]);

  const handLogin = (e)=>{
    e.preventDefault();


    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        dispatch({type:'LOGIN', payload:user})
        navigate('/');
      })
      .catch((error) => {
        setError(true);
    });

  } 

  return (
    <div className="login">
      <form onSubmit={handLogin} >
        <input type='email' placeholder='email' onChange={e=>setEmail(e.target.value)}></input>
        <input type='password' placeholder='password' onChange={e=>setPassword(e.target.value)}></input>
        <button type='submit'>Login</button>
        {error && <span>Incorrect login details</span>}
      </form>
    </div>
  )
}

export default Login