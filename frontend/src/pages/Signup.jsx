import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    country: '',

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
      // Step 1: Signup request
      const signupResponse = await fetch(`http://192.168.103.71:3000/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          country: formData.country,

        }),
      });

      const signupResult = await signupResponse.json();
      console.log(signupResult);

      if (!signupResponse.ok) throw new Error(signupResult.message || 'User registration failed.');

      const { token } = signupResult.user;
      if (!token) throw new Error('No token returned from signup.');

      // Step 2: Avatar upload (if selected)
      if (avatarFile) {
        const avatarFormData = new FormData();
        avatarFormData.append('avatar', avatarFile);

        const avatarResponse = await fetch(`http://192.168.103.71:3000/api/upload/avatar`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: avatarFormData,
        });

        const avatarResult = await avatarResponse.json();
        if (!avatarResponse.ok) throw new Error(avatarResult.message || 'Avatar upload failed.');
      }

      // Step 3: Store token and redirect
      localStorage.setItem('authToken', token);

      alert('Registration successful!');
      navigate('/');

    } catch (err) {
      console.error('Registration process error:', err);
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

          {/* Avatar Upload Section */}
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

          {/* Form Fields Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} className="w-full bg-[#FCEFCB] p-3 rounded-lg border-2 border-[#A86523]/50 focus:outline-none focus:border-[#A86523] placeholder:text-[#A86523]/70" required />
            <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} className="w-full bg-[#FCEFCB] p-3 rounded-lg border-2 border-[#A86523]/50 focus:outline-none focus:border-[#A86523] placeholder:text-[#A86523]/70" required />
            <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} className="w-full bg-[#FCEFCB] p-3 rounded-lg border-2 border-[#A86523]/50 focus:outline-none focus:border-[#A86523] placeholder:text-[#A86523]/70" required />
            <input type="tel" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} className="w-full bg-[#FCEFCB] p-3 rounded-lg border-2 border-[#A86523]/50 focus:outline-none focus:border-[#A86523] placeholder:text-[#A86523]/70" />
            <input type="text" name="city" placeholder="City" value={formData.city} onChange={handleChange} className="w-full bg-[#FCEFCB] p-3 rounded-lg border-2 border-[#A86523]/50 focus:outline-none focus:border-[#A86523] placeholder:text-[#A86523]/70" />
            <input type="text" name="country" placeholder="Country" value={formData.country} onChange={handleChange} className="w-full bg-[#FCEFCB] p-3 rounded-lg border-2 border-[#A86523]/50 focus:outline-none focus:border-[#A86523] placeholder:text-[#A86523]/70" required />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-3 p-6">
          <Button className="bg-[#A86523] text-[#FCEFCB] hover:bg-[#A86523]/90" onClick={handleUpdateProfile}>Save Profile</Button>
          <Button className="bg-red-600 text-white hover:bg-red-600/90" onClick={handleLogout}>Logout</Button>
        </CardFooter>
      </Card>

      <Card className="w-full max-w-6xl shadow-lg text-center bg-[#FAD59A] border border-[#A86523] text-[#A86523]">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Pre-Planned Trips</CardTitle>
          <CardDescription className="text-[#A86523]/90">View and manage your upcoming trips.</CardDescription>
        </CardHeader>
        <CardContent>
          <div>
            {categorizedTrips.upcoming.length > 0 ? (
              categorizedTrips.upcoming.map((trip) => (
                <TripCard key={trip.id} trip={trip} onDelete={handleTripDelete} />
              ))
            ) : (
              <p className="text-[#A86523]/90">No upcoming trips.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Signup;