'use client';

import { useState, useEffect, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  BarChart3,
  BookOpen,
  CheckCircle2,
  Clock,
  Cpu,
  Eye,
  FileQuestion,
  RefreshCw,
  TrendingUp,
  XCircle,
  Zap,
  Plus,
  ChevronRight,
  Settings,
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { api } from '@/lib/api';
import { sampleFacts } from '@/lib/data';
import { cn } from '@/lib/utils';
import type { AIJob, AdminStats } from '@/types';

const Scene3D = dynamic(
  () => import('@/components/3d/Scene3D').then((mod) => mod.Scene3D),
  { ssr: false }
);

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  change?: string;
  trend?: 'up' | 'down';
  color: string;
}

function StatCard({ title, value, icon, change, trend, color }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-slate-900/90 to-slate-950/90 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center', color)}>
          {icon}
        </div>
        {change && (
          <span className={cn('text-sm font-medium', trend === 'up' ? 'text-green-400' : 'text-red-400')}>
            {trend === 'up' ? '+' : ''}{change}
          </span>
        )}
      </div>
      <h3 className="text-2xl font-bold text-white mb-1">{value}</h3>
      <p className="text-sm text-slate-500">{title}</p>
    </motion.div>
  );
}

function AdminContent() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [jobs, setJobs] = useState<AIJob[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'queue' | 'settings'>('overview');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [statsData, jobsData] = await Promise.all([
        api.admin.getStats(),
        api.admin.getJobs(),
      ]);
      setStats(statsData);
      setJobs(jobsData);
    } catch (error) {
      console.error('Failed to load admin data:', error);
    }
  };

  const handleGenerateFact = async () => {
    setIsGenerating(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await loadData();
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 relative">
      <div className="fixed inset-0 -z-10 opacity-30">
        <Scene3D />
      </div>

      <Header />

      <div className="relative pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12"
          >
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Admin Dashboard
              </h1>
              <p className="text-slate-400">
                Manage facts, monitor AI generation, and track system health
              </p>
            </div>
            <Button onClick={handleGenerateFact} isLoading={isGenerating}>
              <Plus className="w-5 h-5 mr-2" />
              Generate New Fact
            </Button>
          </motion.div>

          {/* Stats Grid */}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
              <StatCard
                title="Total Facts"
                value={stats.totalFacts}
                icon={<BookOpen className="w-6 h-6 text-white" />}
                color="bg-blue-500/20"
                change="+12"
                trend="up"
              />
              <StatCard
                title="Verified Facts"
                value={stats.verifiedFacts}
                icon={<CheckCircle2 className="w-6 h-6 text-white" />}
                color="bg-green-500/20"
                change="+8"
                trend="up"
              />
              <StatCard
                title="Pending Review"
                value={stats.pendingReview}
                icon={<Clock className="w-6 h-6 text-white" />}
                color="bg-yellow-500/20"
              />
              <StatCard
                title="Published Today"
                value={stats.publishedToday}
                icon={<Zap className="w-6 h-6 text-white" />}
                color="bg-cyan-500/20"
                change="+3"
                trend="up"
              />
            </div>
          )}

          {/* Secondary Stats */}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
              <StatCard
                title="AI Generations"
                value={stats.aiGenerations}
                icon={<Cpu className="w-6 h-6 text-white" />}
                color="bg-violet-500/20"
              />
              <StatCard
                title="API Usage"
                value={stats.apiUsage.toLocaleString()}
                icon={<TrendingUp className="w-6 h-6 text-white" />}
                color="bg-pink-500/20"
                change="+15%"
                trend="up"
              />
              <StatCard
                title="Failed Jobs"
                value={stats.failedJobs}
                icon={<XCircle className="w-6 h-6 text-white" />}
                color="bg-red-500/20"
                change="-2"
                trend="up"
              />
              <StatCard
                title="Total Views"
                value="1.2M"
                icon={<Eye className="w-6 h-6 text-white" />}
                color="bg-orange-500/20"
                change="+23%"
                trend="up"
              />
            </div>
          )}

          {/* Tabs */}
          <div className="flex gap-2 mb-6 border-b border-slate-800">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'queue', label: 'Fact Queue', icon: FileQuestion },
              { id: 'settings', label: 'Settings', icon: Settings },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setSelectedTab(id as typeof selectedTab)}
                className={cn(
                  'flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors',
                  selectedTab === id
                    ? 'text-cyan-400 border-cyan-400'
                    : 'text-slate-500 border-transparent hover:text-white'
                )}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>

          {/* Content based on tab */}
          {selectedTab === 'overview' && stats && (
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Trending Topics */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-br from-slate-900/90 to-slate-950/90 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6"
              >
                <h3 className="text-lg font-bold text-white mb-4">Trending Topics</h3>
                <div className="space-y-4">
                  {stats.trendingTopics.map((topic, index) => (
                    <div
                      key={topic.topic}
                      className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold">
                          {index + 1}
                        </span>
                        <div>
                          <p className="font-medium text-white">{topic.topic}</p>
                          <p className="text-xs text-slate-500 capitalize">{topic.category}</p>
                        </div>
                      </div>
                      <span className="text-sm text-slate-400">{topic.count} views</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Pipeline Status */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-slate-900/90 to-slate-950/90 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6"
              >
                <h3 className="text-lg font-bold text-white mb-4">AI Pipeline Status</h3>
                <div className="grid grid-cols-4 gap-2">
                  {['Discovery', 'Research', 'Verify', 'Generate'].map((stage, index) => (
                    <div key={stage} className="text-center">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center mx-auto mb-2">
                        <RefreshCw className="w-6 h-6 text-white" />
                      </div>
                      <p className="text-xs text-slate-400">{stage}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-slate-800">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Current Job</span>
                    <span className="text-cyan-400">Generating ocean fact...</span>
                  </div>
                </div>
              </motion.div>
            </div>
          )}

          {selectedTab === 'queue' && (
            <div className="space-y-4">
              {/* Queue Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-white">Fact Generation Queue</h3>
                <Button size="sm" variant="outline" onClick={loadData}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
              </div>

              {/* Jobs List */}
              {jobs.map((job, index) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-gradient-to-br from-slate-900/90 to-slate-950/90 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="px-3 py-1 text-xs font-medium bg-slate-800 text-slate-400 rounded-full capitalize">
                          {job.type.replace('_', ' ')}
                        </span>
                        <span
                          className={cn(
                            'px-3 py-1 text-xs font-medium rounded-full',
                            job.status === 'completed' && 'bg-green-500/20 text-green-400',
                            job.status === 'running' && 'bg-cyan-500/20 text-cyan-400',
                            job.status === 'pending' && 'bg-yellow-500/20 text-yellow-400',
                            job.status === 'failed' && 'bg-red-500/20 text-red-400'
                          )}
                        >
                          {job.status}
                        </span>
                      </div>
                      <p className="text-white font-medium">
                        {job.type === 'fact_generation' && 'Generating new fact...'}
                        {job.type === 'verification' && 'Verifying sources...'}
                        {job.type === 'research' && `Research: ${(job.input as { topic?: string })?.topic || 'Unknown'}`}
                      </p>
                      <p className="text-sm text-slate-500 mt-1">
                        Started {new Date(job.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {job.status === 'pending' && (
                        <>
                          <Button size="sm" variant="ghost">Edit</Button>
                          <Button size="sm" variant="ghost">Cancel</Button>
                        </>
                      )}
                      {job.status === 'completed' && (
                        <Button size="sm" variant="outline">
                          View Result
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {selectedTab === 'settings' && (
            <div className="bg-gradient-to-br from-slate-900/90 to-slate-950/90 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-8">
              <h3 className="text-lg font-bold text-white mb-6">Generation Settings</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">
                    Refresh Interval
                  </label>
                  <select className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white">
                    <option>Every hour</option>
                    <option>Every 6 hours</option>
                    <option>Every 12 hours</option>
                    <option>Daily</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">
                    Facts per Generation
                  </label>
                  <select className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white">
                    <option>1</option>
                    <option>3</option>
                    <option>5</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">
                    Minimum Confidence
                  </label>
                  <select className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white">
                    <option>70%</option>
                    <option>80%</option>
                    <option>90%</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">
                    Auto-publish
                  </label>
                  <select className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white">
                    <option>Manual approval required</option>
                    <option>Auto-publish verified facts</option>
                  </select>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-slate-800">
                <Button>Save Settings</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default function AdminPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center"><div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" /></div>}>
      <AdminContent />
    </Suspense>
  );
}
