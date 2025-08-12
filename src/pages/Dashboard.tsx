import { useSleepStore } from '@/store/sleepStore';
import { Clock, TrendingUp, Calendar, Star, Moon, Sun, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDemo } from '@/contexts/DemoContext';

const Dashboard = () => {
  const { entries, getAverageQuality, getAverageDuration, getSleepStreak } = useSleepStore();
  const { isDemoMode, demoData } = useDemo();
  
  // Use demo data when in demo mode
  const currentEntries = isDemoMode ? demoData.sleepEntries : entries;
  const recentEntries = currentEntries.slice(0, 7);
  
  // Calculate stats from current data
  const averageQuality = isDemoMode 
    ? currentEntries.slice(0, 7).reduce((sum, entry) => sum + entry.quality, 0) / Math.min(7, currentEntries.length)
    : getAverageQuality();
    
  const averageDuration = isDemoMode
    ? currentEntries.slice(0, 7).reduce((sum, entry) => sum + entry.duration, 0) / Math.min(7, currentEntries.length)
    : getAverageDuration();
    
  const sleepStreak = isDemoMode ? demoData.user.streak : getSleepStreak();
  
  // Calculate sleep score (0-100)
  const sleepScore = Math.round(
    (averageQuality / 10) * 0.6 * 100 + 
    (Math.min(averageDuration / 8, 1)) * 0.4 * 100
  );

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getQualityColor = (quality: number) => {
    if (quality >= 8) return 'text-green-600';
    if (quality >= 6) return 'text-accent';
    if (quality >= 4) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-accent';
    if (score >= 40) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="min-h-screen bg-background-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="heading-primary">Sleep Dashboard</h1>
              <p className="text-background-dark/70 mt-2">Track your sleep patterns and improve your rest</p>
            </div>
            {isDemoMode && (
              <div className="flex items-center space-x-2 bg-accent/10 text-accent px-4 py-2 rounded-lg">
                <Eye className="h-5 w-5" />
                <span className="font-medium">Demo Mode - Read Only</span>
              </div>
            )}
          </div>
        </div>

        {/* Sleep Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Sleep Score */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-primary-dark">Sleep Score</h3>
              <Moon className="h-6 w-6 text-accent" />
            </div>
            <div className="text-center">
              <div className={cn('text-4xl font-bold mb-2', getScoreColor(sleepScore))}>
                {sleepScore}
              </div>
              <div className="w-full bg-gray-200/50 rounded-full h-2">
                <div 
                  className={cn(
                    'h-2 rounded-full transition-all duration-300',
                    sleepScore >= 80 ? 'bg-green-500' : sleepScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                  )}
                  style={{ width: `${sleepScore}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Average Duration */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-primary-dark">Average Duration</h3>
              <Clock className="h-6 w-6 text-accent" />
            </div>
            <div className="text-3xl font-bold text-primary-dark mb-2">
              {averageDuration.toFixed(1)}h
            </div>
            <p className="text-sm text-background-dark/60">Last 7 days</p>
          </div>

          {/* Average Quality */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-primary-dark">Avg Quality</h3>
              <Star className="h-6 w-6 text-accent" />
            </div>
            <div className={cn('text-3xl font-bold mb-2', getQualityColor(averageQuality))}>
              {averageQuality.toFixed(1)}/10
            </div>
            <p className="text-sm text-background-dark/60">Last 7 days</p>
          </div>

          {/* Sleep Streak */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-primary-dark">Sleep Streak</h3>
              <TrendingUp className="h-6 w-6 text-accent" />
            </div>
            <div className="text-3xl font-bold text-primary-dark mb-2">
              {sleepStreak}
            </div>
            <p className="text-sm text-background-dark/60">Days logged</p>
          </div>
        </div>

        {/* Recent Entries */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-primary-dark">Recent Sleep Entries</h2>
            <Calendar className="h-6 w-6 text-accent" />
          </div>
          
          {recentEntries.length === 0 ? (
            <div className="text-center py-12">
              <Moon className="h-12 w-12 text-background-dark/40 mx-auto mb-4" />
              <p className="text-background-dark/70 text-lg mb-2">No sleep entries yet</p>
              <p className="text-background-dark/50">
                {isDemoMode ? 'Try the demo to see sample data' : 'Start tracking your sleep to see insights here'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentEntries.map((entry) => (
                <div key={entry.id} className="flex items-center justify-between p-4 bg-background-light/50 rounded-lg border border-primary/10">
                  <div className="flex items-center space-x-4">
                    <div className="text-sm font-medium text-primary-dark">
                      {new Date(entry.date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-background-dark/60">
                      <Moon className="h-4 w-4" />
                      <span>{formatTime(entry.bedtime)}</span>
                      <span>→</span>
                      <Sun className="h-4 w-4" />
                      <span>{formatTime(entry.wakeTime)}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-sm font-medium text-primary-dark">
                      {entry.duration.toFixed(1)}h
                    </div>
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            'h-4 w-4',
                            i < entry.quality / 2
                              ? 'text-accent fill-current'
                              : 'text-background-dark/30'
                          )}
                        />
                      ))}
                      <span className={cn('text-sm font-medium ml-2', getQualityColor(entry.quality))}>
                        {entry.quality}/10
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;