import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../lib/api';

export const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'user' });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      setError('');
      const res = await api.post('/auth/register', formData);
      if (res.data.success) {
        navigate('/login');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Join Swiggy</h1>
        <p className="text-sm text-gray-500">Savor the speed, taste the quality.</p>
      </div>

      {error && <div className="bg-red-50 text-red-500 p-3 rounded text-sm mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">I am a...</label>
          <select 
            name="role"
            value={formData.role} 
            onChange={handleChange}
            className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-primary focus:border-primary bg-gray-50"
          >
            <option value="user">Customer</option>
            <option value="owner">Restaurant Owner</option>
            {/* Note: In production, admin registration should be restricted */}
            <option value="admin">Admin</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Full Name</label>
          <input 
            type="text" 
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. John Doe" 
            className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-primary focus:border-primary bg-gray-50"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Email Address</label>
          <input 
            type="email" 
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="john@example.com" 
            className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-primary focus:border-primary bg-gray-50"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Password</label>
            <input 
              type="password" 
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••" 
              className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-primary focus:border-primary bg-gray-50"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Confirm Password</label>
            <input 
              type="password" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••" 
              className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-primary focus:border-primary bg-gray-50"
              required
            />
          </div>
        </div>

        <button type="submit" className="w-full bg-primary text-white rounded-lg py-2.5 font-medium hover:bg-primary-dark transition-colors mt-4">
          Create Account
        </button>
      </form>
      
      <p className="text-center text-sm text-gray-500 mt-6">
        Already have an account? <Link to="/login" className="text-primary font-medium">Log In</Link>
      </p>
    </div>
  );
};
