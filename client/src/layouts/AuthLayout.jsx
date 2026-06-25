import { Outlet } from 'react-router-dom';

export const AuthLayout = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
        {/* Subtle decorative background blur as seen in design */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 rounded-full bg-orange-100 blur-3xl opacity-50"></div>
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-32 h-32 rounded-full bg-orange-100 blur-3xl opacity-50"></div>
        
        <div className="relative z-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
