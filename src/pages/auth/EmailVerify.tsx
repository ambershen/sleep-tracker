import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { supabase } from '../../../supabase/config';
import { toast } from 'sonner';

type VerificationStatus = 'loading' | 'success' | 'error';

export default function EmailVerify() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<VerificationStatus>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const token = searchParams.get('token');
        const type = searchParams.get('type');
        
        if (!token || !type) {
          setStatus('error');
          setMessage('Invalid verification link. Please check your email and try again.');
          return;
        }

        // Verify the email using Supabase
        const { data, error } = await supabase.auth.verifyOtp({
          token_hash: token,
          type: type as any
        });

        if (error) {
          console.error('Email verification error:', error);
          setStatus('error');
          setMessage(error.message || 'Email verification failed. Please try again.');
          toast.error('Email verification failed');
          return;
        }

        if (data.user) {
          setStatus('success');
          setMessage('Your email has been verified successfully!');
          toast.success('Email verified successfully!');
          
          // Redirect to sign in page after a short delay
          setTimeout(() => {
            navigate('/auth/signin', { 
              state: { message: 'Email verified! You can now sign in.' }
            });
          }, 2000);
        } else {
          setStatus('error');
          setMessage('Email verification failed. Please try again.');
        }
      } catch (error) {
        console.error('Verification error:', error);
        setStatus('error');
        setMessage('An unexpected error occurred. Please try again.');
        toast.error('Verification failed');
      }
    };

    verifyEmail();
  }, [searchParams, navigate]);

  const handleReturnToSignIn = () => {
    navigate('/auth/signin');
  };

  const handleResendVerification = () => {
    navigate('/auth/signup', { 
      state: { message: 'Please sign up again to receive a new verification email.' }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="mb-6">
            {status === 'loading' && (
              <div className="flex flex-col items-center">
                <Loader2 className="h-16 w-16 text-purple-500 animate-spin mb-4" />
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Verifying Email</h1>
                <p className="text-gray-600">Please wait while we verify your email address...</p>
              </div>
            )}
            
            {status === 'success' && (
              <div className="flex flex-col items-center">
                <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Email Verified!</h1>
                <p className="text-gray-600 mb-4">{message}</p>
                <p className="text-sm text-gray-500">Redirecting you to sign in...</p>
              </div>
            )}
            
            {status === 'error' && (
              <div className="flex flex-col items-center">
                <XCircle className="h-16 w-16 text-red-500 mb-4" />
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Verification Failed</h1>
                <p className="text-gray-600 mb-6">{message}</p>
                
                <div className="space-y-3 w-full">
                  <button
                    onClick={handleReturnToSignIn}
                    className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors font-medium"
                  >
                    Return to Sign In
                  </button>
                  
                  <button
                    onClick={handleResendVerification}
                    className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                  >
                    Resend Verification Email
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}