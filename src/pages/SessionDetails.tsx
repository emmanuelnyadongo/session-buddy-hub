
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BookOpen, ArrowLeft, Calendar, Clock, Users, MapPin, MessageCircle, Mail } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface StudySession {
  id: string;
  title: string;
  subject: string;
  date: string;
  time: string;
  duration: string;
  participantLimit: number;
  currentParticipants: number;
  participants: Array<{
    id: string;
    name: string;
    email: string;
    avatar?: string;
    isCreator?: boolean;
  }>;
  creator: string;
  description: string;
  location?: string;
}

const SessionDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isJoined, setIsJoined] = useState(false);
  
  // Mock data - in real app, this would be fetched based on the session ID
  const [session] = useState<StudySession>({
    id: id || '1',
    title: 'Advanced Calculus Study Group',
    subject: 'Mathematics',
    date: '2024-07-02',
    time: '14:00',
    duration: '2 hours',
    participantLimit: 6,
    currentParticipants: 4,
    participants: [
      {
        id: '1',
        name: 'Maria Garcia',
        email: 'maria@university.edu',
        avatar: '/api/placeholder/32/32',
        isCreator: true
      },
      {
        id: '2',
        name: 'Alex Chen',
        email: 'alex@university.edu',
        avatar: '/api/placeholder/32/32'
      },
      {
        id: '3',
        name: 'John Smith',
        email: 'john@university.edu',
        avatar: '/api/placeholder/32/32'
      },
      {
        id: '4',
        name: 'Sarah Wilson',
        email: 'sarah@university.edu',
        avatar: '/api/placeholder/32/32'
      }
    ],
    creator: 'Maria Garcia',
    description: 'Preparing for the midterm exam on integration techniques. We\'ll cover u-substitution, integration by parts, and partial fractions. Please bring your textbook and practice problems.',
    location: 'Library Study Room 204'
  });

  const getSubjectColor = (subject: string) => {
    const colors: Record<string, string> = {
      'Mathematics': 'bg-blue-100 text-blue-800',
      'Computer Science': 'bg-green-100 text-green-800',
      'Chemistry': 'bg-purple-100 text-purple-800',
      'History': 'bg-orange-100 text-orange-800',
      'Physics': 'bg-red-100 text-red-800',
      'Biology': 'bg-teal-100 text-teal-800'
    };
    return colors[subject] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleJoinSession = () => {
    setIsJoined(true);
    toast({
      title: "Successfully joined!",
      description: "You've joined the study session. Check your email for details.",
    });
  };

  const handleLeaveSession = () => {
    setIsJoined(false);
    toast({
      title: "Left session",
      description: "You've left the study session.",
    });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/dashboard')}
                className="text-gray-600 hover:text-blue-600"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                StudyBuddy
              </h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Session Info Card */}
            <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-xl">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <CardTitle className="text-2xl">{session.title}</CardTitle>
                    <CardDescription className="text-base">
                      Created by {session.creator}
                    </CardDescription>
                  </div>
                  <Badge className={getSubjectColor(session.subject)}>
                    {session.subject}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Session Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-5 w-5 mr-3 text-blue-600" />
                    <div>
                      <p className="font-medium">Date</p>
                      <p className="text-sm">{formatDate(session.date)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <Clock className="h-5 w-5 mr-3 text-blue-600" />
                    <div>
                      <p className="font-medium">Time & Duration</p>
                      <p className="text-sm">{session.time} ({session.duration})</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <Users className="h-5 w-5 mr-3 text-blue-600" />
                    <div>
                      <p className="font-medium">Participants</p>
                      <p className="text-sm">{session.currentParticipants}/{session.participantLimit} joined</p>
                    </div>
                  </div>
                  
                  {session.location && (
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-5 w-5 mr-3 text-blue-600" />
                      <div>
                        <p className="font-medium">Location</p>
                        <p className="text-sm">{session.location}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-600 leading-relaxed">{session.description}</p>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4">
                  {!isJoined ? (
                    <Button 
                      onClick={handleJoinSession}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                      disabled={session.currentParticipants >= session.participantLimit}
                    >
                      {session.currentParticipants >= session.participantLimit ? 'Session Full' : 'Join Session'}
                    </Button>
                  ) : (
                    <Button 
                      onClick={handleLeaveSession}
                      variant="outline"
                      className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
                    >
                      Leave Session
                    </Button>
                  )}
                  <Button variant="outline" className="flex items-center">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Message Creator
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Participants Card */}
            <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Participants ({session.currentParticipants}/{session.participantLimit})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {session.participants.map((participant) => (
                    <div key={participant.id} className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={participant.avatar} alt={participant.name} />
                        <AvatarFallback className="bg-blue-100 text-blue-600">
                          {getInitials(participant.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {participant.name}
                          </p>
                          {participant.isCreator && (
                            <Badge variant="secondary" className="text-xs">
                              Creator
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 truncate">{participant.email}</p>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Mail className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  
                  {/* Empty slots */}
                  {Array.from({ length: session.participantLimit - session.currentParticipants }).map((_, index) => (
                    <div key={`empty-${index}`} className="flex items-center space-x-3 opacity-50">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-gray-100">
                          <Users className="h-4 w-4 text-gray-400" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm text-gray-400">Open slot</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions Card */}
            <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-xl">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="h-4 w-4 mr-2" />
                  Add to Calendar
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Group Chat
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Mail className="h-4 w-4 mr-2" />
                  Email Reminders
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionDetails;
