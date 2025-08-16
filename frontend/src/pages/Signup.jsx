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
  const [success, setSuccess] = useState(null); // ✅ new state for success

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
    setSuccess(null);

    try {
      // Signup API call
      const signupResponse = await fetch(`/api/auth/signup`, {
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

        const avatarResponse = await fetch(`/api/upload/avatar`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: avatarFormData,
        });

        const avatarResult = await avatarResponse.json();
        if (!avatarResponse.ok) throw new Error(avatarResult.message || 'Avatar upload failed.');
      }

      localStorage.setItem('authToken', token);
      setSuccess('Registration successful! ✅'); // ✅ show success box
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

return (
    <div className="bg-white min-h-screen w-full text-[#A86523] font-sans flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-6 text-[#A86523]">Create Your Account</h1>

        <form onSubmit={handleSubmit} className="bg-[#FCEFCB] border-2 border-[#FAD59A] rounded-2xl p-6 sm:p-8 space-y-6 shadow-lg">
          {/* Avatar Upload */}
          <div className="flex flex-col items-center space-y-2">
            <label htmlFor="avatar-upload" className="cursor-pointer group">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-white border-2 border-dashed border-[#A86523] flex items-center justify-center text-[#A86523]/80 overflow-hidden relative transition-all duration-300 group-hover:border-solid">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Avatar Preview" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-sm sm:text-base">Add Photo</span>
                )}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-white text-xs font-semibold">Change</span>
                </div>
              </div>
            </label>
            <input id="avatar-upload" type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            {/* Full Name */}
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-white p-3 rounded-lg border-2 border-[#A86523]/50 focus:outline-none focus:ring-2 focus:ring-[#A86523]/50 focus:border-transparent placeholder:text-[#A86523]/70"
              required
            />
            {/* Email Address */}
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-white p-3 rounded-lg border-2 border-[#A86523]/50 focus:outline-none focus:ring-2 focus:ring-[#A86523]/50 focus:border-transparent placeholder:text-[#A86523]/70"
              required
            />
            {/* Password */}
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-white p-3 rounded-lg border-2 border-[#A86523]/50 focus:outline-none focus:ring-2 focus:ring-[#A86523]/50 focus:border-transparent placeholder:text-[#A86523]/70"
              required
            />
            {/* Phone Number */}
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              className="w-full bg-white p-3 rounded-lg border-2 border-[#A86523]/50 focus:outline-none focus:ring-2 focus:ring-[#A86523]/50 focus:border-transparent placeholder:text-[#A86523]/70"
            />
            {/* City */}
            <input
              type="text"
              name="city"
              placeholder="City"
              value={formData.city}
              onChange={handleChange}
              className="w-full bg-white p-3 rounded-lg border-2 border-[#A86523]/50 focus:outline-none focus:ring-2 focus:ring-[#A86523]/50 focus:border-transparent placeholder:text-[#A86523]/70"
            />
            {/* Country */}
            <input
              type="text"
              name="country"
              placeholder="Country"
              value={formData.country}
              onChange={handleChange}
              className="w-full bg-white p-3 rounded-lg border-2 border-[#A86523]/50 focus:outline-none focus:ring-2 focus:ring-[#A86523]/50 focus:border-transparent placeholder:text-[#A86523]/70"
              required
            />
          </div>

          {/* Message Box */}
          <div className="h-8"> {/* This div ensures layout doesn't jump when messages appear */}
            {error && <p className="text-red-600 text-center text-sm bg-red-100 p-2 rounded-lg">{error}</p>}
            {success && <p className="text-green-600 text-center text-sm bg-green-100 p-2 rounded-lg">{success}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#A86523] text-white py-3 rounded-lg font-semibold hover:bg-[#935920] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Registering...' : 'Sign Up'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
