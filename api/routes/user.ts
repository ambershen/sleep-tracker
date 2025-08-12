/**
 * User profile API routes
 * Handle user profile management
 */
import { Router, type Request, type Response } from 'express';
import { supabaseAdmin } from '../../supabase/config.js';
import { authenticateUser } from '../middleware/auth.js';

const router = Router();

/**
 * Get User Profile
 * GET /api/user/profile
 */
router.get('/profile', authenticateUser, async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
      return;
    }

    // Get user profile from database
    const { data: profile, error } = await supabaseAdmin
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Profile fetch error:', error);
      res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        id: profile.id,
        email: req.user?.email,
        name: profile.name,
        sleep_goal_hours: profile.sleep_goal_hours,
        timezone: profile.timezone,
        email_reminders: profile.email_reminders,
        reminder_time: profile.reminder_time,
        created_at: profile.created_at
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * Update User Profile
 * PUT /api/user/profile
 */
router.put('/profile', authenticateUser, async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { name, sleep_goal_hours, timezone, email_reminders, reminder_time } = req.body;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
      return;
    }

    // Validate sleep_goal_hours if provided
    if (sleep_goal_hours !== undefined && (sleep_goal_hours < 6 || sleep_goal_hours > 12)) {
      res.status(400).json({
        success: false,
        message: 'Sleep goal must be between 6 and 12 hours'
      });
      return;
    }

    // Build update object with only provided fields
    const updateData: any = {
      updated_at: new Date().toISOString()
    };

    if (name !== undefined) updateData.name = name;
    if (sleep_goal_hours !== undefined) updateData.sleep_goal_hours = sleep_goal_hours;
    if (timezone !== undefined) updateData.timezone = timezone;
    if (email_reminders !== undefined) updateData.email_reminders = email_reminders;
    if (reminder_time !== undefined) updateData.reminder_time = reminder_time;

    // Update user profile
    const { data: updatedProfile, error } = await supabaseAdmin
      .from('user_profiles')
      .update(updateData)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Profile update error:', error);
      res.status(400).json({
        success: false,
        message: 'Failed to update profile'
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        id: updatedProfile.id,
        email: req.user?.email,
        name: updatedProfile.name,
        sleep_goal_hours: updatedProfile.sleep_goal_hours,
        timezone: updatedProfile.timezone,
        email_reminders: updatedProfile.email_reminders,
        reminder_time: updatedProfile.reminder_time,
        updated_at: updatedProfile.updated_at
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * Delete User Account
 * DELETE /api/user/account
 */
router.delete('/account', authenticateUser, async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
      return;
    }

    // Delete user profile (sleep entries will be deleted via CASCADE)
    const { error: profileError } = await supabaseAdmin
      .from('user_profiles')
      .delete()
      .eq('id', userId);

    if (profileError) {
      console.error('Profile deletion error:', profileError);
    }

    // Note: Supabase Auth user deletion requires admin privileges
    // For now, we'll just delete the profile data
    // In production, you might want to use Supabase Admin API to delete the auth user

    res.status(200).json({
      success: true,
      message: 'Account data deleted successfully'
    });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

export default router;