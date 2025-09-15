import React, { useState, useEffect } from "react";
import { User } from "@/entities/User";
import { UserStats } from "@/entities/UserStats"; // This import can technically be removed if UserStats isn't used directly here for fetching, but it's harmless to keep.
import { InterviewSession } from "@/entities/InterviewSession"; // Same as UserStats
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  Play, 
  Flame, 
  Target, 
  Calendar,
  Lightbulb,
  TrendingUp,
  AlertTriangle,
  Calculator,
  Shuffle,
  ChevronRight
} from "lucide-react";

import StatsCard from "../components/dashboard/StatsCard";
import QuestionTypeStats from "../components/dashboard/QuestionTypeStats";
import OnboardingModal from "../components/onboarding/OnboardingModal";
import { useAuth } from "../Layout";

const questionTypes = [
  {
    type: 'Design',
    title: 'Product Design',
    description: 'Design new products from scratch',
    icon: Lightbulb,
    gradient: 'bg-gradient-to-r from-purple-500 to-pink-500',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50 hover:bg-purple-100'
  },
  {
    type: 'Improvement',
    title: 'Product Improvement',
    description: 'Improve existing products',
    icon: TrendingUp,
    gradient: 'bg-gradient-to-r from-blue-500 to-indigo-500',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 hover:bg-blue-100'
  },
  {
    type: 'RCA',
    title: 'Root Cause Analysis',
    description: 'Investigate product issues',
    icon: AlertTriangle,
    gradient: 'bg-gradient-to-r from-red-500 to-pink-500',
    color: 'text-red-600',
    bgColor: 'bg-red-50 hover:bg-red-100'
  },
  {
    type: 'Guesstimate',
    title: 'Guesstimate',
    description: 'Market sizing & estimation',
    icon: Calculator,
    gradient: 'bg-gradient-to-r from-green-500 to-teal-500',
    color: 'text-green-600',
    bgColor: 'bg-green-50 hover:bg-green-100'
  }
];

