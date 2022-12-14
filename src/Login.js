import React, {useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from './firebase';
import "./Login.css";
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    const signIn = e => {
        e.preventDefault();
        signInWithEmailAndPassword(auth, email, password)
        navigate('/')
        .catch((error) => alert(error.message));
    }

    const registerAccount = (e) => {
        e.preventDefault();

        createUserWithEmailAndPassword(auth, email, password)
        .then((authUser) => {
            console.log(authUser);
            if (auth) {
                navigate('/')
            }
        })
        .catch((error) => alert(error.message));
    }
  return (
    <div className='login'>
    <Link to="/">
    <img src='https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg' alt='Amazon Login logo' className='login__logo' />
    </Link>

    <div className='login__container'>
        <h1>Sign in</h1>

        <form>
            <h5>E-mail</h5>
            <input type='text' value={email} onChange={e => setEmail(e.target.value)} />
            <h5>Password</h5>
            <input type="password" value={password}  onChange={e => setPassword(e.target.value)}/>

            <button className='login__signInButton' onClick={signIn} type='submit'>Sign in </button>
        </form>

        <p>
            By signing-in you agree to the AMAZON FAKE CLONE conditions of Use & Sale. Please see our Privacy Notice, our Cookies Notice and our Interest-Based Ads 
        </p>

        <button className='login__registerButton' type='submit' onClick={registerAccount}>Create your Amazon Account</button>

    </div>
    </div>
  )
}

export default Login