'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Settings, LogOut, Mail, Calendar, TrendingUp, Award, Zap, Star, ChevronRight, Edit2, Save, X } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

const MOCK_USER = {
  id: '1', name: 'Space Explorer', email: 'explorer@factverse.ai',
  joinedDate: new Date('2024-01-15'),
  stats: { factsExplored: 127, quizzesTaken: 23, averageScore: 87, bookmarks: 42, streak: 7, level: 12, xp: 3450, nextLevelXp: 4000 },
  achievements: [
    { id: '1', name: 'First Fact', description: 'Explored your first fact', icon: '🌟', unlocked: true },
    { id: '2', name: 'Quiz Master', description: 'Scored 100% on a quiz', icon: '🏆', unlocked: true },
    { id: '3', name: 'Bookworm', description: 'Bookmarked 10 facts', icon: '📚', unlocked: true },
    { id: '4', name: 'Week Streak', description: '7 days in a row', icon: '🔥', unlocked: true },
    { id: '5', name: 'Science Whiz', description: 'Explored 50 science facts', icon: '🔬', unlocked: false },
    { id: '6', name: 'Space Cadet', description: 'Explored all space facts', icon: '🚀', unlocked: false },
  ],
  recentActivity: [
    { type: 'explored', fact: 'The Ocean Is Deeper Than You Think', time: '2 hours ago' },
    { type: 'quiz', score: 90, topic: 'Space', time: '5 hours ago' },
    { type: 'bookmarked', fact: 'Neutron Stars Spin 700 Times Per Second', time: '1 day ago' },
    { type: 'explored', fact: 'The Great Wall Myth', time: '2 days ago' },
  ],
};

function AnimatedCounter({ value }: { value: number }) {
  const [displayValue, setDisplayValue] = useState(0);
  useEffect(() => {
    const duration = 1000, steps = 30, increment = value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) { setDisplayValue(value); clearInterval(timer); }
      else setDisplayValue(Math.floor(current));
    }, duration / steps);
    return () => clearInterval(timer);
  }, [value]);
  return <span>{displayValue}</span>;
}

