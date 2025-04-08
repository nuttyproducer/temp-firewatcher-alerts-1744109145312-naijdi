
import React, { useState } from 'react';
import { toast } from '@/lib/toast';
import { saveUserReport } from '@/lib/supabaseClient';

interface FireReportFormProps {
  onSuccess?: (report: any) => void;
  currentLocation?: { lat: number; lng: number } | null;
}

const FireReportForm = ({ onSuccess, currentLocation }: FireReportFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    severity: 'medium',
    status: 'reported', // Added status field to match Report interface
    latitude: currentLocation?.lat || null,
    longitude: currentLocation?.lng || null,
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // In a real implementation, this would save to Supabase
      const result = await saveUserReport(formData);
      toast.success("Fire report submitted successfully", {
        description: "Thank you for helping keep your community safe"
      });
      
      if (onSuccess) {
        onSuccess(result.data);
      }
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        location: '',
        severity: 'medium',
        status: 'reported',
        latitude: currentLocation?.lat || null,
        longitude: currentLocation?.lng || null,
      });
    } catch (error) {
      console.error('Error submitting report:', error);
      toast.error("Failed to submit report", {
        description: "Please try again or connect to Supabase"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-1">Report Title</label>
        <input
          type="text"
          id="title"
          name="title"
          required
          value={formData.title}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          placeholder="E.g., Smoke visible from Highway 101"
        />
      </div>
      
      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1">Description</label>
        <textarea
          id="description"
          name="description"
          required
          value={formData.description}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          rows={3}
          placeholder="Describe what you see, smell, or hear..."
        />
      </div>
      
      <div>
        <label htmlFor="location" className="block text-sm font-medium mb-1">Location Description</label>
        <input
          type="text"
          id="location"
          name="location"
          required
          value={formData.location}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          placeholder="E.g., Near Pine Ridge Road, 2 miles east of town center"
        />
      </div>
      
      <div>
        <label htmlFor="severity" className="block text-sm font-medium mb-1">Severity</label>
        <select
          id="severity"
          name="severity"
          value={formData.severity}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
        >
          <option value="low">Low - Small smoke or just starting</option>
          <option value="medium">Medium - Visible flames, moderate smoke</option>
          <option value="high">High - Large flames, heavy smoke</option>
          <option value="critical">Critical - Rapidly spreading, immediate danger</option>
        </select>
      </div>
      
      {(formData.latitude && formData.longitude) ? (
        <p className="text-sm text-muted-foreground">Using your current location coordinates</p>
      ) : (
        <p className="text-sm text-alert-medium">Location services not available. Please provide a detailed location description.</p>
      )}
      
      <button
        type="submit"
        className="w-full py-2 bg-primary text-white rounded-md shadow-sm font-medium"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Submitting...' : 'Submit Report'}
      </button>
    </form>
  );
};

export default FireReportForm;
