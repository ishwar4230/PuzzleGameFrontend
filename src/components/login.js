import React, {useState} from 'react';
import "./loginstyle.css";
import { useNavigate } from 'react-router-dom';
const Login = () => {

    const navigate = useNavigate();
    const [isRegistering, setIsRegistering] = useState(false);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const userdata={email};
    const handleToggleMode = () => {
      setIsRegistering(!isRegistering);
    };
  
    const handleAuth = async () => {
      if (isRegistering) {
        
        console.log('Register:', username, email, password);
        if(username.length==0 || email.length==0 || password.length==0 )
        alert('Fill all the details!');
        else{
        try {
            const response = await fetch('https://puzzlegamebackend.onrender.com/register', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                username,
                email,
                password
              })
            });
      
            if (response.status === 201) {
              
              navigate("/puzzle",{state:userdata});
              //alert('Registration successful!');
              // You can redirect or display a success message here
            } else {
              alert('Registration failed.');
              // You can display an error message here
            }
          } catch (error) {
            alert('Error registering:', error);
          }
        
      }
     } 
     else {
        // Handle login logic here
        // For this example, you can print the email and password to the console
        console.log('Login:', email, password);
        try {
            const response = await fetch('https://puzzlegamebackend.onrender.com/login', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                email,
                password,
              }),
            });
      
            const data = await response.json();
      
            if (response.status === 200) {
              // Successful login
              //alert('Login Successful!');
              navigate("/puzzle",{state:userdata});
            } else {
              // Invalid credentials
              alert('Invalid email or password.');
            }
          } catch (error) {
            console.error('Error logging in:', error);
            //setErrorMessage('An error occurred while logging in.');
          }

      }
      
    };
  
    return (
        <div>
      <div className="auth-container">
        <h2>{isRegistering ? 'Register' : 'Login'}</h2>
        {isRegistering && (
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleAuth}>
          {isRegistering ? 'Register' : 'Login'}
        </button>
        <p onClick={handleToggleMode}>
          {isRegistering ? 'Already have an account? Login' : 'Don\'t have an account? Register'}
        </p>
      </div>
      <div className='last'>
       <h3 >OR</h3>
      <button onClick={()=>{ navigate("/puzzle",{state:userdata})}}>Continue as a Guest</button>
      </div>
      </div>
    );
};

export default Login