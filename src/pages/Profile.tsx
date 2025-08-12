import React, { useState } from 'react';
import { User, Settings, Bell, Shield, Moon, Clock, Target, Save, Edit3, Camera } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface UserProfile {
  name: string;
  email: string;
  age: number;
  timezone: string;
  sleepGoal: number;
  bedtimeReminder: boolean;
  reminderTime: string;
  weeklyGoal: number;
  privacySettings: {
    shareData: boolean;
    publicProfile: boolean;
    emailNotifications: boolean;
  };
}

interface NotificationSettings {
  bedtimeReminder: boolean;
  sleepGoalReminder: boolean;
  weeklyReport: boolean;
  insightNotifications: boolean;
  emailNotifications: boolean;
}

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  
  const [profile, setProfile] = useState<UserProfile>({
    name: 'John Doe',
    email: user?.email || 'john.doe@example.com',
    age: 28,
    timezone: 'America/New_York',
    sleepGoal: 8,
    bedtimeReminder: true,
    reminderTime: '22:00',
    weeklyGoal: 56,
    privacySettings: {
      shareData: false,
      publicProfile: false,
      emailNotifications: true,
    },
  });

  const [notifications, setNotifications] = useState<NotificationSettings>({
    bedtimeReminder: true,
    sleepGoalReminder: true,
    weeklyReport: true,
    insightNotifications: true,
    emailNotifications: true,
  });

  const handleProfileSave = () => {
    // Here you would typically save to your backend
    toast.success('Profile updated successfully!');
    setIsEditing(false);
  };

  const handleNotificationChange = (key: keyof NotificationSettings) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    toast.success('Notification settings updated!');
  };

  const handlePrivacyChange = (key: keyof UserProfile['privacySettings']) => {
    setProfile(prev => ({
      ...prev,
      privacySettings: {
        ...prev.privacySettings,
        [key]: !prev.privacySettings[key]
      }
    }));
    toast.success('Privacy settings updated!');
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'sleep', label: 'Sleep Settings', icon: Moon },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Shield },
  ];

  const timezones = [
    'America/New_York',
    'America/Chicago',
    'America/Denver',
    'America/Los_Angeles',
    'Europe/London',
    'Europe/Paris',
    'Asia/Tokyo',
    'Asia/Shanghai',
    'Australia/Sydney',
  ];

  return (
    <div className="min-h-screen bg-background-light">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="heading-primary">Account Settings</h1>
          <p className="text-background-dark/70 mt-2">Manage your profile and preferences</p>
        </div>

        {/* Tab Navigation */}
        <div className="card mb-8">
          <div className="border-b border-background-dark/20">
            <nav className="flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      'flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors',
                      activeTab === tab.id
                        ? 'border-accent text-accent'
                        : 'border-transparent text-background-dark/60 hover:text-primary-dark hover:border-background-dark/30'
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-primary-dark">Personal Information</h2>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center space-x-2 text-accent hover:text-accent-600"
              >
                <Edit3 className="h-4 w-4" />
                <span>{isEditing ? 'Cancel' : 'Edit'}</span>
              </button>
            </div>

            {/* Profile Picture */}
            <div className="flex items-center space-x-6 mb-8">
              <div className="relative">
                <div className="w-24 h-24 bg-accent/20 rounded-full flex items-center justify-center">
                  <User className="h-12 w-12 text-accent" />
                </div>
                {isEditing && (
                  <button className="absolute -bottom-2 -right-2 bg-accent text-white rounded-full p-2 hover:bg-accent-600">
                    <Camera className="h-4 w-4" />
                  </button>
                )}
              </div>
              <div>
                <h3 className="text-lg font-medium text-primary-dark">{profile.name}</h3>
                <p className="text-background-dark/60">{profile.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-primary-dark mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-background-dark/30 rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-white disabled:bg-background-light disabled:text-background-dark/60"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-primary-dark mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-background-dark/30 rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-white disabled:bg-background-light disabled:text-background-dark/60"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-primary-dark mb-2">
                  Age
                </label>
                <input
                  type="number"
                  value={profile.age}
                  onChange={(e) => setProfile(prev => ({ ...prev, age: parseInt(e.target.value) || 0 }))}
                  disabled={!isEditing}
                  min="13"
                  max="120"
                  className="w-full px-3 py-2 border border-background-dark/30 rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-white disabled:bg-background-light disabled:text-background-dark/60"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-primary-dark mb-2">
                  Timezone
                </label>
                <select
                  value={profile.timezone}
                  onChange={(e) => setProfile(prev => ({ ...prev, timezone: e.target.value }))}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-background-dark/30 rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-white disabled:bg-background-light disabled:text-background-dark/60"
                >
                  {timezones.map(tz => (
                    <option key={tz} value={tz}>{tz}</option>
                  ))}
                </select>
              </div>
            </div>

            {isEditing && (
              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleProfileSave}
                  className="btn-primary flex items-center space-x-2"
                >
                  <Save className="h-4 w-4" />
                  <span>Save Changes</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Sleep Settings Tab */}
        {activeTab === 'sleep' && (
          <div className="card">
            <h2 className="text-xl font-semibold text-primary-dark mb-6">Sleep Preferences</h2>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-primary-dark mb-2">
                    Daily Sleep Goal (hours)
                  </label>
                  <select
                    value={profile.sleepGoal}
                    onChange={(e) => setProfile(prev => ({ ...prev, sleepGoal: parseFloat(e.target.value) }))}
                    className="w-full px-3 py-2 border border-background-dark/30 rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-white"
                  >
                    {[6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10].map(hours => (
                      <option key={hours} value={hours}>{hours} hours</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-primary-dark mb-2">
                    Weekly Sleep Goal (hours)
                  </label>
                  <input
                    type="number"
                    value={profile.weeklyGoal}
                    onChange={(e) => setProfile(prev => ({ ...prev, weeklyGoal: parseInt(e.target.value) || 0 }))}
                    min="30"
                    max="70"
                    className="w-full px-3 py-2 border border-background-dark/30 rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-white"
                  />
                </div>
              </div>

              <div className="bg-accent/10 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-accent" />
                    <span className="font-medium text-primary-dark">Bedtime Reminder</span>
                  </div>
                  <button
                    onClick={() => setProfile(prev => ({ ...prev, bedtimeReminder: !prev.bedtimeReminder }))}
                    className={cn(
                      'relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200',
                      profile.bedtimeReminder ? 'bg-accent' : 'bg-background-dark/30'
                    )}
                  >
                    <span
                      className={cn(
                        'inline-block h-4 w-4 transform rounded-full bg-white transition duration-200',
                        profile.bedtimeReminder ? 'translate-x-6' : 'translate-x-1'
                      )}
                    />
                  </button>
                </div>
                
                {profile.bedtimeReminder && (
                  <div>
                    <label className="block text-sm font-medium text-primary-dark mb-2">
                      Reminder Time
                    </label>
                    <input
                      type="time"
                      value={profile.reminderTime}
                      onChange={(e) => setProfile(prev => ({ ...prev, reminderTime: e.target.value }))}
                      className="w-full px-3 py-2 border border-background-dark/30 rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-white"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="card">
            <h2 className="text-xl font-semibold text-primary-dark mb-6">Notification Preferences</h2>
            
            <div className="space-y-4">
              {Object.entries(notifications).map(([key, value]) => {
                const labels = {
                  bedtimeReminder: 'Bedtime Reminders',
                  sleepGoalReminder: 'Sleep Goal Reminders',
                  weeklyReport: 'Weekly Sleep Reports',
                  insightNotifications: 'Sleep Insights & Tips',
                  emailNotifications: 'Email Notifications',
                };
                
                const descriptions = {
                  bedtimeReminder: 'Get notified when it\'s time to start your bedtime routine',
                  sleepGoalReminder: 'Reminders to help you meet your daily sleep goals',
                  weeklyReport: 'Weekly summary of your sleep patterns and progress',
                  insightNotifications: 'Personalized tips and insights about your sleep',
                  emailNotifications: 'Receive notifications via email',
                };

                return (
                  <div key={key} className="flex items-center justify-between p-4 bg-background-light rounded-lg">
                    <div>
                      <h3 className="font-medium text-primary-dark">{labels[key as keyof typeof labels]}</h3>
                      <p className="text-sm text-background-dark/60">{descriptions[key as keyof typeof descriptions]}</p>
                    </div>
                    <button
                      onClick={() => handleNotificationChange(key as keyof NotificationSettings)}
                      className={cn(
                        'relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200',
                        value ? 'bg-accent' : 'bg-background-dark/30'
                      )}
                    >
                      <span
                        className={cn(
                          'inline-block h-4 w-4 transform rounded-full bg-white transition duration-200',
                          value ? 'translate-x-6' : 'translate-x-1'
                        )}
                      />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Privacy Tab */}
        {activeTab === 'privacy' && (
          <div className="card">
            <h2 className="text-xl font-semibold text-primary-dark mb-6">Privacy Settings</h2>
            
            <div className="space-y-4">
              {Object.entries(profile.privacySettings).map(([key, value]) => {
                const labels = {
                  shareData: 'Share Anonymous Data',
                  publicProfile: 'Public Profile',
                  emailNotifications: 'Email Communications',
                };
                
                const descriptions = {
                  shareData: 'Help improve the app by sharing anonymous usage data',
                  publicProfile: 'Allow others to see your sleep achievements',
                  emailNotifications: 'Receive product updates and tips via email',
                };

                return (
                  <div key={key} className="flex items-center justify-between p-4 bg-background-light rounded-lg">
                    <div>
                      <h3 className="font-medium text-primary-dark">{labels[key as keyof typeof labels]}</h3>
                      <p className="text-sm text-background-dark/60">{descriptions[key as keyof typeof descriptions]}</p>
                    </div>
                    <button
                      onClick={() => handlePrivacyChange(key as keyof UserProfile['privacySettings'])}
                      className={cn(
                        'relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200',
                        value ? 'bg-accent' : 'bg-background-dark/30'
                      )}
                    >
                      <span
                        className={cn(
                          'inline-block h-4 w-4 transform rounded-full bg-white transition duration-200',
                          value ? 'translate-x-6' : 'translate-x-1'
                        )}
                      />
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-lg">
              <h3 className="font-medium text-red-800 mb-2">Danger Zone</h3>
              <p className="text-sm text-red-600 mb-4">These actions cannot be undone.</p>
              <div className="space-y-2">
                <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                  Export My Data
                </button>
                <br />
                <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;