import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '../services/AuthService.js';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState('processing');

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log('=== AUTH CALLBACK DEBUG ===');
        console.log('Current URL:', window.location.href);
        console.log('Search params:', window.location.search);
        console.log('Hash params:', window.location.hash);
        
        // Check both URL search params and hash params (Supabase often uses hash)
        const urlParams = new URLSearchParams(window.location.search);
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        
        console.log('URL params:', Object.fromEntries(urlParams));
        console.log('Hash params:', Object.fromEntries(hashParams));
        
        // Try to get access token from either location
        let accessToken = urlParams.get('access_token') || hashParams.get('access_token');
        let refreshToken = urlParams.get('refresh_token') || hashParams.get('refresh_token');
        
        console.log('Access token found:', !!accessToken);
        console.log('Refresh token found:', !!refreshToken);
        
        if (accessToken) {
          console.log('Storing access token...');
          // Store the access token
          AuthService.setToken(accessToken);
          
          // Verify the user is authenticated by fetching user data
          try {
            console.log('Verifying user authentication...');
            const userData = await AuthService.getCurrentUser();
            console.log('User data received:', userData);
            setStatus('success');
            // Force a page reload to refresh the Layout component's auth state
            setTimeout(() => {
              console.log('Redirecting to home...');
              window.location.href = '/';
            }, 1000);
          } catch (error) {
            console.error('Error verifying user after OAuth:', error);
            setStatus('error');
          }
        } else {
          // Check for error parameters in both locations
          const error = urlParams.get('error') || hashParams.get('error');
          const errorDescription = urlParams.get('error_description') || hashParams.get('error_description');
          
          if (error) {
            console.error('OAuth error:', error, errorDescription);
            setStatus('error');
          } else {
            console.log('No token or error found, redirecting to home...');
            // No token and no error - redirect to home
            window.location.href = '/';
          }
        }
      } catch (error) {
        console.error('Error in auth callback:', error);
        setStatus('error');
      }
    };

    handleAuthCallback();
  }, [navigate]);

  const getStatusMessage = () => {
    switch (status) {
      case 'processing':
        return 'Completing sign in...';
      case 'success':
        return 'Sign in successful! Redirecting...';
      case 'error':
        return 'There was an error signing in. Please try again.';
      default:
        return 'Processing...';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'processing':
        return 'text-blue-600';
      case 'success':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 flex items-center justify-center">
            {status === 'processing' && (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            )}
            {status === 'success' && (
              <div className="rounded-full h-8 w-8 bg-green-100 flex items-center justify-center">
                <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
            )}
            {status === 'error' && (
              <div className="rounded-full h-8 w-8 bg-red-100 flex items-center justify-center">
                <svg className="h-5 w-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </div>
            )}
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {status === 'error' ? 'Authentication Error' : 'Authenticating'}
          </h2>
          <p className={`mt-2 text-center text-sm ${getStatusColor()}`}>
            {getStatusMessage()}
          </p>
          {status === 'error' && (
            <button
              onClick={() => window.location.href = '/'}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Return to Home
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthCallback;
