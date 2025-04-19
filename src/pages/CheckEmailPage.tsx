// src/pages/CheckEmailPage.tsx

import { Link } from 'react-router-dom';

const CheckEmailPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center bg-gray-50">
      <h1 className="text-3xl font-bold mb-4">Almost there!</h1>
      <p className="mb-6 text-lg">
        We've sent a verification link to your email. <br />
        Please check your inbox (or spam) and click the link to verify your account.
      </p>
      <Link
        to="/login"
        className="text-blue-600 hover:underline text-md"
      >
        Back to Login
      </Link>
    </div>
  );
};

export default CheckEmailPage;
