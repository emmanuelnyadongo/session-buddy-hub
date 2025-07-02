
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Users, BookOpen, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface StudySession {
  id: string;
  title: string;
  subject: string;
  date: string;
  time: string;
  duration: string;
  participantLimit: number;
  currentParticipants: number;
  participants: string[];
  creator: string;
  description: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [user] = useState({ name: 'Alex Chen', email: 'alex@university.edu' });
  
  const [upcomingSessions] = useState<StudySession[]>([
    {
      id: '1',
      title: 'Advanced Calculus Study Group',
      subject: 'Mathematics',
      date: '2024-07-02',
      time: '14:00',
      duration: '2 hours',
      participantLimit: 6,
      currentParticipants: 4,
      participants: ['Alex Chen', 'Maria Garcia', 'John Smith', 'Sarah Wilson'],
      creator: 'Maria Garcia',
      description: 'Preparing for the midterm exam on integration techniques'
    },
    {
      id: '2',
      title: 'React Development Workshop',
      subject: 'Computer Science',
      date: '2024-07-03',
      time: '16:30',
      duration: '3 hours',
      participantLimit: 8,
      currentParticipants: 3,
      participants: ['Alex Chen', 'David Kim', 'Emma Johnson'],
      creator: 'Alex Chen',
      description: 'Building a full-stack application with React and Node.js'
    }
  ]);

  const [availableSessions] = useState<StudySession[]>([
    {
      id: '3',
      title: 'Organic Chemistry Lab Prep',
      subject: 'Chemistry',
      date: '2024-07-04',
      time: '10:00',
      duration: '2.5 hours',
      participantLimit: 5,
      currentParticipants: 2,
      participants: ['Lisa Brown', 'Mike Davis'],
      creator: 'Lisa Brown',
      description: 'Reviewing lab procedures and safety protocols'
    },
    {
      id: '4',
      title: 'European History Discussion',
      subject: 'History',
      date: '2024-07-05',
      time: '13:00',
      duration: '1.5 hours',
      participantLimit: 4,
      currentParticipants: 1,
      participants: ['Prof. Anderson'],
      creator: 'Prof. Anderson',
      description: 'Analyzing the causes and effects of WWI'
    }
  ]);

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
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                StudyBuddy
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                onClick={() => navigate('/create-session')}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Session
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => navigate('/profile')}
                className="text-gray-700 hover:text-blue-600"
              >
                {user.name}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user.name}!</h2>
          <p className="text-gray-600">Ready to learn something new today?</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-none">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100">Sessions Joined</p>
                  <p className="text-3xl font-bold">{upcomingSessions.length}</p>
                </div>
                <Calendar className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-none">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100">Hours This Week</p>
                  <p className="text-3xl font-bold">12.5</p>
                </div>
                <Clock className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-none">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100">Study Partners</p>
                  <p className="text-3xl font-bold">28</p>
                </div>
                <Users className="h-8 w-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* My Upcoming Sessions */}
          <div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">My Upcoming Sessions</h3>
            <div className="space-y-4">
              {upcomingSessions.map((session) => (
                <Card key={session.id} className="hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-blue-500">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{session.title}</CardTitle>
                        <CardDescription className="mt-1">{session.description}</CardDescription>
                      </div>
                      <Badge className={getSubjectColor(session.subject)}>
                        {session.subject}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDate(session.date)}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {session.time} ({session.duration})
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          {session.currentParticipants}/{session.participantLimit}
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate(`/session/${session.id}`)}
                      >
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Available Sessions */}
          <div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">Available Sessions</h3>
            <div className="space-y-4">
              {availableSessions.map((session) => (
                <Card key={session.id} className="hover:shadow-lg transition-shadow duration-200">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{session.title}</CardTitle>
                        <CardDescription className="mt-1">{session.description}</CardDescription>
                      </div>
                      <Badge className={getSubjectColor(session.subject)}>
                        {session.subject}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDate(session.date)}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {session.time} ({session.duration})
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          {session.currentParticipants}/{session.participantLimit}
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                      >
                        Join Session
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => navigate(`/session/${session.id}`)}
                      >
                        Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
