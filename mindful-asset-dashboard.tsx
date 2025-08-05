import React, { useState } from 'react';
import { Activity, TrendingUp, TrendingDown, BarChart3, Target, Layers, Circle, Plus, X, Sun, Moon, MoreVertical } from 'lucide-react';

// Dropdown Date Picker Component
const DropdownDatePicker = ({ value, onChange, theme }) => {
  const parseDate = (dateString) => {
    if (!dateString) return { year: '', month: '', day: '' };
    
    let year, month, day;
    if (dateString.includes('/')) {
      const [m, d, y] = dateString.split('/');
      year = y;
      month = m.padStart(2, '0');
      day = d.padStart(2, '0');
    } else if (dateString.includes('-')) {
      [year, month, day] = dateString.split('-');
    }
    
    return { year: year || '', month: month || '', day: day || '' };
  };

  const { year, month, day } = parseDate(value);

  const months = [
    { value: '01', label: 'Jan' }, { value: '02', label: 'Feb' }, { value: '03', label: 'Mar' },
    { value: '04', label: 'Apr' }, { value: '05', label: 'May' }, { value: '06', label: 'Jun' },
    { value: '07', label: 'Jul' }, { value: '08', label: 'Aug' }, { value: '09', label: 'Sep' },
    { value: '10', label: 'Oct' }, { value: '11', label: 'Nov' }, { value: '12', label: 'Dec' }
  ];

  const years = Array.from({ length: 7 }, (_, i) => (2024 + i).toString());
  const maxDays = month && year ? new Date(parseInt(year), parseInt(month), 0).getDate() : 31;
  const days = Array.from({ length: maxDays }, (_, i) => (i + 1).toString().padStart(2, '0'));

  const updateDate = (newYear, newMonth, newDay) => {
    if (newYear && newMonth && newDay) {
      onChange && onChange(`${newYear}-${newMonth}-${newDay}`);
    }
  };

  const baseClasses = theme === 'light' 
    ? 'bg-white border border-gray-300 text-gray-900 hover:bg-gray-50 focus:border-blue-500'
    : 'bg-gray-800 border border-gray-600 text-white hover:bg-gray-700 focus:border-blue-500';

  return (
    <div className="flex space-x-1">
      <select
        value={month}
        onChange={(e) => updateDate(year, e.target.value, day)}
        className={`${baseClasses} text-xs cursor-pointer px-1 py-1 rounded outline-none`}
      >
        <option value="">Mon</option>
        {months.map(m => (
          <option key={m.value} value={m.value}>{m.label}</option>
        ))}
      </select>
      
      <select
        value={day}
        onChange={(e) => updateDate(year, month, e.target.value)}
        className={`${baseClasses} text-xs cursor-pointer px-1 py-1 rounded outline-none`}
      >
        <option value="">Day</option>
        {days.map(d => (
          <option key={d} value={d}>{d}</option>
        ))}
      </select>
      
      <select
        value={year}
        onChange={(e) => updateDate(e.target.value, month, day)}
        className={`${baseClasses} text-xs cursor-pointer px-1 py-1 rounded outline-none`}
      >
        <option value="">Year</option>
        {years.map(y => (
          <option key={y} value={y}>{y}</option>
        ))}
      </select>
    </div>
  );
};

// Actions Dropdown Menu Component
const ActionsDropdown = ({ meeting, isOpen, onToggle, onDelete, onPostpone, theme }) => {
  return (
    <div className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
        className={`p-1 rounded transition-colors ${
          theme === 'light' 
            ? 'text-gray-500 hover:text-gray-700 hover:bg-gray-100' 
            : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'
        }`}
        title="Actions"
      >
        <MoreVertical size={14} />
      </button>
      
      {isOpen && (
        <div className={`absolute right-0 top-full mt-1 w-32 rounded-md border shadow-lg z-50 ${
          theme === 'light' 
            ? 'bg-white border-gray-200' 
            : 'bg-gray-800 border-gray-600'
        }`}>
          <div className="py-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPostpone(meeting.id);
              }}
              className={`w-full text-left px-3 py-2 text-xs transition-colors ${
                theme === 'light' 
                  ? 'text-gray-700 hover:bg-gray-100' 
                  : 'text-gray-300 hover:bg-gray-700'
              }`}
            >
              {meeting.postponed === 'Y' ? 'Un-postpone' : 'Postpone'}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(meeting.id);
              }}
              className={`w-full text-left px-3 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors ${
                theme === 'dark' ? 'hover:bg-red-900/20' : ''
              }`}
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Progress Bar Button Component
const ProgressBarButton = ({ label, breakdown, onClick, className = "", theme }) => {
  const { complete, inProgress, needsAttention, completeCount, total } = breakdown;
  
  return (
    <button
      onClick={onClick}
      className={`relative overflow-hidden rounded text-xs font-mono cursor-pointer transition-all hover:shadow-lg group ${className}`}
    >
      <div className="flex h-full w-full">
        {complete > 0 && (
          <div 
            className="bg-emerald-600 h-full transition-all duration-300 group-hover:bg-emerald-500" 
            style={{ width: `${complete}%` }}
          />
        )}
        {inProgress > 0 && (
          <div 
            className="bg-amber-500 h-full transition-all duration-300 group-hover:bg-amber-400" 
            style={{ width: `${inProgress}%` }}
          />
        )}
        {needsAttention > 0 && (
          <div 
            className="bg-red-500 h-full transition-all duration-300 group-hover:bg-red-400" 
            style={{ width: `${needsAttention}%` }}
          />
        )}
        {total === 0 && (
          <div className={`h-full w-full transition-all duration-300 ${
            theme === 'light' ? 'bg-gray-300' : 'bg-gray-600'
          }`} />
        )}
      </div>
      
      <div className="absolute inset-0 flex items-center justify-center px-2 py-1">
        <span className={`font-medium text-xs drop-shadow-lg ${
          theme === 'light' ? 'text-gray-900' : 'text-white'
        }`}>
          {label} ({Math.round((completeCount / Math.max(total, 1)) * 100)}%)
        </span>
      </div>
    </button>
  );
};

// Metric Display Component
const MetricDisplay = ({ label, value, change, trend, className = "", subtitle = "", theme }) => (
  <div className={`border rounded-lg p-4 transition-all hover:shadow-md ${className} ${
    theme === 'light' 
      ? 'bg-white border-gray-200 hover:bg-gray-50' 
      : 'bg-gray-800/50 border-gray-700/50 hover:bg-gray-800/70'
  }`}>
    <div className="flex items-center justify-between mb-2">
      <span className={`text-sm font-medium tracking-wide ${
        theme === 'light' ? 'text-gray-600' : 'text-gray-400'
      }`}>{label}</span>
      {trend && (
        <div className={`flex items-center ${
          trend === 'up' ? 'text-emerald-500' : 
          trend === 'down' ? 'text-red-500' : 'text-amber-500'
        }`}>
          {trend === 'up' ? <TrendingUp size={16} /> : 
           trend === 'down' ? <TrendingDown size={16} /> : 
           <Circle size={16} />}
        </div>
      )}
    </div>
    <div className="flex items-end justify-between">
      <span className={`text-2xl font-bold font-mono ${
        theme === 'light' ? 'text-gray-900' : 'text-white'
      }`}>{value}</span>
      {change && (
        <span className={`text-sm font-mono ${
          change.startsWith('+') ? 'text-emerald-500' : 'text-red-500'
        }`}>
          {change}
        </span>
      )}
    </div>
    {subtitle && (
      <div className={`text-xs mt-1 ${
        theme === 'light' ? 'text-gray-500' : 'text-gray-500'
      }`}>{subtitle}</div>
    )}
  </div>
);

