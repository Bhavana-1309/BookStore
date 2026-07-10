import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateUserProfile } = useContext(AuthContext);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
const [preview, setPreview] = useState("");

useEffect(() => {
  if (user) {
    setName(user.name);
    setEmail(user.email);
    setPhone(user.phone || "");
    setPreview(user.profilePic || "https://cdn-icons-png.flaticon.com/512/149/149071.png");
  }
}, [user]);
const handleImageChange = (e) => {
  const file = e.target.files[0];

  if (!file) return;

  setProfilePic(file);
  setPreview(URL.createObjectURL(file));
};

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email) {
      return toast.error('Name and Email are required');
    }

    if (password) {
      if (password.length < 6) {
        return toast.error('New password must be at least 6 characters');
      }
      if (password !== confirmPassword) {
        return toast.error('Passwords do not match');
      }
    }

    setLoading(true);
    try {
    const formData = new FormData();

formData.append("name", name);
formData.append("email", email);
formData.append("phone", phone);

if (password) {
  formData.append("password", password);
}

if (profilePic) {
  formData.append("profilePic", profilePic);
}

await updateUserProfile(formData);
      setPassword('');
      setConfirmPassword('');
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
<div className="container py-5" style={{ minHeight: '80vh' }}>

  <div className="text-center mb-4 border-bottom pb-4">

    <label htmlFor="profileImage" style={{ cursor: "pointer" }}>
      <img
        src={preview}
        alt="Profile"
        className="rounded-circle shadow"
        style={{
          width: "130px",
          height: "130px",
          objectFit: "cover",
          border: "4px solid #f97316"
        }}
      />
    </label>

    <input
      type="file"
      id="profileImage"
      hidden
      accept="image/*"
      onChange={handleImageChange}
    />

    <p className="text-muted small mt-2">
      Click image to change
    </p>

    <h3 className="fw-bold mt-2">
      My Profile
    </h3>

    <p className="text-muted">
      Update your personal account credentials
    </p>

  </div>

  <form onSubmit={handleSubmit}>
              {/* Name */}
              <div className="mb-3">
                <label className="form-label fw-semibold small">Full Name</label>
                <input
                  type="text"
                  className="form-control bg-light"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              {/* Email */}
              <div className="mb-3">
                <label className="form-label fw-semibold small">Email Address</label>
                <input
                  type="email"
                  className="form-control bg-light"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* Phone */}
              <div className="mb-3">
                <label className="form-label fw-semibold small">Mobile Number</label>
                <input
                  type="tel"
                  className="form-control bg-light"
                  placeholder="e.g. 9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              {/* Change Password alert banner */}
              <div className="alert alert-info border-0 small py-2 my-4">
                Leave password fields blank if you do not wish to change your current password.
              </div>

              {/* New Password */}
              <div className="row g-3">
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold small">New Password</label>
                  <input
                    type="password"
                    className="form-control bg-light"
                    placeholder="New password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold small">Confirm New Password</label>
                  <input
                    type="password"
                    className="form-control bg-light"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>

              {/* Save Button */}
              <button
                type="submit"
                className="btn btn-orange text-white w-100 py-2.5 fw-bold mt-3"
                disabled={loading}
              >
                {loading ? (
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                ) : null}
                Save Changes
              </button>
            </form>
          </div>
    //     </div>
    //   </div>
    // </div>
  );
};

export default Profile;
