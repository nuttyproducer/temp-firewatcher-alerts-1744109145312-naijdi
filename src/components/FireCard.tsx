
import React, { useState } from 'react';
import { Flame, Wind, Compass, Calendar, ArrowUpRight, ThumbsUp, ThumbsDown, CheckCircle, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface FireData {
  id: string;
  name: string;
  location: string;
  status: 'contained' | 'uncontained' | 'partially-contained';
  severity: 'low' | 'medium' | 'high' | 'critical';
  size: string;
  containment: number;
  updatedAt: string;
  windDirection?: string;
  windSpeed?: string;
  verifiedCount?: number;
  upvotes?: number;
  downvotes?: number;
  comments?: number;
}

interface FireCardProps {
  fire: FireData;
  onClick?: (fire: FireData) => void;
  onVerify?: (fireId: string) => void;
  onUpvote?: (fireId: string) => void;
  onDownvote?: (fireId: string) => void;
  onChatOpen?: (fireId: string) => void;
  className?: string;
}

const FireCard = ({ fire, onClick, onVerify, onUpvote, onDownvote, onChatOpen, className }: FireCardProps) => {
  const [isVerified, setIsVerified] = useState(false);
  const [hasVoted, setHasVoted] = useState<'up' | 'down' | null>(null);
  
  const handleClick = () => {
    if (onClick) onClick(fire);
  };

  const handleVerify = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onVerify && !isVerified) {
      onVerify(fire.id);
      setIsVerified(true);
    }
  };

  const handleUpvote = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onUpvote && hasVoted !== 'up') {
      onUpvote(fire.id);
      setHasVoted('up');
    }
  };

  const handleDownvote = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDownvote && hasVoted !== 'down') {
      onDownvote(fire.id);
      setHasVoted('down');
    }
  };

  const handleChatOpen = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onChatOpen) {
      onChatOpen(fire.id);
    }
  };

  const statusColors = {
    'contained': 'bg-green-500',
    'partially-contained': 'bg-amber-500',
    'uncontained': 'bg-red-500'
  };

  const severityLabels = {
    'low': 'Low',
    'medium': 'Medium',
    'high': 'High',
    'critical': 'Critical'
  };

  const severityColors = {
    'low': 'badge-alert-low',
    'medium': 'badge-alert-medium',
    'high': 'badge-alert-high',
    'critical': 'badge-alert-critical'
  };

  return (
    <div 
      className={cn(
        'fire-card transition-transform hover:scale-[1.01] active:scale-[0.99]',
        className
      )}
      onClick={handleClick}
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-medium text-lg">{fire.name}</h3>
          <p className="text-muted-foreground text-sm">{fire.location}</p>
        </div>
        <span className={cn('badge-alert', severityColors[fire.severity])}>
          {severityLabels[fire.severity]}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="flex items-center space-x-2">
          <Flame className="h-4 w-4 text-fire-500" />
          <span className="text-sm">Size: {fire.size}</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded-full" style={{ 
            background: `conic-gradient(${statusColors[fire.status]} ${fire.containment}%, transparent 0)` 
          }} />
          <span className="text-sm">{fire.containment}% contained</span>
        </div>
        
        {fire.windDirection && fire.windSpeed && (
          <div className="flex items-center space-x-2">
            <Wind className="h-4 w-4 text-info-primary" />
            <span className="text-sm">{fire.windSpeed} mph</span>
          </div>
        )}
        
        {fire.windDirection && fire.windSpeed && (
          <div className="flex items-center space-x-2">
            <Compass className="h-4 w-4 text-info-primary" />
            <span className="text-sm">{fire.windDirection}</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between border-t pt-2 mt-2">
        <div className="flex items-center space-x-3">
          <button 
            className={`flex items-center ${isVerified ? 'text-safe-primary' : 'text-muted-foreground hover:text-safe-primary'}`}
            onClick={handleVerify}
            title="Verify this report"
          >
            <CheckCircle className="h-4 w-4 mr-1" />
            <span className="text-xs">{fire.verifiedCount || 0}</span>
          </button>
          
          <div className="flex items-center space-x-2">
            <button 
              className={`flex items-center ${hasVoted === 'up' ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}
              onClick={handleUpvote}
              title="Upvote for accuracy"
            >
              <ThumbsUp className="h-4 w-4 mr-1" />
              <span className="text-xs">{fire.upvotes || 0}</span>
            </button>
            
            <button 
              className={`flex items-center ${hasVoted === 'down' ? 'text-alert-high' : 'text-muted-foreground hover:text-alert-high'}`}
              onClick={handleDownvote}
              title="Downvote for inaccuracy"
            >
              <ThumbsDown className="h-4 w-4 mr-1" />
              <span className="text-xs">{fire.downvotes || 0}</span>
            </button>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button 
            className="flex items-center text-muted-foreground hover:text-primary"
            onClick={handleChatOpen}
            title="Open chat for this fire"
          >
            <MessageSquare className="h-4 w-4 mr-1" />
            <span className="text-xs">{fire.comments || 0}</span>
          </button>
          
          <div className="flex items-center text-xs text-muted-foreground">
            <Calendar className="h-3 w-3 mr-1" />
            <span>Updated {fire.updatedAt}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FireCard;
