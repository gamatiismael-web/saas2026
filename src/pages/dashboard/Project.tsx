import { useEffect, useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import {
  Globe, CheckCircle2, Circle, Clock, AlertCircle, ExternalLink,
  FolderKanban, CalendarDays, Settings,
} from 'lucide-react';
import { Link } from 'react-router-dom';

type Project = {
  id: string;
  name: string;
  status: string;
  stage: string;
  onboarding_progress: number;
  pages_in_scope: { name: string; status: string; progress: number }[];
  launch_date: string | null;
  created_at: string;
  updated_at: string;
};

type Task = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  awaiting_client: boolean;
  due_date: string | null;
};

const STAGES = ['discovery', 'design', 'development', 'launch'];

const STAGE_LABELS: Record<string, string> = {
  discovery: 'Discovery',
  design: 'Design',
  development: 'Development',
  launch: 'Launch',
};

const STAGE_DESCRIPTIONS: Record<string, string> = {
  discovery: 'Requirements gathering and planning',
  design: 'Visual design and wireframes',
  development: 'Building your website',
  launch: 'Final testing and go-live',
};

const STATUS_BADGE: Record<string, string> = {
  completed: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  in_progress: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
  review: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  pending: 'text-gray-400 bg-gray-800 border-gray-700',
  onboarding: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  live: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
};

function Skeleton({ className }: { className: string }) {
  return <div className={`animate-pulse bg-gray-800 rounded-lg ${className}`} />;
}

