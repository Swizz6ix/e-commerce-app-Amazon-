import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import CheckoutProduct from './CheckoutProduct';
import { useStateValue } from './StateProvider'
import "./Payment.css";
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import CurrencyFormat from 'react-currency-format';
import { getBasketTotal } from "./reducer";
import { async } from '@firebase/util';
import axios from './axios';
import { addDoc, collection, doc } from 'firebase/firestore';
import db from './firebase';
import {getDatabase, ref, set} from "firebase/database";

function Payment() {
    const [{basket, user}, disptach] = useStateValue();
    const navigate = useNavigate();

    const stripe = useStripe();
    const elements = useElements();

    const [error, setError] = useState(null);
    const [disabled, setDisabled] = useState(true);
    const [succeeded, setSucceeded] = useState(false);
    const [processing, setProcessing] = useState('');
    const [clientSecret, setClientSecret] = useState('');

    useEffect(() => {
        const getClientSecret = async () => {
            const response = await axios({
                method: "post",
                url: `/payments/create?total=${getBasketTotal(basket) * 100}`
                // NB: Srtipe expects the total in a currency subunits hence the above (*100)
            });
            setClientSecret(response.data.clientSecret)
            console.log('BABY', response)
        }
    
        getClientSecret();
    
    }, [basket])
    
    console.log("tell me a secret Playboi", clientSecret)
    console.log('swizz', user)

    const handleSubmit = async (e) => {
        e.preventDefault();
        setProcessing(true);

        const payload = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: elements.getElement(CardElement)
            }
        })
        .then(({paymentIntent}) => {
            // paymentIntent = payment confirmatiom

            const db = getDatabase();
            set(ref(db, "users/" + user?.uid + "/orders" + paymentIntent.id ), {
                basket: basket,
                amount: paymentIntent.amount,
                created: paymentIntent.created,
            });

            setSucceeded(true)
            setError(null)
            setProcessing(false)

            disptach({
                type: "EMPTY_BASKET"
            })

            navigate("../orders", { replace:true })
        })
    }

    const handleChange = (e) => {
        // Listen for changes in the CardElement
        // and display any errors as the customer types their card details

        setDisabled(e.empty);
        setError(e.error ? e.error.message : '')
    }


  return (
    <div className='payment'>
        <div className='payment__container'>
            <h1>
                Checkout (
                    {<Link to="/checkout">{basket?.length} item(s)</Link>}
                    )
            </h1>
            <div className='payment__section'>
                <div className='payment__title'>
                    <h3>Delivery Address</h3>

                </div>
                <div className='payment__address'>
                    <p>{user?.email}</p>
                    <p>123 React lane</p>
                    <p>Los Angeles, CA</p>

                </div>

            </div>

            <div className='payment__section'>
                <div className='payment__title'>
                    <h3>Review items and Delivery</h3>

                </div>
                <div className='payment__items'>
                    {basket.map((item) => (
                        <CheckoutProduct
                        id={item.id}
                        title={item.title}
                        image={item.image}
                        price={item.price}
                        rating={item.rating} />
                    ))}

                </div>

            </div>

            <div className='payment__section'>
                <div className='payment__title'>
                    <h3>Payment Method</h3>

                </div>
                <div className='payment__details'>
                    <form onSubmit={handleSubmit}>
                            <CardElement onChange={handleChange} />

                            <div className='payment__priceContainer'>
                                <CurrencyFormat
                                renderText={(value) => (
                                <h3>Order Total: {value}</h3>
                                )}
                                decimalScale={2}
                                value={getBasketTotal(basket)}
                                displayType={'text'}
                                thousandSeparator={true}
                                prefix={'$'}
                                />
                            <button disabled={processing || disabled || succeeded}>
                                <span>{processing ? <p>processing</p> : "Buy Now"}</span>
                        
                            </button>
                            </div>
                            {error && <div>{error}</div>}
                        </form>
                </div>

            </div>
        
        </div>

    </div>
    )
}

export default Payment