// Enhanced Progress Bar Component for Main Dashboard - Compact Version with Status Changes
const EnhancedProgressBar = ({ title, tasks, theme, clientName, taskType, onAssignmentChange, onStatusChange, twoColumns = false, allAdvisorOptions }) => {
  const [showInitialsInput, setShowInitialsInput] = useState(null); // Track which task is asking for initials
  const [tempInitials, setTempInitials] = useState('');

  const completedTasks = tasks.filter(task => task.status === 'Complete' && task.initials);
  const total = tasks.filter(task => task.status !== 'N/A').length;
  const completedPercentage = total > 0 ? (completedTasks.length / total) * 100 : 0;

  const handleTaskStatusChange = (taskKey, newStatus) => {
    if (newStatus === 'Complete') {
      setShowInitialsInput(taskKey);
      setTempInitials('');
    } else {
      onStatusChange && onStatusChange(taskKey, newStatus);
    }
  };

  const handleCompleteWithInitials = (taskKey) => {
    if (tempInitials.trim()) {
      onStatusChange && onStatusChange(taskKey, 'Complete', tempInitials.trim().toUpperCase());
      setShowInitialsInput(null);
      setTempInitials('');
    }
  };

  const cancelInitials = () => {
    setShowInitialsInput(null);
    setTempInitials('');
  };

  const getStatusIcon = (status, initials) => {
    if (status === 'Complete' && initials) {
      return <div className="w-2 h-2 rounded-full bg-emerald-500" />;
    } else if (status === 'In Progress') {
      return <div className="w-2 h-2 rounded-full bg-amber-500" />;
    } else if (status === 'Needs Attention') {
      return <div className="w-2 h-2 rounded-full bg-red-500" />;
    }
    return <div className="w-2 h-2 rounded-full bg-gray-400" />;
  };

  return (
    <div className={`p-2 rounded border ${
      theme === 'light' ? 'bg-gray-50 border-gray-200' : 'bg-gray-800/30 border-gray-600/50'
    }`}>
      <div className="flex items-center justify-between mb-1">
        <h6 className={`font-medium text-xs ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
          {title}
        </h6>
        <div className={`text-xs font-mono px-1.5 py-0.5 rounded ${
          completedPercentage === 100 ? 'bg-emerald-500/20 text-emerald-600' :
          completedPercentage >= 50 ? 'bg-amber-500/20 text-amber-600' :
          'bg-red-500/20 text-red-600'
        }`}>
          {Math.round(completedPercentage)}%
        </div>
      </div>
      
      {/* Compact Progress Bar */}
      <div className="relative h-1.5 bg-gray-200 rounded-full overflow-hidden mb-2">
        <div
          className="absolute left-0 top-0 h-full bg-gradient-to-r from-emerald-500 to-emerald-600 transition-all duration-300"
          style={{ width: `${completedPercentage}%` }}
        />
      </div>

      {/* Initials Input Modal */}
      {showInitialsInput && (
        <div className={`mb-2 p-2 rounded border ${
          theme === 'light' ? 'bg-blue-50 border-blue-200' : 'bg-blue-900/20 border-blue-800'
        }`}>
          <div className="text-xs font-medium mb-1">Enter initials:</div>
          <div className="flex space-x-1">
            <input
              type="text"
              value={tempInitials}
              onChange={(e) => setTempInitials(e.target.value.toUpperCase())}
              placeholder="AB"
              maxLength="3"
              className={`flex-1 border px-1 py-0.5 rounded text-xs outline-none ${
                theme === 'light' 
                  ? 'bg-white border-gray-300 text-gray-900' 
                  : 'bg-gray-800 border-gray-600 text-white'
              }`}
              onKeyPress={(e) => e.key === 'Enter' && handleCompleteWithInitials(showInitialsInput)}
              autoFocus
            />
            <button
              onClick={() => handleCompleteWithInitials(showInitialsInput)}
              disabled={!tempInitials.trim()}
              className="px-1 py-0.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white rounded text-xs transition-colors"
            >
              ✓
            </button>
            <button
              onClick={cancelInitials}
              className="px-1 py-0.5 bg-gray-600 hover:bg-gray-700 text-white rounded text-xs transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      )}
      
      {/* Compact Task List with Status Changes */}
      <div className={`space-y-1 ${twoColumns ? 'grid grid-cols-2 gap-x-3 gap-y-1' : ''}`}>
        {tasks.filter(task => task.status !== 'N/A').map((task, idx) => (
          <div key={idx} className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-1 flex-1 mr-2">
              {getStatusIcon(task.status, task.initials)}
              <span className={`text-xs ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`} style={{ fontSize: '10px' }}>
                {task.name}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              {/* Status Dropdown */}
              <select
                value={task.status}
                onChange={(e) => handleTaskStatusChange(task.key, e.target.value)}
                className={`text-xs px-1 py-0.5 rounded border cursor-pointer w-16 ${
                  theme === 'light' ? 'bg-white border-gray-300 text-gray-900' : 'bg-gray-700 border-gray-600 text-white'
                }`}
                style={{ fontSize: '10px' }}
              >
                <option value="Complete">Done</option>
                <option value="In Progress">Prog</option>
                <option value="Needs Attention">Need</option>
                <option value="N/A">N/A</option>
              </select>

              {/* Assignment Dropdown */}
              <select
                value={task.assignedTo || ''}
                onChange={(e) => onAssignmentChange && onAssignmentChange(task.key, e.target.value)}
                className={`text-xs px-1 py-0.5 rounded border cursor-pointer w-12 ${
                  theme === 'light' ? 'bg-white border-gray-300 text-blue-700' : 'bg-gray-700 border-gray-600 text-blue-400'
                }`}
                style={{ fontSize: '10px' }}
              >
                <option value="">—</option>
                {allAdvisorOptions.map(advisor => (
                  <option key={advisor} value={advisor}>{advisor}</option>
                ))}
              </select>
              
              {/* Compact Status Indicator */}
              {task.status === 'Complete' && task.initials && (
                <span className="px-1 py-0.5 bg-emerald-500/20 text-emerald-600 rounded font-mono font-bold" style={{ fontSize: '10px' }}>
                  {task.initials}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Task Card Component - Simplified and Fixed
const TaskCard = ({ title, description, status, onStatusChange, isOutsideAccounts = false, outsideAccounts = [], onAccountsChange, theme, initials = '', onInitialsChange, assignedTo = '' }) => {
  const [newAccountName, setNewAccountName] = useState('');
  const [showAddInput, setShowAddInput] = useState(false);
  const [showInitialsInput, setShowInitialsInput] = useState(false);
  const [tempInitials, setTempInitials] = useState('');

  const getStatusColor = (status, hasInitials = false) => {
    if (theme === 'light') {
      switch (status) {
        case 'Complete': 
          return hasInitials 
            ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
            : 'bg-amber-50 border-amber-200 text-amber-700';
        case 'In Progress': return 'bg-amber-50 border-amber-200 text-amber-700';
        case 'Needs Attention': return 'bg-red-50 border-red-200 text-red-700';
        case 'N/A': return 'bg-gray-50 border-gray-200 text-gray-600';
        default: return 'bg-gray-50 border-gray-200 text-gray-600';
      }
    } else {
      switch (status) {
        case 'Complete': 
          return hasInitials 
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
            : 'bg-amber-500/10 border-amber-500/30 text-amber-400';
        case 'In Progress': return 'bg-amber-500/10 border-amber-500/30 text-amber-400';
        case 'Needs Attention': return 'bg-red-500/10 border-red-500/30 text-red-400';
        case 'N/A': return 'bg-gray-600/10 border-gray-600/30 text-gray-400';
        default: return 'bg-gray-600/10 border-gray-600/30 text-gray-400';
      }
    }
  };

  const handleDirectStatusChange = (newStatus) => {
    if (newStatus === 'Complete') {
      setTempInitials('');
      setShowInitialsInput(true);
    } else {
      // For non-complete statuses, only call onStatusChange
      // Do NOT call onInitialsChange as that will set status back to Complete
      onStatusChange(newStatus);
    }
  };

  const handleCompleteWithInitials = () => {
    if (tempInitials.trim()) {
      onStatusChange('Complete');
      if (onInitialsChange) onInitialsChange(tempInitials.trim().toUpperCase());
      setShowInitialsInput(false);
      setTempInitials('');
    }
  };

  const cancelInitials = () => {
    setShowInitialsInput(false);
    setTempInitials('');
  };

  const addAccount = () => {
    if (newAccountName.trim() && onAccountsChange) {
      const newAccount = {
        id: Date.now(),
        name: newAccountName.trim(),
        status: 'no-access'
      };
      onAccountsChange([...outsideAccounts, newAccount]);
      setNewAccountName('');
      setShowAddInput(false);
    }
  };

  const hasValidInitials = status === 'Complete' && initials;

  return (
    <div className={`flex flex-col p-4 rounded-lg border min-h-[120px] ${getStatusColor(status, hasValidInitials)}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex-1">
          <div className="font-medium text-sm">{title}</div>
          <div className={`text-xs ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>{description}</div>
          {assignedTo && (
            <div className={`text-xs mt-1 ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`}>
              Assigned to: {assignedTo}
            </div>
          )}
        </div>
        <div className="text-right ml-4 space-y-2">
          <select 
            value={status}
            onChange={(e) => handleDirectStatusChange(e.target.value)}
            className={`border text-xs font-medium cursor-pointer px-2 py-1 rounded transition-colors ${
              theme === 'light' 
                ? 'bg-white border-gray-300 text-gray-900 hover:bg-gray-50' 
                : 'bg-gray-800 border-gray-600 text-white hover:bg-gray-700'
            }`}
          >
            <option value="Complete">Complete</option>
            <option value="In Progress">In Progress</option>
            <option value="Needs Attention">Needs Attention</option>
            <option value="N/A">N/A</option>
          </select>
          
          {hasValidInitials && (
            <div className="px-2 py-1 bg-emerald-500/20 text-emerald-600 rounded text-xs font-mono font-bold">
              ✓ {initials}
            </div>
          )}
        </div>
      </div>

      {/* Initials Input Modal */}
      {showInitialsInput && (
        <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded">
          <div className="text-sm font-medium mb-2">Enter your initials to complete this task:</div>
          <div className="flex space-x-2">
            <input
              type="text"
              value={tempInitials}
              onChange={(e) => setTempInitials(e.target.value.toUpperCase())}
              placeholder="e.g., AB"
              maxLength="3"
              className={`flex-1 border px-2 py-1 rounded text-sm outline-none ${
                theme === 'light' 
                  ? 'bg-white border-gray-300 text-gray-900' 
                  : 'bg-gray-800 border-gray-600 text-white'
              }`}
              onKeyPress={(e) => e.key === 'Enter' && handleCompleteWithInitials()}
              autoFocus
            />
            <button
              onClick={handleCompleteWithInitials}
              disabled={!tempInitials.trim()}
              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white rounded text-sm transition-colors"
            >
              Complete
            </button>
            <button
              onClick={cancelInitials}
              className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white rounded text-sm transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {isOutsideAccounts && (
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between">
            <h5 className={`text-xs font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Outside Accounts</h5>
            <button
              onClick={() => setShowAddInput(!showAddInput)}
              className="flex items-center space-x-1 px-2 py-1 bg-blue-600/20 hover:bg-blue-600/30 text-blue-500 rounded text-xs transition-colors"
            >
              <Plus size={12} />
              <span>Add Account</span>
            </button>
          </div>

          {showAddInput && (
            <div className="flex space-x-2">
              <input
                type="text"
                value={newAccountName}
                onChange={(e) => setNewAccountName(e.target.value)}
                placeholder="Account name..."
                className={`flex-1 border px-2 py-1 rounded text-xs outline-none ${
                  theme === 'light' 
                    ? 'bg-white border-gray-300 text-gray-900' 
                    : 'bg-gray-800 border-gray-600 text-white'
                }`}
                onKeyPress={(e) => e.key === 'Enter' && addAccount()}
                autoFocus
              />
              <button
                onClick={addAccount}
                className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs transition-colors"
              >
                Add
              </button>
            </div>
          )}

          <div className="space-y-2">
            {outsideAccounts.map((account) => (
              <div key={account.id} className={`flex items-center justify-between p-2 rounded border ${
                theme === 'light' 
                  ? 'bg-gray-50 border-gray-200' 
                  : 'bg-gray-700/30 border-gray-600/50'
              }`}>
                <span className={`text-xs font-medium ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                  {account.name}
                </span>
              </div>
            ))}
            {outsideAccounts.length === 0 && (
              <div className={`text-center py-4 text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-500'}`}>
                No outside accounts added yet
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Panel Component
const Panel = ({ title, children, className = "", tools = [], theme }) => (
  <div className={`border rounded-xl overflow-hidden ${className} ${
    theme === 'light' 
      ? 'bg-white border-gray-200' 
      : 'bg-gray-900/70 border-gray-700/50'
  }`}>
    <div className={`px-6 py-4 border-b ${
      theme === 'light' 
        ? 'bg-gray-50 border-gray-200' 
        : 'bg-gray-800/70 border-gray-700/50'
    }`}>
      <div className="flex items-center justify-between">
        <h3 className={`font-semibold tracking-wide ${
          theme === 'light' ? 'text-gray-900' : 'text-white'
        }`}>{title}</h3>
        {tools.length > 0 && (
          <div className="flex space-x-2">
            {tools.map((tool, idx) => (
              React.isValidElement(tool) ? (
                <div key={idx}>{tool}</div>
              ) : (
                <button
                  key={idx}
                  className={`text-xs px-3 py-1 rounded-md transition-colors ${
                    theme === 'light' 
                      ? 'text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200' 
                      : 'text-gray-400 hover:text-white bg-gray-700/50 hover:bg-gray-700'
                  }`}
                >
                  {tool}
                </button>
              )
            ))}
          </div>
        )}
      </div>
    </div>
    <div className="p-6">
      {children}
    </div>
  </div>
);

// View Button Component
const ViewButton = ({ active, onClick, children, icon, theme }) => (
  <button
    onClick={onClick}
    className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all ${
      active
        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
        : theme === 'light' 
          ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100' 
          : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
    }`}
  >
    {icon}
    <span>{children}</span>
  </button>
);

// Main Dashboard Component
export default function MindfulAssetPlanningDashboard() {
  const [activeView, setActiveView] = useState('organizer-prep');
  const [timeframe, setTimeframe] = useState('1D');
  const [isLive, setIsLive] = useState(true);
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [dataSource, setDataSource] = useState('mock');
  const [theme, setTheme] = useState('dark');

  // Add Meeting Modal
  const [showAddMeetingModal, setShowAddMeetingModal] = useState(false);
  const [newMeeting, setNewMeeting] = useState({
    meetingDate: '',
    client: '',
    clientService: 'Office',
    adv1: '',
    adv2: '',
    csrScore: '',
    fp: '1',
    inv: '1',
    postponed: 'N'
  });

  // Filter State
  const [showFilters, setShowFilters] = useState(false);
  const [showPrepStatus, setShowPrepStatus] = useState(false); // Toggle for prep status visibility
  const [filters, setFilters] = useState({
    hidePastMeetings: true, // Default to hiding past meetings
    next2Weeks: false,
    advisor1: '',
    advisor2: '',
    pastMeetings: '', // '', 'week', 'month', 'quarter', 'year'
  });

  // Organizer Prep State
  const [organizerPrepSection, setOrganizerPrepSection] = useState('main-dashboard');
  const [selectedClient, setSelectedClient] = useState(null);

  // Actions dropdown state
  const [openActionMenu, setOpenActionMenu] = useState(null);

  // Outside Accounts Management
  const [outsideAccounts, setOutsideAccounts] = useState([
    { id: 1, name: 'Fidelity 401k', status: 'have-access' },
    { id: 2, name: 'Charles Schwab IRA', status: 'requested-access' },
    { id: 3, name: 'Vanguard Roth IRA', status: 'no-access' }
  ]);

  // Helper function to determine default assignee for admin/organizer tasks
  const getDefaultAssignee = (advisor, taskType) => {
    // For MM and LR, assign to BD, AS, or PG instead
    if (advisor === 'MM' || advisor === 'LR') {
      return 'BD'; // Default to BD, could be rotated among BD, AS, PG
    }
    
    // For admin tasks, some have specific defaults
    if (taskType === 'greenFolderPrep') return 'JD';
    if (taskType === 'greenFolderPrinted') return 'MS';
    
    // For other admin and organizer tasks, use the advisor
    return advisor;
  };

  // Client-specific task statuses
  const [clientTaskStatuses, setClientTaskStatuses] = useState({
    'Johnson Family Trust': {
      greenFolderPrep: { status: 'Complete', initials: 'JD', assignedTo: 'JD' },
      greenFolderPrinted: { status: 'In Progress', initials: '', assignedTo: 'MS' },
      folderDelivered: { status: 'Needs Attention', initials: '', assignedTo: 'RJ' }, // RJ is Adv 2
      organizer: { status: 'Complete', initials: 'RJ', assignedTo: 'RJ' }, // RJ is Adv 2
      outsideAccounts: { status: 'Complete', initials: 'RJ', assignedTo: 'RJ' },
      morningstarUpdated: { status: 'Complete', initials: 'DF', assignedTo: 'DF' },
      outsideAccountsList: { status: 'In Progress', initials: '', assignedTo: 'RJ' },
      mstrUpdated: { status: 'Complete', initials: 'DF', assignedTo: 'DF' },
      keyReportsUpdated: { status: 'Complete', initials: 'DF', assignedTo: 'DF' },
      eqForms: { status: 'N/A', initials: '', assignedTo: '' },
      investmentDirection: { status: 'Complete', initials: 'MS', assignedTo: 'MS' },
      signoffPage: { status: 'In Progress', initials: '', assignedTo: 'MS' },
      reports: { status: 'Complete', initials: 'DF', assignedTo: 'DF' },
      savedToClientFile: { status: 'Needs Attention', initials: '', assignedTo: 'MS' }
    },
    'Williams & Associates LLC': {
      greenFolderPrep: { status: 'Complete', initials: 'JD', assignedTo: 'JD' },
      greenFolderPrinted: { status: 'Complete', initials: 'MS', assignedTo: 'MS' },
      folderDelivered: { status: 'In Progress', initials: '', assignedTo: 'AD' }, // AD is Adv 2
      organizer: { status: 'Complete', initials: 'AD', assignedTo: 'AD' }, // AD is Adv 2
      outsideAccounts: { status: 'In Progress', initials: '', assignedTo: 'AD' },
      morningstarUpdated: { status: 'Complete', initials: 'DF', assignedTo: 'DF' },
      outsideAccountsList: { status: 'Needs Attention', initials: '', assignedTo: 'AD' },
      mstrUpdated: { status: 'In Progress', initials: '', assignedTo: 'DF' },
      keyReportsUpdated: { status: 'Needs Attention', initials: '', assignedTo: 'DF' },
      eqForms: { status: 'Complete', initials: 'AD', assignedTo: 'AD' },
      investmentDirection: { status: 'In Progress', initials: '', assignedTo: 'DF' },
      signoffPage: { status: 'Complete', initials: 'DF', assignedTo: 'DF' },
      reports: { status: 'Complete', initials: 'DF', assignedTo: 'DF' },
      savedToClientFile: { status: 'Complete', initials: 'DF', assignedTo: 'DF' }
    },
    'Miller Retirement Planning': {
      greenFolderPrep: { status: 'In Progress', initials: '', assignedTo: 'JD' },
      greenFolderPrinted: { status: 'Needs Attention', initials: '', assignedTo: 'MS' },
      folderDelivered: { status: 'Needs Attention', initials: '', assignedTo: 'BD' }, // Default for MM exception
      organizer: { status: 'In Progress', initials: '', assignedTo: 'BD' }, // Default for MM exception  
      outsideAccounts: { status: 'Needs Attention', initials: '', assignedTo: 'BD' },
      morningstarUpdated: { status: 'Needs Attention', initials: '', assignedTo: 'DF' },
      outsideAccountsList: { status: 'Needs Attention', initials: '', assignedTo: 'BD' },
      mstrUpdated: { status: 'In Progress', initials: '', assignedTo: 'DF' },
      keyReportsUpdated: { status: 'Needs Attention', initials: '', assignedTo: 'DF' },
      eqForms: { status: 'N/A', initials: '', assignedTo: '' },
      investmentDirection: { status: 'Needs Attention', initials: '', assignedTo: 'MS' },
      signoffPage: { status: 'Needs Attention', initials: '', assignedTo: 'MS' },
      reports: { status: 'In Progress', initials: '', assignedTo: 'DF' },
      savedToClientFile: { status: 'In Progress', initials: '', assignedTo: 'MS' }
    }
  });

  // Global task statuses
  const [taskStatuses, setTaskStatuses] = useState({
    greenFolderPrep: { status: 'Complete', initials: 'JD', assignedTo: 'JD' },
    greenFolderPrinted: { status: 'In Progress', initials: '', assignedTo: 'MS' }, 
    folderDelivered: { status: 'Needs Attention', initials: '', assignedTo: 'MB' },
    organizer: { status: 'Complete', initials: 'GM', assignedTo: 'GM' },
    outsideAccounts: { status: 'In Progress', initials: '', assignedTo: 'GM' },
    morningstarUpdated: { status: 'Complete', initials: 'DF', assignedTo: 'DF' },
    outsideAccountsList: { status: 'Needs Attention', initials: '', assignedTo: 'GM' },
    mstrUpdated: { status: 'Complete', initials: 'DF', assignedTo: 'DF' },
    keyReportsUpdated: { status: 'In Progress', initials: '', assignedTo: 'DF' },
    eqForms: { status: 'N/A', initials: '', assignedTo: '' }
  });

  const updateTaskStatus = (taskKey, newStatus, newInitials = '') => {
    console.log('updateTaskStatus called:', { taskKey, newStatus, newInitials });
    
    setTaskStatuses(prev => {
      const updated = {
        ...prev,
        [taskKey]: {
          status: newStatus,
          // Clear initials if status is not Complete, otherwise use provided initials
          initials: newStatus === 'Complete' ? newInitials : '',
          assignedTo: prev[taskKey]?.assignedTo || ''
        }
      };
      console.log('Updated task status:', updated);
      return updated;
    });
  };

  const updateClientTaskStatus = (clientName, taskKey, newStatus, newInitials = '') => {
    console.log('updateClientTaskStatus called:', { clientName, taskKey, newStatus, newInitials });
    
    setClientTaskStatuses(prev => {
      const updated = {
        ...prev,
        [clientName]: {
          ...prev[clientName],
          [taskKey]: {
            status: newStatus,
            // Clear initials if status is not Complete, otherwise use provided initials
            initials: newStatus === 'Complete' ? newInitials : '',
            assignedTo: prev[clientName]?.[taskKey]?.assignedTo || ''
          }
        }
      };
      console.log('Updated state:', updated);
      return updated;
    });
  };

  // Calculate task breakdown
  const calculateTaskBreakdown = (clientName, taskType) => {
    const clientTasks = clientTaskStatuses[clientName];
    if (!clientTasks) return { 
      complete: 0, inProgress: 0, needsAttention: 0, total: 0, 
      completeCount: 0, inProgressCount: 0, needsAttentionCount: 0
    };

    let taskKeys = [];
    
    if (taskType === 'admin') {
      taskKeys = ['greenFolderPrep', 'greenFolderPrinted', 'folderDelivered'];
    } else if (taskType === 'organizer') {
      taskKeys = ['organizer', 'outsideAccounts', 'morningstarUpdated', 'outsideAccountsList', 'mstrUpdated', 'keyReportsUpdated', 'eqForms'];
    } else if (taskType === 'investment') {
      taskKeys = ['investmentDirection', 'signoffPage', 'reports', 'savedToClientFile'];
    }

    const taskStatuses = taskKeys
      .map(key => clientTasks[key]?.status || 'Needs Attention')
      .filter(status => status && status !== 'N/A');
    
    const total = taskStatuses.length;
    
    if (total === 0) return { 
      complete: 0, inProgress: 0, needsAttention: 0, total: 0,
      completeCount: 0, inProgressCount: 0, needsAttentionCount: 0
    };

    // Only count as complete if status is Complete AND has initials
    const completed = taskKeys.filter(key => {
      const task = clientTasks[key];
      return task?.status === 'Complete' && task?.initials;
    });
    const inProgress = taskStatuses.filter(status => status === 'In Progress');
    const needsAttention = taskStatuses.filter(status => status === 'Needs Attention');

    return {
      complete: Math.round((completed.length / total) * 100),
      inProgress: Math.round((inProgress.length / total) * 100),
      needsAttention: Math.round((needsAttention.length / total) * 100),
      total: total,
      completeCount: completed.length,
      inProgressCount: inProgress.length,
      needsAttentionCount: needsAttention.length
    };
  };

  // Get enhanced task data for progress bars
  const getEnhancedTaskData = (clientName, taskType) => {
    const clientTasks = clientTaskStatuses[clientName];
    if (!clientTasks) return [];

    const taskNameMapping = {
      admin: {
        greenFolderPrep: 'Green Folder Prep',
        greenFolderPrinted: 'Green Folder Printed', 
        folderDelivered: 'Folder Delivered'
      },
      organizer: {
        organizer: 'Organizer Assignment',
        outsideAccounts: 'Outside Accounts Verification',
        morningstarUpdated: 'Morningstar Data Update',
        outsideAccountsList: 'Outside Accounts List',
        mstrUpdated: 'MSTR System Update',
        keyReportsUpdated: 'Key Reports Generation',
        eqForms: 'EQ Forms Processing'
      },
      investment: {
        investmentDirection: 'Investment Direction',
        signoffPage: 'Sign-off Page',
        reports: 'Reports',
        savedToClientFile: 'Saved to Client File'
      }
    };

    const taskKeys = Object.keys(taskNameMapping[taskType] || {});
    
    return taskKeys.map(key => {
      const task = clientTasks[key] || { status: 'Needs Attention', initials: '', assignedTo: '' };
      return {
        key: key,
        name: taskNameMapping[taskType][key],
        status: task.status,
        initials: task.initials,
        assignedTo: task.assignedTo
      };
    });
  };

  // Handle assignment changes
  const handleAssignmentChange = (clientName, taskKey, newAssignee) => {
    setClientTaskStatuses(prev => ({
      ...prev,
      [clientName]: {
        ...prev[clientName],
        [taskKey]: {
          ...prev[clientName][taskKey],
          assignedTo: newAssignee
        }
      }
    }));
  };

  // Filter functions
  const applyFilters = (meetings) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of day for accurate comparison
    const twoWeeksFromNow = new Date(today.getTime() + (14 * 24 * 60 * 60 * 1000));
    
    return meetings.filter(meeting => {
      const meetingDate = new Date(meeting.meetingDate);
      meetingDate.setHours(0, 0, 0, 0);
      
      // Handle past meetings filter
      if (filters.pastMeetings) {
        let pastCutoff = new Date(today);
        switch (filters.pastMeetings) {
          case 'week':
            pastCutoff.setDate(today.getDate() - 7);
            break;
          case 'month':
            pastCutoff.setMonth(today.getMonth() - 1);
            break;
          case 'quarter':
            pastCutoff.setMonth(today.getMonth() - 3);
            break;
          case 'year':
            pastCutoff.setFullYear(today.getFullYear() - 1);
            break;
        }
        // Only show past meetings within the specified timeframe
        if (meetingDate >= today || meetingDate < pastCutoff) {
          return false;
        }
      } else {
        // Default behavior: hide past meetings unless explicitly showing them
        if (filters.hidePastMeetings && meetingDate < today) {
          return false;
        }
      }
      
      // Next 2 weeks filter
      if (filters.next2Weeks && (meetingDate < today || meetingDate > twoWeeksFromNow)) {
        return false;
      }
      
      // Advisor filters
      if (filters.advisor1 && meeting.adv1 !== filters.advisor1) {
        return false;
      }
      
      if (filters.advisor2 && meeting.adv2 !== filters.advisor2) {
        return false;
      }
      
      return true;
    });
  };

  const clearAllFilters = () => {
    setFilters({
      hidePastMeetings: true,
      next2Weeks: false,
      advisor1: '',
      advisor2: '',
      pastMeetings: ''
    });
  };

  const toggleNext2Weeks = () => {
    setFilters(prev => ({
      ...prev,
      next2Weeks: !prev.next2Weeks,
      hidePastMeetings: false,
      pastMeetings: ''
    }));
  };

  const setPastMeetingsFilter = (period) => {
    setFilters(prev => ({
      ...prev,
      pastMeetings: prev.pastMeetings === period ? '' : period,
      hidePastMeetings: false,
      next2Weeks: false
    }));
  };

  const showAllMeetings = () => {
    setFilters(prev => ({
      ...prev,
      hidePastMeetings: false,
      next2Weeks: false,
      pastMeetings: ''
    }));
  };

  const organizerPrepSections = [
    { id: 'main-dashboard', label: 'Upcoming Meetings', icon: <BarChart3 size={16} /> },
    { id: 'activities', label: 'Organizer Prep', icon: <TrendingUp size={16} /> },
    { id: 'complexity', label: 'FP/Inv Complexity', icon: <Activity size={16} /> }
  ];

  const [upcomingMeetings, setUpcomingMeetings] = useState([
    {
      id: 1,
      meetingDate: '2025-07-28',
      client: 'Johnson Family Trust',
      clientService: 'Office',
      adv1: 'MB',
      adv2: 'RJ',
      csrScore: '1.5',
      fp: '1',
      inv: '1',
      postponed: 'N',
      adminPrep: '75%',
      organizer: 'RJ', // RJ is Adv 2, assigned to organizer prep
      investmentOps: 'MS'
    },
    {
      id: 2,
      meetingDate: '2025-08-05',
      client: 'Williams & Associates LLC',
      clientService: 'Teams',
      adv1: 'DH',
      adv2: 'AD',
      csrScore: '2.8',
      fp: '1',
      inv: '1',
      postponed: 'Y',
      adminPrep: '40%',
      organizer: 'AD', // AD is Adv 2, assigned to organizer prep
      investmentOps: 'DF'
    },
    {
      id: 3,
      meetingDate: '2025-08-15',
      client: 'Miller Retirement Planning',
      clientService: 'Teams',
      adv1: 'RS',
      adv2: 'MM',
      csrScore: '2.25',
      fp: '3',
      inv: '1',
      postponed: 'Y',
      adminPrep: '20%',
      organizer: 'BD', // MM exception - assigned to BD instead
      investmentOps: 'MS'
    },
    // Past meetings for testing filters
    {
      id: 4,
      meetingDate: '2025-07-20',
      client: 'Smith Investment Group',
      clientService: 'Office',
      adv1: 'LR',
      adv2: 'GM',
      csrScore: '3.2',
      fp: '2',
      inv: '2',
      postponed: 'N',
      adminPrep: '100%',
      organizer: 'GM',
      investmentOps: 'MS'
    },
    {
      id: 5,
      meetingDate: '2025-06-15',
      client: 'Legacy Financial Trust',
      clientService: 'Teams',
      adv1: 'NA',
      adv2: 'AS',
      csrScore: '2.1',
      fp: '1',
      inv: '1',
      postponed: 'N',
      adminPrep: '100%',
      organizer: 'AS',
      investmentOps: 'DF'
    },
    {
      id: 6,
      meetingDate: '2025-04-10',
      client: 'Cornerstone Capital',
      clientService: 'Office',
      adv1: 'MB',
      adv2: 'BD',
      csrScore: '1.8',
      fp: '1',
      inv: '1',
      postponed: 'N',
      adminPrep: '100%',
      organizer: 'BD',
      investmentOps: 'MS'
    },
    {
      id: 7,
      meetingDate: '2024-12-05',
      client: 'Pioneer Wealth Management',
      clientService: 'Teams',
      adv1: 'DH',
      adv2: 'PG',
      csrScore: '2.7',
      fp: '2',
      inv: '1',
      postponed: 'N',
      adminPrep: '100%',
      organizer: 'PG',
      investmentOps: 'DF'
    }
  ]);

  const filteredAndSortedMeetings = applyFilters([...upcomingMeetings].sort((a, b) => {
    const dateA = new Date(a.meetingDate);
    const dateB = new Date(b.meetingDate);
    return dateA - dateB;
  }));

  const primaryAdvisorOptions = ['DH', 'LR', 'MB', 'NA', 'RS'];
  const secondaryAdvisorOptions = ['AD', 'AM', 'AS', 'BD', 'BL', 'GM', 'LR', 'MB', 'MM', 'PG', 'RJ'];
  const allAdvisorOptions = ['AD', 'AM', 'AS', 'BD', 'BL', 'DH', 'GM', 'LR', 'MB', 'MM', 'NA', 'NG', 'PG', 'RJ', 'RS', 'JD', 'MS', 'DF'];
  const locationOptions = ['Office', 'Teams', 'Phone', 'Offsite'];

  // Update meeting data
  const updateMeetingData = (meetingId, field, value) => {
    setUpcomingMeetings(prev => 
      prev.map(meeting => 
        meeting.id === meetingId ? { ...meeting, [field]: value } : meeting
      )
    );
  };

  // Remove meeting
  const removeMeeting = (meetingId) => {
    if (window.confirm('Are you sure you want to delete this meeting? This action cannot be undone.')) {
      setUpcomingMeetings(prev => prev.filter(meeting => meeting.id !== meetingId));
      setOpenActionMenu(null);
    }
  };

  // Postpone/Un-postpone meeting
  const togglePostponeMeeting = (meetingId) => {
    setUpcomingMeetings(prev => 
      prev.map(meeting => 
        meeting.id === meetingId 
          ? { ...meeting, postponed: meeting.postponed === 'Y' ? 'N' : 'Y' }
          : meeting
      )
    );
    setOpenActionMenu(null);
  };

  // Add new meeting
  const addNewMeeting = () => {
    if (!newMeeting.client || !newMeeting.meetingDate || !newMeeting.adv1) {
      alert('Please fill in Client Name, Meeting Date, and Primary Advisor');
      return;
    }

    const meeting = {
      id: Date.now(),
      ...newMeeting,
      adminPrep: '0%',
      organizer: getDefaultAssignee(newMeeting.adv2 || newMeeting.adv1, 'organizer'),
      investmentOps: newMeeting.adv1
    };

    setUpcomingMeetings(prev => [...prev, meeting]);
    
    // Initialize client task statuses for new meeting
    const defaultOrganizerAssignee = getDefaultAssignee(newMeeting.adv2 || newMeeting.adv1, 'organizer');
    
    setClientTaskStatuses(prev => ({
      ...prev,
      [newMeeting.client]: {
        greenFolderPrep: { status: 'Needs Attention', initials: '', assignedTo: getDefaultAssignee('', 'greenFolderPrep') },
        greenFolderPrinted: { status: 'Needs Attention', initials: '', assignedTo: getDefaultAssignee('', 'greenFolderPrinted') },
        folderDelivered: { status: 'Needs Attention', initials: '', assignedTo: defaultOrganizerAssignee },
        organizer: { status: 'Needs Attention', initials: '', assignedTo: defaultOrganizerAssignee },
        outsideAccounts: { status: 'Needs Attention', initials: '', assignedTo: defaultOrganizerAssignee },
        morningstarUpdated: { status: 'Needs Attention', initials: '', assignedTo: 'DF' },
        outsideAccountsList: { status: 'Needs Attention', initials: '', assignedTo: defaultOrganizerAssignee },
        mstrUpdated: { status: 'Needs Attention', initials: '', assignedTo: 'DF' },
        keyReportsUpdated: { status: 'Needs Attention', initials: '', assignedTo: 'DF' },
        eqForms: { status: 'N/A', initials: '', assignedTo: '' },
        investmentDirection: { status: 'Needs Attention', initials: '', assignedTo: 'MS' },
        signoffPage: { status: 'Needs Attention', initials: '', assignedTo: 'MS' },
        reports: { status: 'Needs Attention', initials: '', assignedTo: 'DF' },
        savedToClientFile: { status: 'Needs Attention', initials: '', assignedTo: 'MS' }
      }
    }));

    // Reset form
    setNewMeeting({
      meetingDate: '',
      client: '',
      clientService: 'Office',
      adv1: '',
      adv2: '',
      csrScore: '',
      fp: '1',
      inv: '1',
      postponed: 'N'
    });
    setShowAddMeetingModal(false);
  };

  const viewButtons = [
    { id: 'organizer-prep', label: 'Organizer Prep', icon: <Layers size={18} /> }
  ];

  const themeClasses = theme === 'light' 
    ? 'bg-gray-50 text-gray-900' 
    : 'bg-gray-950 text-white';

  const headerClasses = theme === 'light' 
    ? 'bg-white/80 border-gray-200' 
    : 'bg-gray-900/80 border-gray-700/50';

  const navClasses = theme === 'light' 
    ? 'bg-gray-100 border-gray-200' 
    : 'bg-gray-900/50 border-gray-700/50';

  const subNavClasses = theme === 'light' 
    ? 'bg-gray-200/50 border-gray-200' 
    : 'bg-gray-800/50 border-gray-700/50';

  const footerClasses = theme === 'light' 
    ? 'bg-gray-100 border-gray-200' 
    : 'bg-gray-900/50 border-gray-700/50';

  return (
    <div className={`h-screen flex flex-col overflow-hidden ${themeClasses}`} onClick={() => setOpenActionMenu(null)}>
      {/* Clean Header */}
      <header className={`backdrop-blur-sm border-b px-6 py-4 ${headerClasses}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                <BarChart3 size={20} className="text-white" />
              </div>
              <h1 className="text-xl font-bold">Mindful Asset Planning - Organizer Dashboard</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`} />
                <span className={`text-sm font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                  {loading ? 'LOADING' : isLive ? 'LIVE' : 'PAUSED'}
                </span>
                <span className={`text-xs px-2 py-1 rounded ${dataSource === 'live' ? 'bg-emerald-900 text-emerald-400' : 'bg-amber-900 text-amber-400'}`}>
                  {dataSource === 'live' ? 'REAL DATA' : 'MOCK DATA'}
                </span>
              </div>
              {lastUpdate && (
                <div className={`text-sm font-mono tabular-nums ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                  Updated: {lastUpdate.toLocaleTimeString()}
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <select 
              value={timeframe} 
              onChange={(e) => setTimeframe(e.target.value)}
              className={`border px-3 py-2 rounded-lg font-medium transition-colors ${
                theme === 'light' 
                  ? 'bg-white border-gray-300 text-gray-900 hover:bg-gray-50' 
                  : 'bg-gray-800 border-gray-600 text-white hover:bg-gray-700'
              }`}
            >
              <option value="1D">1 Day</option>
              <option value="5D">5 Days</option>
              <option value="1M">1 Month</option>
              <option value="3M">3 Months</option>
              <option value="1Y">1 Year</option>
            </select>
            <button 
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                theme === 'light' 
                  ? 'bg-gray-200 hover:bg-gray-300 text-gray-700' 
                  : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
              }`}
            >
              {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
            </button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className={`border-b px-6 py-4 ${navClasses}`}>
        <div className="flex space-x-2">
          {viewButtons.map((btn) => (
            <ViewButton
              key={btn.id}
              active={activeView === btn.id}
              onClick={() => setActiveView(btn.id)}
              icon={btn.icon}
              theme={theme}
            >
              {btn.label}
            </ViewButton>
          ))}
        </div>
      </nav>

      {/* Organizer Prep Sub-Navigation */}
      {activeView === 'organizer-prep' && (
        <nav className={`border-b px-6 py-3 ${subNavClasses}`}>
          <div className="flex space-x-2">
            {organizerPrepSection === 'client-specific-prep' ? (
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => {
                    setOrganizerPrepSection('main-dashboard');
                    setSelectedClient(null);
                  }}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all text-sm ${
                    theme === 'light' 
                      ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100' 
                      : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                  }`}
                >
                  <span>← Back to Dashboard</span>
                </button>
                <div className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-sm bg-blue-600 text-white shadow-lg shadow-blue-600/20">
                  <Layers size={16} />
                  <span>{selectedClient?.client} - Admin Prep</span>
                </div>
              </div>
            ) : organizerPrepSection === 'client-organizer-prep' ? (
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => {
                    setOrganizerPrepSection('main-dashboard');
                    setSelectedClient(null);
                  }}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all text-sm ${
                    theme === 'light' 
                      ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100' 
                      : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                  }`}
                >
                  <span>← Back to Dashboard</span>
                </button>
                <div className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-sm bg-purple-600 text-white shadow-lg shadow-purple-600/20">
                  <TrendingUp size={16} />
                  <span>{selectedClient?.client} - Organizer Prep</span>
                </div>
              </div>
            ) : organizerPrepSection === 'client-investment-ops' ? (
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => {
                    setOrganizerPrepSection('main-dashboard');
                    setSelectedClient(null);
                  }}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all text-sm ${
                    theme === 'light' 
                      ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100' 
                      : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                  }`}
                >
                  <span>← Back to Dashboard</span>
                </button>
                <div className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-sm bg-emerald-600 text-white shadow-lg shadow-emerald-600/20">
                  <Target size={16} />
                  <span>{selectedClient?.client} - Investment Ops Prep</span>
                </div>
              </div>
            ) : (
              organizerPrepSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setOrganizerPrepSection(section.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all text-sm ${
                    organizerPrepSection === section.id
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                      : theme === 'light' 
                        ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100' 
                        : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                  }`}
                >
                  {section.icon}
                  <span>{section.label}</span>
                </button>
              ))
            )}
          </div>
        </nav>
      )}

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        <main className="flex-1 p-6 overflow-y-auto">
          {activeView === 'organizer-prep' && (
            <div className="space-y-6">
              {organizerPrepSection === 'main-dashboard' && (
                <>
                  <div className="grid grid-cols-4 gap-6">
                    <MetricDisplay 
                      label="Total Meetings" 
                      value="47" 
                      change="+3" 
                      trend="up"
                      theme={theme}
                    />
                    <MetricDisplay 
                      label="Completed" 
                      value="23" 
                      change="+5" 
                      trend="up"
                      theme={theme}
                    />
                    <MetricDisplay 
                      label="In Progress" 
                      value="18" 
                      change="-2" 
                      trend="down"
                      theme={theme}
                    />
                    <MetricDisplay 
                      label="Pending" 
                      value="6" 
                      change="0" 
                      trend="neutral"
                      theme={theme}
                    />
                  </div>

                  {(() => {
                    const getPanelTitle = () => {
                      if (filters.pastMeetings) {
                        const period = filters.pastMeetings;
                        return `Past ${period.charAt(0).toUpperCase() + period.slice(1)} Meetings - Master Dashboard`;
                      } else if (filters.next2Weeks) {
                        return 'Next 2 Weeks Meetings - Master Dashboard';
                      } else if (!filters.hidePastMeetings && !filters.pastMeetings) {
                        return 'All Meetings - Master Dashboard';
                      } else {
                        return 'Upcoming Meetings - Master Dashboard';
                      }
                    };
                    
                    return (
                      <Panel title={getPanelTitle()} tools={[
                    <button
                      key="toggle-prep"
                      onClick={() => setShowPrepStatus(!showPrepStatus)}
                      className={`text-xs px-3 py-1 rounded-md font-medium transition-colors ${
                        showPrepStatus
                          ? 'bg-purple-600 text-white'
                          : theme === 'light'
                            ? 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                            : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                      }`}
                    >
                      {showPrepStatus ? 'Hide Prep Status' : 'Show Prep Status'}
                    </button>,
                    <button
                      key="next-2-weeks"
                      onClick={toggleNext2Weeks}
                      className={`text-xs px-3 py-1 rounded-md font-medium transition-colors ${
                        filters.next2Weeks
                          ? 'bg-blue-600 text-white'
                          : theme === 'light'
                            ? 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                            : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                      }`}
                    >
                      Next 2 Weeks
                    </button>,
                    <button
                      key="all-meetings"
                      onClick={showAllMeetings}
                      className={`text-xs px-3 py-1 rounded-md font-medium transition-colors ${
                        !filters.hidePastMeetings && !filters.pastMeetings && !filters.next2Weeks
                          ? 'bg-green-600 text-white'
                          : theme === 'light'
                            ? 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                            : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                      }`}
                    >
                      Show All
                    </button>,
                    <div key="past-filters" className="flex space-x-1">
                      <button
                        onClick={() => setPastMeetingsFilter('week')}
                        className={`text-xs px-2 py-1 rounded-md font-medium transition-colors ${
                          filters.pastMeetings === 'week'
                            ? 'bg-orange-600 text-white'
                            : theme === 'light'
                              ? 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                              : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                        }`}
                      >
                        Past Week
                      </button>
                      <button
                        onClick={() => setPastMeetingsFilter('month')}
                        className={`text-xs px-2 py-1 rounded-md font-medium transition-colors ${
                          filters.pastMeetings === 'month'
                            ? 'bg-orange-600 text-white'
                            : theme === 'light'
                              ? 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                              : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                        }`}
                      >
                        Past Month
                      </button>
                      <button
                        onClick={() => setPastMeetingsFilter('quarter')}
                        className={`text-xs px-2 py-1 rounded-md font-medium transition-colors ${
                          filters.pastMeetings === 'quarter'
                            ? 'bg-orange-600 text-white'
                            : theme === 'light'
                              ? 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                              : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                        }`}
                      >
                        Past Quarter
                      </button>
                      <button
                        onClick={() => setPastMeetingsFilter('year')}
                        className={`text-xs px-2 py-1 rounded-md font-medium transition-colors ${
                          filters.pastMeetings === 'year'
                            ? 'bg-orange-600 text-white'
                            : theme === 'light'
                              ? 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                              : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                        }`}
                      >
                        Past Year
                      </button>
                    </div>,
                    <button
                      key="clear-filters"
                      onClick={clearAllFilters}
                      className={`text-xs px-3 py-1 rounded-md font-medium transition-colors ${
                        Object.values(filters).some(f => f && f !== true && f !== '')
                          ? 'bg-red-600 text-white hover:bg-red-700'
                          : theme === 'light'
                            ? 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                            : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                      }`}
                    >
                      Clear Filters
                    </button>,
                    'Export', 
                    <button
                      key="add-meeting"
                      onClick={() => setShowAddMeetingModal(true)}
                      className="text-blue-500 hover:text-blue-600 transition-colors text-xs px-3 py-1"
                    >
                      Add Meeting
                    </button>
                  ]} theme={theme}>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className={theme === 'light' ? 'bg-gray-100' : 'bg-gray-800/50'}>
                          <tr>
                            <th className={`text-left p-2 font-medium text-xs ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Meeting Date</th>
                            <th className={`text-left p-2 font-medium text-xs ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Client</th>
                            <th className={`text-left p-2 font-medium text-xs ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Location</th>
                            <th className={`text-left p-2 font-medium text-xs ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Adv 1</th>
                            <th className={`text-left p-2 font-medium text-xs ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Adv 2</th>
                            <th className={`text-left p-2 font-medium text-xs ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>CSR Score</th>
                            <th className={`text-left p-2 font-medium text-xs ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>FP</th>
                            <th className={`text-left p-2 font-medium text-xs ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Inv</th>
                            <th className={`text-left p-2 font-medium text-xs ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Admin Prep</th>
                            <th className={`text-left p-2 font-medium text-xs ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Organizer Prep</th>
                            <th className={`text-left p-2 font-medium text-xs ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Investment Ops Prep</th>
                            <th className={`text-left p-2 font-medium text-xs ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredAndSortedMeetings.length === 0 ? (
                            <tr>
                              <td colSpan="12" className={`text-center py-8 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                                {Object.values(filters).some(f => f && f !== '') 
                                  ? 'No meetings match the current filters' 
                                  : 'No meetings found'}
                              </td>
                            </tr>
                          ) : (
                            filteredAndSortedMeetings.map((meeting) => (
                              <React.Fragment key={meeting.id}>
                                {/* Main Meeting Row */}
                                <tr className={`border-t transition-colors ${
                                  meeting.postponed === 'Y' 
                                    ? theme === 'light' 
                                      ? 'bg-blue-50 border-blue-200 hover:bg-blue-100' 
                                      : 'bg-blue-900/20 border-blue-800/50 hover:bg-blue-900/30'
                                    : theme === 'light' 
                                      ? 'border-gray-200 hover:bg-gray-50' 
                                      : 'border-gray-700/50 hover:bg-gray-800/30'
                                }`}>
                                  <td className="p-2">
                                    <DropdownDatePicker
                                      value={meeting.meetingDate}
                                      onChange={(value) => updateMeetingData(meeting.id, 'meetingDate', value)}
                                      theme={theme}
                                    />
                                  </td>
                                  <td className={`p-2 font-medium text-xs ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                                    <div className="flex items-center space-x-2">
                                      <span>{meeting.client}</span>
                                      {meeting.postponed === 'Y' && (
                                        <span className="px-1.5 py-0.5 bg-blue-600/20 text-blue-600 rounded text-xs font-medium">
                                          POSTPONED
                                        </span>
                                      )}
                                    </div>
                                  </td>
                                  <td className="p-2">
                                    <select
                                      value={meeting.clientService}
                                      onChange={(e) => updateMeetingData(meeting.id, 'clientService', e.target.value)}
                                      className={`border text-xs cursor-pointer px-2 py-1 rounded transition-all outline-none ${
                                        theme === 'light' 
                                          ? 'bg-white border-gray-300 text-gray-900 hover:bg-gray-50' 
                                          : 'bg-gray-800 border-gray-600 text-white hover:bg-gray-700'
                                      }`}
                                    >
                                      {locationOptions.map(location => (
                                        <option key={location} value={location}>{location}</option>
                                      ))}
                                    </select>
                                  </td>
                                  <td className="p-2">
                                    <select
                                      value={meeting.adv1}
                                      onChange={(e) => updateMeetingData(meeting.id, 'adv1', e.target.value)}
                                      className={`border text-xs cursor-pointer px-2 py-1 rounded transition-all outline-none ${
                                        theme === 'light' 
                                          ? 'bg-white border-gray-300 text-gray-900 hover:bg-gray-50' 
                                          : 'bg-gray-800 border-gray-600 text-white hover:bg-gray-700'
                                      }`}
                                    >
                                      <option value="">—</option>
                                      {primaryAdvisorOptions.map(advisor => (
                                        <option key={advisor} value={advisor}>{advisor}</option>
                                      ))}
                                    </select>
                                  </td>
                                  <td className="p-2">
                                    <select
                                      value={meeting.adv2}
                                      onChange={(e) => updateMeetingData(meeting.id, 'adv2', e.target.value)}
                                      className={`border text-xs cursor-pointer px-2 py-1 rounded transition-all outline-none ${
                                        theme === 'light' 
                                          ? 'bg-white border-gray-300 text-gray-900 hover:bg-gray-50' 
                                          : 'bg-gray-800 border-gray-600 text-white hover:bg-gray-700'
                                      }`}
                                    >
                                      <option value="">—</option>
                                      {secondaryAdvisorOptions.map(advisor => (
                                        <option key={advisor} value={advisor}>{advisor}</option>
                                      ))}
                                    </select>
                                  </td>
                                  <td className={`p-2 font-mono text-xs ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>{meeting.csrScore}</td>
                                  <td className={`p-2 font-mono text-xs ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>{meeting.fp}</td>
                                  <td className={`p-2 font-mono text-xs ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>{meeting.inv}</td>
                                  <td className="p-2">
                                    <ProgressBarButton
                                      label="Admin"
                                      breakdown={calculateTaskBreakdown(meeting.client, 'admin')}
                                      onClick={() => {
                                        setSelectedClient(meeting);
                                        setOrganizerPrepSection('client-specific-prep');
                                      }}
                                      className="w-full min-w-[80px] h-8"
                                      theme={theme}
                                    />
                                  </td>
                                  <td className="p-2">
                                    <ProgressBarButton
                                      label={meeting.organizer}
                                      breakdown={calculateTaskBreakdown(meeting.client, 'organizer')}
                                      onClick={() => {
                                        setSelectedClient(meeting);
                                        setOrganizerPrepSection('client-organizer-prep');
                                      }}
                                      className="w-full min-w-[80px] h-8"
                                      theme={theme}
                                    />
                                  </td>
                                  <td className="p-2">
                                    <ProgressBarButton
                                      label={meeting.investmentOps}
                                      breakdown={calculateTaskBreakdown(meeting.client, 'investment')}
                                      onClick={() => {
                                        setSelectedClient(meeting);
                                        setOrganizerPrepSection('client-investment-ops');
                                      }}
                                      className="w-full min-w-[80px] h-8"
                                      theme={theme}
                                    />
                                  </td>
                                  <td className="p-2">
                                    <ActionsDropdown
                                      meeting={meeting}
                                      isOpen={openActionMenu === meeting.id}
                                      onToggle={() => setOpenActionMenu(openActionMenu === meeting.id ? null : meeting.id)}
                                      onDelete={removeMeeting}
                                      onPostpone={togglePostponeMeeting}
                                      theme={theme}
                                    />
                                  </td>
                                </tr>
                                
                                {/* Enhanced Progress Bars Row - Only show when toggled on */}
                                {showPrepStatus && (
                                  <tr className={`${
                                    meeting.postponed === 'Y'
                                      ? theme === 'light' 
                                        ? 'bg-blue-100/50' 
                                        : 'bg-blue-900/10'
                                      : theme === 'light' 
                                        ? 'bg-gray-50' 
                                        : 'bg-gray-800/20'
                                  }`}>
                                    <td colSpan="12" className="p-3">
                                      <div className="grid grid-cols-4 gap-3">
                                        <EnhancedProgressBar
                                          title="Admin Prep"
                                          tasks={getEnhancedTaskData(meeting.client, 'admin')}
                                          theme={theme}
                                          clientName={meeting.client}
                                          taskType="admin"
                                          allAdvisorOptions={allAdvisorOptions}
                                          onAssignmentChange={(taskKey, assignee) => handleAssignmentChange(meeting.client, taskKey, assignee)}
                                          onStatusChange={(taskKey, newStatus, newInitials) => updateClientTaskStatus(meeting.client, taskKey, newStatus, newInitials)}
                                        />
                                        <div className="col-span-2">
                                          <EnhancedProgressBar
                                            title="Organizer Prep"
                                            tasks={getEnhancedTaskData(meeting.client, 'organizer')}
                                            theme={theme}
                                            clientName={meeting.client}
                                            taskType="organizer"
                                            twoColumns={true}
                                            allAdvisorOptions={allAdvisorOptions}
                                            onAssignmentChange={(taskKey, assignee) => handleAssignmentChange(meeting.client, taskKey, assignee)}
                                            onStatusChange={(taskKey, newStatus, newInitials) => updateClientTaskStatus(meeting.client, taskKey, newStatus, newInitials)}
                                          />
                                        </div>
                                        <EnhancedProgressBar
                                          title="Investment Ops"
                                          tasks={getEnhancedTaskData(meeting.client, 'investment')}
                                          theme={theme}
                                          clientName={meeting.client}
                                          taskType="investment"
                                          allAdvisorOptions={allAdvisorOptions}
                                          onAssignmentChange={(taskKey, assignee) => handleAssignmentChange(meeting.client, taskKey, assignee)}
                                          onStatusChange={(taskKey, newStatus, newInitials) => updateClientTaskStatus(meeting.client, taskKey, newStatus, newInitials)}
                                        />
                                      </div>
                                    </td>
                                  </tr>
                                )}
                              </React.Fragment>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </Panel>
                    );
                  })()}
                </>
              )}

              {/* Client-Specific Admin Prep Section */}
              {organizerPrepSection === 'client-specific-prep' && selectedClient && (
                <>
                  <div className="grid grid-cols-4 gap-6">
                    <MetricDisplay 
                      label="Client" 
                      value={selectedClient.client} 
                      subtitle={`Meeting: ${selectedClient.meetingDate}`}
                      theme={theme}
                    />
                    <MetricDisplay 
                      label="Admin Prep Status" 
                      value={selectedClient.adminPrep} 
                      change="In Progress" 
                      trend="up"
                      theme={theme}
                    />
                    <MetricDisplay 
                      label="Primary Advisor" 
                      value={selectedClient.adv1} 
                      subtitle={selectedClient.adv2 ? `Co-Advisor: ${selectedClient.adv2}` : 'Single Advisor'}
                      theme={theme}
                    />
                    <div className={`border rounded-lg p-4 ${
                      theme === 'light' ? 'bg-white border-gray-200' : 'bg-gray-800/50 border-gray-700/50'
                    }`}>
                      <button
                        onClick={() => {
                          setOrganizerPrepSection('main-dashboard');
                          setSelectedClient(null);
                        }}
                        className={`w-full px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
                          theme === 'light' 
                            ? 'bg-gray-200 hover:bg-gray-300 text-gray-700' 
                            : 'bg-gray-700 hover:bg-gray-600 text-white'
                        }`}
                      >
                        ← Back to Dashboard
                      </button>
                    </div>
                  </div>

                  <Panel title={`${selectedClient.client} - Admin Prep Tasks`} tools={['Add Task', 'Export', 'Print']} theme={theme}>
                    <div className="space-y-4">
                      <h4 className="text-blue-500 font-medium text-lg">Admin Prep Tasks - {selectedClient.client}</h4>
                      <div className="grid grid-cols-1 gap-4">
                        <TaskCard 
                          title="Green Folder Prep"
                          description={`3-4 weeks before meeting date - ${selectedClient.meetingDate}`}
                          status={clientTaskStatuses[selectedClient.client]?.greenFolderPrep?.status || 'Needs Attention'}
                          initials={clientTaskStatuses[selectedClient.client]?.greenFolderPrep?.initials || ''}
                          assignedTo={clientTaskStatuses[selectedClient.client]?.greenFolderPrep?.assignedTo || ''}
                          onStatusChange={(status) => updateClientTaskStatus(selectedClient.client, 'greenFolderPrep', status)}
                          onInitialsChange={(initials) => updateClientTaskStatus(selectedClient.client, 'greenFolderPrep', 'Complete', initials)}
                          theme={theme}
                        />
                        
                        <TaskCard 
                          title="Green Folder Printed"
                          description={`${selectedClient.clientService} meeting - Ready for pickup`}
                          status={clientTaskStatuses[selectedClient.client]?.greenFolderPrinted?.status || 'Needs Attention'}
                          initials={clientTaskStatuses[selectedClient.client]?.greenFolderPrinted?.initials || ''}
                          assignedTo={clientTaskStatuses[selectedClient.client]?.greenFolderPrinted?.assignedTo || ''}
                          onStatusChange={(status) => updateClientTaskStatus(selectedClient.client, 'greenFolderPrinted', status)}
                          onInitialsChange={(initials) => updateClientTaskStatus(selectedClient.client, 'greenFolderPrinted', 'Complete', initials)}
                          theme={theme}
                        />
                        
                        <TaskCard 
                          title={`Folder Delivered To: ${selectedClient.adv1}`}
                          description="Delivery to primary advisor"
                          status={clientTaskStatuses[selectedClient.client]?.folderDelivered?.status || 'Needs Attention'}
                          initials={clientTaskStatuses[selectedClient.client]?.folderDelivered?.initials || ''}
                          assignedTo={clientTaskStatuses[selectedClient.client]?.folderDelivered?.assignedTo || ''}
                          onStatusChange={(status) => updateClientTaskStatus(selectedClient.client, 'folderDelivered', status)}
                          onInitialsChange={(initials) => updateClientTaskStatus(selectedClient.client, 'folderDelivered', 'Complete', initials)}
                          theme={theme}
                        />
                      </div>
                    </div>
                  </Panel>
                </>
              )}

              {/* Client-Specific Organizer Prep Section */}
              {organizerPrepSection === 'client-organizer-prep' && selectedClient && (
                <>
                  <div className="grid grid-cols-4 gap-6">
                    <MetricDisplay 
                      label="Client" 
                      value={selectedClient.client} 
                      subtitle={`Meeting: ${selectedClient.meetingDate}`}
                      theme={theme}
                    />
                    <MetricDisplay 
                      label="Organizer Progress" 
                      value="85%" 
                      change="In Progress" 
                      trend="up"
                      theme={theme}
                    />
                    <MetricDisplay 
                      label="Assigned Organizer" 
                      value={selectedClient.organizer} 
                      subtitle={selectedClient.adv2 ? `Co-Advisor: ${selectedClient.adv2}` : 'Single Advisor'}
                      theme={theme}
                    />
                    <div className={`border rounded-lg p-4 ${
                      theme === 'light' ? 'bg-white border-gray-200' : 'bg-gray-800/50 border-gray-700/50'
                    }`}>
                      <button
                        onClick={() => {
                          setOrganizerPrepSection('main-dashboard');
                          setSelectedClient(null);
                        }}
                        className={`w-full px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
                          theme === 'light' 
                            ? 'bg-gray-200 hover:bg-gray-300 text-gray-700' 
                            : 'bg-gray-700 hover:bg-gray-600 text-white'
                        }`}
                      >
                        ← Back to Dashboard
                      </button>
                    </div>
                  </div>

                  <Panel title={`${selectedClient.client} - Organizer Preparation Tasks`} tools={['Add Task', 'Export', 'Print']} theme={theme}>
                    <div className="space-y-4">
                      <h4 className="text-purple-500 font-medium text-lg">Organizer Tasks - {selectedClient.client}</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <TaskCard 
                          title="Organizer Assignment"
                          description={`Assigned to ${selectedClient.organizer}`}
                          status={clientTaskStatuses[selectedClient.client]?.organizer?.status || 'Needs Attention'}
                          initials={clientTaskStatuses[selectedClient.client]?.organizer?.initials || ''}
                          assignedTo={clientTaskStatuses[selectedClient.client]?.organizer?.assignedTo || ''}
                          onStatusChange={(status) => updateClientTaskStatus(selectedClient.client, 'organizer', status)}
                          onInitialsChange={(initials) => updateClientTaskStatus(selectedClient.client, 'organizer', 'Complete', initials)}
                          theme={theme}
                        />
                        
                        <TaskCard 
                          title="Outside Accounts Verification"
                          description="Account access verification"
                          status={clientTaskStatuses[selectedClient.client]?.outsideAccounts?.status || 'Needs Attention'}
                          initials={clientTaskStatuses[selectedClient.client]?.outsideAccounts?.initials || ''}
                          assignedTo={clientTaskStatuses[selectedClient.client]?.outsideAccounts?.assignedTo || ''}
                          onStatusChange={(status) => updateClientTaskStatus(selectedClient.client, 'outsideAccounts', status)}
                          onInitialsChange={(initials) => updateClientTaskStatus(selectedClient.client, 'outsideAccounts', 'Complete', initials)}
                          theme={theme}
                        />
                        
                        <TaskCard 
                          title="Morningstar Data Update"
                          description="Portfolio data refresh"
                          status={clientTaskStatuses[selectedClient.client]?.morningstarUpdated?.status || 'Needs Attention'}
                          initials={clientTaskStatuses[selectedClient.client]?.morningstarUpdated?.initials || ''}
                          assignedTo={clientTaskStatuses[selectedClient.client]?.morningstarUpdated?.assignedTo || ''}
                          onStatusChange={(status) => updateClientTaskStatus(selectedClient.client, 'morningstarUpdated', status)}
                          onInitialsChange={(initials) => updateClientTaskStatus(selectedClient.client, 'morningstarUpdated', 'Complete', initials)}
                          theme={theme}
                        />
                        
                        <TaskCard 
                          title="Outside Accounts List"
                          description="Client account submission"
                          status={clientTaskStatuses[selectedClient.client]?.outsideAccountsList?.status || 'Needs Attention'}
                          initials={clientTaskStatuses[selectedClient.client]?.outsideAccountsList?.initials || ''}
                          assignedTo={clientTaskStatuses[selectedClient.client]?.outsideAccountsList?.assignedTo || ''}
                          onStatusChange={(status) => updateClientTaskStatus(selectedClient.client, 'outsideAccountsList', status)}
                          onInitialsChange={(initials) => updateClientTaskStatus(selectedClient.client, 'outsideAccountsList', 'Complete', initials)}
                          isOutsideAccounts={true}
                          outsideAccounts={outsideAccounts}
                          onAccountsChange={setOutsideAccounts}
                          theme={theme}
                        />
                        
                        <TaskCard 
                          title="MSTR System Update"
                          description="Portfolio management system sync"
                          status={clientTaskStatuses[selectedClient.client]?.mstrUpdated?.status || 'Needs Attention'}
                          initials={clientTaskStatuses[selectedClient.client]?.mstrUpdated?.initials || ''}
                          assignedTo={clientTaskStatuses[selectedClient.client]?.mstrUpdated?.assignedTo || ''}
                          onStatusChange={(status) => updateClientTaskStatus(selectedClient.client, 'mstrUpdated', status)}
                          onInitialsChange={(initials) => updateClientTaskStatus(selectedClient.client, 'mstrUpdated', 'Complete', initials)}
                          theme={theme}
                        />
                        
                        <TaskCard 
                          title="Key Reports Generation"
                          description="Performance and allocation reports"
                          status={clientTaskStatuses[selectedClient.client]?.keyReportsUpdated?.status || 'Needs Attention'}
                          initials={clientTaskStatuses[selectedClient.client]?.keyReportsUpdated?.initials || ''}
                          assignedTo={clientTaskStatuses[selectedClient.client]?.keyReportsUpdated?.assignedTo || ''}
                          onStatusChange={(status) => updateClientTaskStatus(selectedClient.client, 'keyReportsUpdated', status)}
                          onInitialsChange={(initials) => updateClientTaskStatus(selectedClient.client, 'keyReportsUpdated', 'Complete', initials)}
                          theme={theme}
                        />
                        
                        <TaskCard 
                          title="EQ Forms Processing"
                          description="Equity allocation forms"
                          status={clientTaskStatuses[selectedClient.client]?.eqForms?.status || 'N/A'}
                          initials={clientTaskStatuses[selectedClient.client]?.eqForms?.initials || ''}
                          assignedTo={clientTaskStatuses[selectedClient.client]?.eqForms?.assignedTo || ''}
                          onStatusChange={(status) => updateClientTaskStatus(selectedClient.client, 'eqForms', status)}
                          onInitialsChange={(initials) => updateClientTaskStatus(selectedClient.client, 'eqForms', 'Complete', initials)}
                          theme={theme}
                        />
                      </div>
                    </div>
                  </Panel>
                </>
              )}

              {/* Client-Specific Investment Ops Section */}
              {organizerPrepSection === 'client-investment-ops' && selectedClient && (
                <>
                  <div className="grid grid-cols-4 gap-6">
                    <MetricDisplay 
                      label="Client" 
                      value={selectedClient.client} 
                      subtitle={`Meeting: ${selectedClient.meetingDate}`}
                      theme={theme}
                    />
                    <MetricDisplay 
                      label="Investment Ops Progress" 
                      value="92%" 
                      change="In Progress" 
                      trend="up"
                      theme={theme}
                    />
                    <MetricDisplay 
                      label="Assigned Ops" 
                      value={selectedClient.investmentOps} 
                      subtitle={selectedClient.adv2 ? `Co-Advisor: ${selectedClient.adv2}` : 'Single Advisor'}
                      theme={theme}
                    />
                    <div className={`border rounded-lg p-4 ${
                      theme === 'light' ? 'bg-white border-gray-200' : 'bg-gray-800/50 border-gray-700/50'
                    }`}>
                      <button
                        onClick={() => {
                          setOrganizerPrepSection('main-dashboard');
                          setSelectedClient(null);
                        }}
                        className={`w-full px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
                          theme === 'light' 
                            ? 'bg-gray-200 hover:bg-gray-300 text-gray-700' 
                            : 'bg-gray-700 hover:bg-gray-600 text-white'
                        }`}
                      >
                        ← Back to Dashboard
                      </button>
                    </div>
                  </div>

                  <Panel title={`${selectedClient.client} - Investment Operations Prep Tasks`} tools={['Add Task', 'Export', 'Print']} theme={theme}>
                    <div className="space-y-4">
                      <h4 className="text-emerald-500 font-medium text-lg">Investment Ops Tasks - {selectedClient.client}</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <TaskCard 
                          title="Investment Direction"
                          description="Investment strategy and direction"
                          status={clientTaskStatuses[selectedClient.client]?.investmentDirection?.status || 'Needs Attention'}
                          initials={clientTaskStatuses[selectedClient.client]?.investmentDirection?.initials || ''}
                          assignedTo={clientTaskStatuses[selectedClient.client]?.investmentDirection?.assignedTo || ''}
                          onStatusChange={(status) => updateClientTaskStatus(selectedClient.client, 'investmentDirection', status)}
                          onInitialsChange={(initials) => updateClientTaskStatus(selectedClient.client, 'investmentDirection', 'Complete', initials)}
                          theme={theme}
                        />
                        
                        <TaskCard 
                          title="Sign-off Page"
                          description="Client sign-off and approval"
                          status={clientTaskStatuses[selectedClient.client]?.signoffPage?.status || 'Needs Attention'}
                          initials={clientTaskStatuses[selectedClient.client]?.signoffPage?.initials || ''}
                          assignedTo={clientTaskStatuses[selectedClient.client]?.signoffPage?.assignedTo || ''}
                          onStatusChange={(status) => updateClientTaskStatus(selectedClient.client, 'signoffPage', status)}
                          onInitialsChange={(initials) => updateClientTaskStatus(selectedClient.client, 'signoffPage', 'Complete', initials)}
                          theme={theme}
                        />
                        
                        <TaskCard 
                          title="Reports"
                          description="Generate investment reports"
                          status={clientTaskStatuses[selectedClient.client]?.reports?.status || 'Needs Attention'}
                          initials={clientTaskStatuses[selectedClient.client]?.reports?.initials || ''}
                          assignedTo={clientTaskStatuses[selectedClient.client]?.reports?.assignedTo || ''}
                          onStatusChange={(status) => updateClientTaskStatus(selectedClient.client, 'reports', status)}
                          onInitialsChange={(initials) => updateClientTaskStatus(selectedClient.client, 'reports', 'Complete', initials)}
                          theme={theme}
                        />
                        
                        <TaskCard 
                          title="Saved to Client File"
                          description="Archive completed materials"
                          status={clientTaskStatuses[selectedClient.client]?.savedToClientFile?.status || 'Needs Attention'}
                          initials={clientTaskStatuses[selectedClient.client]?.savedToClientFile?.initials || ''}
                          assignedTo={clientTaskStatuses[selectedClient.client]?.savedToClientFile?.assignedTo || ''}
                          onStatusChange={(status) => updateClientTaskStatus(selectedClient.client, 'savedToClientFile', status)}
                          onInitialsChange={(initials) => updateClientTaskStatus(selectedClient.client, 'savedToClientFile', 'Complete', initials)}
                          theme={theme}
                        />
                      </div>
                    </div>
                  </Panel>
                </>
              )}

              {/* FP/Inv Complexity Section */}
              {organizerPrepSection === 'complexity' && (
                <Panel title="Financial Planning & Investment Complexity Dashboard" tools={['Analyze', 'Export']} theme={theme}>
                  <div className="grid grid-cols-3 gap-6 mb-6">
                    <MetricDisplay 
                      label="Client Complexity Score" 
                      value="7.2/10" 
                      change="+0.1" 
                      trend="up"
                      theme={theme}
                    />
                    <MetricDisplay 
                      label="Regulatory Complexity" 
                      value="High" 
                      change="Stable" 
                      trend="neutral"
                      theme={theme}
                    />
                    <MetricDisplay 
                      label="Portfolio Complexity" 
                      value="Medium" 
                      change="+0.3" 
                      trend="up"
                      theme={theme}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-6">
                    <div>
                      <h4 className={`font-medium mb-4 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Client Complexity Trends</h4>
                      <div className="space-y-4">
                        <div className="space-y-1 text-sm">
                          <div className={`flex justify-between py-2 border-b ${
                            theme === 'light' ? 'border-gray-200' : 'border-gray-800/50'
                          }`}>
                            <span className={`font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>High Net Worth Clients</span>
                            <div className="flex items-center space-x-3">
                              <span className={`font-mono ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>24%</span>
                              <div className="w-2 h-2 rounded-full bg-amber-400" />
                            </div>
                          </div>
                          <div className={`flex justify-between py-2 border-b ${
                            theme === 'light' ? 'border-gray-200' : 'border-gray-800/50'
                          }`}>
                            <span className={`font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Complex Structures</span>
                            <div className="flex items-center space-x-3">
                              <span className={`font-mono ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>12%</span>
                              <div className="w-2 h-2 rounded-full bg-amber-400" />
                            </div>
                          </div>
                          <div className={`flex justify-between py-2 border-b last:border-0 ${
                            theme === 'light' ? 'border-gray-200' : 'border-gray-800/50'
                          }`}>
                            <span className={`font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Alternative Investments</span>
                            <div className="flex items-center space-x-3">
                              <span className={`font-mono ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>18%</span>
                              <div className="w-2 h-2 rounded-full bg-amber-400" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className={`font-medium mb-4 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Regulatory Complexity</h4>
                      <div className="space-y-4">
                        <div className="space-y-1 text-sm">
                          <div className={`flex justify-between py-2 border-b ${
                            theme === 'light' ? 'border-gray-200' : 'border-gray-800/50'
                          }`}>
                            <span className={`font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>ERISA Plans</span>
                            <div className="flex items-center space-x-3">
                              <span className={`font-mono ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>8 clients</span>
                              <div className="w-2 h-2 rounded-full bg-red-400" />
                            </div>
                          </div>
                          <div className={`flex justify-between py-2 border-b ${
                            theme === 'light' ? 'border-gray-200' : 'border-gray-800/50'
                          }`}>
                            <span className={`font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Institutional</span>
                            <div className="flex items-center space-x-3">
                              <span className={`font-mono ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>3 clients</span>
                              <div className="w-2 h-2 rounded-full bg-amber-400" />
                            </div>
                          </div>
                          <div className={`flex justify-between py-2 border-b last:border-0 ${
                            theme === 'light' ? 'border-gray-200' : 'border-gray-800/50'
                          }`}>
                            <span className={`font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>International Assets</span>
                            <div className="flex items-center space-x-3">
                              <span className={`font-mono ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>15%</span>
                              <div className="w-2 h-2 rounded-full bg-red-400" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className={`font-medium mb-4 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Portfolio Complexity</h4>
                      <div className="space-y-4">
                        <div className="space-y-1 text-sm">
                          <div className={`flex justify-between py-2 border-b ${
                            theme === 'light' ? 'border-gray-200' : 'border-gray-800/50'
                          }`}>
                            <span className={`font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Options Strategies</span>
                            <div className="flex items-center space-x-3">
                              <span className={`font-mono ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>22%</span>
                              <div className="w-2 h-2 rounded-full bg-amber-400" />
                            </div>
                          </div>
                          <div className={`flex justify-between py-2 border-b ${
                            theme === 'light' ? 'border-gray-200' : 'border-gray-800/50'
                          }`}>
                            <span className={`font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Volatility Products</span>
                            <div className="flex items-center space-x-3">
                              <span className={`font-mono ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>8%</span>
                              <div className="w-2 h-2 rounded-full bg-amber-400" />
                            </div>
                          </div>
                          <div className={`flex justify-between py-2 border-b last:border-0 ${
                            theme === 'light' ? 'border-gray-200' : 'border-gray-800/50'
                          }`}>
                            <span className={`font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Private Markets</span>
                            <div className="flex items-center space-x-3">
                              <span className={`font-mono ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>5%</span>
                              <div className="w-2 h-2 rounded-full bg-emerald-400" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Panel>
              )}

              {/* Activities Section */}
              {organizerPrepSection === 'activities' && (
                <Panel title="Recent Preparation Activities" tools={['Add Task', 'Filter', 'Export']} theme={theme}>
                  <div className="space-y-6">
                    <div className="grid grid-cols-4 gap-6">
                      <MetricDisplay 
                        label="Admin Prep" 
                        value="3" 
                        change="Tasks" 
                        trend="up"
                        theme={theme}
                      />
                      <MetricDisplay 
                        label="Organizer Prep" 
                        value="7" 
                        change="Tasks" 
                        trend="neutral"
                        theme={theme}
                      />
                      <MetricDisplay 
                        label="Needs Attention" 
                        value="2" 
                        change="Tasks" 
                        trend="down"
                        theme={theme}
                      />
                      <MetricDisplay 
                        label="Percent Complete" 
                        value="78%" 
                        change="8/10" 
                        trend="up"
                        theme={theme}
                      />
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-purple-500 font-medium text-lg">All Organizer Prep Tasks</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <TaskCard 
                          title="Organizer Assignment"
                          description="Assigned to DH"
                          status={taskStatuses.organizer?.status || 'Needs Attention'}
                          initials={taskStatuses.organizer?.initials || ''}
                          assignedTo={taskStatuses.organizer?.assignedTo || ''}
                          onStatusChange={(status) => updateTaskStatus('organizer', status)}
                          onInitialsChange={(initials) => updateTaskStatus('organizer', 'Complete', initials)}
                          theme={theme}
                        />
                        
                        <TaskCard 
                          title="Outside Accounts Verification"
                          description="Account verification"
                          status={taskStatuses.outsideAccounts?.status || 'Needs Attention'}
                          initials={taskStatuses.outsideAccounts?.initials || ''}
                          assignedTo={taskStatuses.outsideAccounts?.assignedTo || ''}
                          onStatusChange={(status) => updateTaskStatus('outsideAccounts', status)}
                          onInitialsChange={(initials) => updateTaskStatus('outsideAccounts', 'Complete', initials)}
                          theme={theme}
                        />
                        
                        <TaskCard 
                          title="Morningstar Updated"
                          description="Data refresh complete"
                          status={taskStatuses.morningstarUpdated?.status || 'Needs Attention'}
                          initials={taskStatuses.morningstarUpdated?.initials || ''}
                          assignedTo={taskStatuses.morningstarUpdated?.assignedTo || ''}
                          onStatusChange={(status) => updateTaskStatus('morningstarUpdated', status)}
                          onInitialsChange={(initials) => updateTaskStatus('morningstarUpdated', 'Complete', initials)}
                          theme={theme}
                        />
                        
                        <TaskCard 
                          title="List of Outside Accounts"
                          description="Client submission pending"
                          status={taskStatuses.outsideAccountsList?.status || 'Needs Attention'}
                          initials={taskStatuses.outsideAccountsList?.initials || ''}
                          assignedTo={taskStatuses.outsideAccountsList?.assignedTo || ''}
                          onStatusChange={(status) => updateTaskStatus('outsideAccountsList', status)}
                          onInitialsChange={(initials) => updateTaskStatus('outsideAccountsList', 'Complete', initials)}
                          isOutsideAccounts={true}
                          outsideAccounts={outsideAccounts}
                          onAccountsChange={setOutsideAccounts}
                          theme={theme}
                        />
                        
                        <TaskCard 
                          title="MSTR Updated"
                          description="System sync complete"
                          status={taskStatuses.mstrUpdated?.status || 'Needs Attention'}
                          initials={taskStatuses.mstrUpdated?.initials || ''}
                          assignedTo={taskStatuses.mstrUpdated?.assignedTo || ''}
                          onStatusChange={(status) => updateTaskStatus('mstrUpdated', status)}
                          onInitialsChange={(initials) => updateTaskStatus('mstrUpdated', 'Complete', initials)}
                          theme={theme}
                        />
                        
                        <TaskCard 
                          title="Key Reports Updated"
                          description="Performance reports pending"
                          status={taskStatuses.keyReportsUpdated?.status || 'Needs Attention'}
                          initials={taskStatuses.keyReportsUpdated?.initials || ''}
                          assignedTo={taskStatuses.keyReportsUpdated?.assignedTo || ''}
                          onStatusChange={(status) => updateTaskStatus('keyReportsUpdated', status)}
                          onInitialsChange={(initials) => updateTaskStatus('keyReportsUpdated', 'Complete', initials)}
                          theme={theme}
                        />
                      </div>
                    </div>
                  </div>
                </Panel>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Add Meeting Modal */}
      {showAddMeetingModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className={`rounded-xl border p-6 w-full max-w-md mx-4 ${
            theme === 'light' 
              ? 'bg-white border-gray-200' 
              : 'bg-gray-900 border-gray-700'
          }`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className={`text-xl font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Add New Meeting</h3>
              <button
                onClick={() => setShowAddMeetingModal(false)}
                className={`transition-colors ${theme === 'light' ? 'text-gray-600 hover:text-gray-900' : 'text-gray-400 hover:text-white'}`}
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-1 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Client Name *</label>
                <input
                  type="text"
                  value={newMeeting.client}
                  onChange={(e) => setNewMeeting({...newMeeting, client: e.target.value})}
                  className={`w-full border px-3 py-2 rounded-lg outline-none ${
                    theme === 'light' 
                      ? 'bg-white border-gray-300 text-gray-900' 
                      : 'bg-gray-800 border-gray-600 text-white'
                  }`}
                  placeholder="Enter client name"
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-1 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Meeting Date *</label>
                <input
                  type="date"
                  value={newMeeting.meetingDate}
                  onChange={(e) => setNewMeeting({...newMeeting, meetingDate: e.target.value})}
                  className={`w-full border px-3 py-2 rounded-lg outline-none ${
                    theme === 'light' 
                      ? 'bg-white border-gray-300 text-gray-900' 
                      : 'bg-gray-800 border-gray-600 text-white'
                  }`}
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-1 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Primary Advisor *</label>
                <select
                  value={newMeeting.adv1}
                  onChange={(e) => setNewMeeting({...newMeeting, adv1: e.target.value})}
                  className={`w-full border px-3 py-2 rounded-lg outline-none ${
                    theme === 'light' 
                      ? 'bg-white border-gray-300 text-gray-900' 
                      : 'bg-gray-800 border-gray-600 text-white'
                  }`}
                >
                  <option value="">Select Advisor</option>
                  {primaryAdvisorOptions.map(advisor => (
                    <option key={advisor} value={advisor}>{advisor}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-1 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Secondary Advisor</label>
                <select
                  value={newMeeting.adv2}
                  onChange={(e) => setNewMeeting({...newMeeting, adv2: e.target.value})}
                  className={`w-full border px-3 py-2 rounded-lg outline-none ${
                    theme === 'light' 
                      ? 'bg-white border-gray-300 text-gray-900' 
                      : 'bg-gray-800 border-gray-600 text-white'
                  }`}
                >
                  <option value="">Select Advisor (Optional)</option>
                  {secondaryAdvisorOptions.map(advisor => (
                    <option key={advisor} value={advisor}>{advisor}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowAddMeetingModal(false)}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                  theme === 'light' 
                    ? 'bg-gray-200 hover:bg-gray-300 text-gray-700' 
                    : 'bg-gray-700 hover:bg-gray-600 text-white'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={addNewMeeting}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                Add Meeting
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clean Footer */}
      <footer className={`border-t px-6 py-3 ${footerClasses}`}>
        <div className="flex justify-between items-center text-sm">
          <div className={`flex items-center space-x-6 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
            <span>Market: <span className="text-emerald-500">OPEN</span></span>
            <span>P&L: <span className="text-emerald-500 font-mono">+$1,247.83</span></span>
            <span>Risk: <span className="text-amber-500">MEDIUM</span></span>
          </div>
          <div className={theme === 'light' ? 'text-gray-500' : 'text-gray-500'}>
            Mindful Asset Planning v2.1.0
          </div>
        </div>
      </footer>
    </div>
  );
}
                        