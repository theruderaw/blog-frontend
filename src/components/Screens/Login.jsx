import  { useState } from 'react'
import {useLocation, useNavigate } from 'react-router-dom'
import { supabase } from '../Auth/supabaseClient'
import LoginForm from '../LoginScreens/LoginForm'

function Login() {
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || '/dashboard'

    const handleLogin = async (e, email, password) => {
        e.preventDefault()
        setLoading(true);
        setErrorMessage('');

        console.log({ email, password })

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email, password
            })

            console.log({ data, error })

            if (error) throw error;

            if (data?.user) {
                navigate(from, { replace: true })
                console.log("Logged in")
            }
        } catch (error) {
            setErrorMessage(error.message)
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <LoginForm handleLogin={handleLogin} />
        </div>
    )
}

export default Login