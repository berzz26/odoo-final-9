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
      const response = await fetch(`http://13.202.224.27:3000/api/auth/login`, {
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
    <div className="bg-[#FFFFFF] min-h-screen w-screen text-[#A86523] font-sans flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <h1 className="text-3xl font-bold text-center mb-6 text-[#A86523]">Login Page</h1>
        
        <form onSubmit={handleSubmit} className="bg-[#FCEFCB] border-2 border-[#FAD59A] rounded-lg p-8 space-y-6 shadow-lg">
          
          <div className="flex justify-center">
            {/* You can add an icon or image here if needed */}
          </div>

          <div className="max-w-sm mx-auto space-y-6">
            <div>
              <input 
                type="email" 
                name="email" 
                placeholder="Email Address" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="w-full bg-[#FFFFFF] p-3 rounded-lg border-2 border-[#FAD59A] focus:outline-none focus:border-[#A86523] placeholder:text-[#A86523]/70" 
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
                className="w-full bg-[#FFFFFF] p-3 rounded-lg border-2 border-[#FAD59A] focus:outline-none focus:border-[#A86523] placeholder:text-[#A86523]/70" 
                required 
              />
            </div>
            
            {error && <p className="text-red-500 text-center text-sm">{error}</p>}

            <div className="text-center pt-4">
              <button 
                type="submit" 
                className="w-full bg-[#A86523] text-white rounded-full px-8 py-3 shadow-lg hover:bg-[#A86523]/90 transition-transform hover:scale-105 font-semibold disabled:bg-gray-500 disabled:cursor-not-allowed" 
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </div>

            <p className="text-center text-sm text-[#A86523]/90 pt-4">
              Don't have an account?{' '}
              <Link to="/signup" className="font-semibold text-[#A86523] hover:underline">
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