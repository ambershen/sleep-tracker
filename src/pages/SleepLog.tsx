import React, { useState } from 'react';
import { useSleepStore } from '@/store/sleepStore';
import { useDemo } from '@/contexts/DemoContext';
import { Moon, Sun, Star, Save, Calendar, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const SleepLog = () => {
  const { addEntry, entries } = useSleepStore();
  const { isDemoMode } = useDemo();
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    bedtime: '',
    wakeTime: '',
    quality: 5,
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isDemoMode) {
      toast.error('Demo mode is read-only. Sign up to save your sleep data!');
      return;
    }
    
    if (!formData.bedtime || !formData.wakeTime) {
      toast.error('Please fill in both bedtime and wake time');
      return;
    }

    // Check if entry for this date already exists
    const existingEntry = entries.find(entry => entry.date === formData.date);
    if (existingEntry) {
      toast.error('Sleep entry for this date already exists');
      return;
    }

    try {
      addEntry({
        date: formData.date,
        bedtime: formData.bedtime,
        wakeTime: formData.wakeTime,
        quality: formData.quality,
        notes: formData.notes || undefined
      });
      
      toast.success('Sleep entry saved successfully!');
      
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

  return (
    <div className="min-h-screen bg-background-light">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="heading-primary">Log Sleep Entry</h1>
              <p className="text-background-dark/70 mt-2">Record your sleep data to track patterns and improve your rest</p>
            </div>
            {isDemoMode && (
              <div className="flex items-center space-x-2 bg-accent/10 text-accent px-3 py-1 rounded-full text-sm font-medium">
                <Eye className="h-4 w-4" />
                <span>Demo Mode - Read Only</span>
              </div>
            )}
          </div>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Date */}
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-primary-dark mb-2">
                <Calendar className="inline h-4 w-4 mr-2 text-accent" />
                Date
              </label>
              <input
                type="date"
                id="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                className="w-full px-3 py-2 border border-primary/20 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent bg-white"
                required
              />
            </div>

            {/* Bedtime */}
            <div>
              <label htmlFor="bedtime" className="block text-sm font-medium text-primary-dark mb-2">
                <Moon className="inline h-4 w-4 mr-2 text-accent" />
                Bedtime
              </label>
              <input
                type="time"
                id="bedtime"
                value={formData.bedtime}
                onChange={(e) => setFormData(prev => ({ ...prev, bedtime: e.target.value }))}
                className="w-full px-3 py-2 border border-primary/20 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent bg-white"
                required
              />
            </div>

            {/* Wake Time */}
            <div>
              <label htmlFor="wakeTime" className="block text-sm font-medium text-primary-dark mb-2">
                <Sun className="inline h-4 w-4 mr-2 text-accent" />
                Wake Time
              </label>
              <input
                type="time"
                id="wakeTime"
                value={formData.wakeTime}
                onChange={(e) => setFormData(prev => ({ ...prev, wakeTime: e.target.value }))}
                className="w-full px-3 py-2 border border-primary/20 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent bg-white"
                required
              />
            </div>

            {/* Sleep Quality */}
            <div>
              <label className="block text-sm font-medium text-primary-dark mb-4">
                <Star className="inline h-4 w-4 mr-2 text-accent" />
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
                    className="w-full h-2 bg-primary/20 rounded-lg appearance-none cursor-pointer slider"
                    style={{
                      background: `linear-gradient(to right, #3498DB 0%, #3498DB ${(formData.quality - 1) * 11.11}%, #e5e7eb ${(formData.quality - 1) * 11.11}%, #e5e7eb 100%)`
                    }}
                  />
                  <div className="flex justify-between text-xs text-background-dark/50 mt-1">
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
                          'h-6 w-6 transition-colors duration-150',
                          i < formData.quality
                            ? 'text-accent fill-current'
                            : 'text-background-dark/30 hover:text-accent/50'
                        )}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-primary-dark mb-2">
                Notes (Optional)
              </label>
              <textarea
                id="notes"
                rows={4}
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Add any notes about your sleep... (e.g., stress levels, caffeine intake, exercise, room temperature)"
                className="w-full px-3 py-2 border border-primary/20 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent resize-none bg-white"
                maxLength={500}
              />
              <div className="text-xs text-background-dark/50 mt-1">
                {formData.notes.length}/500 characters
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                className="btn-primary w-full flex items-center justify-center space-x-2 py-3 px-4 font-medium"
              >
                <Save className="h-5 w-5" />
                <span>Save Sleep Entry</span>
              </button>
            </div>
          </form>
        </div>

        {/* Quick Tips */}
        <div className="mt-8 bg-accent/10 rounded-lg p-6 border border-accent/20">
          <h3 className="text-lg font-semibold text-primary-dark mb-3">💡 Quick Tips</h3>
          <ul className="space-y-2 text-sm text-background-dark/70">
            <li>• Log your sleep as soon as you wake up for better accuracy</li>
            <li>• Consider factors like stress, caffeine, and exercise in your notes</li>
            <li>• Aim for consistency in your sleep schedule</li>
            <li>• Quality is just as important as quantity</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SleepLog;