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
    //   const expirationTime = Date.now() + 7 * 24 * 60 * 60 * 1000;
    //   localStorage.setItem('authToken', JSON.stringify({ token, expires: expirationTime }));

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
    <div className="flex flex-col items-center w-screen min-h-screen bg-[#FCEFCB] p-4 sm:p-6 gap-6 font-sans">
      <Card className="w-full max-w-6xl shadow-lg bg-[#FAD59A] border border-[#A86523] text-[#A86523]">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">User Profile</CardTitle>
          <CardDescription className="text-[#A86523]/90">View and manage your account details.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="flex-shrink-0 text-center">
              <Label htmlFor="avatar-upload" className="cursor-pointer">
                <Avatar className="h-40 w-40 sm:h-48 sm:w-48 border-2 border-[#A86523]">
                  <AvatarImage src={avatarUrl} alt="User Avatar" />
                  <AvatarFallback className="text-4xl bg-[#FCEFCB] text-[#A86523]">
                    {user.email?.[0]?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </Label>
              <Input
                id="avatar-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </div>
            <div className="w-full">
              <h1 className="text-2xl font-semibold mb-2">Welcome, {name}!</h1>
              <p className="italic text-[#A86523]/80 mb-6">Here is your profile information.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-base font-semibold">Name</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-[#FCEFCB] border border-[#A86523]/50 focus:border-[#A86523] text-[#A86523]" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-base font-semibold">Email</Label>
                  <Input id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-[#FCEFCB] border border-[#A86523]/50 focus:border-[#A86523] text-[#A86523]" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country" className="text-base font-semibold">Country</Label>
                  <Input id="country" value={country} onChange={(e) => setCountry(e.target.value)} className="w-full bg-[#FCEFCB] border border-[#A86523]/50 focus:border-[#A86523] text-[#A86523]" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city" className="text-base font-semibold">City</Label>
                  <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} className="w-full bg-[#FCEFCB] border border-[#A86523]/50 focus:border-[#A86523] text-[#A86523]" />
                </div>
              </div>
            </div>
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