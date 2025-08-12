import React, { useState, useMemo } from 'react';
import { useSleepStore } from '@/store/sleepStore';
import { useDemo } from '@/contexts/DemoContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Calendar, Clock, TrendingUp, Star, Moon, Sun, BarChart3, PieChart as PieChartIcon, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

type TimePeriod = '7d' | '30d' | '90d' | 'all';

const Statistics = () => {
  const { entries } = useSleepStore();
  const { isDemoMode, demoData } = useDemo();
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('30d');

  const currentEntries = isDemoMode ? demoData.sleepEntries : entries;

  const filteredEntries = useMemo(() => {
    if (selectedPeriod === 'all') return currentEntries;
    
    const days = selectedPeriod === '7d' ? 7 : selectedPeriod === '30d' ? 30 : 90;
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return currentEntries.filter(entry => new Date(entry.date) >= cutoffDate);
  }, [currentEntries, selectedPeriod]);

  const chartData = useMemo(() => {
    return filteredEntries
      .slice(-14) // Show last 14 entries for better visualization
      .map(entry => ({
        date: new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        duration: entry.duration,
        quality: entry.quality,
        bedtime: entry.bedtime,
        wakeTime: entry.wakeTime
      }));
  }, [filteredEntries]);

  const qualityDistribution = useMemo(() => {
    const distribution = { excellent: 0, good: 0, fair: 0, poor: 0 };
    filteredEntries.forEach(entry => {
      if (entry.quality >= 8) distribution.excellent++;
      else if (entry.quality >= 6) distribution.good++;
      else if (entry.quality >= 4) distribution.fair++;
      else distribution.poor++;
    });
    
    return [
      { name: 'Excellent (8-10)', value: distribution.excellent, color: '#10B981' },
      { name: 'Good (6-7)', value: distribution.good, color: '#3498DB' },
      { name: 'Fair (4-5)', value: distribution.fair, color: '#F59E0B' },
      { name: 'Poor (1-3)', value: distribution.poor, color: '#EF4444' }
    ].filter(item => item.value > 0);
  }, [filteredEntries]);

  const averageStats = useMemo(() => {
    if (filteredEntries.length === 0) {
      return { avgDuration: 0, avgQuality: 0, avgBedtime: '00:00', avgWakeTime: '00:00' };
    }

    const avgDuration = filteredEntries.reduce((sum, entry) => sum + entry.duration, 0) / filteredEntries.length;
    const avgQuality = filteredEntries.reduce((sum, entry) => sum + entry.quality, 0) / filteredEntries.length;
    
    // Calculate average bedtime and wake time
    const avgBedtimeMinutes = filteredEntries.reduce((sum, entry) => {
      const [hours, minutes] = entry.bedtime.split(':').map(Number);
      return sum + (hours * 60 + minutes);
    }, 0) / filteredEntries.length;
    
    const avgWakeTimeMinutes = filteredEntries.reduce((sum, entry) => {
      const [hours, minutes] = entry.wakeTime.split(':').map(Number);
      return sum + (hours * 60 + minutes);
    }, 0) / filteredEntries.length;
    
    const formatTime = (minutes: number) => {
      const hours = Math.floor(minutes / 60) % 24;
      const mins = Math.round(minutes % 60);
      return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
    };

    return {
      avgDuration,
      avgQuality,
      avgBedtime: formatTime(avgBedtimeMinutes),
      avgWakeTime: formatTime(avgWakeTimeMinutes)
    };
  }, [filteredEntries]);

  const periodLabels = {
    '7d': 'Last 7 Days',
    '30d': 'Last 30 Days',
    '90d': 'Last 90 Days',
    'all': 'All Time'
  };

  return (
    <div className="min-h-screen bg-background-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="heading-primary">Sleep Statistics & Analytics</h1>
              <p className="text-background-dark/70 mt-2">Analyze your sleep patterns and track your progress over time</p>
            </div>
            {isDemoMode && (
              <div className="flex items-center space-x-2 bg-accent/10 text-accent px-3 py-1 rounded-full text-sm font-medium">
                <Eye className="h-4 w-4" />
                <span>Demo Mode - Read Only</span>
              </div>
            )}
          </div>
        </div>

        {/* Time Period Selector */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {(Object.keys(periodLabels) as TimePeriod[]).map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={cn(
                  'px-4 py-2 rounded-lg font-medium transition-colors duration-200',
                  selectedPeriod === period
                    ? 'bg-accent text-white'
                    : 'bg-white text-primary-dark border border-primary/20 hover:bg-accent/10'
                )}
              >
                {periodLabels[period]}
              </button>
            ))}
          </div>
        </div>

        {filteredEntries.length === 0 ? (
          <div className="card text-center py-12">
            <BarChart3 className="h-16 w-16 text-background-dark/40 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-primary-dark mb-2">No Data Available</h3>
            <p className="text-background-dark/60">
              {isDemoMode 
                ? 'Demo data is being loaded...' 
                : 'Start logging your sleep to see detailed analytics and insights.'
              }
            </p>
          </div>
        ) : (
          <>
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="card">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-primary-dark">Avg Duration</h3>
                  <Clock className="h-5 w-5 text-accent" />
                </div>
                <div className="text-2xl font-bold text-primary-dark">
                  {averageStats.avgDuration.toFixed(1)}h
                </div>
              </div>
              
              <div className="card">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-primary-dark">Avg Quality</h3>
                  <Star className="h-5 w-5 text-accent" />
                </div>
                <div className="text-2xl font-bold text-primary-dark">
                  {averageStats.avgQuality.toFixed(1)}/10
                </div>
              </div>
              
              <div className="card">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-primary-dark">Avg Bedtime</h3>
                  <Moon className="h-5 w-5 text-accent" />
                </div>
                <div className="text-2xl font-bold text-primary-dark">
                  {averageStats.avgBedtime}
                </div>
              </div>
              
              <div className="card">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-primary-dark">Avg Wake Time</h3>
                  <Sun className="h-5 w-5 text-accent" />
                </div>
                <div className="text-2xl font-bold text-primary-dark">
                  {averageStats.avgWakeTime}
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Sleep Duration Chart */}
              <div className="card">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-primary-dark">Sleep Duration Trend</h2>
                  <BarChart3 className="h-6 w-6 text-accent" />
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis 
                        dataKey="date" 
                        stroke="#6b7280"
                        fontSize={12}
                      />
                      <YAxis 
                        stroke="#6b7280"
                        fontSize={12}
                        label={{ value: 'Hours', angle: -90, position: 'insideLeft' }}
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px'
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="duration" 
                        stroke="#3498DB" 
                        strokeWidth={3}
                        dot={{ fill: '#3498DB', strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Sleep Quality Chart */}
              <div className="card">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-primary-dark">Sleep Quality Trend</h2>
                  <Star className="h-6 w-6 text-accent" />
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis 
                        dataKey="date" 
                        stroke="#6b7280"
                        fontSize={12}
                      />
                      <YAxis 
                        stroke="#6b7280"
                        fontSize={12}
                        domain={[0, 10]}
                        label={{ value: 'Quality (1-10)', angle: -90, position: 'insideLeft' }}
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px'
                        }}
                      />
                      <Bar 
                        dataKey="quality" 
                        fill="#3498DB"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Quality Distribution */}
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-primary-dark">Sleep Quality Distribution</h2>
                <PieChartIcon className="h-6 w-6 text-accent" />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={qualityDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {qualityDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-col justify-center space-y-4">
                  {qualityDistribution.map((item, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <span className="text-sm font-medium text-primary-dark">{item.name}</span>
                      <span className="text-sm text-background-dark/60">({item.value} nights)</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Statistics;