import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    city: '',
    country: '',
    additionalInfo: '',
  });
  
 
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);


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


  const handleSubmit = (e) => {
    e.preventDefault();
    
    const submissionData = {
      name: `${formData.name}`,
      email: formData.email,
      password: formData.password,

  
    };
    console.log("Submitting registration data:", submissionData);
    console.log("Avatar file to upload:", avatarFile);
    
    //will send data to backend 
    
    
    navigate('/login');
    alert("Registration submitted! Check the console for data.");
  };

  return (
    <div className="bg-[#1E212B] min-h-screen w-screen text-[#EAECEE] font-sans flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <h1 className="text-3xl font-bold text-center mb-6">Registration Screen</h1>
        
        <form onSubmit={handleSubmit} className="bg-[#2D3039] border-2 border-[#4A4E5A] rounded-lg p-8 space-y-6">
          
          {/* Avatar Upload Section */}
          <div className="flex justify-center">
            <label htmlFor="avatar-upload" className="cursor-pointer">
              <div className="w-32 h-32 rounded-full bg-[#1E212B] border-2 border-dashed border-[#4A4E5A] flex items-center justify-center text-gray-400 overflow-hidden">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Avatar Preview" className="w-full h-full object-cover" />
                ) : (
                  <span>Photo</span>
                )}
              </div>
            </label>
            <input id="avatar-upload" type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
          </div>

          {/* Form Fields Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full bg-[#1E212B] p-3 rounded-lg border-2 border-[#4A4E5A] focus:outline-none focus:border-[#8338EC]" required />
            <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} className="w-full bg-[#1E212B] p-3 rounded-lg border-2 border-[#4A4E5A] focus:outline-none focus:border-[#8338EC]" required />
            <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} className="w-full bg-[#1E212B] p-3 rounded-lg border-2 border-[#4A4E5A] focus:outline-none focus:border-[#8338EC]" required />
            <input type="tel" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} className="w-full bg-[#1E212B] p-3 rounded-lg border-2 border-[#4A4E5A] focus:outline-none focus:border-[#8338EC]" />
            <div className="grid grid-cols-2 gap-4">
              <input type="text" name="city" placeholder="City" value={formData.city} onChange={handleChange} className="w-full bg-[#1E212B] p-3 rounded-lg border-2 border-[#4A4E5A] focus:outline-none focus:border-[#8338EC]" />
              <input type="text" name="country" placeholder="Country" value={formData.country} onChange={handleChange} className="w-full bg-[#1E212B] p-3 rounded-lg border-2 border-[#4A4E5A] focus:outline-none focus:border-[#8338EC]" />
            </div>
          </div>
          
          {/* Additional Information Textarea */}
          <textarea name="additionalInfo" placeholder="Additional Information ...." value={formData.additionalInfo} onChange={handleChange} rows="4" className="w-full bg-[#1E212B] p-3 rounded-lg border-2 border-[#4A4E5A] focus:outline-none focus:border-[#8338EC]"></textarea>

          {/* Submit Button */}
          <div className="text-center pt-4">
            <button type="submit" className="bg-[#8338EC] text-white rounded-full px-10 py-3 shadow-lg hover:bg-opacity-90 transition-transform hover:scale-105 font-semibold">
              Register User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;