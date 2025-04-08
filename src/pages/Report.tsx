
import React from 'react';
import { toast } from "@/lib/toast";
import Navigation from '@/components/Navigation';
import ReportFire from '@/components/ReportFire';

const Report = () => {
  const handleSubmit = (formData: any) => {
    console.log('Report submitted:', formData);
    toast.success("Your report has been submitted. Community members will be able to verify it.", {
      description: "Thank you for contributing to public safety.",
    });
    // In a real app, this would send data to an API
  };
  
  return (
    <div className="app-container">
      <div className="page-container pb-24">
        <h1 className="text-2xl font-semibold mb-6">Report Wildfire</h1>
        
        <ReportFire onSubmit={handleSubmit} />
      </div>
      
      <Navigation />
    </div>
  );
};

export default Report;
