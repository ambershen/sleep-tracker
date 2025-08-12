import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Moon, Sun, Star, Save, Calendar, TrendingUp, Clock, BarChart3, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const Home = () => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    bedtime: '',
    wakeTime: '',
    quality: 5,
    notes: ''
  });

  const [localEntries, setLocalEntries] = useState<any[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.bedtime || !formData.wakeTime) {
      toast.error('Please fill in both bedtime and wake time');
      return;
    }

    // Check if entry for this date already exists
    const existingEntry = localEntries.find(entry => entry.date === formData.date);
    if (existingEntry) {
      toast.error('Sleep entry for this date already exists');
      return;
    }

    try {
      const newEntry = {
        id: Date.now().toString(),
        date: formData.date,
        bedtime: formData.bedtime,
        wakeTime: formData.wakeTime,
        quality: formData.quality,
        notes: formData.notes || undefined
      };
      
      setLocalEntries(prev => [newEntry, ...prev]);
      toast.success('Sleep entry saved! Sign up to keep your data permanently.');
      
      // Reset form
      setFormData({
        date: new Date().toISOString().split('T')[0],
        bedtime: '',
        wakeTime: '',
        quality: 5,
        notes: ''
      });
    } catch (error) {
      toast.error('Failed to save sleep entry');
    }
  };

  const handleQualityChange = (quality: number) => {
    setFormData(prev => ({ ...prev, quality }));
  };

  const getQualityLabel = (quality: number) => {
    if (quality >= 9) return 'Excellent';
    if (quality >= 7) return 'Good';
    if (quality >= 5) return 'Fair';
    if (quality >= 3) return 'Poor';
    return 'Very Poor';
  };

  const getQualityColor = (quality: number) => {
    if (quality >= 8) return 'text-green-600';
    if (quality >= 6) return 'text-yellow-600';
    if (quality >= 4) return 'text-orange-600';
    return 'text-red-600';
  };

  const calculateDuration = (bedtime: string, wakeTime: string) => {
    const bed = new Date(`2000-01-01T${bedtime}:00`);
    let wake = new Date(`2000-01-01T${wakeTime}:00`);
    
    // If wake time is earlier than bedtime, assume it's the next day
    if (wake < bed) {
      wake = new Date(`2000-01-02T${wakeTime}:00`);
    }
    
    const diff = wake.getTime() - bed.getTime();
    return diff / (1000 * 60 * 60); // Convert to hours
  };

  const averageQuality = localEntries.length > 0 
    ? localEntries.reduce((sum, entry) => sum + entry.quality, 0) / localEntries.length 
    : 0;

  const averageDuration = localEntries.length > 0
    ? localEntries.reduce((sum, entry) => sum + calculateDuration(entry.bedtime, entry.wakeTime), 0) / localEntries.length
    : 0;

  return (
    <div className="min-h-screen bg-purple-100/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Track Your Sleep</h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">Start logging your sleep patterns today.&nbsp;</p>
          
          {/* Quick Stats */}
          {localEntries.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white/70 backdrop-blur-sm rounded-lg p-6 shadow-md">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">Entries Logged</h3>
                  <Calendar className="h-6 w-6 text-purple-500" />
                </div>
                <div className="text-3xl font-bold text-gray-900">{localEntries.length}</div>
              </div>
              
              <div className="bg-white/70 backdrop-blur-sm rounded-lg p-6 shadow-md">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">Avg Duration</h3>
                  <Clock className="h-6 w-6 text-purple-500" />
                </div>
                <div className="text-3xl font-bold text-gray-900">
                  {averageDuration.toFixed(1)}h
                </div>
              </div>
              
              <div className="bg-white/70 backdrop-blur-sm rounded-lg p-6 shadow-md">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">Avg Quality</h3>
                  <Star className="h-6 w-6 text-purple-500" />
                </div>
                <div className="text-3xl font-bold text-gray-900">
                  {averageQuality.toFixed(1)}/10
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Sleep Log Form */}
          <div className="bg-white/70 backdrop-blur-sm rounded-lg shadow-md p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Log Your Sleep</h2>
              <p className="text-gray-600">Record your sleep data to start tracking patterns</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Date */}
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="inline h-4 w-4 mr-2" />
                  Date
                </label>
                <input
                  type="date"
                  id="date"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  required
                />
              </div>

              {/* Bedtime */}
              <div>
                <label htmlFor="bedtime" className="block text-sm font-medium text-gray-700 mb-2">
                  <Moon className="inline h-4 w-4 mr-2" />
                  Bedtime
                </label>
                <input
                  type="time"
                  id="bedtime"
                  value={formData.bedtime}
                  onChange={(e) => setFormData(prev => ({ ...prev, bedtime: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  required
                />
              </div>

              {/* Wake Time */}
              <div>
                <label htmlFor="wakeTime" className="block text-sm font-medium text-gray-700 mb-2">
                  <Sun className="inline h-4 w-4 mr-2" />
                  Wake Time
                </label>
                <input
                  type="time"
                  id="wakeTime"
                  value={formData.wakeTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, wakeTime: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  required
                />
              </div>

              {/* Sleep Quality */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  <Star className="inline h-4 w-4 mr-2" />
                  Sleep Quality
                </label>
                
                <div className="space-y-4">
                  {/* Quality Slider */}
                  <div className="px-3">
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={formData.quality}
                      onChange={(e) => handleQualityChange(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>1</span>
                      <span>5</span>
                      <span>10</span>
                    </div>
                  </div>
                  
                  {/* Quality Display */}
                  <div className="text-center">
                    <div className={cn('text-2xl font-bold', getQualityColor(formData.quality))}>
                      {formData.quality}/10
                    </div>
                    <div className={cn('text-sm font-medium', getQualityColor(formData.quality))}>
                      {getQualityLabel(formData.quality)}
                    </div>
                  </div>
                  
                  {/* Star Rating Display */}
                  <div className="flex justify-center space-x-1">
                    {[...Array(10)].map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleQualityChange(i + 1)}
                        className="focus:outline-none"
                      >
                        <Star
                          className={cn(
                            'h-5 w-5 transition-colors duration-150',
                            i < formData.quality
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300 hover:text-yellow-200'
                          )}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  id="notes"
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="How did you sleep? Any factors that affected your sleep?"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  className="w-full flex items-center justify-center space-x-2 bg-purple-600 text-white py-3 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors duration-200 font-medium"
                >
                  <Save className="h-5 w-5" />
                  <span>Log Sleep Entry</span>
                </button>
              </div>
            </form>
          </div>

          {/* Recent Entries & CTA */}

        </div>

        {/* Quick Tips */}
        <div className="mt-12 bg-purple-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-purple-900 mb-3">💡 Quick Tips for Better Sleep</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-purple-800">
            <ul className="space-y-2">
              <li>• Log your sleep as soon as you wake up for better accuracy</li>
              <li>• Aim for 7-9 hours of sleep per night</li>
              <li>• Keep a consistent sleep schedule, even on weekends</li>
            </ul>
            <ul className="space-y-2">
              <li>• Consider factors like stress, caffeine, and exercise in your notes</li>
              <li>• Quality is just as important as quantity</li>
              <li>• Create a relaxing bedtime routine</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;