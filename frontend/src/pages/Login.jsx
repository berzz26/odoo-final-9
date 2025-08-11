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
     
      const response = await fetch('https://odoo-final-9.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed. Please check your credentials.');
      }

      const result = await response.json();
      console.log('Login successful:', result);
      
      localStorage.setItem('authToken', result.token);

  
      navigate('/');

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
          
          {/* Photo Placeholder */}
          <div className="flex justify-center">
            <div className="w-24 h-24 rounded-full bg-[#1E212B] border-2 border-dashed border-[#4A4E5A] flex items-center justify-center text-gray-400">
              Photo
            </div>
          </div>

          {/* This wrapper keeps the form fields centered and at a sensible width */}
          <div className="max-w-sm mx-auto space-y-6">
            {/* Form Fields */}
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
            
            {/* Error Message Display */}
            {error && <p className="text-red-500 text-center text-sm">{error}</p>}

            {/* Submit Button */}
            <div className="text-center pt-4">
              <button 
                type="submit" 
                className="w-full bg-[#8338EC] text-white rounded-full px-8 py-3 shadow-lg hover:bg-opacity-90 transition-transform hover:scale-105 font-semibold disabled:bg-gray-500 disabled:cursor-not-allowed" 
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login Button'}
              </button>
            </div>

            {/* Link to Registration Page */}
            <p className="text-center text-sm text-gray-400 pt-4">
              Don't have an account?{' '}
              <Link to="/signup" className="font-semibold text-[#8338EC] hover:underline">
                SignUp
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
export default Login;