export default function ProfilePage() {
  const [user] = useState(MOCK_USER);
  const [activeTab, setActiveTab] = useState<'overview' | 'bookmarks' | 'achievements' | 'settings'>('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(user.name);

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="relative h-64 bg-gradient-to-br from-cyan-900/50 via-slate-950 to-violet-900/50">
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 4, repeat: Infinity }} className="text-8xl opacity-20">🌌</motion.div>
        </div>
        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="relative">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-cyan-500 to-violet-500 p-1">
              <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center">
                <User className="w-16 h-16 text-slate-400" />
              </div>
            </div>
            <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-green-500 flex items-center justify-center border-4 border-slate-950">
              <span className="text-white font-bold text-sm">Lv{user.stats.level}</span>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="pt-20 pb-8 text-center">
        <AnimatePresence mode="wait">
          {isEditing ? (
            <motion.div key="edit" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center justify-center gap-2">
              <input type="text" value={editedName} onChange={(e) => setEditedName(e.target.value)} className="text-2xl font-bold bg-slate-800 text-white px-4 py-2 rounded-xl border border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500" />
              <Button size="sm" onClick={() => setIsEditing(false)}><Save className="w-4 h-4" /></Button>
              <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}><X className="w-4 h-4" /></Button>
            </motion.div>
          ) : (
            <motion.div key="display" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center justify-center gap-2">
              <h1 className="text-3xl font-bold text-white">{user.name}</h1>
              <button onClick={() => setIsEditing(true)} className="p-2 text-slate-400 hover:text-white transition-colors"><Edit2 className="w-4 h-4" /></button>
            </motion.div>
          )}
        </AnimatePresence>
        <p className="text-slate-400 flex items-center justify-center gap-2 mt-2"><Mail className="w-4 h-4" />{user.email}</p>
      </div>

      <div className="max-w-2xl mx-auto px-6 mb-8">
        <div className="glass rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2"><Zap className="w-5 h-5 text-cyan-400" /><span className="text-white font-medium">Level {user.stats.level}</span></div>
            <span className="text-slate-400 text-sm">{user.stats.xp.toLocaleString()} / {user.stats.nextLevelXp.toLocaleString()} XP</span>
          </div>
          <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: `${(user.stats.xp / user.stats.nextLevelXp) * 100}%` }} transition={{ duration: 1 }} className="h-full bg-gradient-to-r from-cyan-500 to-violet-500" />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 mb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[{ label: 'Facts Explored', value: user.stats.factsExplored, icon: '📚' }, { label: 'Quizzes Taken', value: user.stats.quizzesTaken, icon: '🎯' }, { label: 'Avg Score', value: `${user.stats.averageScore}%`, icon: '🏆' }, { label: 'Day Streak', value: user.stats.streak, icon: '🔥' }].map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass rounded-2xl p-4 text-center">
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-2xl font-bold text-white"><AnimatedCounter value={typeof stat.value === 'number' ? stat.value : 0} />{typeof stat.value === 'string' && stat.value.includes('%') && '%'}</div>
              <div className="text-xs text-slate-400">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 mb-6">
        <div className="flex gap-2 p-1 bg-slate-900/50 rounded-xl">
          {(['overview', 'bookmarks', 'achievements', 'settings'] as const).map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all capitalize ${activeTab === tab ? 'bg-gradient-to-r from-cyan-500 to-violet-500 text-white' : 'text-slate-400 hover:text-white'}`}>{tab}</button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="max-w-4xl mx-auto px-6 pb-20">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="glass rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-cyan-400" />Recent Activity</h3>
                <div className="space-y-3">
                  {user.recentActivity.map((activity, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center">{activity.type === 'explored' && '📖'}{activity.type === 'quiz' && '🎯'}{activity.type === 'bookmarked' && '🔖'}</div>
                        <div><p className="text-white text-sm">{activity.type === 'quiz' ? `Scored ${activity.score}% on ${activity.topic} quiz` : `${activity.type === 'explored' ? 'Explored' : 'Bookmarked'}: ${activity.fact}`}</p><p className="text-slate-500 text-xs">{activity.time}</p></div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-600" />
                    </motion.div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Link href="/facts"><div className="glass rounded-2xl p-6 hover:border-cyan-500/50 transition-colors cursor-pointer"><div className="text-3xl mb-2">🚀</div><h4 className="font-bold text-white">Explore Facts</h4><p className="text-sm text-slate-400">Discover new knowledge</p></div></Link>
                <Link href="/quiz"><div className="glass rounded-2xl p-6 hover:border-cyan-500/50 transition-colors cursor-pointer"><div className="text-3xl mb-2">🎯</div><h4 className="font-bold text-white">Take a Quiz</h4><p className="text-sm text-slate-400">Test your knowledge</p></div></Link>
              </div>
            </div>
          )}
          {activeTab === 'bookmarks' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between"><h3 className="text-xl font-bold text-white">Your Bookmarks</h3><span className="text-cyan-400 font-medium">{user.stats.bookmarks} saved</span></div>
              {user.recentActivity.filter((a) => a.type === 'bookmarked').map((bookmark, i) => (
                <Link key={i} href="/facts"><div className="glass rounded-2xl p-4 flex items-center justify-between hover:border-cyan-500/50 transition-colors"><div className="flex items-center gap-4"><div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-2xl">🔖</div><div><h4 className="font-medium text-white">{bookmark.fact}</h4><p className="text-sm text-slate-400">{bookmark.time}</p></div></div><ChevronRight className="w-5 h-5 text-slate-600" /></div></Link>
              ))}
              <div className="text-center py-8 text-slate-500"><p>Explore more facts to bookmark them!</p><Link href="/facts"><Button className="mt-4">Browse Facts</Button></Link></div>
            </div>
          )}
          {activeTab === 'achievements' && (
            <div>
              <div className="flex items-center justify-between mb-6"><h3 className="text-xl font-bold text-white flex items-center gap-2"><Award className="w-5 h-5 text-amber-400" />Achievements</h3><span className="text-amber-400 font-medium">{user.achievements.filter((a) => a.unlocked).length}/{user.achievements.length} unlocked</span></div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {user.achievements.map((achievement, i) => (
                  <motion.div key={achievement.id} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }} className={`relative p-4 rounded-2xl border ${achievement.unlocked ? 'bg-gradient-to-br from-amber-500/20 to-orange-500/20 border-amber-500/30' : 'bg-slate-900/50 border-slate-800 opacity-50'}`}>
                    <div className="text-4xl mb-2">{achievement.icon}</div>
                    <h4 className={`font-bold ${achievement.unlocked ? 'text-white' : 'text-slate-500'}`}>{achievement.name}</h4>
                    <p className="text-xs text-slate-400">{achievement.description}</p>
                    {achievement.unlocked && <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center"><Star className="w-4 h-4 text-white fill-current" /></div>}
                  </motion.div>
                ))}
              </div>
            </div>
          )}
          {activeTab === 'settings' && (
            <div className="space-y-4">
              <div className="glass rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Settings className="w-5 h-5 text-slate-400" />Preferences</h3>
                <div className="space-y-4">
                  {[{ label: 'Auto-play narration', enabled: true }, { label: 'Reduce motion', enabled: false }, { label: 'Dark mode', enabled: true }, { label: 'Notifications', enabled: true }].map((setting, i) => (
                    <div key={i} className="flex items-center justify-between"><span className="text-white">{setting.label}</span><button className={`w-12 h-6 rounded-full transition-colors ${setting.enabled ? 'bg-cyan-500' : 'bg-slate-700'}`}><div className={`w-5 h-5 rounded-full bg-white transition-transform ${setting.enabled ? 'translate-x-6' : 'translate-x-0.5'}`} /></button></div>
                  ))}
                </div>
              </div>
              <div className="glass rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">Account</h3>
                <div className="space-y-3">
                  <button className="w-full p-3 text-left text-slate-400 hover:text-white transition-colors rounded-xl hover:bg-slate-800">Change Password</button>
                  <button className="w-full p-3 text-left text-slate-400 hover:text-white transition-colors rounded-xl hover:bg-slate-800">Update Email</button>
                  <button className="w-full p-3 text-left text-red-400 hover:text-red-300 transition-colors rounded-xl hover:bg-red-500/10 flex items-center gap-2"><LogOut className="w-4 h-4" />Sign Out</button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
