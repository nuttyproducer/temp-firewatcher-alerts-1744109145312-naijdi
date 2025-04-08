
import React, { useState } from 'react';
import { Send, X, User, Info, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { FireData } from '@/components/FireCard';

interface ChatMessage {
  id: string;
  userId: string;
  username: string;
  text: string;
  timestamp: string;
  isLocal?: boolean;
}

interface FireChatDialogProps {
  fire: FireData;
  isOpen: boolean;
  onClose: () => void;
}

// Mock data for chat messages
const mockMessages: ChatMessage[] = [
  {
    id: '1',
    userId: 'user1',
    username: 'MountainRanger',
    text: 'Just drove by the area, fire is actively burning on the east side.',
    timestamp: '10 min ago'
  },
  {
    id: '2',
    userId: 'user2',
    username: 'LocalResident',
    text: 'Anyone know if evacuation orders have been issued for Pinecrest Rd?',
    timestamp: '8 min ago'
  },
  {
    id: '3',
    userId: 'user3',
    username: 'FirefighterJoe',
    text: 'I\'m with Station 12. We\'re setting up containment lines on the north side. Please avoid Highway 16.',
    timestamp: '5 min ago'
  },
  {
    id: '4',
    userId: 'user4',
    username: 'WildlifeCenter',
    text: 'Our shelter is open for small animals if evacuations occur. Call 555-1234 for assistance.',
    timestamp: '3 min ago'
  }
];

const FireChatDialog = ({ fire, isOpen, onClose }: FireChatDialogProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>(mockMessages);
  const [newMessage, setNewMessage] = useState('');
  const [showInfo, setShowInfo] = useState(false);
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;
    
    const newChatMessage: ChatMessage = {
      id: Date.now().toString(),
      userId: 'currentUser',
      username: 'You',
      text: newMessage,
      timestamp: 'Just now',
      isLocal: true
    };
    
    setMessages([...messages, newChatMessage]);
    setNewMessage('');
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[80vh] flex flex-col">
        <DialogHeader className="border-b pb-2">
          <DialogTitle className="flex justify-between items-center">
            <span>Community Chat: {fire.name}</span>
            <button
              className="p-1 rounded-full hover:bg-secondary"
              onClick={() => setShowInfo(!showInfo)}
            >
              {showInfo ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </button>
          </DialogTitle>
        </DialogHeader>
        
        {showInfo && (
          <div className="bg-muted/50 p-3 rounded-md my-2 animate-fade-in">
            <div className="flex items-start">
              <Info className="h-5 w-5 mr-2 text-muted-foreground flex-shrink-0 mt-1" />
              <div className="text-sm">
                <p className="font-medium mb-1">{fire.severity.charAt(0).toUpperCase() + fire.severity.slice(1)} severity fire in {fire.location}</p>
                <p className="text-muted-foreground">Size: {fire.size} • {fire.containment}% contained</p>
                {fire.windDirection && fire.windSpeed && (
                  <p className="text-muted-foreground">Wind: {fire.windSpeed} mph {fire.windDirection}</p>
                )}
                <div className="flex items-center mt-1 text-muted-foreground">
                  <p className="mr-3">{fire.verifiedCount} verifications</p>
                  <p className="mr-3">{fire.upvotes} upvotes</p>
                  <p>{fire.downvotes} downvotes</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex-1 overflow-y-auto py-2 space-y-3">
          {messages.map((message) => (
            <div 
              key={message.id}
              className={cn(
                "flex",
                message.isLocal ? "justify-end" : "justify-start"
              )}
            >
              <div className={cn(
                "max-w-[80%] rounded-lg p-3",
                message.isLocal 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-muted"
              )}>
                <div className="flex items-center mb-1">
                  <User className="h-4 w-4 mr-1" />
                  <span className={cn(
                    "text-xs font-medium",
                    message.isLocal ? "text-primary-foreground" : "text-foreground"
                  )}>
                    {message.username}
                  </span>
                </div>
                <p className="text-sm">{message.text}</p>
                <p className={cn(
                  "text-xs mt-1 text-right",
                  message.isLocal ? "text-primary-foreground/70" : "text-muted-foreground"
                )}>
                  {message.timestamp}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        <DialogFooter className="flex-shrink-0 sm:justify-between border-t pt-2">
          <form onSubmit={handleSendMessage} className="flex w-full gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-ring"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground"
              disabled={!newMessage.trim()}
            >
              <Send className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </button>
          </form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FireChatDialog;
