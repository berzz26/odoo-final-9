import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // UPDATED: Using environment variable for the API endpoint
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      // FIXED: Read the response as text first to avoid JSON parsing errors
      const responseText = await response.text();
      
      // Try to parse the text as JSON. If it fails, we'll know the response wasn't JSON.
      let result;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        // If parsing fails, throw an error with the raw text response
        throw new Error(`Server returned a non-JSON response: ${responseText}`);
      }

      if (!response.ok) {
        throw new Error(result.message || 'Login failed. Please check your credentials.');
      }

      const { token } = result;

      if (token) {
        console.log('Login successful, token received.');
        // Store the auth token to keep the user logged in
        localStorage.setItem('authToken', token);
        // On success, navigate to the main application dashboard
        navigate('/');
      } else {
        throw new Error('Login successful, but no authentication token was provided.');
      }

    } catch (err) {
      console.error('Login error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#1E212B] min-h-screen w-screen text-[#EAECEE] font-sans flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <h1 className="text-3xl font-bold text-center mb-6">Login Screen</h1>
        
        <form onSubmit={handleSubmit} className="bg-[#2D3039] border-2 border-[#4A4E5A] rounded-lg p-8 space-y-6">
          
          <div className="flex justify-center">
            <div className="w-24 h-24 rounded-full bg-[#1E212B] border-2 border-dashed border-[#4A4E5A] flex items-center justify-center text-gray-400">
              Photo
            </div>
          </div>

          <div className="max-w-sm mx-auto space-y-6">
            <div>
              <input 
                type="email" 
                name="email" 
                placeholder="Email Address" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="w-full bg-[#1E212B] p-3 rounded-lg border-2 border-[#4A4E5A] focus:outline-none focus:border-[#8338EC]" 
                required 
              />
            </div>
            <div>
              <input 
                type="password" 
                name="password" 
                placeholder="Password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="w-full bg-[#1E212B] p-3 rounded-lg border-2 border-[#4A4E5A] focus:outline-none focus:border-[#8338EC]" 
                required 
              />
            </div>
            
            {error && <p className="text-red-500 text-center text-sm">{error}</p>}

            <div className="text-center pt-4">
              <button 
                type="submit" 
                className="w-full bg-[#8338EC] text-white rounded-full px-8 py-3 shadow-lg hover:bg-opacity-90 transition-transform hover:scale-105 font-semibold disabled:bg-gray-500 disabled:cursor-not-allowed" 
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login Button'}
              </button>
            </div>

            <p className="text-center text-sm text-gray-400 pt-4">
              Don't have an account?{' '}
              <Link to="/signup" className="font-semibold text-[#8338EC] hover:underline">
                Sign Up
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;