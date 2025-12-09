import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Building2, 
  Map as MapIcon, 
  Euro, 
  TrendingUp, 
  BrickWall, 
  Calculator, 
  PieChart as PieIcon, 
  Sparkles,
  AlertCircle,
  Download,
  LandPlot,
  Scale,
  Hammer,
  Wallet,
  Activity,
  Layers,
  MapPin,
  ImagePlus,
  Wand2,
  AlertTriangle,
  Upload,
  Moon,
  Sun,
  RotateCcw,
  Save,
  Trash2,
  FolderOpen,
  X,
  CheckCircle,
  XCircle,
  User,
  Phone,
  ArrowUpRight,
  Copy,
  Lock,
  LogOut,
  ArrowRight,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie
} from 'recharts';

import { ProjectInputs, CalculationResults, AIAnalysisState, DesignState, SavedProject } from './types';
import { analyzeInvestment, generateDesignVisualization, estimatePlotPrice } from './services/geminiService';
import { saveProject, getProjects, deleteProject } from './services/firebase';
import { InputCard } from './components/InputCard';
import { StatCard } from './components/StatCard';

// --- Helper Components ---

const NotificationBanner = ({ message, type, onClose }: { message: string, type: 'success' | 'error', onClose: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed bottom-4 right-4 z-[300] flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border transition-all animate-in slide-in-from-bottom-5 fade-in ${
      type === 'success' 
        ? 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-900/90 dark:border-emerald-800 dark:text-emerald-100' 
        : 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/90 dark:border-red-800 dark:text-red-100'
    }`}>
      {type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
      <span className="font-medium text-sm">{message}</span>
      <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100">
        <X size={16} />
      </button>
    </div>
  );
};

const LoginScreen = ({ onLogin }: { onLogin: () => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // --- CREDENTIALS CONFIGURATION ---
  // 1. Vercel / Production:
  //    Go to Vercel Dashboard > Settings > Environment Variables
  //    Add ADMIN_EMAIL and ADMIN_PASSWORD
  //
  // 2. Local Fallback (for development or if env vars are missing):
  //    These are the default credentials you requested.
  //    The app prioritizes the environment variables if they exist.
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'sakis@post.com';
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'sakis1964';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.toLowerCase() === ADMIN_EMAIL.toLowerCase() && password === ADMIN_PASSWORD) {
      onLogin();
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4 transition-colors duration-300">
      <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        <div className="bg-blue-900 p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10" 
               style={{backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '20px 20px'}}></div>
          <div className="relative z-10 flex flex-col items-center">
            <div className="bg-white/10 p-4 rounded-2xl mb-4 backdrop-blur-sm border border-white/20">
              <Building2 size={48} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Domos</h1>
            <p className="text-blue-200 mt-2 font-medium">Greek Property Calculator</p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Email Address</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-900 dark:focus:ring-blue-500 outline-none transition-all text-slate-900 dark:text-white"
                placeholder="Enter your email"
                autoFocus
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-900 dark:focus:ring-blue-500 outline-none transition-all text-slate-900 dark:text-white"
                placeholder="Enter your password"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300 text-sm font-medium rounded-lg flex items-center gap-2 border border-red-100 dark:border-red-800">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <button 
            type="submit"
            className="w-full py-3 bg-blue-900 dark:bg-blue-600 hover:bg-blue-950 dark:hover:bg-blue-700 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            Sign In to Dashboard
            <ArrowRight size={18} />
          </button>
        </form>
        <div className="px-8 pb-6 text-center">
            <p className="text-xs text-slate-400 dark:text-slate-500">
                Protected Access • Authorized Personnel Only
            </p>
        </div>
      </div>
    </div>
  );
};

const CircleIndicator = ({ percentage, colorClass, label, icon: Icon, valueText }: any) => {
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(percentage, 100) / 100) * circumference;
  
  return (
    <div className="flex flex-col items-center p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-all flex-1">
      <div className="relative w-24 h-24 mb-2">
        {/* Background Circle */}
        <svg className="w-full h-full transform -rotate-90">
          <circle cx="48" cy="48" r={radius} className="stroke-slate-100 dark:stroke-slate-700" strokeWidth="8" fill="transparent" />
          {/* Progress Circle */}
          <circle 
            cx="48" cy="48" r={radius} 
            stroke="currentColor" 
            strokeWidth="8" 
            fill="transparent" 
            strokeDasharray={circumference} 
            strokeDashoffset={strokeDashoffset} 
            strokeLinecap="round"
            className={`${colorClass} transition-all duration-1000 ease-out`} 
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-600 dark:text-slate-400">
           {Icon && <Icon size={20} className="mb-0.5 opacity-60" />}
           <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{valueText || `${Math.round(percentage)}%`}</span>
        </div>
      </div>
      <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider text-center">{label}</span>
    </div>
  );
};

const StrengthGauge = ({ margin }: { margin: number }) => {
  // Mapping logic: 
  // Map realistic Greek construction margins (-5% to 35%) to a 0-100 visual scale.
  const minMargin = -5;
  const maxMargin = 35;
  const range = maxMargin - minMargin;
  
  // Calculate relative percentage (0 to 100) for the bar position
  const rawPercentage = ((margin - minMargin) / range) * 100;
  // Clamp between 0 and 100
  const percentage = Math.min(100, Math.max(0, rawPercentage));

  let label = "Critical";
  let labelColor = "text-red-500";

  // Dynamic Text Logic
  if (margin >= 25) {
      label = "Excellent";
      labelColor = "text-emerald-700 dark:text-emerald-400";
  } else if (margin >= 18) {
      label = "Very Good";
      labelColor = "text-green-700 dark:text-green-400";
  } else if (margin >= 12) {
      label = "Good";
      labelColor = "text-lime-600 dark:text-lime-400";
  } else if (margin >= 5) {
      label = "Moderate";
      labelColor = "text-amber-600 dark:text-amber-400";
  } else {
      label = "High Risk";
      labelColor = "text-red-600 dark:text-red-400";
  }

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col justify-center h-full transition-colors">
      {/* Top Labels Row */}
      <div className="flex justify-between items-end mb-3 relative">
         <span className="text-xs font-medium text-slate-400 w-24">Risk (0%)</span>
         <div className="text-center flex-1">
            <span className={`text-2xl font-bold ${labelColor} tracking-tight`}>{label}</span>
         </div>
         <span className="text-xs font-medium text-slate-400 w-24 text-right">Opp. (100%)</span>
      </div>
      
      {/* Bar Container */}
      <div className="relative h-12 flex items-center select-none">
        {/* Gradient Bar */}
        <div className="h-6 w-full rounded-full relative shadow-inner"
             style={{
               background: 'linear-gradient(90deg, #ef4444 0%, #f97316 35%, #eab308 50%, #84cc16 75%, #22c55e 100%)',
             }}
        >
            {/* Black Pill Marker */}
            <div
                className="absolute top-1/2 -translate-y-1/2 w-4 h-10 bg-slate-900 dark:bg-slate-100 rounded-full shadow-xl transition-all duration-700 ease-out border-[3px] border-white dark:border-slate-800 cursor-pointer group z-10"
                style={{ left: `calc(${percentage}% - 8px)` }}
            >
                {/* Tooltip on hover */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900 text-xs font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg pointer-events-none">
                    {margin.toFixed(1)}%
                    <div className="absolute top-100 left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800 dark:border-t-slate-200"></div>
                </div>
            </div>
        </div>
      </div>

      {/* Bottom Scale */}
      <div className="flex justify-between text-xs font-medium text-slate-400 px-0.5 mt-1">
          <span>0</span>
          <span>25</span>
          <span>50</span>
          <span>75</span>
          <span>100</span>
      </div>
    </div>
  );
};

const RiskBar = ({ margin }: { margin: number }) => {
  // Risk Logic:
  // If Margin >= 30%, Risk is 0% (Minimal).
  // If Margin <= 0%, Risk is 100% (Critical).
  const calculateRisk = (m: number) => {
    if (m >= 30) return 0;
    if (m <= 0) return 100;
    return 100 - (m / 30) * 100;
  };

  const risk = calculateRisk(margin);
  
  // Ensure we always show at least a small bar (5%) so the color is visible
  const visualWidth = Math.max(risk, 5);

  let barColor = "bg-red-500";
  let statusText = "Critical";
  let statusColor = "text-red-600 dark:text-red-400";

  if (risk < 10) {
      barColor = "bg-emerald-500";
      statusText = "Minimal";
      statusColor = "text-emerald-600 dark:text-emerald-400";
  } else if (risk < 30) {
      barColor = "bg-green-500";
      statusText = "Low";
      statusColor = "text-green-600 dark:text-green-400";
  } else if (risk < 60) {
      barColor = "bg-amber-500";
      statusText = "Moderate";
      statusColor = "text-amber-600 dark:text-amber-400";
  } else if (risk < 80) {
      barColor = "bg-orange-500";
      statusText = "High";
      statusColor = "text-orange-600 dark:text-orange-400";
  }

  return (
    <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col justify-center transition-colors">
      <div className="flex justify-between items-center mb-2">
         <div className="flex items-center gap-2">
            <AlertTriangle size={18} className={risk > 50 ? "text-red-500" : "text-amber-500"} />
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Estimated Risk Level</span>
         </div>
         <span className={`text-lg font-bold ${statusColor}`}>
           {Math.round(risk)}% <span className="text-xs font-medium opacity-80">({statusText})</span>
         </span>
      </div>
      
      <div className="h-4 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden relative">
         <div 
            className={`h-full ${barColor} transition-all duration-1000 ease-out relative`}
            style={{ width: `${visualWidth}%` }}
         >
           {/* Pattern overlay for texture */}
           <div className="absolute inset-0 opacity-20" style={{backgroundImage: 'linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent)', backgroundSize: '1rem 1rem'}}></div>
         </div>
      </div>
      <div className="flex justify-between mt-1.5 text-[10px] text-slate-400 font-medium uppercase tracking-wider">
        <span>Low</span>
        <span>Moderate</span>
        <span>Critical</span>
      </div>
    </div>
  );
};

// Default values for initial load
const INITIAL_INPUTS: ProjectInputs = {
  location: "Athens, Greece",
  ownerNotes: "",
  plotSize: 500,
  plotPrice: 150000,
  buildingCoefficient: 0.8, // Default Factor
  constructionCostPerSqm: 1800,
  salePricePerSqm: 4200,
  miscCostsPercent: 5, // Default buffer for taxes/permits
};

// Empty values for "Clear" action
const EMPTY_INPUTS: ProjectInputs = {
  location: "",
  ownerNotes: "",
  plotSize: 0,
  plotPrice: 0,
  buildingCoefficient: 0,
  constructionCostPerSqm: 0,
  salePricePerSqm: 0,
  miscCostsPercent: 0,
};

const App: React.FC = () => {
  // --- State ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [inputs, setInputs] = useState<ProjectInputs>(INITIAL_INPUTS);
  const [savedProjects, setSavedProjects] = useState<SavedProject[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);
  
  // UI States
  const [notification, setNotification] = useState<{message: string, type: 'success'|'error'} | null>(null);
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [duplicateWarningOpen, setDuplicateWarningOpen] = useState(false);
  const [deleteConfirmationId, setDeleteConfirmationId] = useState<string | null>(null);
  const [saveProjectName, setSaveProjectName] = useState("");

  const [aiState, setAiState] = useState<AIAnalysisState>({
    loading: false,
    content: null,
    error: null,
  });

  const [designState, setDesignState] = useState<DesignState>({
    originalImage: null,
    generatedImage: null,
    prompt: "Add a modern mediterranean villa with a pool and garden",
    loading: false,
    error: null
  });

  const [isEstimatingPrice, setIsEstimatingPrice] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'breakdown' | 'design'>('overview');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Effects ---
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Load projects from Firebase on mount
  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoadingProjects(true);
      try {
        const projects = await getProjects();
        setSavedProjects(projects);
      } catch (error) {
        console.error("Failed to load projects:", error);
      } finally {
        setIsLoadingProjects(false);
      }
    };
    fetchProjects();
  }, []);

  // --- Calculations ---
  const results: CalculationResults = useMemo(() => {
    // New Logic: Max Buildable Area = Plot Size * Coefficient
    const maxBuildableArea = inputs.plotSize * inputs.buildingCoefficient;

    const constructionCostBase = maxBuildableArea * inputs.constructionCostPerSqm;
    const miscCosts = (constructionCostBase + inputs.plotPrice) * (inputs.miscCostsPercent / 100);
    
    const constructionCostTotal = constructionCostBase;
    const constructionCostTotalInclPlot = inputs.plotPrice + constructionCostBase + miscCosts;
    
    const revenueTotal = maxBuildableArea * inputs.salePricePerSqm;
    const profitTotal = revenueTotal - constructionCostTotalInclPlot;
    
    const profitMargin = revenueTotal > 0 ? (profitTotal / revenueTotal) * 100 : 0;
    const roi = constructionCostTotalInclPlot > 0 ? (profitTotal / constructionCostTotalInclPlot) * 100 : 0;

    const costPerSqmInclPlot = maxBuildableArea > 0 
      ? constructionCostTotalInclPlot / maxBuildableArea 
      : 0;

    return {
      maxBuildableArea,
      constructionCostTotal,
      constructionCostTotalInclPlot,
      costPerSqmInclPlot,
      revenueTotal,
      profitTotal,
      profitMargin,
      roi,
      miscCostsValue: miscCosts
    };
  }, [inputs]);

  // --- Derived Percentages for Graphics ---
  const percentages = useMemo(() => {
    const total = results.constructionCostTotalInclPlot || 1;
    return {
      plot: (inputs.plotPrice / total) * 100,
      construction: (results.constructionCostTotal / total) * 100,
      misc: (results.miscCostsValue / total) * 100
    };
  }, [inputs, results]);

  // --- Handlers ---
  const handleInputChange = (field: keyof ProjectInputs, value: number | string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
    // Reset AI analysis when data changes to ensure freshness
    if (aiState.content) {
      setAiState(prev => ({ ...prev, content: null, error: null }));
    }
  };

  const handleReset = () => {
    setInputs({...EMPTY_INPUTS});
    setAiState({ loading: false, content: null, error: null });
    setDesignState({
      originalImage: null,
      generatedImage: null,
      prompt: "Add a modern mediterranean villa with a pool and garden",
      loading: false,
      error: null
    });
    setIsEstimatingPrice(false);
    setActiveTab('overview');
    setNotification({ message: "Fields cleared", type: 'success' });
  };

  const handleOpenSaveModal = () => {
    const defaultName = inputs.location || `Project ${new Date().toLocaleDateString()}`;
    setSaveProjectName(defaultName);
    setSaveModalOpen(true);
  };

  const executeSave = async () => {
    try {
      const newProject = await saveProject(saveProjectName, inputs);
      setSavedProjects(prev => [newProject, ...prev]);
      setSaveModalOpen(false);
      setDuplicateWarningOpen(false);
      setNotification({ message: "Project saved successfully!", type: 'success' });
    } catch (error: any) {
      console.error("Error saving project:", error);
      setNotification({ message: "Failed to save: " + error.message, type: 'error' });
    }
  };

  const handleConfirmSave = async () => {
    if (!saveProjectName.trim()) return;
    
    // Check for duplicates by address/location
    const currentLocation = inputs.location.trim().toLowerCase();
    const isDuplicate = savedProjects.some(p => p.inputs.location.trim().toLowerCase() === currentLocation);

    if (isDuplicate) {
      // Close save modal and open warning
      setSaveModalOpen(false);
      setDuplicateWarningOpen(true);
      return;
    }

    // No duplicate, proceed normally
    await executeSave();
  };

  const handleLoadProject = (project: SavedProject) => {
    // Immediate load without confirmation to avoid sandboxing issues
    setInputs(project.inputs);
    setAiState({ loading: false, content: null, error: null });
    setActiveTab('overview');
    setNotification({ message: `Loaded "${project.name}"`, type: 'success' });
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDeleteConfirmationId(id);
  };

  const confirmDelete = async () => {
    if (!deleteConfirmationId) return;

    try {
      await deleteProject(deleteConfirmationId);
      setSavedProjects(prev => prev.filter(p => p.id !== deleteConfirmationId));
      setNotification({ message: "Project deleted", type: 'success' });
    } catch (error: any) {
      console.error("Error deleting project:", error);
      setNotification({ message: "Failed to delete project", type: 'error' });
    } finally {
      setDeleteConfirmationId(null);
    }
  };

  const handleEstimatePrice = async () => {
    if (!inputs.location) {
      setNotification({ message: "Please enter a location first", type: 'error' });
      return;
    }
    setIsEstimatingPrice(true);
    try {
      const estimatedPrice = await estimatePlotPrice(inputs.location, inputs.plotSize);
      if (estimatedPrice > 0) {
        handleInputChange('plotPrice', estimatedPrice);
        setNotification({ message: "Price estimated successfully", type: 'success' });
      }
    } catch (error: any) {
      console.error("Failed to estimate price", error);
      if (error.message === "ENABLE_API_REQUIRED" || error.message === "API_KEY_RESTRICTED" || error.message === "API_KEY_LEAKED") {
        setNotification({ message: "API Service Blocked. See Analysis section.", type: 'error' });
        setAiState(prev => ({ ...prev, error: error.message }));
      } else {
        setNotification({ message: "Could not estimate price", type: 'error' });
      }
    } finally {
      setIsEstimatingPrice(false);
    }
  };

  const handleGenerateAI = async () => {
    setAiState({ loading: true, content: null, error: null });
    try {
      const analysis = await analyzeInvestment(inputs, results);
      setAiState({ loading: false, content: analysis, error: null });
    } catch (err: any) {
      setAiState({ loading: false, content: null, error: err.message });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setDesignState(prev => ({
          ...prev,
          originalImage: reader.result as string,
          generatedImage: null,
          error: null
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateDesign = async () => {
    if (!designState.originalImage) return;
    
    setDesignState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const resultImage = await generateDesignVisualization(designState.originalImage, designState.prompt);
      setDesignState(prev => ({ 
        ...prev, 
        loading: false, 
        generatedImage: resultImage 
      }));
    } catch (err: any) {
      let errorMsg = "Failed to generate design: " + err.message;

      if (err.message === "ENABLE_API_REQUIRED" || err.message === "API_KEY_RESTRICTED" || err.message === "API_KEY_LEAKED") {
         errorMsg = "API Service Blocked. See Analysis section.";
         setAiState(prev => ({ ...prev, error: err.message }));
      }
      
      setDesignState(prev => ({ 
        ...prev, 
        loading: false, 
        error: errorMsg 
      }));
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setNotification({ message: "Logged out successfully", type: 'success' });
  };

  // Helper to calculate project metrics for the table display without loading the project
  const calculateProjectMetrics = (pInputs: ProjectInputs) => {
    const maxBuildable = pInputs.plotSize * pInputs.buildingCoefficient;
    const constrCost = maxBuildable * pInputs.constructionCostPerSqm;
    const misc = (constrCost + pInputs.plotPrice) * (pInputs.miscCostsPercent / 100);
    const totalInv = pInputs.plotPrice + constrCost + misc;
    const revenue = maxBuildable * pInputs.salePricePerSqm;
    const profit = revenue - totalInv;
    const margin = revenue > 0 ? (profit / revenue) * 100 : 0;
    
    return { totalInv, revenue, profit, margin };
  };

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-GR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val);

  const formatNumber = (val: number) => 
    new Intl.NumberFormat('en-GR', { maximumFractionDigits: 0 }).format(val);

  // --- Chart Data ---
  const revenueData = [
    { name: 'Total Cost', value: results.constructionCostTotalInclPlot },
    { name: 'Revenue', value: results.revenueTotal },
  ];

  const costBreakdownData = [
    { name: 'Plot', value: inputs.plotPrice, color: isDarkMode ? '#3b82f6' : '#1e3a8a' }, // Dark Blue (Light Mode) / Blue-500 (Dark Mode)
    { name: 'Construction', value: results.constructionCostTotal, color: isDarkMode ? '#0ea5e9' : '#2563eb' }, // Royal Blue
    { name: 'Misc/Tax', value: results.miscCostsValue, color: isDarkMode ? '#94a3b8' : '#64748b' }, // Slate
  ];

  // --- AUTH GUARD ---
  if (!isAuthenticated) {
    return (
      <>
        {notification && (
          <NotificationBanner 
            message={notification.message} 
            type={notification.type} 
            onClose={() => setNotification(null)} 
          />
        )}
        <LoginScreen onLogin={() => {
          setIsAuthenticated(true);
          setNotification({ message: "Welcome back, Sakis", type: 'success' });
        }} />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 pb-12 transition-colors duration-200 relative">
      
      {/* Save Project Modal */}
      {saveModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200 dark:border-slate-700">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Save Project</h3>
                <button 
                  onClick={() => setSaveModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Project Name</label>
                  <input
                    type="text"
                    value={saveProjectName}
                    onChange={(e) => setSaveProjectName(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="e.g. My Villa Project"
                    autoFocus
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-8 justify-end">
                <button
                  onClick={() => setSaveModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmSave}
                  className="px-6 py-2 text-sm font-bold text-white bg-blue-900 dark:bg-blue-600 hover:bg-blue-950 dark:hover:bg-blue-700 rounded-lg transition-colors shadow-sm"
                >
                  Save Project
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Duplicate Warning Modal */}
      {duplicateWarningOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 border-2 border-amber-200 dark:border-amber-900/50">
            <div className="p-6">
              <div className="flex flex-col items-center text-center mb-6">
                <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mb-4 text-amber-600 dark:text-amber-500">
                  <AlertTriangle size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Duplicate Address Found</h3>
                <p className="text-slate-500 dark:text-slate-400 mt-2">
                  A project with the location <span className="font-semibold text-slate-800 dark:text-slate-200">"{inputs.location}"</span> already exists in your saved list.
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                  Do you want to add this as a new record anyway?
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={executeSave}
                  className="w-full py-3 text-sm font-bold text-white bg-blue-900 dark:bg-blue-600 hover:bg-blue-950 dark:hover:bg-blue-700 rounded-xl transition-colors shadow-sm"
                >
                  Yes, Save Anyway
                </button>
                <button
                  onClick={() => setDuplicateWarningOpen(false)}
                  className="w-full py-3 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmationId && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border-2 border-red-100 dark:border-red-900/50">
            <div className="p-6">
              <div className="flex flex-col items-center text-center mb-6">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4 text-red-600 dark:text-red-500">
                  <Trash2 size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Delete Project?</h3>
                <p className="text-slate-500 dark:text-slate-400 mt-2">
                  Are you sure you want to delete <span className="font-semibold text-slate-800 dark:text-slate-200">"{savedProjects.find(p => p.id === deleteConfirmationId)?.name}"</span>? 
                </p>
                <p className="text-sm text-red-600 dark:text-red-400 mt-2 font-medium">
                  This action cannot be undone.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={confirmDelete}
                  className="w-full py-3 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors shadow-sm"
                >
                  Yes, Delete Permanently
                </button>
                <button
                  onClick={() => setDeleteConfirmationId(null)}
                  className="w-full py-3 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {notification && (
        <NotificationBanner 
          message={notification.message} 
          type={notification.type} 
          onClose={() => setNotification(null)} 
        />
      )}

      {/* Header */}
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-20 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-blue-900 text-white p-2 rounded-lg">
              <Building2 size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Domos</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Development Calculator</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700 rounded-lg transition-colors"
              title="Toggle Theme"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-1"></div>
            <div className="flex items-center gap-2 mr-2">
              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-800 dark:text-blue-200 font-bold text-xs">
                S
              </div>
              <span className="text-sm font-medium hidden sm:block">Sakis</span>
            </div>
            <button 
              onClick={handleLogout}
              className="text-slate-400 hover:text-red-500 transition-colors"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl mb-8 max-w-md mx-auto shadow-inner">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'overview'
                ? 'bg-white dark:bg-slate-700 text-blue-900 dark:text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <Calculator size={16} />
            Calculator
          </button>
          <button
            onClick={() => setActiveTab('breakdown')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'breakdown'
                ? 'bg-white dark:bg-slate-700 text-blue-900 dark:text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <FolderOpen size={16} />
            Saved Projects
          </button>
          <button
            onClick={() => setActiveTab('design')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'design'
                ? 'bg-white dark:bg-slate-700 text-purple-700 dark:text-purple-300 shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-300'
            }`}
          >
            <Sparkles size={16} />
            AI Design
          </button>
        </div>

        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Left Column: Inputs */}
            <div className="lg:col-span-4 space-y-6">
              
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-bold flex items-center gap-2">
                    <MapPin size={20} className="text-blue-600" />
                    Project Details
                  </h2>
                  <div className="flex gap-2">
                     <button onClick={handleReset} className="p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors" title="Reset Inputs">
                       <RotateCcw size={18} />
                     </button>
                     <button onClick={handleOpenSaveModal} className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50 rounded-lg transition-colors" title="Save Project">
                       <Save size={18} />
                     </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-500 dark:text-slate-400">Location</label>
                    <input 
                      type="text" 
                      value={inputs.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
                      placeholder="e.g. Glyfada, Athens"
                    />
                  </div>
                  
                  <div className="space-y-2">
                     <label className="text-sm font-medium text-slate-500 dark:text-slate-400">Owner/Notes</label>
                     <textarea 
                        value={inputs.ownerNotes || ''}
                        onChange={(e) => handleInputChange('ownerNotes', e.target.value)}
                        className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm min-h-[80px] resize-none"
                        placeholder="Contact info, specific requirements..."
                     />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <InputCard
                  label="Plot Size"
                  value={inputs.plotSize}
                  onChange={(val) => handleInputChange('plotSize', val)}
                  icon={LandPlot}
                  unit="m²"
                  min={0}
                  step={10}
                />
                
                <InputCard
                  label="Plot Price"
                  value={inputs.plotPrice}
                  onChange={(val) => handleInputChange('plotPrice', val)}
                  icon={Euro}
                  unit="EUR"
                  step={1000}
                  action={
                    <button 
                      onClick={handleEstimatePrice}
                      disabled={isEstimatingPrice}
                      className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50 transition-colors flex items-center gap-1"
                    >
                      {isEstimatingPrice ? <div className="animate-spin w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full"></div> : <Wand2 size={12} />}
                      Estimate
                    </button>
                  }
                />

                <InputCard
                  label="Building Coefficient (Σ.Δ.)"
                  value={inputs.buildingCoefficient}
                  onChange={(val) => handleInputChange('buildingCoefficient', val)}
                  icon={Scale}
                  step={0.1}
                  min={0.1}
                  max={4.0}
                  helperText={`Max Buildable: ${Math.round(results.maxBuildableArea)} m²`}
                  highlight
                />

                <InputCard
                  label="Construction Cost"
                  value={inputs.constructionCostPerSqm}
                  onChange={(val) => handleInputChange('constructionCostPerSqm', val)}
                  icon={Hammer}
                  unit="€/m²"
                  step={50}
                />

                <InputCard
                  label="Est. Sale Price"
                  value={inputs.salePricePerSqm}
                  onChange={(val) => handleInputChange('salePricePerSqm', val)}
                  icon={Wallet}
                  unit="€/m²"
                  step={50}
                />
                
                <InputCard
                    label="Misc Costs Buffer"
                    value={inputs.miscCostsPercent}
                    onChange={(val) => handleInputChange('miscCostsPercent', val)}
                    icon={Layers}
                    unit="%"
                    step={1}
                    max={20}
                    helperText={`Taxes, notary, etc: ${formatCurrency(results.miscCostsValue)}`}
                />
              </div>
            </div>

            {/* Right Column: Results & Analysis */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Key Stats Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard 
                  label="Total Investment" 
                  value={formatNumber(results.constructionCostTotalInclPlot)}
                  subValue="Land + Build + Misc"
                  icon={Euro}
                  color="blue"
                />
                <StatCard 
                  label="Proj. Revenue" 
                  value={formatNumber(results.revenueTotal)}
                  subValue={`@ ${inputs.salePricePerSqm} €/m²`}
                  icon={TrendingUp}
                  color="green"
                />
                <StatCard 
                  label="Net Profit" 
                  value={formatNumber(results.profitTotal)}
                  subValue={`Margin: ${results.profitMargin.toFixed(1)}%`}
                  icon={Wallet}
                  trend={results.profitTotal > 0 ? 'positive' : 'negative'}
                  // Fix: 'emerald' is not a valid color in StatCardProps, using 'green' instead
                  color={results.profitTotal > 0 ? 'green' : 'amber'}
                />
                <StatCard 
                  label="ROI" 
                  value={`${results.roi.toFixed(1)}%`}
                  subValue="Return on Cost"
                  icon={Activity}
                  color={results.roi > 15 ? 'green' : results.roi > 0 ? 'amber' : 'slate'}
                />
              </div>

              {/* Visuals Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {/* Cost Structure Chart */}
                 <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-6">Cost Breakdown</h3>
                    <div className="h-64 flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={costBreakdownData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {costBreakdownData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    formatter={(value: number) => formatCurrency(value)}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex justify-center gap-4 mt-2">
                        {costBreakdownData.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-1.5">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                                <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{item.name}</span>
                            </div>
                        ))}
                    </div>
                 </div>

                 {/* Indicators */}
                 <div className="space-y-4">
                     <StrengthGauge margin={results.profitMargin} />
                     <RiskBar margin={results.profitMargin} />
                     <div className="bg-blue-900 text-white p-5 rounded-xl shadow-lg relative overflow-hidden">
                        <div className="relative z-10">
                            <p className="text-blue-200 text-xs font-bold uppercase tracking-wider mb-1">Break-even Point</p>
                            <h3 className="text-2xl font-bold">
                                {formatCurrency(results.costPerSqmInclPlot)} <span className="text-sm font-medium opacity-70">/ m²</span>
                            </h3>
                            <p className="text-xs text-blue-100 mt-2 opacity-80">
                                You need to sell above this price to make a profit.
                            </p>
                        </div>
                        <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-4 translate-y-4">
                            <Euro size={100} />
                        </div>
                     </div>
                 </div>
              </div>

              {/* AI Consultant Section */}
              <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-slate-800 dark:to-slate-800/50 rounded-2xl border border-indigo-100 dark:border-slate-700 p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                  <Sparkles size={120} />
                </div>
                
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                      <Sparkles className="text-indigo-600 dark:text-indigo-400" size={24} />
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">Gemini AI Investment Consultant</h3>
                    </div>
                    <button
                      onClick={handleGenerateAI}
                      disabled={aiState.loading}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors flex items-center gap-2 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {aiState.loading ? (
                        <>
                          <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                          Analyzing...
                        </>
                      ) : (
                        <>
                          Analyze Investment
                        </>
                      )}
                    </button>
                  </div>

                  <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 max-w-2xl">
                    Get an instant professional opinion on this project's viability in the Greek market.
                  </p>

                  {aiState.error && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-xl p-4 text-sm text-red-800 dark:text-red-200 animate-in fade-in">
                       <div className="flex items-start gap-3">
                         <ShieldAlert className="shrink-0 mt-0.5" size={18} />
                         <div>
                           <p className="font-bold mb-1">Analysis Failed</p>
                           <p className="opacity-90">{aiState.error === "ENABLE_API_REQUIRED" ? "The AI Service is disabled for this project." : aiState.error === "API_KEY_RESTRICTED" ? "The API Key is restricted." : aiState.error === "API_KEY_LEAKED" ? "The API Key was leaked and blocked." : aiState.error}</p>
                           
                           {aiState.error === "ENABLE_API_REQUIRED" && (
                             <a 
                               href="https://console.developers.google.com/apis/api/generativelanguage.googleapis.com/overview?project=802024199226"
                               target="_blank"
                               rel="noreferrer"
                               className="inline-flex items-center gap-1 mt-2 text-red-700 dark:text-red-300 font-bold underline hover:no-underline"
                             >
                               Enable API in Google Console <ExternalLink size={12}/>
                             </a>
                           )}

                            {aiState.error === "API_KEY_RESTRICTED" && (
                             <div className="mt-2 text-xs bg-white/50 dark:bg-black/20 p-2 rounded">
                               <strong>How to fix:</strong>
                               <ol className="list-decimal ml-4 mt-1 space-y-1">
                                 <li>Go to <a href="https://console.cloud.google.com/apis/credentials?project=802024199226" target="_blank" className="underline">Google Cloud Credentials</a></li>
                                 <li>Click on <strong>"Browser key (auto created by Firebase)"</strong></li>
                                 <li>Scroll to "API restrictions"</li>
                                 <li>Select <strong>"Generative Language API"</strong> from the dropdown list</li>
                                 <li>Click Save</li>
                               </ol>
                             </div>
                           )}

                           {aiState.error === "API_KEY_LEAKED" && (
                             <div className="mt-2 text-xs bg-white/50 dark:bg-black/20 p-2 rounded">
                               <p><strong>Security Alert:</strong> Google blocked the hardcoded key.</p>
                               <p className="mt-1">The app has been updated to use your secure Vercel Environment Variable instead. Please Redeploy.</p>
                             </div>
                           )}
                         </div>
                       </div>
                    </div>
                  )}

                  {aiState.content && (
                    <div className="bg-white/80 dark:bg-slate-900/50 rounded-xl p-6 border border-indigo-50 dark:border-slate-700 prose dark:prose-invert prose-sm max-w-none animate-in fade-in slide-in-from-bottom-2">
                       <div className="whitespace-pre-wrap font-medium leading-relaxed">
                         {aiState.content}
                       </div>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        )}

        {activeTab === 'breakdown' && (
          <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="flex justify-between items-center">
                <div>
                   <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Saved Projects Dashboard</h2>
                   <p className="text-slate-500 dark:text-slate-400 mt-1">Manage and compare your investment scenarios</p>
                </div>
                <div className="bg-white dark:bg-slate-800 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-medium">
                   {savedProjects.length} Projects Found
                </div>
             </div>

             {isLoadingProjects ? (
                <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                   <div className="animate-spin mb-4 text-blue-600">
                      <RotateCcw size={32} />
                   </div>
                   <p>Loading projects...</p>
                </div>
             ) : savedProjects.length === 0 ? (
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 p-12 text-center">
                   <div className="w-16 h-16 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                      <FolderOpen size={32} />
                   </div>
                   <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1">No saved projects yet</h3>
                   <p className="text-slate-500 mb-6">Start by calculating a new project and saving it.</p>
                   <button 
                      onClick={() => setActiveTab('overview')}
                      className="bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors"
                   >
                      Create First Project
                   </button>
                </div>
             ) : (
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                   <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                         <thead>
                            <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                               <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Project Name</th>
                               <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Location</th>
                               <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                               <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Total Budget</th>
                               <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Net Profit</th>
                               <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Margin</th>
                               <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Actions</th>
                            </tr>
                         </thead>
                         <tbody>
                            {savedProjects.map((project) => {
                               const metrics = calculateProjectMetrics(project.inputs);
                               return (
                                  <tr key={project.id} className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group">
                                     <td className="p-4">
                                        <div className="font-bold text-slate-900 dark:text-white">{project.name}</div>
                                     </td>
                                     <td className="p-4 text-slate-600 dark:text-slate-300 text-sm">
                                        <div className="flex items-center gap-1.5">
                                           <MapPin size={14} className="opacity-50" />
                                           {project.inputs.location}
                                        </div>
                                     </td>
                                     <td className="p-4 text-slate-500 text-sm">
                                        {new Date(project.createdAt).toLocaleDateString()}
                                     </td>
                                     <td className="p-4 text-right font-medium text-slate-700 dark:text-slate-300">
                                        {formatNumber(metrics.totalInv)} €
                                     </td>
                                     <td className={`p-4 text-right font-bold ${metrics.profit > 0 ? 'text-emerald-600' : 'text-amber-600'}`}>
                                        {formatNumber(metrics.profit)} €
                                     </td>
                                     <td className="p-4 text-right">
                                        <span className={`inline-block px-2 py-1 rounded text-xs font-bold ${
                                           metrics.margin > 15 
                                             ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                                             : metrics.margin > 0
                                                ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                                                : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                        }`}>
                                           {metrics.margin.toFixed(1)}%
                                        </span>
                                     </td>
                                     <td className="p-4 text-center">
                                        <div className="flex items-center justify-center gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                           <button 
                                              onClick={() => handleLoadProject(project)}
                                              className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                              title="Load Project"
                                           >
                                              <FolderOpen size={18} />
                                           </button>
                                           <button 
                                              onClick={(e) => handleDeleteClick(e, project.id)}
                                              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                              title="Delete Project"
                                           >
                                              <Trash2 size={18} />
                                           </button>
                                        </div>
                                     </td>
                                  </tr>
                               );
                            })}
                         </tbody>
                      </table>
                   </div>
                </div>
             )}
          </div>
        )}

        {activeTab === 'design' && (
           <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
                 <div className="p-8 border-b border-slate-100 dark:border-slate-700">
                    <div className="flex items-center gap-3 mb-2">
                       <div className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg">
                          <Wand2 size={24} />
                       </div>
                       <h2 className="text-2xl font-bold">AI Design Studio</h2>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 max-w-2xl">
                       Upload a photo of your plot or an existing structure, and let AI visualize potential developments or renovations instantly.
                    </p>
                 </div>
                 
                 <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Upload Section */}
                    <div className="space-y-4">
                       <h3 className="font-semibold text-slate-900 dark:text-white">1. Upload Source Image</h3>
                       <div 
                          onClick={() => fileInputRef.current?.click()}
                          className={`aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-slate-50 dark:hover:bg-slate-700/50 relative overflow-hidden group ${
                             designState.originalImage 
                               ? 'border-purple-200 dark:border-purple-900' 
                               : 'border-slate-300 dark:border-slate-600'
                          }`}
                       >
                          {designState.originalImage ? (
                             <img src={designState.originalImage} alt="Source" className="w-full h-full object-cover" />
                          ) : (
                             <div className="text-center p-6">
                                <Upload size={32} className="mx-auto text-slate-400 mb-2 group-hover:scale-110 transition-transform" />
                                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Click to upload photo</p>
                                <p className="text-xs text-slate-400 mt-1">JPG, PNG up to 5MB</p>
                             </div>
                          )}
                          <input 
                             type="file" 
                             ref={fileInputRef} 
                             onChange={handleImageUpload} 
                             className="hidden" 
                             accept="image/*"
                          />
                       </div>
                    </div>

                    {/* Result Section */}
                    <div className="space-y-4">
                       <h3 className="font-semibold text-slate-900 dark:text-white">2. AI Generation</h3>
                       <div className={`aspect-square rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center relative overflow-hidden ${designState.loading ? 'animate-pulse' : ''}`}>
                          {designState.loading ? (
                             <div className="text-center">
                                <Wand2 size={32} className="mx-auto text-purple-500 animate-spin mb-2" />
                                <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Generating Vision...</p>
                             </div>
                          ) : designState.generatedImage ? (
                             <>
                                <img src={designState.generatedImage} alt="Generated" className="w-full h-full object-cover animate-in fade-in" />
                                <a 
                                   href={designState.generatedImage} 
                                   download="domos-design.png"
                                   className="absolute bottom-4 right-4 p-2 bg-white/90 text-slate-900 rounded-lg shadow-lg hover:bg-white transition-colors"
                                   title="Download"
                                >
                                   <Download size={18} />
                                </a>
                             </>
                          ) : designState.error ? (
                             <div className="text-center p-6 text-red-500">
                                <AlertTriangle size={32} className="mx-auto mb-2" />
                                <p className="text-sm">{designState.error}</p>
                             </div>
                          ) : (
                             <div className="text-center p-6 text-slate-400">
                                <ImagePlus size={32} className="mx-auto mb-2 opacity-50" />
                                <p className="text-sm">Result will appear here</p>
                             </div>
                          )}
                       </div>
                    </div>
                 </div>

                 <div className="p-8 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-700">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                       Describe your vision
                    </label>
                    <div className="flex gap-2">
                       <input 
                          type="text" 
                          value={designState.prompt}
                          onChange={(e) => setDesignState(prev => ({ ...prev, prompt: e.target.value }))}
                          className="flex-1 p-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-purple-500 outline-none"
                          placeholder="e.g. Modern two-story villa with white facade and swimming pool"
                       />
                       <button 
                          onClick={handleGenerateDesign}
                          disabled={!designState.originalImage || designState.loading}
                          className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 rounded-xl font-bold flex items-center gap-2 transition-colors shadow-md"
                       >
                          <Wand2 size={18} />
                          Generate
                       </button>
                    </div>
                 </div>
              </div>
           </div>
        )}

      </main>
    </div>
  );
};

export default App;