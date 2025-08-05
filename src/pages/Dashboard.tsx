import { useSleepStore } from '@/store/sleepStore';
import { Clock, TrendingUp, Calendar, Star, Moon, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';

const Dashboard = () => {
  const { entries, getAverageQuality, getAverageDuration, getSleepStreak } = useSleepStore();
  
  const recentEntries = entries.slice(0, 7);
  const averageQuality = getAverageQuality();
  const averageDuration = getAverageDuration();
  const sleepStreak = getSleepStreak();
  
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
    return 'text-yellow-300';
  };

  const getScoreColor = (score: number) => {
    return 'text-yellow-300';
  };

  return (
    <div className="min-h-screen bg-purple-100/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Sleep Dashboard</h1>
          <p className="text-gray-600 mt-2">Track your sleep patterns and improve your rest</p>
        </div>

        {/* Sleep Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Sleep Score */}
          <div className="relative bg-white/20 backdrop-blur-md rounded-2xl border border-white/30 shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Sleep Score</h3>
              <Moon className="h-6 w-6 text-purple-500" />
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
          <div className="relative bg-white/20 backdrop-blur-md rounded-2xl border border-white/30 shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Average Duration</h3>
              <Clock className="h-6 w-6 text-purple-500" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {averageDuration.toFixed(1)}h
            </div>
            <p className="text-sm text-gray-600">Last 7 days</p>
          </div>

          {/* Average Quality */}
          <div className="relative bg-white/20 backdrop-blur-md rounded-2xl border border-white/30 shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Avg Quality</h3>
              <Star className="h-6 w-6 text-purple-500" />
            </div>
            <div className={cn('text-3xl font-bold mb-2', getQualityColor(averageQuality))}>
              {averageQuality.toFixed(1)}/10
            </div>
            <p className="text-sm text-gray-600">Last 7 days</p>
          </div>

          {/* Sleep Streak */}
          <div className="relative bg-white/20 backdrop-blur-md rounded-2xl border border-white/30 shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Sleep Streak</h3>
              <TrendingUp className="h-6 w-6 text-purple-500" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {sleepStreak}
            </div>
            <p className="text-sm text-gray-600">Days logged</p>
          </div>
        </div>

        {/* Recent Entries */}
        <div className="relative bg-white/20 backdrop-blur-md rounded-2xl border border-white/30 shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Recent Sleep Entries</h2>
            <Calendar className="h-6 w-6 text-purple-500" />
          </div>
          
          {recentEntries.length === 0 ? (
            <div className="text-center py-12">
              <Moon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg mb-2">No sleep entries yet</p>
              <p className="text-gray-500">Start tracking your sleep to see insights here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentEntries.map((entry) => (
                <div key={entry.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="text-sm font-medium text-gray-900">
                      {new Date(entry.date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Moon className="h-4 w-4" />
                      <span>{formatTime(entry.bedtime)}</span>
                      <span>→</span>
                      <Sun className="h-4 w-4" />
                      <span>{formatTime(entry.wakeTime)}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-sm font-medium text-gray-900">
                      {entry.duration.toFixed(1)}h
                    </div>
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            'h-4 w-4',
                            i < entry.quality / 2
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
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