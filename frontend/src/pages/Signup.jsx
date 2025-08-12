import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    country: '',
    phone: '',
    city: '',
  });

  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Signup API call
      const signupResponse = await fetch(`${import.meta.process.env.VITE_BAKEND_URL}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          country: formData.country,
          phone: formData.phone,
          city: formData.city,
        }),
      });

      const signupResult = await signupResponse.json();
      if (!signupResponse.ok) throw new Error(signupResult.message || 'User registration failed.');

      const { token } = signupResult.user || {};
      if (!token) throw new Error('No token returned from signup.');

      // Upload avatar if any
      if (avatarFile) {
        const avatarFormData = new FormData();
        avatarFormData.append('avatar', avatarFile);

        const avatarResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/upload/avatar`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: avatarFormData,
  });

        const avatarResult = await avatarResponse.json();
        if (!avatarResponse.ok) throw new Error(avatarResult.message || 'Avatar upload failed.');
      }

      localStorage.setItem('authToken', token);
      alert('Registration successful!');
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#FCEFCB] min-h-screen w-screen text-[#A86523] font-sans flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <h1 className="text-3xl font-bold text-center mb-6 text-[#A86523]">SignUp Page</h1>

        <form onSubmit={handleSubmit} className="bg-[#FAD59A] border-2 border-[#A86523] rounded-lg p-8 space-y-6">
          {/* Avatar Upload */}
          <div className="flex justify-center">
            <label htmlFor="avatar-upload" className="cursor-pointer">
              <div className="w-32 h-32 rounded-full bg-[#FCEFCB] border-2 border-dashed border-[#A86523] flex items-center justify-center text-[#A86523]/80 overflow-hidden">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Avatar Preview" className="w-full h-full object-cover" />
                ) : (
                  <span>Photo</span>
                )}
              </div>
            </label>
            <input id="avatar-upload" type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-[#FCEFCB] p-3 rounded-lg border-2 border-[#A86523]/50 focus:outline-none focus:border-[#A86523] placeholder:text-[#A86523]/70"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-[#FCEFCB] p-3 rounded-lg border-2 border-[#A86523]/50 focus:outline-none focus:border-[#A86523] placeholder:text-[#A86523]/70"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-[#FCEFCB] p-3 rounded-lg border-2 border-[#A86523]/50 focus:outline-none focus:border-[#A86523] placeholder:text-[#A86523]/70"
              required
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              className="w-full bg-[#FCEFCB] p-3 rounded-lg border-2 border-[#A86523]/50 focus:outline-none focus:border-[#A86523] placeholder:text-[#A86523]/70"
            />
            <input
              type="text"
              name="city"
              placeholder="City"
              value={formData.city}
              onChange={handleChange}
              className="w-full bg-[#FCEFCB] p-3 rounded-lg border-2 border-[#A86523]/50 focus:outline-none focus:border-[#A86523] placeholder:text-[#A86523]/70"
            />
            <input
              type="text"
              name="country"
              placeholder="Country"
              value={formData.country}
              onChange={handleChange}
              className="w-full bg-[#FCEFCB] p-3 rounded-lg border-2 border-[#A86523]/50 focus:outline-none focus:border-[#A86523] placeholder:text-[#A86523]/70"
              required
            />
          </div>

          {error && <p className="text-red-600 text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#A86523] text-[#FCEFCB] py-3 rounded-lg font-semibold hover:bg-[#A86523]/90 disabled:opacity-50"
          >
            {loading ? 'Registering...' : 'Sign Up'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
