import { useState, useMemo } from 'react';
import { useSleepStore } from '@/store/sleepStore';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Calendar, Clock, TrendingUp, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';

type TimeRange = 'week' | 'month' | 'quarter';

const Analytics = () => {
  const { entries } = useSleepStore();
  const [timeRange, setTimeRange] = useState<TimeRange>('month');

  const filteredEntries = useMemo(() => {
    const now = new Date();
    const cutoffDate = new Date();
    
    switch (timeRange) {
      case 'week':
        cutoffDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        cutoffDate.setDate(now.getDate() - 30);
        break;
      case 'quarter':
        cutoffDate.setDate(now.getDate() - 90);
        break;
    }
    
    return entries
      .filter(entry => new Date(entry.date) >= cutoffDate)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [entries, timeRange]);

  const durationData = useMemo(() => {
    return filteredEntries.map(entry => ({
      date: new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      duration: entry.duration,
      quality: entry.quality
    }));
  }, [filteredEntries]);

  const qualityDistribution = useMemo(() => {
    const distribution = {
      'Excellent (9-10)': 0,
      'Good (7-8)': 0,
      'Fair (5-6)': 0,
      'Poor (3-4)': 0,
      'Very Poor (1-2)': 0
    };
    
    filteredEntries.forEach(entry => {
      if (entry.quality >= 9) distribution['Excellent (9-10)']++;
      else if (entry.quality >= 7) distribution['Good (7-8)']++;
      else if (entry.quality >= 5) distribution['Fair (5-6)']++;
      else if (entry.quality >= 3) distribution['Poor (3-4)']++;
      else distribution['Very Poor (1-2)']++;
    });
    
    return Object.entries(distribution).map(([name, value]) => ({ name, value }));
  }, [filteredEntries]);

  const weeklyAverages = useMemo(() => {
    const weeklyData: { [key: string]: { totalDuration: number; totalQuality: number; count: number } } = {};
    
    filteredEntries.forEach(entry => {
      const date = new Date(entry.date);
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay());
      const weekKey = weekStart.toISOString().split('T')[0];
      
      if (!weeklyData[weekKey]) {
        weeklyData[weekKey] = { totalDuration: 0, totalQuality: 0, count: 0 };
      }
      
      weeklyData[weekKey].totalDuration += entry.duration;
      weeklyData[weekKey].totalQuality += entry.quality;
      weeklyData[weekKey].count++;
    });
    
    return Object.entries(weeklyData).map(([week, data]) => ({
      week: new Date(week).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      avgDuration: Math.round((data.totalDuration / data.count) * 100) / 100,
      avgQuality: Math.round((data.totalQuality / data.count) * 10) / 10
    }));
  }, [filteredEntries]);

  const COLORS = ['#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#A855F7'];

  const stats = useMemo(() => {
    if (filteredEntries.length === 0) {
      return {
        avgDuration: 0,
        avgQuality: 0,
        totalEntries: 0,
        bestDay: null,
        worstDay: null
      };
    }
    
    const totalDuration = filteredEntries.reduce((sum, entry) => sum + entry.duration, 0);
    const totalQuality = filteredEntries.reduce((sum, entry) => sum + entry.quality, 0);
    
    const sortedByQuality = [...filteredEntries].sort((a, b) => b.quality - a.quality);
    
    return {
      avgDuration: Math.round((totalDuration / filteredEntries.length) * 100) / 100,
      avgQuality: Math.round((totalQuality / filteredEntries.length) * 10) / 10,
      totalEntries: filteredEntries.length,
      bestDay: sortedByQuality[0],
      worstDay: sortedByQuality[sortedByQuality.length - 1]
    };
  }, [filteredEntries]);

  return (
    <div className="min-h-screen bg-purple-100/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Sleep Analytics</h1>
          <p className="text-gray-600 mt-2">Analyze your sleep patterns and trends</p>
        </div>

        {/* Time Range Selector */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-gray-200 p-1 rounded-lg w-fit">
            {[
              { key: 'week', label: 'Last Week' },
              { key: 'month', label: 'Last Month' },
              { key: 'quarter', label: 'Last 3 Months' }
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setTimeRange(key as TimeRange)}
                className={cn(
                  'px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200',
                  timeRange === key
                    ? 'bg-white text-purple-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {filteredEntries.length === 0 ? (
          <div className="text-center py-12">
            <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg mb-2">No data available</p>
            <p className="text-gray-500">Start logging your sleep to see analytics</p>
          </div>
        ) : (
          <>
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-600">Avg Duration</h3>
                  <Clock className="h-4 w-4 text-purple-500" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{stats.avgDuration}h</div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-600">Avg Quality</h3>
                  <TrendingUp className="h-4 w-4 text-purple-500" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{stats.avgQuality}/10</div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-600">Total Entries</h3>
                  <Calendar className="h-4 w-4 text-purple-500" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{stats.totalEntries}</div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-600">Best Day</h3>
                </div>
                <div className="text-sm font-bold text-green-600">
                  {stats.bestDay ? `${stats.bestDay.quality}/10` : 'N/A'}
                </div>
                <div className="text-xs text-gray-500">
                  {stats.bestDay ? new Date(stats.bestDay.date).toLocaleDateString() : ''}
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-600">Worst Day</h3>
                </div>
                <div className="text-sm font-bold text-red-600">
                  {stats.worstDay ? `${stats.worstDay.quality}/10` : 'N/A'}
                </div>
                <div className="text-xs text-gray-500">
                  {stats.worstDay ? new Date(stats.worstDay.date).toLocaleDateString() : ''}
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Sleep Duration Trend */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Sleep Duration Trend</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={durationData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value}h`, 'Duration']} />
                    <Line type="monotone" dataKey="duration" stroke="#8B5CF6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Sleep Quality Trend */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Sleep Quality Trend</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={durationData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 10]} />
                    <Tooltip formatter={(value) => [`${value}/10`, 'Quality']} />
                    <Line type="monotone" dataKey="quality" stroke="#A855F7" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Quality Distribution */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Sleep Quality Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={qualityDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {qualityDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Weekly Averages */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Averages</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={weeklyAverages}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="avgDuration" fill="#8B5CF6" name="Avg Duration (h)" />
                <Bar dataKey="avgQuality" fill="#A855F7" name="Avg Quality" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Analytics;