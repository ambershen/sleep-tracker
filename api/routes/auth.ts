/**
 * User authentication API routes
 * Handle user registration, login, password reset, etc.
 */
import { Router, type Request, type Response } from 'express';
import { supabase, supabaseAdmin } from '../../supabase/config.js';

const router = Router();

/**
 * User Registration
 * POST /api/auth/signup
 */
router.post('/signup', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, name, timezone = 'UTC' } = req.body;

    // Validate required fields
    if (!email || !password || !name) {
      res.status(400).json({
        success: false,
        message: 'Email, password, and name are required'
      });
      return;
    }

    // Validate password length
    if (password.length < 8) {
      res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long'
      });
      return;
    }

    // Create user with Supabase Auth (no email confirmation required)
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          timezone
        },
        emailRedirectTo: undefined // Disable email confirmation
      }
    });

    if (authError) {
      res.status(400).json({
        success: false,
        message: authError.message
      });
      return;
    }

    // Create user profile
    if (authData.user) {
      const { error: profileError } = await supabaseAdmin
        .from('user_profiles')
        .insert({
          id: authData.user.id,
          name,
          timezone,
          sleep_goal_hours: 8.0
        });

      if (profileError) {
        console.error('Profile creation error:', profileError);
        // Don't fail the registration if profile creation fails
      }
    }

    // TODO: Implement welcome email functionality with proper email service
    // For now, the signup flow works without email verification

    // Get user profile for complete user data
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('user_profiles')
      .select('*')
      .eq('id', authData.user!.id)
      .single();

    if (profileError) {
      console.error('Profile fetch error:', profileError);
    }

    res.status(201).json({
      success: true,
      message: 'Account created successfully! Welcome to Sleep Tracker.',
      token: authData.session?.access_token,
      user: {
        id: authData.user?.id,
        email: authData.user?.email,
        name: profile?.name || name,
        sleep_goal_hours: profile?.sleep_goal_hours || 8.0,
        timezone: profile?.timezone || timezone
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * User Login
 * POST /api/auth/signin
 */
router.post('/signin', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
      return;
    }

    // Sign in with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (authError) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
      return;
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('user_profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (profileError) {
      console.error('Profile fetch error:', profileError);
    }

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token: authData.session?.access_token,
      user: {
        id: authData.user.id,
        email: authData.user.email,
        name: profile?.name || authData.user.user_metadata?.name,
        sleep_goal_hours: profile?.sleep_goal_hours || 8.0,
        timezone: profile?.timezone || 'UTC'
      }
    });
  } catch (error) {
    console.error('Signin error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * Password Reset Request
 * POST /api/auth/forgot-password
 */
router.post('/forgot-password', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({
        success: false,
        message: 'Email is required'
      });
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password`
    });

    if (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Password reset email sent successfully'
    });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * Password Reset
 * POST /api/auth/reset-password
 */
router.post('/reset-password', async (req: Request, res: Response): Promise<void> => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      res.status(400).json({
        success: false,
        message: 'Token and new password are required'
      });
      return;
    }

    if (password.length < 8) {
      res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long'
      });
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password
    });

    if (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (error) {
    console.error('Password update error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * User Logout
 * POST /api/auth/logout
 */
router.post('/logout', async (req: Request, res: Response): Promise<void> => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

export default router;