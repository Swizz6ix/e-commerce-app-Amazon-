import React, {useEffect} from 'react';
import './App.css';
import Header from './Header';
import Home from './Home';
import { Routes, Route, Link } from "react-router-dom";
import Checkout from './Checkout';
import Login from './Login';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import { useStateValue } from './StateProvider';
import Payment from './Payment';
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import Orders from './Orders';

const promise = loadStripe(
  "pk_test_51KpdLNLy0tV1iuNuTHBT9m1wM4zDdL6LhZcPdVewdBFxu3aFQBsfZOSaXuFGY6IBFVhLbOhe8BKchqP5qT0LOy7n00n1xBbTW0"
);

function App() {
  const [{}, dispatch] = useStateValue();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth,(authUser) => {
      console.log('I am in', authUser);

      if (authUser) {
        dispatch({
          type: 'SET_USER',
          user: authUser
        })
      } else {
        dispatch({
          type: 'SET_USER',
          user: null
        })
      }
    })
  
    return () => {
      unsubscribe();
    }
  }, [])
  
  return (
    <div className="app">
      <Routes>
        <Route path='/orders' element={<><Header /><Orders /></>} />

        <Route path='/payment' element={<><Header /><Elements stripe={promise}><Payment /></Elements></>} />

        <Route path='/login' element={<><Login /></>} />
        
        <Route path='/checkout' element={<><Header /><Checkout /></>} />

        <Route path='/' element={<><Header /><Home /></>} />
      </Routes>
    </div>
    
  );
}

export default App;
