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
    <div className={`fixed bottom-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border transition-all animate-in slide-in-from-bottom-5 fade-in ${
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

  const handleDeleteProject = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); 
    // Immediate delete without confirmation to avoid sandboxing issues
    try {
      await deleteProject(id);
      setSavedProjects(prev => prev.filter(p => p.id !== id));
      setNotification({ message: "Project deleted", type: 'success' });
    } catch (error: any) {
      console.error("Error deleting project:", error);
      setNotification({ message: "Failed to delete project", type: 'error' });
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
      if (error.message === "ENABLE_API_REQUIRED" || error.message === "API_KEY_RESTRICTED") {
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

      if (err.message === "ENABLE_API_REQUIRED" || err.message === "API_KEY_RESTRICTED") {
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-900 dark:bg-blue-700 p-2 rounded-lg text-white">
              <Building2 size={24} />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-blue-950 dark:text-white">Domos <span className="text-slate-400 dark:text-slate-500 font-normal">| Greece</span></h1>
          </div>
          <div className="flex gap-4">
             <button
               onClick={handleOpenSaveModal}
               className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-900 dark:bg-blue-600 hover:bg-blue-950 dark:hover:bg-blue-700 rounded-lg transition-colors shadow-sm"
               title="Save current project"
             >
               <Save size={16} />
               <span className="hidden sm:inline">Save Project</span>
             </button>
             <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="flex items-center justify-center p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                title="Toggle Dark Mode"
             >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
             </button>
             <button 
                onClick={handleLogout}
                className="flex items-center justify-center p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                title="Sign Out"
             >
                <LogOut size={20} />
             </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: INPUTS */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2 text-blue-950 dark:text-white">
                  <MapIcon className="text-blue-900 dark:text-blue-400" size={20} />
                  Plot Details
                </h2>
                <button 
                  type="button"
                  onClick={handleReset}
                  className="p-2 text-slate-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
                  title="Clear all fields"
                >
                  <RotateCcw size={16} />
                </button>
              </div>
              
              <div className="space-y-4">
                {/* Location Input */}
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-blue-800 dark:hover:border-blue-500 transition-colors">
                  <div className="flex items-center gap-2 mb-2 text-slate-600 dark:text-slate-400">
                    <MapPin size={18} className="text-slate-400 dark:text-slate-500" />
                    <label className="text-sm font-medium">Location / Area</label>
                  </div>
                  <input
                    type="text"
                    value={inputs.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="w-full text-lg font-bold text-slate-900 dark:text-white bg-transparent outline-none placeholder:text-slate-300 dark:placeholder:text-slate-600"
                    placeholder="e.g. Glyfada, Athens"
                  />
                </div>

                {/* Owner Notes Input */}
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-blue-800 dark:hover:border-blue-500 transition-colors">
                   <div className="flex items-center gap-2 mb-2 text-slate-600 dark:text-slate-400">
                      <User size={18} className="text-slate-400 dark:text-slate-500" />
                      <label className="text-sm font-medium">Owner Contact / Notes</label>
                   </div>
                   <textarea
                      value={inputs.ownerNotes || ""}
                      onChange={(e) => handleInputChange('ownerNotes', e.target.value)}
                      className="w-full text-sm text-slate-700 dark:text-slate-300 bg-transparent outline-none placeholder:text-slate-400 resize-none h-20"
                      placeholder="Name, Phone, Comments..."
                   />
                </div>

                {/* Embedded Map */}
                <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 h-48 bg-slate-100 dark:bg-slate-900 relative">
                  {inputs.location ? (
                    <iframe
                      width="100%"
                      height="100%"
                      frameBorder="0"
                      style={{ border: 0, filter: isDarkMode ? 'invert(90%) hue-rotate(180deg)' : 'none' }}
                      src={`https://maps.google.com/maps?q=${encodeURIComponent(inputs.location)}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                      allowFullScreen
                    ></iframe>
                  ) : (
                    <div className="flex items-center justify-center h-full text-slate-400 text-sm">
                      Enter a location to view map
                    </div>
                  )}
                </div>

                <div className="border-t border-slate-100 dark:border-slate-700 my-4"></div>

                <InputCard 
                  label="Plot Price"
                  value={inputs.plotPrice}
                  onChange={(v) => handleInputChange('plotPrice', v)}
                  icon={Euro}
                  unit="EUR"
                  step={1000}
                  action={
                    <button 
                      onClick={handleEstimatePrice}
                      disabled={isEstimatingPrice || !inputs.location}
                      className="text-xs flex items-center gap-1 text-blue-900 dark:text-blue-300 hover:text-blue-950 dark:hover:text-blue-100 font-medium disabled:opacity-50 transition-colors bg-blue-100 dark:bg-blue-900/40 px-2 py-1 rounded-md"
                      title="Estimate price based on location"
                    >
                      {isEstimatingPrice ? (
                        <Sparkles size={12} className="animate-spin" />
                      ) : (
                        <Sparkles size={12} />
                      )}
                      {isEstimatingPrice ? "Estimating..." : "Auto-Estimate"}
                    </button>
                  }
                />
                <InputCard 
                  label="Plot Size"
                  value={inputs.plotSize}
                  onChange={(v) => handleInputChange('plotSize', v)}
                  icon={LandPlot}
                  unit="m²"
                />
                
                {/* Building Coefficient Input */}
                <InputCard 
                  label="Building Coefficient (Factor)"
                  value={inputs.buildingCoefficient}
                  onChange={(v) => handleInputChange('buildingCoefficient', v)}
                  icon={Scale}
                  step={0.1}
                  min={0.1}
                  max={5.0}
                  helperText="Syntelesis Domisis (e.g. 0.8, 1.2)"
                />

                {/* Derived Max Buildable Area */}
                <InputCard 
                  label="Max Buildable Area (Calculated)"
                  value={results.maxBuildableArea}
                  icon={BrickWall}
                  unit="m²"
                  readOnly
                  helperText={`${inputs.plotSize} m² x ${inputs.buildingCoefficient} Factor`}
                  highlight
                />
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 transition-colors">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-blue-950 dark:text-white">
                <Calculator className="text-blue-900 dark:text-blue-400" size={20} />
                Financials
              </h2>
              <div className="space-y-4">
                <InputCard 
                  label="Construction Cost (Hard)"
                  value={inputs.constructionCostPerSqm}
                  onChange={(v) => handleInputChange('constructionCostPerSqm', v)}
                  icon={BrickWall}
                  unit="€/m²"
                  helperText="Excluding plot price"
                />
                <InputCard 
                  label="Misc Costs Buffer"
                  value={inputs.miscCostsPercent}
                  onChange={(v) => handleInputChange('miscCostsPercent', v)}
                  icon={PieIcon}
                  unit="%"
                  step={0.5}
                  min={0}
                  max={30}
                  helperText="Taxes, notary, permits"
                />
                <div className="my-4 border-t border-slate-100 dark:border-slate-700"></div>
                <InputCard 
                  label="Target Sale Price"
                  value={inputs.salePricePerSqm}
                  onChange={(v) => handleInputChange('salePricePerSqm', v)}
                  icon={TrendingUp}
                  unit="€/m²"
                  highlight
                />
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: RESULTS */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <StatCard 
                label="Total Investment" 
                value={formatNumber(results.constructionCostTotalInclPlot)}
                subValue={`Inc. Land & ${inputs.miscCostsPercent}% Misc`}
                icon={Euro}
                color="slate"
              />
               <StatCard 
                label="Potential Revenue" 
                value={formatNumber(results.revenueTotal)}
                subValue={`@ ${formatCurrency(inputs.salePricePerSqm)} /m²`}
                icon={TrendingUp}
                color="blue"
              />
              <StatCard 
                label="Net Profit" 
                value={formatNumber(results.profitTotal)}
                subValue={`${results.profitMargin.toFixed(1)}% Margin`}
                icon={results.profitTotal >= 0 ? Sparkles : AlertCircle}
                color={results.profitTotal >= 0 ? "green" : "amber"}
              />
            </div>

            {/* Detailed Analysis Tabs */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden min-h-[500px] transition-colors">
              <div className="border-b border-slate-100 dark:border-slate-700 px-6 pt-4 flex gap-6">
                <button 
                  onClick={() => setActiveTab('overview')}
                  className={`pb-4 text-sm font-medium transition-colors border-b-2 ${
                    activeTab === 'overview' 
                      ? 'border-blue-900 text-blue-900 dark:text-blue-400 dark:border-blue-400' 
                      : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                  }`}
                >
                  Visual Analysis
                </button>
                <button 
                   onClick={() => setActiveTab('breakdown')}
                   className={`pb-4 text-sm font-medium transition-colors border-b-2 ${
                    activeTab === 'breakdown' 
                      ? 'border-blue-900 text-blue-900 dark:text-blue-400 dark:border-blue-400' 
                      : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                  }`}
                >
                  Cost Structure
                </button>
                <button 
                   onClick={() => setActiveTab('design')}
                   className={`pb-4 text-sm font-medium transition-colors border-b-2 flex items-center gap-1.5 ${
                    activeTab === 'design' 
                      ? 'border-indigo-900 text-indigo-900 dark:text-indigo-400 dark:border-indigo-400' 
                      : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                  }`}
                >
                  <Wand2 size={16} />
                  Design Studio
                </button>
              </div>

              <div className="p-6">
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    
                    {/* Graphical Metrics Row */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                      {/* Strength Gauge */}
                      <div className="md:col-span-5 flex flex-col gap-4">
                        <StrengthGauge margin={results.profitMargin} />
                        {/* New Risk Bar */}
                        <RiskBar margin={results.profitMargin} />
                      </div>

                      {/* Cost Distribution Circles */}
                      <div className="md:col-span-7 bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col justify-between transition-colors">
                         <div className="flex items-center gap-2 mb-3">
                            <Layers size={18} className="text-slate-600 dark:text-slate-400" />
                            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Expense Breakdown</span>
                         </div>
                         <div className="flex items-center justify-around gap-3 h-full">
                           <CircleIndicator 
                             percentage={percentages.plot} 
                             colorClass={isDarkMode ? "text-blue-500" : "text-blue-900"} 
                             label="Plot" 
                             icon={MapIcon}
                           />
                           <CircleIndicator 
                             percentage={percentages.construction} 
                             colorClass={isDarkMode ? "text-sky-500" : "text-blue-700"} 
                             label="Construction" 
                             icon={Hammer}
                           />
                           <CircleIndicator 
                             percentage={percentages.misc} 
                             colorClass="text-slate-400" 
                             label="Soft Costs" 
                             icon={Wallet}
                           />
                         </div>
                      </div>
                    </div>

                    {/* Break-even Price Helper (Moved Here) */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-900/50 mt-2">
                       <div className="flex justify-between items-center text-sm mb-1">
                         <span className="text-blue-900 dark:text-blue-300 font-medium">Break-even Price</span>
                         <span className="text-blue-950 dark:text-blue-100 font-bold">{formatCurrency(results.costPerSqmInclPlot)} /m²</span>
                       </div>
                       <div className="w-full bg-blue-200 dark:bg-blue-900/50 h-2 rounded-full mt-2 overflow-hidden">
                         <div 
                           className="h-full bg-blue-900 dark:bg-blue-500 transition-all duration-500"
                           style={{ width: `${Math.min((results.costPerSqmInclPlot / inputs.salePricePerSqm) * 100, 100)}%` }}
                         />
                       </div>
                       <p className="text-xs text-blue-900 dark:text-blue-300 mt-2 text-right">
                         Current margin safety: {Math.max(0, 100 - (results.costPerSqmInclPlot / inputs.salePricePerSqm * 100)).toFixed(1)}%
                       </p>
                    </div>

                    {/* Revenue vs Cost Chart */}
                    <div className="h-[250px] w-full mt-4">
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2 pl-2">Revenue vs Investment</p>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={revenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }} layout="vertical">
                          <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke={isDarkMode ? "#334155" : "#f1f5f9"} />
                          <XAxis type="number" hide />
                          <YAxis dataKey="name" type="category" width={80} tick={{fontSize: 12, fill: isDarkMode ? '#cbd5e1' : '#1e3a8a'}} />
                          <Tooltip 
                            cursor={{ fill: isDarkMode ? '#1e293b' : '#f8fafc' }}
                            contentStyle={{ 
                              borderRadius: '12px', 
                              border: 'none', 
                              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                              backgroundColor: isDarkMode ? '#1e293b' : '#fff',
                              color: isDarkMode ? '#fff' : '#000'
                            }}
                            formatter={(value: number) => formatCurrency(value)}
                          />
                          <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={40}>
                            {revenueData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={index === 0 ? (isDarkMode ? '#94a3b8' : '#64748b') : results.profitTotal > 0 ? '#10b981' : '#f59e0b'} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center transition-colors">
                       <div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold">Constr. Cost</p>
                          <p className="text-lg font-bold text-slate-700 dark:text-slate-200">{formatCurrency(results.constructionCostTotal)}</p>
                       </div>
                       <div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold">Total Cost/m²</p>
                          <p className="text-lg font-bold text-slate-700 dark:text-slate-200">{formatCurrency(results.costPerSqmInclPlot)}</p>
                       </div>
                       <div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold">ROI</p>
                          <p className={`text-lg font-bold ${results.roi >= 0 ? 'text-emerald-700 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                            {results.roi.toFixed(1)}%
                          </p>
                       </div>
                       <div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold">Margin</p>
                          <p className={`text-lg font-bold ${results.profitMargin >= 0 ? 'text-emerald-700 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                            {results.profitMargin.toFixed(1)}%
                          </p>
                       </div>
                    </div>
                  </div>
                )}

                {activeTab === 'breakdown' && (
                  <div className="flex flex-col md:flex-row items-center justify-center gap-8 h-[300px]">
                    <div className="w-full md:w-1/2 h-full">
                       <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={costBreakdownData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={5}
                            dataKey="value"
                            stroke="none"
                          >
                            {costBreakdownData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip 
                            formatter={(value: number) => formatCurrency(value)}
                            contentStyle={{ 
                              backgroundColor: isDarkMode ? '#1e293b' : '#fff',
                              color: isDarkMode ? '#fff' : '#000',
                              border: 'none',
                              borderRadius: '8px',
                              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="w-full md:w-1/2 space-y-3">
                        <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">Detailed Cost Breakdown</h4>
                        {costBreakdownData.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                            <div className="flex items-center gap-3">
                              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{item.name}</span>
                            </div>
                            <div className="text-right">
                              <span className="block text-sm font-bold text-slate-900 dark:text-white">{formatCurrency(item.value)}</span>
                              <span className="text-xs text-slate-500 dark:text-slate-400">{((item.value / results.constructionCostTotalInclPlot) * 100).toFixed(1)}%</span>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {activeTab === 'design' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       {/* Input Side */}
                       <div className="space-y-4">
                         <div className="bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                              onClick={() => fileInputRef.current?.click()}>
                           <input 
                             type="file" 
                             ref={fileInputRef} 
                             className="hidden" 
                             accept="image/*"
                             onChange={handleImageUpload}
                           />
                           {designState.originalImage ? (
                             <img src={designState.originalImage} alt="Original Plot" className="max-h-64 rounded-lg shadow-sm object-cover" />
                           ) : (
                             <>
                               <div className="bg-white dark:bg-slate-800 p-3 rounded-full shadow-sm mb-3">
                                 <Upload className="text-blue-900 dark:text-blue-500" size={24} />
                               </div>
                               <h3 className="text-slate-900 dark:text-white font-semibold">Upload Photo of Plot</h3>
                               <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Click to browse or drag & drop</p>
                             </>
                           )}
                         </div>

                         <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-200">What would you like to build/change?</label>
                            <textarea 
                              className="w-full p-3 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-900 dark:focus:ring-blue-500 focus:border-blue-900 dark:focus:border-blue-500 outline-none resize-none h-24 text-sm placeholder:text-slate-400"
                              placeholder="e.g. Add a modern two-story white villa with a swimming pool and olive trees."
                              value={designState.prompt}
                              onChange={(e) => setDesignState(prev => ({...prev, prompt: e.target.value}))}
                            />
                         </div>

                         <button 
                            className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                              !designState.originalImage || designState.loading
                                ? 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                                : 'bg-blue-900 dark:bg-blue-600 text-white hover:bg-blue-950 dark:hover:bg-blue-700 shadow-lg hover:shadow-blue-900/20'
                            }`}
                            onClick={handleGenerateDesign}
                            disabled={!designState.originalImage || designState.loading}
                         >
                            {designState.loading ? (
                              <>
                                <Wand2 className="animate-spin" size={20} />
                                Generating Visualization...
                              </>
                            ) : (
                              <>
                                <Wand2 size={20} />
                                Generate Visualization
                              </>
                            )}
                         </button>
                         {designState.error && (
                           <div className={`text-sm p-3 rounded-lg border flex flex-col gap-2 ${
                              designState.error.includes("Analysis section") 
                              ? "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800"
                              : "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-100 dark:border-red-800"
                           }`}>
                             {designState.error}
                           </div>
                         )}
                       </div>

                       {/* Result Side */}
                       <div className="bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-800 p-1 flex items-center justify-center min-h-[400px]">
                          {designState.generatedImage ? (
                            <div className="relative group w-full h-full">
                              <img src={designState.generatedImage} alt="Generated Design" className="w-full h-full object-contain rounded-lg shadow-sm" />
                              <a href={designState.generatedImage} download="domos-design.png" className="absolute top-4 right-4 bg-white/90 dark:bg-slate-800/90 p-2 rounded-lg text-slate-700 dark:text-slate-200 hover:text-blue-900 dark:hover:text-blue-400 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                <Download size={20} />
                              </a>
                            </div>
                          ) : (
                            <div className="text-center p-8 opacity-60">
                              <ImagePlus size={48} className="mx-auto text-blue-300 dark:text-blue-500 mb-4" />
                              <p className="text-blue-900 dark:text-blue-200 font-medium">Visualization Preview</p>
                              <p className="text-blue-900/70 dark:text-blue-300/70 text-sm mt-1">Upload an image and describe your vision to see it here.</p>
                            </div>
                          )}
                       </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* AI Assistant Section */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-800 rounded-2xl p-6 border border-blue-100 dark:border-slate-700 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-10">
                 <Sparkles size={64} className="text-blue-900 dark:text-blue-400" />
               </div>
               
               <div className="flex items-start justify-between mb-4 relative z-10">
                 <div>
                   <h3 className="text-lg font-bold text-blue-900 dark:text-blue-100 flex items-center gap-2">
                     <Sparkles size={18} className="text-blue-900 dark:text-blue-400" />
                     Gemini AI Investment Consultant
                   </h3>
                   <p className="text-sm text-blue-800 dark:text-blue-300 mt-1">
                     Get an instant professional opinion on this project's viability in the Greek market.
                   </p>
                 </div>
                 <button
                    onClick={handleGenerateAI}
                    disabled={aiState.loading}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold shadow-sm transition-all ${
                      aiState.loading 
                        ? 'bg-blue-200 text-blue-500 cursor-not-allowed dark:bg-slate-700 dark:text-slate-500'
                        : 'bg-blue-900 text-white hover:bg-blue-950 hover:shadow-md dark:bg-blue-600 dark:hover:bg-blue-700'
                    }`}
                 >
                   {aiState.loading ? 'Analyzing...' : 'Analyze Investment'}
                 </button>
               </div>

               {aiState.error === "ENABLE_API_REQUIRED" ? (
                 <div className="bg-amber-50 dark:bg-amber-900/30 p-4 rounded-xl border border-amber-200 dark:border-amber-800 animate-in fade-in slide-in-from-bottom-2">
                    <div className="flex items-start gap-3">
                       <div className="p-2 bg-amber-100 dark:bg-amber-800/50 rounded-full text-amber-700 dark:text-amber-400">
                         <Lock size={20} />
                       </div>
                       <div>
                          <h4 className="font-bold text-amber-900 dark:text-amber-100">API Service Not Enabled</h4>
                          <p className="text-sm text-amber-800 dark:text-amber-300 mt-1 mb-3">
                             The "Generative Language API" is currently disabled in your Google Cloud Project. You must enable it to use AI features.
                          </p>
                          <a 
                            href="https://console.developers.google.com/apis/api/generativelanguage.googleapis.com/overview?project=802024199226"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-bold rounded-lg transition-colors shadow-sm"
                          >
                            Enable API in Google Cloud
                            <ExternalLink size={14} />
                          </a>
                       </div>
                    </div>
                 </div>
               ) : aiState.error === "API_KEY_RESTRICTED" ? (
                  <div className="bg-red-50 dark:bg-red-900/30 p-4 rounded-xl border border-red-200 dark:border-red-800 animate-in fade-in slide-in-from-bottom-2">
                     <div className="flex items-start gap-3">
                        <div className="p-2 bg-red-100 dark:bg-red-800/50 rounded-full text-red-700 dark:text-red-400">
                          <ShieldAlert size={20} />
                        </div>
                        <div>
                           <h4 className="font-bold text-red-900 dark:text-red-100">API Key Restricted</h4>
                           <p className="text-sm text-red-800 dark:text-red-300 mt-1 mb-3">
                              Your API Key has security restrictions that block the AI service. 
                              Go to <strong>Credentials</strong>, edit your API Key, and add "Generative Language API" to the allowed list (or select "Don't restrict key").
                           </p>
                           <a 
                             href="https://console.cloud.google.com/apis/credentials?project=802024199226"
                             target="_blank"
                             rel="noopener noreferrer"
                             className="inline-flex items-center gap-2 px-4 py-2 bg-red-700 hover:bg-red-800 text-white text-sm font-bold rounded-lg transition-colors shadow-sm"
                           >
                             Fix Key Restrictions
                             <ExternalLink size={14} />
                           </a>
                        </div>
                     </div>
                  </div>
               ) : aiState.error && (
                 <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 p-3 rounded-lg text-sm border border-red-100 dark:border-red-800">
                   {aiState.error}
                 </div>
               )}

               {aiState.content && (
                 <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm p-5 rounded-xl border border-blue-100 dark:border-slate-600 text-slate-700 dark:text-slate-200 text-sm leading-relaxed whitespace-pre-line animate-in fade-in slide-in-from-bottom-2 duration-500">
                   <div className="prose prose-sm prose-blue dark:prose-invert max-w-none">
                     {/* Simple rendering of markdown-like text */}
                     {aiState.content.split('**').map((part, i) => 
                        i % 2 === 1 ? <strong key={i} className="text-blue-900 dark:text-blue-300">{part}</strong> : part
                     )}
                   </div>
                 </div>
               )}
            </div>

          </div>
        </div>

        {/* FULL WIDTH SAVED PROJECTS DASHBOARD */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden transition-colors">
           <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
              <h2 className="text-lg font-bold text-blue-950 dark:text-white flex items-center gap-2">
                 <FolderOpen className="text-blue-900 dark:text-blue-400" size={20} />
                 Saved Projects Dashboard
              </h2>
              <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                {savedProjects.length} Records
              </span>
           </div>

           <div className="overflow-x-auto">
             {isLoadingProjects ? (
                <div className="p-8 text-center text-slate-500 dark:text-slate-400">Loading projects...</div>
             ) : savedProjects.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="bg-slate-50 dark:bg-slate-700/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                     <FolderOpen size={32} className="text-slate-400 dark:text-slate-500" />
                  </div>
                  <h3 className="text-slate-900 dark:text-white font-semibold">No saved projects found</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Analysis records will appear here after you save them.</p>
                </div>
             ) : (
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 text-xs uppercase font-semibold">
                    <tr>
                      <th className="px-6 py-4">Project Name & Owner</th>
                      <th className="px-6 py-4">Address / Location</th>
                      <th className="px-6 py-4 text-right">Total Investment</th>
                      <th className="px-6 py-4 text-right">Potential Revenue</th>
                      <th className="px-6 py-4 text-right">Net Profit</th>
                      <th className="px-6 py-4 text-center">Strength</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                    {savedProjects.map((project) => {
                      const metrics = calculateProjectMetrics(project.inputs);
                      
                      // Strength Badge Logic
                      let badgeColor = "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800";
                      let badgeText = "Risky";
                      if (metrics.margin > 25) {
                         badgeColor = "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800";
                         badgeText = "Excellent";
                      } else if (metrics.margin > 15) {
                         badgeColor = "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800";
                         badgeText = "Good";
                      } else if (metrics.margin > 5) {
                         badgeColor = "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800";
                         badgeText = "Moderate";
                      }

                      return (
                        <tr key={project.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors group">
                          <td className="px-6 py-4 align-top">
                             <div className="font-bold text-slate-900 dark:text-white">{project.name}</div>
                             {project.inputs.ownerNotes && (
                               <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 max-w-[200px]">
                                 <span className="font-semibold">Note:</span> {project.inputs.ownerNotes}
                               </div>
                             )}
                          </td>
                          <td className="px-6 py-4 align-top text-sm text-slate-600 dark:text-slate-300">
                             <div className="flex items-center gap-1.5">
                               <MapPin size={14} className="text-slate-400" />
                               {project.inputs.location}
                             </div>
                             <div className="text-xs text-slate-400 mt-1 pl-5">
                               {project.inputs.plotSize} m² • €{formatNumber(project.inputs.plotPrice)}
                             </div>
                          </td>
                          <td className="px-6 py-4 align-top text-right font-medium text-slate-700 dark:text-slate-300">
                             {formatCurrency(metrics.totalInv)}
                          </td>
                          <td className="px-6 py-4 align-top text-right font-medium text-blue-700 dark:text-blue-300">
                             {formatCurrency(metrics.revenue)}
                          </td>
                          <td className="px-6 py-4 align-top text-right font-bold text-slate-900 dark:text-white">
                             {formatCurrency(metrics.profit)}
                             <div className="text-xs font-normal text-slate-500 dark:text-slate-400 mt-0.5">
                               {metrics.margin.toFixed(1)}% Margin
                             </div>
                          </td>
                          <td className="px-6 py-4 align-top text-center">
                             <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-bold border ${badgeColor}`}>
                               {badgeText}
                             </span>
                          </td>
                          <td className="px-6 py-4 align-top text-right">
                             <div className="flex items-center justify-end gap-2">
                               <button 
                                 onClick={() => handleLoadProject(project)}
                                 className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                                 title="Load Project"
                               >
                                 <ArrowUpRight size={18} />
                               </button>
                               <button 
                                 onClick={(e) => handleDeleteProject(e, project.id)}
                                 className="p-2 text-slate-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
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
             )}
           </div>
        </div>

      </main>
    </div>
  );
};

export default App;