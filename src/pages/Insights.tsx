import { useState, useMemo } from 'react';
import { useSleepStore } from '@/store/sleepStore';
import { Lightbulb, Bell, Clock, TrendingUp, Target, CheckCircle, AlertCircle, Settings } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const Insights = () => {
  const { entries, goals, updateGoals, getAverageQuality, getAverageDuration } = useSleepStore();
  const [showReminderSettings, setShowReminderSettings] = useState(false);
  
  const recentEntries = entries.slice(0, 14); // Last 2 weeks
  const averageQuality = getAverageQuality(14);
  const averageDuration = getAverageDuration(14);

  const insights = useMemo(() => {
    const insights = [];
    
    if (recentEntries.length === 0) {
      return [{
        type: 'info',
        title: 'Start Your Sleep Journey',
        description: 'Begin logging your sleep to receive personalized insights and recommendations.',
        action: 'Log your first sleep entry to get started'
      }];
    }

    // Duration insights
    if (averageDuration < 7) {
      insights.push({
        type: 'warning',
        title: 'Insufficient Sleep Duration',
        description: `Your average sleep duration is ${averageDuration.toFixed(1)} hours. Most adults need 7-9 hours of sleep.`,
        action: 'Try going to bed 30 minutes earlier each night'
      });
    } else if (averageDuration > 9) {
      insights.push({
        type: 'info',
        title: 'Long Sleep Duration',
        description: `You're averaging ${averageDuration.toFixed(1)} hours of sleep. While this might work for you, ensure it's quality sleep.`,
        action: 'Monitor your sleep quality and energy levels during the day'
      });
    } else {
      insights.push({
        type: 'success',
        title: 'Good Sleep Duration',
        description: `Your average sleep duration of ${averageDuration.toFixed(1)} hours is within the recommended range.`,
        action: 'Keep maintaining this healthy sleep duration'
      });
    }

    // Quality insights
    if (averageQuality < 6) {
      insights.push({
        type: 'warning',
        title: 'Low Sleep Quality',
        description: `Your average sleep quality is ${averageQuality.toFixed(1)}/10. This suggests room for improvement.`,
        action: 'Consider factors like room temperature, noise, and screen time before bed'
      });
    } else if (averageQuality >= 8) {
      insights.push({
        type: 'success',
        title: 'Excellent Sleep Quality',
        description: `Your sleep quality average of ${averageQuality.toFixed(1)}/10 is excellent!`,
        action: 'Continue your current sleep habits and routines'
      });
    }

    // Consistency insights
    const bedtimes = recentEntries.map(entry => {
      const [hours, minutes] = entry.bedtime.split(':').map(Number);
      return hours * 60 + minutes;
    });
    
    if (bedtimes.length > 1) {
      const avgBedtime = bedtimes.reduce((sum, time) => sum + time, 0) / bedtimes.length;
      const variance = bedtimes.reduce((sum, time) => sum + Math.pow(time - avgBedtime, 2), 0) / bedtimes.length;
      const stdDev = Math.sqrt(variance);
      
      if (stdDev > 60) { // More than 1 hour variance
        insights.push({
          type: 'warning',
          title: 'Inconsistent Sleep Schedule',
          description: 'Your bedtime varies significantly. Consistency is key for better sleep quality.',
          action: 'Try to go to bed and wake up at the same time every day'
        });
      } else {
        insights.push({
          type: 'success',
          title: 'Consistent Sleep Schedule',
          description: 'You maintain a consistent bedtime, which is great for your circadian rhythm.',
          action: 'Keep up the consistent sleep schedule'
        });
      }
    }

    // Weekend vs weekday analysis
    const weekdayEntries = recentEntries.filter(entry => {
      const day = new Date(entry.date).getDay();
      return day >= 1 && day <= 5;
    });
    
    const weekendEntries = recentEntries.filter(entry => {
      const day = new Date(entry.date).getDay();
      return day === 0 || day === 6;
    });

    if (weekdayEntries.length > 0 && weekendEntries.length > 0) {
      const weekdayAvgDuration = weekdayEntries.reduce((sum, entry) => sum + entry.duration, 0) / weekdayEntries.length;
      const weekendAvgDuration = weekendEntries.reduce((sum, entry) => sum + entry.duration, 0) / weekendEntries.length;
      
      if (Math.abs(weekendAvgDuration - weekdayAvgDuration) > 1.5) {
        insights.push({
          type: 'info',
          title: 'Weekend Sleep Pattern Difference',
          description: `Your weekend sleep differs significantly from weekdays (${Math.abs(weekendAvgDuration - weekdayAvgDuration).toFixed(1)}h difference).`,
          action: 'Try to maintain similar sleep patterns on weekends'
        });
      }
    }

    return insights;
  }, [recentEntries, averageQuality, averageDuration]);

  const habitTips = [
    {
      title: 'Create a Bedtime Routine',
      description: 'Establish a relaxing pre-sleep routine 30-60 minutes before bed.',
      tips: ['Dim the lights', 'Read a book', 'Take a warm bath', 'Practice meditation']
    },
    {
      title: 'Optimize Your Sleep Environment',
      description: 'Make your bedroom conducive to quality sleep.',
      tips: ['Keep room cool (60-67°F)', 'Use blackout curtains', 'Minimize noise', 'Comfortable mattress']
    },
    {
      title: 'Watch Your Diet and Timing',
      description: 'What and when you eat affects your sleep quality.',
      tips: ['Avoid caffeine 6+ hours before bed', 'No large meals 3 hours before sleep', 'Limit alcohol', 'Stay hydrated during the day']
    },
    {
      title: 'Manage Light Exposure',
      description: 'Light exposure affects your circadian rhythm.',
      tips: ['Get morning sunlight', 'Limit blue light 2 hours before bed', 'Use warm lighting in evening', 'Consider blue light glasses']
    }
  ];

  const calculateOptimalBedtime = () => {
    const targetWakeTime = '07:00'; // Default wake time
    const [wakeHour, wakeMin] = targetWakeTime.split(':').map(Number);
    const wakeTimeMinutes = wakeHour * 60 + wakeMin;
    const bedtimeMinutes = wakeTimeMinutes - (goals.targetSleepDuration * 60);
    
    let bedHour = Math.floor(bedtimeMinutes / 60);
    let bedMin = bedtimeMinutes % 60;
    
    if (bedHour < 0) {
      bedHour += 24;
    }
    
    return `${bedHour.toString().padStart(2, '0')}:${bedMin.toString().padStart(2, '0')}`;
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning': return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      default: return <Lightbulb className="h-5 w-5 text-purple-500" />;
    }
  };

  const getInsightBorderColor = (type: string) => {
    switch (type) {
      case 'success': return 'border-l-green-500';
      case 'warning': return 'border-l-yellow-500';
      default: return 'border-l-purple-500';
    }
  };

  const handleReminderToggle = () => {
    updateGoals({ reminderEnabled: !goals.reminderEnabled });
    toast.success(goals.reminderEnabled ? 'Bedtime reminders disabled' : 'Bedtime reminders enabled');
  };

  const handleReminderTimeChange = (minutes: number) => {
    updateGoals({ reminderMinutesBefore: minutes });
    toast.success(`Reminder set to ${minutes} minutes before bedtime`);
  };

  const handleTargetDurationChange = (hours: number) => {
    updateGoals({ targetSleepDuration: hours });
    toast.success(`Target sleep duration set to ${hours} hours`);
  };

  return (
    <div className="min-h-screen bg-purple-100/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Sleep Insights &amp; Recommendations</h1>
          <p className="text-gray-600 mt-2">Personalized tips and insights to improve your sleep</p>
        </div>

        {/* Bedtime Reminder Settings */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Bell className="h-6 w-6 text-purple-500" />
              <h2 className="text-xl font-semibold text-gray-900">Bedtime Reminders</h2>
            </div>
            <button
              onClick={() => setShowReminderSettings(!showReminderSettings)}
              className="text-purple-600 hover:text-purple-700"
            >
              <Settings className="h-5 w-5" />
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-700">Enable bedtime reminders</p>
                <p className="text-sm text-gray-500">Get notified when it's time to start your bedtime routine</p>
              </div>
              <button
                onClick={handleReminderToggle}
                className={cn(
                  'relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200',
                  goals.reminderEnabled ? 'bg-purple-600' : 'bg-gray-300'
                )}
              >
                <span
                  className={cn(
                    'inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200',
                    goals.reminderEnabled ? 'translate-x-6' : 'translate-x-1'
                  )}
                />
              </button>
            </div>
            
            {showReminderSettings && (
              <div className="space-y-4 pt-4 border-t border-gray-200">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Sleep Duration
                  </label>
                  <select
                    value={goals.targetSleepDuration}
                    onChange={(e) => handleTargetDurationChange(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {[6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10].map(hours => (
                      <option key={hours} value={hours}>{hours} hours</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reminder Time (minutes before optimal bedtime)
                  </label>
                  <select
                    value={goals.reminderMinutesBefore}
                    onChange={(e) => handleReminderTimeChange(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {[15, 30, 45, 60, 90].map(minutes => (
                      <option key={minutes} value={minutes}>{minutes} minutes</option>
                    ))}
                  </select>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Clock className="h-5 w-5 text-purple-600" />
                    <span className="font-medium text-purple-900">Optimal Bedtime</span>
                  </div>
                  <p className="text-purple-800">
                    Based on your {goals.targetSleepDuration}h sleep goal: <strong>{calculateOptimalBedtime()}</strong>
                  </p>
                  <p className="text-sm text-purple-700 mt-1">
                    Reminder will be sent at {goals.reminderMinutesBefore} minutes before
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Personalized Insights */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center space-x-2 mb-6">
            <TrendingUp className="h-6 w-6 text-purple-500" />
            <h2 className="text-xl font-semibold text-gray-900">Your Sleep Insights</h2>
          </div>
          
          <div className="space-y-4">
            {insights.map((insight, index) => (
              <div
                key={index}
                className={cn(
                  'border-l-4 bg-gray-50 p-4 rounded-r-lg',
                  getInsightBorderColor(insight.type)
                )}
              >
                <div className="flex items-start space-x-3">
                  {getInsightIcon(insight.type)}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{insight.title}</h3>
                    <p className="text-gray-700 mb-2">{insight.description}</p>
                    <p className="text-sm font-medium text-purple-600">💡 {insight.action}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sleep Habit Formation Guide */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center space-x-2 mb-6">
            <Target className="h-6 w-6 text-purple-500" />
            <h2 className="text-xl font-semibold text-gray-900">Sleep Habit Formation Guide</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {habitTips.map((tip, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">{tip.title}</h3>
                <p className="text-gray-600 text-sm mb-3">{tip.description}</p>
                <ul className="space-y-1">
                  {tip.tips.map((item, tipIndex) => (
                    <li key={tipIndex} className="text-sm text-gray-700 flex items-center space-x-2">
                      <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Insights;