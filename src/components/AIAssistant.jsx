import React, { useState } from 'react';
import { Bot, Send, X, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/utils';

export function AIAssistant({ nodes, onUpdateNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!message.trim()) return;

    // Add user message to conversation
    const userMessage = { role: 'user', content: message };
    setConversation([...conversation, userMessage]);
    setMessage('');
    setIsLoading(true);

    // Simulate AI response (replace with actual AI integration)
    setTimeout(() => {
      const aiResponse = generateAIResponse(message, nodes);
      setConversation(prev => [...prev, { role: 'assistant', content: aiResponse }]);
      setIsLoading(false);
    }, 1000);
  };

  const generateAIResponse = (message, nodes) => {
    // This is a placeholder for actual AI logic
    const lowercaseMsg = message.toLowerCase();
    
    if (lowercaseMsg.includes('status')) {
      const atRiskNodes = nodes.filter(n => n.status === 'at-risk');
      if (atRiskNodes.length > 0) {
        return `⚠️ There are ${atRiskNodes.length} projects at risk:\n\n${atRiskNodes.map(n => `- ${n.name}`).join('\n')}`;
      }
      return '✅ All projects are currently on track!';
    }

    if (lowercaseMsg.includes('budget')) {
      const totalBudget = nodes.reduce((sum, n) => sum + (n.budget || 0), 0);
      const totalSpent = nodes.reduce((sum, n) => sum + (n.spent || 0), 0);
      const percentUsed = ((totalSpent / totalBudget) * 100).toFixed(1);
      return `💰 Budget Overview:\n- Total Budget: $${(totalBudget/1000000).toFixed(1)}M\n- Total Spent: $${(totalSpent/1000000).toFixed(1)}M\n- ${percentUsed}% utilized`;
    }

    if (lowercaseMsg.includes('recommend') || lowercaseMsg.includes('suggest')) {
      const lowProgress = nodes.filter(n => n.progress < 50);
      if (lowProgress.length > 0) {
        return `📊 Recommendations:\n\nConsider focusing on these low-progress projects:\n\n${lowProgress.map(n => `- ${n.name} (${n.progress}% complete)`).join('\n')}`;
      }
      return '📈 All projects are making good progress! Consider starting new initiatives.';
    }

    return "I'm here to help! You can ask me about:\n- Project status\n- Budget overview\n- Recommendations\n- Risk assessment\n- Timeline analysis";
  };

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <Button
          className="fixed bottom-4 right-4 h-12 w-12 rounded-full shadow-lg"
          onClick={() => setIsOpen(true)}
        >
          <Bot className="h-6 w-6" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className={cn(
            "fixed right-4 bottom-4 bg-card border rounded-lg shadow-xl flex flex-col",
            isExpanded ? "w-[800px] h-[80vh]" : "w-[380px] h-[600px]"
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              <h3 className="font-semibold">AI Assistant</h3>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? (
                  <Minimize2 className="h-4 w-4" />
                ) : (
                  <Maximize2 className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {conversation.map((msg, i) => (
              <div
                key={i}
                className={cn(
                  "flex gap-2 max-w-[80%]",
                  msg.role === 'user' ? "ml-auto" : "mr-auto"
                )}
              >
                {msg.role === 'assistant' && (
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                )}
                <div
                  className={cn(
                    "rounded-lg p-3",
                    msg.role === 'user' 
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  )}
                >
                  <ReactMarkdown className="prose prose-invert prose-sm">
                    {msg.content}
                  </ReactMarkdown>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-2">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-primary animate-pulse" />
                </div>
                <div className="bg-muted rounded-lg p-3">
                  <div className="flex gap-1">
                    <span className="h-2 w-2 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="h-2 w-2 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="h-2 w-2 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 border-t">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex gap-2"
            >
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask me anything..."
                className="flex-1"
              />
              <Button type="submit" size="icon" disabled={!message.trim() || isLoading}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}