export default function HomePage() {
  const { user, sessions, userStats, isAuthenticated, isLoadingData, refreshUserData } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    // Only show onboarding if the user is authenticated, the user object is available, and they haven't onboarded yet.
    if (isAuthenticated && user && !user.onboarded) {
      setShowOnboarding(true);
    } else {
      setShowOnboarding(false);
    }
  }, [isAuthenticated, user]); // Depend on isAuthenticated and user object to re-evaluate

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    // Refresh user data (including stats and sessions) after onboarding is complete
    if (refreshUserData) {
      refreshUserData();
    }
  };

  const recalculateStats = async () => {
    if (!user?.id) return;
    
    try {
      console.log('Manually recalculating user stats...');
      
      // Get all completed sessions
      const allSessions = await InterviewSession.filter({ user_id: user.id, completed: true });
      console.log('Found sessions for recalculation:', allSessions.length);
      
      if (allSessions.length === 0) return;
      
      // Calculate averages for each question type
      const avgScores = {};
      ['design', 'improvement', 'rca', 'guesstimate'].forEach(type => {
        const capitalizedType = type.charAt(0).toUpperCase() + type.slice(1);
        const typeSessions = allSessions.filter(s => 
          (s.question_type === type || s.question_type === capitalizedType) && 
          s.composite_score !== undefined && 
          s.composite_score !== null
        );
        if (typeSessions.length > 0) {
          const totalScore = typeSessions.reduce((sum, s) => sum + s.composite_score, 0);
          avgScores[`avg_score_${type}`] = totalScore / typeSessions.length;
        } else {
          avgScores[`avg_score_${type}`] = 0;
        }
        console.log(`${type}: ${typeSessions.length} sessions, avg: ${avgScores[`avg_score_${type}`]}`);
      });

      // Get unique activity dates
      const today = new Date();
      const todayStr = today.getFullYear() + '-' + 
                     String(today.getMonth() + 1).padStart(2, '0') + '-' + 
                     String(today.getDate()).padStart(2, '0');
      
      const activityDates = new Set();
      allSessions.forEach(session => {
        const dateToUse = session.date || session.created_date;
        if (dateToUse) {
          let dateStr;
          if (typeof dateToUse === 'string' && dateToUse.includes('T')) {
            dateStr = dateToUse.split('T')[0];
          } else if (typeof dateToUse === 'string' && dateToUse.includes('-') && dateToUse.length === 10) {
            dateStr = dateToUse;
          } else {
            const parsedDate = new Date(dateToUse);
            dateStr = parsedDate.getFullYear() + '-' + 
                     String(parsedDate.getMonth() + 1).padStart(2, '0') + '-' + 
                     String(parsedDate.getDate()).padStart(2, '0');
          }
          activityDates.add(dateStr);
        }
      });

      // Calculate streaks
      let currentStreak = 0;
      let checkDate = new Date();
      
      if (!activityDates.has(todayStr)) {
        checkDate.setDate(checkDate.getDate() - 1);
      }
      
      while (true) {
        const checkDateStr = checkDate.getFullYear() + '-' + 
                            String(checkDate.getMonth() + 1).padStart(2, '0') + '-' + 
                            String(checkDate.getDate()).padStart(2, '0');
        
        if (activityDates.has(checkDateStr)) {
          currentStreak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }

      const sortedDates = Array.from(activityDates).sort();
      let longestStreak = 0;
      let tempStreak = 1;
      
      if (sortedDates.length > 0) {
        longestStreak = 1;
        
        for (let i = 1; i < sortedDates.length; i++) {
          const prevDate = new Date(sortedDates[i - 1]);
          const currDate = new Date(sortedDates[i]);
          const diffMs = currDate.getTime() - prevDate.getTime();
          const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
          
          if (diffDays === 1) {
            tempStreak++;
          } else {
            longestStreak = Math.max(longestStreak, tempStreak);
            tempStreak = 1;
          }
        }
        longestStreak = Math.max(longestStreak, tempStreak);
      }

      const statsUpdate = {
        user_id: user.id,
        current_streak: currentStreak,
        longest_streak: longestStreak,
        total_solved: allSessions.length,
        last_activity_date: todayStr,
        ...avgScores
      };

      // Update user stats
      const statsData = await UserStats.filter({ user_id: user.id });
      
      if (statsData.length === 0) {
        await UserStats.create(statsUpdate);
      } else {
        await UserStats.update(statsData[0].id, statsUpdate);
      }
      
      console.log('Stats recalculated successfully');
      
      // Refresh the page to show updated stats
      if (refreshUserData) {
        await refreshUserData();
      }
      
    } catch (error) {
      console.error('Error recalculating stats:', error);
    }
  };

  if (isLoadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center">
        <div>
          <h1 className="text-3xl font-bold">Welcome to Product Playground</h1>
          <p className="text-gray-600 mt-2">Please sign in to start practicing.</p>
          <Button 
            onClick={() => User.login()} 
            className="mt-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
          >
            Sign In with Google
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            Welcome back, {user?.full_name?.split(' ')[0] || 'User'}! 
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Ready to ace your next product management interview? Let's practice with AI-powered feedback.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Current Streak"
            value={userStats?.current_streak || 0}
            subtitle="days"
            icon={Flame}
            gradient="bg-gradient-to-r from-orange-500 to-red-500"
          />
          <StatsCard
            title="Total Solved"
            value={userStats?.total_solved || 0}
            subtitle="questions"
            icon={Target}
            gradient="bg-gradient-to-r from-indigo-500 to-purple-500"
          />
          <StatsCard
            title="Best Streak"
            value={userStats?.longest_streak || 0}
            subtitle="days"
            icon={Calendar}
            gradient="bg-gradient-to-r from-blue-500 to-indigo-500"
          />
          <StatsCard
            title="This Week"
            value={sessions.filter(s => {
              const sessionDate = new Date(s.created_date);
              const weekAgo = new Date();
              weekAgo.setDate(weekAgo.getDate() - 7);
              return sessionDate >= weekAgo && s.completed;
            }).length}
            subtitle="completed"
            icon={TrendingUp}
            gradient="bg-gradient-to-r from-green-500 to-teal-500"
          />
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Start Practice Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-lg border-0 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <Play className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Start Practice Session</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                {questionTypes.map((type) => (
                  <Link
                    key={type.type}
                    to={createPageUrl(`Interview?type=${type.type}`)}
                    className={`group p-4 rounded-xl border-2 border-gray-200 ${type.bgColor} transition-all duration-200 hover:border-gray-300 hover:shadow-md`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <type.icon className={`w-8 h-8 ${type.color}`} />
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all duration-200" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">{type.title}</h3>
                    <p className="text-sm text-gray-600">{type.description}</p>
                  </Link>
                ))}
              </div>
              
              <div className="border-t pt-4">
                <Link to={createPageUrl("Interview?type=random")}>
                  <Button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
                    <Shuffle className="w-5 h-5 mr-2" />
                    Random Question Challenge
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Performance Stats */}
          <div className="lg:col-span-1 space-y-6">
            <QuestionTypeStats userStats={userStats} sessions={sessions} />
          </div>
        </div>
      </div>
      
      {/* Onboarding Modal */}
      <OnboardingModal 
        open={showOnboarding}
        user={user}
        onComplete={handleOnboardingComplete}
      />
    </div>
  );
}