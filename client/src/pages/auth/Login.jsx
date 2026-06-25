import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import api from '../../lib/api';

export const Login = () => {
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const setAuth = useAuthStore(state => state.setAuth);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      // In a real app we'd also send role to backend if we need to log in specifically as that role,
      // but usually email/password is enough. For this demo, let's assume backend checks it.
      const res = await api.post('/auth/login', { ...formData, role });
      if (res.data.success) {
        setAuth(res.data.user, res.data.accessToken);
        if (res.data.user.role === 'admin') navigate('/admin');
        else if (res.data.user.role === 'owner') navigate('/owner');
        else navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-primary mb-1">Welcome to Swiggy</h1>
        <p className="text-sm text-gray-500">Savor the speed, taste the quality.</p>
      </div>

      <div className="flex border-b border-gray-200 mb-6">
        <button className="flex-1 pb-2 border-b-2 border-primary text-primary font-medium text-sm">Login</button>
        <Link to="/signup" className="flex-1 pb-2 text-gray-400 font-medium text-sm text-center hover:text-gray-600">Sign Up</Link>
      </div>

      {error && <div className="bg-red-50 text-red-500 p-3 rounded text-sm mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">I am a...</label>
          <select 
            value={role} 
            onChange={(e) => setRole(e.target.value)}
            className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-primary focus:border-primary bg-gray-50"
          >
            <option value="user">Customer</option>
            <option value="owner">Restaurant Owner</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Email Address</label>
          <input 
            type="email" 
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="name@example.com" 
            className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-primary focus:border-primary bg-gray-50"
            required
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-xs font-medium text-gray-700">Password</label>
            <a href="#" className="text-xs text-primary hover:underline">Forgot?</a>
          </div>
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

        <button type="submit" className="w-full bg-primary text-white rounded-lg py-2.5 font-medium hover:bg-primary-dark transition-colors mt-2 flex justify-center items-center">
          Log In <span className="ml-2">→</span>
        </button>
      </form>

      <div className="mt-6 flex items-center">
        <div className="flex-1 border-t border-gray-200"></div>
        <span className="px-3 text-xs text-gray-400">Or continue with</span>
        <div className="flex-1 border-t border-gray-200"></div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <button className="border border-gray-200 rounded-lg py-2 flex justify-center items-center text-sm font-medium hover:bg-gray-50">
           Google
        </button>
        <button className="border border-gray-200 rounded-lg py-2 flex justify-center items-center text-sm font-medium hover:bg-gray-50">
           Facebook
        </button>
      </div>
      
      <p className="text-center text-xs text-gray-400 mt-8">
        🔒 Secure authentication with Refresh Tokens.
      </p>
    </div>
  );
};