export function Project() {
  const { profile } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile?.id) return;
    fetchProject();
  }, [profile?.id]);

  const fetchProject = async () => {
    setLoading(true);
    try {
      const { data: projectData } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', profile!.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (projectData) {
        setProject(projectData);

        const { data: taskData } = await supabase
          .from('tasks')
          .select('*')
          .eq('project_id', projectData.id)
          .order('created_at', { ascending: true });

        setTasks(taskData || []);
      }
    } finally {
      setLoading(false);
    }
  };

  const currentStageIndex = project ? STAGES.indexOf(project.stage) : -1;

  const pages: { name: string; status: string; progress: number }[] =
    Array.isArray(project?.pages_in_scope) ? project!.pages_in_scope : [];

  const awaitingTasks = tasks.filter((t) => t.awaiting_client && t.status !== 'completed');
  const completedTasks = tasks.filter((t) => t.status === 'completed');

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
              <FolderKanban className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">My Project</h1>
              <p className="text-sm text-gray-400">
                {profile?.website_url ? (
                  <a
                    href={profile.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    {profile.website_url.replace(/^https?:\/\//, '')}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                ) : (
                  'Track the progress of your website'
                )}
              </p>
            </div>
          </div>

          {project && (
            <span className={`text-xs font-semibold px-3 py-1.5 rounded-full border capitalize ${STATUS_BADGE[project.status] ?? STATUS_BADGE.pending}`}>
              {project.status.replace('_', ' ')}
            </span>
          )}
        </div>

        {loading ? (
          <div className="space-y-6">
            <Skeleton className="h-40" />
            <div className="grid lg:grid-cols-2 gap-6">
              <Skeleton className="h-64" />
              <Skeleton className="h-64" />
            </div>
          </div>
        ) : !project ? (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto mb-5">
              <Globe className="h-8 w-8 text-blue-400" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">No project set up yet</h2>
            <p className="text-gray-400 text-sm mb-2 max-w-sm mx-auto">
              Your project hasn't been created yet.
              {!profile?.website_url && ' Start by adding your website URL in settings.'}
            </p>
            {profile?.website_url && (
              <p className="text-sm text-gray-500 mb-6">
                Website: <span className="text-gray-300">{profile.website_url}</span>
              </p>
            )}
            <Link
              to="/dashboard/settings"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors text-sm"
            >
              <Settings className="h-4 w-4" />
              {profile?.website_url ? 'Contact your account manager' : 'Add your website in Settings'}
            </Link>
          </div>
        ) : (
          <>
            {/* Website badge */}
            {profile?.website_url && (
              <div className="flex items-center gap-2.5 bg-gray-900 border border-gray-800 rounded-xl px-4 py-3">
                <Globe className="h-4 w-4 text-blue-400 flex-shrink-0" />
                <span className="text-sm text-gray-400">Website:</span>
                <a
                  href={profile.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
                >
                  {profile.website_url}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            )}

            {/* Project timeline */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h2 className="text-base font-semibold text-white mb-6">Project Timeline</h2>
              <div className="grid md:grid-cols-4 gap-6">
                {STAGES.map((stage, index) => {
                  const isDone = index < currentStageIndex;
                  const isCurrent = index === currentStageIndex;
                  return (
                    <div key={stage} className="relative">
                      <div className="flex flex-col items-center text-center">
                        <div className="w-14 h-14 rounded-full bg-gray-950 border border-gray-800 flex items-center justify-center mb-3">
                          {isDone ? (
                            <CheckCircle2 className="h-7 w-7 text-emerald-400" />
                          ) : isCurrent ? (
                            <Clock className="h-7 w-7 text-blue-400 animate-pulse" />
                          ) : (
                            <Circle className="h-7 w-7 text-gray-600" />
                          )}
                        </div>
                        <div className={`font-semibold mb-1 text-sm ${isDone ? 'text-emerald-400' : isCurrent ? 'text-white' : 'text-gray-500'}`}>
                          {STAGE_LABELS[stage]}
                        </div>
                        <div className="text-xs text-gray-500">{STAGE_DESCRIPTIONS[stage]}</div>
                        {isCurrent && (
                          <span className="mt-2 text-xs bg-blue-500/10 border border-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">
                            In Progress
                          </span>
                        )}
                      </div>
                      {index < STAGES.length - 1 && (
                        <div className="hidden md:block absolute top-7 left-1/2 w-full h-px">
                          <div className={`h-full ${isDone ? 'bg-emerald-500/40' : 'bg-gray-800'}`} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Pages in scope */}
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <h2 className="text-base font-semibold text-white mb-5">Pages in Scope</h2>
                {pages.length === 0 ? (
                  <p className="text-sm text-gray-500">No pages defined yet.</p>
                ) : (
                  <div className="space-y-4">
                    {pages.map((page, index) => (
                      <div key={index}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2.5">
                            <span className="text-sm font-medium text-white">{page.name}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full border capitalize ${STATUS_BADGE[page.status] ?? STATUS_BADGE.pending}`}>
                              {page.status?.replace('_', ' ')}
                            </span>
                          </div>
                          <span className="text-sm font-medium text-gray-300">{page.progress ?? 0}%</span>
                        </div>
                        <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full bg-blue-500 transition-all duration-500"
                            style={{ width: `${page.progress ?? 0}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Launch info */}
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <h2 className="text-base font-semibold text-white mb-5">Project Overview</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-gray-800">
                    <span className="text-sm text-gray-400">Project name</span>
                    <span className="text-sm font-medium text-white">{project.name}</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-gray-800">
                    <span className="text-sm text-gray-400">Current stage</span>
                    <span className="text-sm font-medium text-white capitalize">{project.stage}</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-gray-800">
                    <span className="text-sm text-gray-400">Tasks awaiting you</span>
                    <span className={`text-sm font-semibold ${awaitingTasks.length > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {awaitingTasks.length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-gray-800">
                    <span className="text-sm text-gray-400">Completed tasks</span>
                    <span className="text-sm font-medium text-white">{completedTasks.length}</span>
                  </div>
                  {project.launch_date && (
                    <div className="flex items-center justify-between py-3">
                      <span className="text-sm text-gray-400 flex items-center gap-1.5">
                        <CalendarDays className="h-3.5 w-3.5" />
                        Estimated launch
                      </span>
                      <span className="text-sm font-semibold text-blue-400">
                        {new Date(project.launch_date).toLocaleDateString('en-GB', {
                          day: 'numeric', month: 'long', year: 'numeric',
                        })}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Tasks */}
            {tasks.length > 0 && (
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-base font-semibold text-white">Tasks</h2>
                  {awaitingTasks.length > 0 && (
                    <span className="text-xs bg-amber-400/10 border border-amber-400/20 text-amber-400 font-medium px-2.5 py-1 rounded-full">
                      {awaitingTasks.length} awaiting your action
                    </span>
                  )}
                </div>
                <div className="space-y-2">
                  {tasks.map((task) => (
                    <div
                      key={task.id}
                      className={`flex items-start justify-between p-4 rounded-xl border ${
                        task.status === 'completed'
                          ? 'bg-gray-950 border-gray-800/50 opacity-60'
                          : task.awaiting_client
                          ? 'bg-amber-500/5 border-amber-500/20'
                          : 'bg-gray-950 border-gray-800'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {task.status === 'completed' ? (
                          <CheckCircle2 className="h-4.5 w-4.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                        ) : task.status === 'in_progress' ? (
                          <Clock className="h-4.5 w-4.5 text-blue-400 flex-shrink-0 mt-0.5" />
                        ) : (
                          <Circle className="h-4.5 w-4.5 text-gray-600 flex-shrink-0 mt-0.5" />
                        )}
                        <div>
                          <p className={`text-sm font-medium ${task.status === 'completed' ? 'line-through text-gray-500' : 'text-white'}`}>
                            {task.title}
                          </p>
                          {task.description && (
                            <p className="text-xs text-gray-500 mt-0.5">{task.description}</p>
                          )}
                          {task.due_date && (
                            <p className="text-xs text-gray-600 mt-1">
                              Due {new Date(task.due_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                            </p>
                          )}
                        </div>
                      </div>
                      {task.awaiting_client && task.status !== 'completed' && (
                        <span className="text-xs text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded-full flex-shrink-0 mt-0.5">
                          Action needed
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tasks.length === 0 && (
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 flex items-center gap-3">
                <AlertCircle className="h-4 w-4 text-gray-500 flex-shrink-0" />
                <p className="text-sm text-gray-500">No tasks assigned yet. Your account manager will add tasks as the project progresses.</p>
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
