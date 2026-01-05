// import React, { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { useForm } from 'react-hook-form';
// import { authAPI } from '../api/auth.api';
// import useAuthStore from '../store/authStore';
// import toast from 'react-hot-toast';

// const RegisterPage = () => {
//   const navigate = useNavigate();
//   const login = useAuthStore((state) => state.login);
//   const [loading, setLoading] = useState(false);
  
//   const { register, handleSubmit, watch, formState: { errors } } = useForm();
//   const password = watch('password');

//   const onSubmit = async (data) => {
//     try {
//       setLoading(true);
//       const response = await authAPI.register(data);
      
// login(response.data.user, response.data.token);
//       toast.success('Registration successful! Please verify your email.');
//       navigate('/');
//     } catch (error) {
//       toast.error(error.message || 'Registration failed');
//     } finally {
//       setLoading(false);
//     }
//   };
//   const handleGoogleLogin = () => {
//   window.location.href = "http://localhost:5000/api/auth/google";
// };


//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12">
//       <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
//         <h2 className="text-3xl font-bold text-center mb-6">Register</h2>
        
//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium mb-2">Full Name</label>
//             <input
//               type="text"
//               {...register('name', { 
//                 required: 'Name is required',
//                 minLength: { value: 2, message: 'Name must be at least 2 characters' }
//               })}
//               className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//               placeholder="John Doe"
//             />
//             {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
//           </div>

//           <div>
//             <label className="block text-sm font-medium mb-2">Email</label>
//             <input
//               type="email"
//               {...register('email', { 
//                 required: 'Email is required',
//                 pattern: {
//                   value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
//                   message: 'Invalid email address'
//                 }
//               })}
//               className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//               placeholder="your@email.com"
//             />
//             {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
//           </div>

//           <div>
//             <label className="block text-sm font-medium mb-2">Phone (Optional)</label>
//             <input
//               type="tel"
//               {...register('phone', {
//                 pattern: {
//                   value: /^[0-9]{10}$/,
//                   message: 'Phone must be 10 digits'
//                 }
//               })}
//               className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//               placeholder="9876543210"
//             />
//             {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
//           </div>

//           <div>
//             <label className="block text-sm font-medium mb-2">Date of Birth</label>
//             <input
//               type="date"
//               {...register('dateOfBirth', { required: 'Date of birth is required' })}
//               className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//             />
//             {errors.dateOfBirth && <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth.message}</p>}
//           </div>

//           <div>
//             <label className="block text-sm font-medium mb-2">Pin Code</label>
//             <input
//               type="text"
//               {...register('pinCode', {
//                 required: 'Pin code is required',
//                 pattern: {
//                   value: /^[0-9]{6}$/,
//                   message: 'Pin code must be 6 digits'
//                 }
//               })}
//               className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//               placeholder="452001"
//             />
//             {errors.pinCode && <p className="text-red-500 text-sm mt-1">{errors.pinCode.message}</p>}
//           </div>

//           <div>
//             <label className="block text-sm font-medium mb-2">Password</label>
//             <input
//               type="password"
//               {...register('password', {
//                 required: 'Password is required',
//                 minLength: { value: 6, message: 'Password must be at least 6 characters' }
//               })}
//               className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//               placeholder="••••••••"
//             />
//             {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
//           </div>

//           <div>
//             <label className="block text-sm font-medium mb-2">Confirm Password</label>
//             <input
//               type="password"
//               {...register('confirmPassword', {
//                 required: 'Please confirm your password',
//                 validate: value => value === password || 'Passwords do not match'
//               })}
//               className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//               placeholder="••••••••"
//             />
//             {errors.confirmPassword && (
//               <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
//             )}
//           </div>

//            <button
//   type="button"
//   onClick={handleGoogleLogin}
//   className="w-full border py-2 rounded-lg mt-4 flex items-center justify-center gap-2 hover:bg-gray-100"
// >
//   <img src="https://developers.google.com/identity/images/g-logo.png" width="20" />
//   Continue with Google
// </button>

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
//           >
//             {loading ? 'Registering...' : 'Register'}
//           </button>
//         </form>

//         <div className="mt-6 text-center">
//           <p className="text-sm text-gray-600">
//             Already have an account?{' '}
//             <Link to="/login" className="text-blue-600 hover:underline">
//               Login
//             </Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RegisterPage;


import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { authAPI } from '../api/auth.api';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';

const RegisterPage = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [loading, setLoading] = useState(false);
  
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const password = watch('password');

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const response = await authAPI.register(data);
      
      login(response.data.user, response.data.token);
      toast.success('Registration successful! Please verify your email.');
      
      // ✅ Redirect to login page after registration
      navigate('/login');
    } catch (error) {
      toast.error(error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // ✅ This will redirect to backend, which should then redirect to /google-auth-success
    window.location.href = "http://localhost:5000/api/auth/google";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center mb-6">Register</h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Full Name</label>
            <input
              type="text"
              {...register('name', { 
                required: 'Name is required',
                minLength: { value: 2, message: 'Name must be at least 2 characters' }
              })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="John Doe"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              {...register('email', { 
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="your@email.com"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Phone (Optional)</label>
            <input
              type="tel"
              {...register('phone', {
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: 'Phone must be 10 digits'
                }
              })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="9876543210"
            />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Date of Birth</label>
            <input
              type="date"
              {...register('dateOfBirth', { required: 'Date of birth is required' })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            {errors.dateOfBirth && <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Pin Code</label>
            <input
              type="text"
              {...register('pinCode', {
                required: 'Pin code is required',
                pattern: {
                  value: /^[0-9]{6}$/,
                  message: 'Pin code must be 6 digits'
                }
              })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="452001"
            />
            {errors.pinCode && <p className="text-red-500 text-sm mt-1">{errors.pinCode.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 6, message: 'Password must be at least 6 characters' }
              })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Confirm Password</label>
            <input
              type="password"
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: value => value === password || 'Passwords do not match'
              })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Registering...' : 'Register'}
          </button>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full border py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-100"
          >
            <img src="https://developers.google.com/identity/images/g-logo.png" width="20" alt="Google" />
            Continue with Google
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;