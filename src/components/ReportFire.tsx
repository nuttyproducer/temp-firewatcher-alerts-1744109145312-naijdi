
import React, { useState } from 'react';
import { Camera, MapPin, Upload, Info, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ReportFireProps {
  onSubmit: (data: any) => void;
  className?: string;
}

const ReportFire = ({ onSubmit, className }: ReportFireProps) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    location: '',
    description: '',
    size: 'small',
    photos: [],
    useLocation: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      onSubmit(formData);
      setIsSubmitting(false);
      setIsSuccess(true);
      
      // Reset form after success
      setTimeout(() => {
        setIsSuccess(false);
        setStep(1);
        setFormData({
          location: '',
          description: '',
          size: 'small',
          photos: [],
          useLocation: false,
        });
      }, 3000);
    }, 1500);
  };
  
  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);
  
  if (isSuccess) {
    return (
      <div className={cn('glass-card p-6 animate-fade-in', className)}>
        <div className="text-center py-10">
          <CheckCircle className="w-16 h-16 mx-auto mb-4 text-safe-primary" />
          <h2 className="text-xl font-semibold mb-2">Report Submitted</h2>
          <p className="text-muted-foreground mb-6">
            Thank you for reporting. Your information helps keep communities safe.
          </p>
          <button 
            className="py-2 px-4 bg-primary text-white rounded-lg"
            onClick={() => setIsSuccess(false)}
          >
            Submit Another Report
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className={cn('glass-card p-6', className)}>
      <h2 className="text-xl font-semibold mb-6">Report a Wildfire</h2>
      
      <div className="mb-6">
        <div className="flex items-center mb-4">
          {[1, 2, 3].map((stepNumber) => (
            <React.Fragment key={stepNumber}>
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm",
                step === stepNumber ? "bg-primary text-white" : 
                step > stepNumber ? "bg-primary/20 text-primary" : 
                "bg-muted text-muted-foreground"
              )}>
                {stepNumber}
              </div>
              {stepNumber < 3 && (
                <div className={cn(
                  "h-0.5 flex-1",
                  step > stepNumber ? "bg-primary" : "bg-muted"
                )} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
      
      <form onSubmit={handleSubmit}>
        {step === 1 && (
          <div className="space-y-4 animate-fade-in">
            <div>
              <label className="block mb-2 text-sm font-medium">Location</label>
              <div className="flex mb-2">
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Enter location description"
                  className="flex-1 p-2 border rounded-l-lg focus:outline-none focus:ring-1 focus:ring-primary"
                  required
                />
                <button
                  type="button"
                  className="bg-secondary p-2 rounded-r-lg border-l-0 border"
                >
                  <MapPin className="h-5 w-5" />
                </button>
              </div>
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="useLocation" 
                  name="useLocation"
                  checked={formData.useLocation}
                  onChange={handleCheckboxChange}
                  className="mr-2"
                />
                <label htmlFor="useLocation" className="text-sm text-muted-foreground">
                  Use my current location
                </label>
              </div>
            </div>
            
            <div>
              <label className="block mb-2 text-sm font-medium">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe what you're seeing (smoke color, flame height, etc.)"
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                rows={4}
                required
              />
            </div>
            
            <div className="flex justify-end">
              <button
                type="button"
                onClick={nextStep}
                className="py-2 px-4 bg-primary text-white rounded-lg"
              >
                Next
              </button>
            </div>
          </div>
        )}
        
        {step === 2 && (
          <div className="space-y-4 animate-fade-in">
            <div>
              <label className="block mb-2 text-sm font-medium">Estimated Fire Size</label>
              <select
                name="size"
                value={formData.size}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="small">Small (campfire size)</option>
                <option value="medium">Medium (size of a car)</option>
                <option value="large">Large (size of a house or larger)</option>
                <option value="unknown">Unknown / Just smoke visible</option>
              </select>
            </div>
            
            <div>
              <label className="block mb-2 text-sm font-medium">Upload Photos (optional)</label>
              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                <Camera className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-2">
                  Tap to take a photo or upload from your device
                </p>
                <button
                  type="button"
                  className="py-2 px-4 bg-secondary text-secondary-foreground rounded-lg inline-flex items-center"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Image
                </button>
              </div>
            </div>
            
            <div className="flex items-center p-3 bg-info-primary/10 rounded-lg">
              <Info className="h-5 w-5 mr-2 text-info-primary" />
              <p className="text-sm">Images help verify reports and assess the situation</p>
            </div>
            
            <div className="flex justify-between">
              <button
                type="button"
                onClick={prevStep}
                className="py-2 px-4 bg-secondary text-secondary-foreground rounded-lg"
              >
                Back
              </button>
              <button
                type="button"
                onClick={nextStep}
                className="py-2 px-4 bg-primary text-white rounded-lg"
              >
                Next
              </button>
            </div>
          </div>
        )}
        
        {step === 3 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h3 className="text-lg font-medium mb-4">Review Your Report</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between pb-2 border-b">
                  <span className="text-muted-foreground">Location</span>
                  <span className="font-medium">
                    {formData.location || 'Current location'}
                  </span>
                </div>
                
                <div className="flex justify-between pb-2 border-b">
                  <span className="text-muted-foreground">Description</span>
                  <span className="font-medium max-w-[60%] text-right">
                    {formData.description.substring(0, 30)}
                    {formData.description.length > 30 ? '...' : ''}
                  </span>
                </div>
                
                <div className="flex justify-between pb-2 border-b">
                  <span className="text-muted-foreground">Size</span>
                  <span className="font-medium">{formData.size}</span>
                </div>
                
                <div className="flex justify-between pb-2 border-b">
                  <span className="text-muted-foreground">Photos</span>
                  <span className="font-medium">
                    {formData.photos.length > 0 ? `${formData.photos.length} photos` : 'None'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="p-3 bg-alert-low/10 rounded-lg">
              <p className="text-sm">
                <span className="font-medium text-alert-low">Important: </span>
                If this is an immediate life-threatening emergency, please also call emergency services directly.
              </p>
            </div>
            
            <div className="flex justify-between">
              <button
                type="button"
                onClick={prevStep}
                className="py-2 px-4 bg-secondary text-secondary-foreground rounded-lg"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="py-2 px-4 bg-primary text-white rounded-lg flex items-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin mr-2"></div>
                    Submitting...
                  </>
                ) : 'Submit Report'}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default ReportFire;
