import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Building2, 
  Map as MapIcon, 
  Euro, 
  TrendingUp, 
  Calculator, 
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
  LogOut,
  ArrowRight,
  ExternalLink,
  ShieldAlert,
  Printer,
  LucideIcon
} from 'lucide-react';
import { 
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
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

const MapView = ({ location }: { location: string }) => {
  // Simple embed map based on location string
  const mapUrl = `https://www.google.com/maps?q=${encodeURIComponent(location || 'Greece')}&output=embed`;
  
  return (
    <div className="w-full h-40 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 mt-4 relative bg-slate-100 dark:bg-slate-900">
      <iframe
        title="Location Map"
        width="100%"
        height="100%"
        frameBorder="0"
        style={{ border: 0 }}
        src={mapUrl}
        allowFullScreen
        loading="lazy"
        className="opacity-90 hover:opacity-100 transition-opacity"
      ></iframe>
      <div className="absolute bottom-2 right-2 bg-white/90 dark:bg-slate-800/90 px-2 py-1 rounded text-[10px] font-bold shadow-sm pointer-events-none text-slate-600 dark:text-slate-300">
        Google Maps
      </div>
    </div>
  );
};

const LoginScreen = ({ onLogin }: { onLogin: () => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

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
              {/* Using Lock icon here conceptually */}
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-900 dark:focus:ring-blue-500 outline-none transition-all text-slate-900 dark:text-white"
                placeholder="Enter your password"
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              </div>
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
      </div>
    </div>
  );
};

const StrengthGauge = ({ margin }: { margin: number }) => {
  const minMargin = -5;
  const maxMargin = 35;
  const range = maxMargin - minMargin;
  const rawPercentage = ((margin - minMargin) / range) * 100;
  const percentage = Math.min(100, Math.max(0, rawPercentage));

  let label = "Critical";
  let labelColor = "text-red-500";

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
      <div className="flex justify-between items-end mb-3 relative">
         <span className="text-xs font-medium text-slate-400 w-24">Risk (0%)</span>
         <div className="text-center flex-1">
            <span className={`text-2xl font-bold ${labelColor} tracking-tight`}>{label}</span>
         </div>
         <span className="text-xs font-medium text-slate-400 w-24 text-right">Opp. (100%)</span>
      </div>
      
      <div className="relative h-12 flex items-center select-none">
        <div className="h-6 w-full rounded-full relative shadow-inner"
             style={{
               background: 'linear-gradient(90deg, #ef4444 0%, #f97316 35%, #eab308 50%, #84cc16 75%, #22c55e 100%)',
             }}
        >
            <div
                className="absolute top-1/2 -translate-y-1/2 w-4 h-10 bg-slate-900 dark:bg-slate-100 rounded-full shadow-xl transition-all duration-700 ease-out border-[3px] border-white dark:border-slate-800 cursor-pointer group z-10"
                style={{ left: `calc(${percentage}% - 8px)` }}
            >
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900 text-xs font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg pointer-events-none">
                    {margin.toFixed(1)}%
                    <div className="absolute top-100 left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800 dark:border-t-slate-200"></div>
                </div>
            </div>
        </div>
      </div>

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
  const calculateRisk = (m: number) => {
    if (m >= 30) return 0;
    if (m <= 0) return 100;
    return 100 - (m / 30) * 100;
  };

  const risk = calculateRisk(margin);
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

const ProgressRing = ({ 
  percentage, 
  label, 
  colorClass, 
  icon: Icon, 
  trailColorClass = "text-slate-100 dark:text-slate-700" 
}: { 
  percentage: number, 
  label: string, 
  colorClass: string, 
  icon?: LucideIcon, 
  trailColorClass?: string 
}) => {
  const radius = 55; // MUCH BIGGER
  const stroke = 10; // Thicker stroke
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center w-full h-full py-2">
      <div className="relative flex items-center justify-center mb-3">
        <svg
          height={radius * 2}
          width={radius * 2}
          className="rotate-[-90deg]"
        >
          <circle
            stroke="currentColor"
            fill="transparent"
            strokeWidth={stroke}
            strokeDasharray={circumference + ' ' + circumference}
            style={{ strokeDashoffset: 0 }}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            className={trailColorClass}
          />
          <circle
            stroke="currentColor"
            fill="transparent"
            strokeWidth={stroke}
            strokeDasharray={circumference + ' ' + circumference}
            style={{ strokeDashoffset }}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            className={`${colorClass} transition-all duration-1000 ease-out`}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {Icon && <Icon size={24} className="text-slate-400 dark:text-slate-500 mb-1" />}
          <span className="text-3xl font-bold text-slate-700 dark:text-white leading-none">
            {percentage}%
          </span>
        </div>
      </div>
      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</span>
    </div>
  );
};

const getStrengthLabel = (margin: number) => {
  if (margin >= 25) return { label: "Excellent", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" };
  if (margin >= 18) return { label: "Very Good", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" };
  if (margin >= 12) return { label: "Good", color: "bg-lime-100 text-lime-700 dark:bg-lime-900/30 dark:text-lime-400" };
  if (margin >= 5) return { label: "Moderate", color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" };
  return { label: "High Risk", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" };
};

const INITIAL_INPUTS: ProjectInputs = {
  location: "Athens, Greece",
  ownerNotes: "",
  plotSize: 500,
  plotPrice: 150000,
  buildingCoefficient: 0.8,
  constructionCostPerSqm: 1800,
  salePricePerSqm: 4200,
  miscCostsPercent: 5,
};

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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [inputs, setInputs] = useState<ProjectInputs>(INITIAL_INPUTS);
  const [savedProjects, setSavedProjects] = useState<SavedProject[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);
  
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
  const [activeTab, setActiveTab] = useState<'overview' | 'saved' | 'design'>('overview');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

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

  const results: CalculationResults = useMemo(() => {
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

  const handleInputChange = (field: keyof ProjectInputs, value: number | string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
    if (aiState.content) {
      setAiState(prev => ({ ...prev, content: null, error: null }));
    }
  };

  const handleReset = () => {
    setInputs({...EMPTY_INPUTS});
    setAiState({ loading: false, content: null, error: null });
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
    const currentLocation = inputs.location.trim().toLowerCase();
    const isDuplicate = savedProjects.some(p => p.inputs.location.trim().toLowerCase() === currentLocation);
    if (isDuplicate) {
      setSaveModalOpen(false);
      setDuplicateWarningOpen(true);
      return;
    }
    await executeSave();
  };

  const handleLoadProject = (project: SavedProject) => {
    setInputs(project.inputs);
    setAiState({ loading: false, content: null, error: null });
    setActiveTab('overview');
    setNotification({ message: `Loaded "${project.name}"`, type: 'success' });
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
      setDesignState(prev => ({ ...prev, loading: false, generatedImage: resultImage }));
    } catch (err: any) {
      let errorMsg = "Failed to generate design: " + err.message;
      if (err.message === "ENABLE_API_REQUIRED" || err.message === "API_KEY_RESTRICTED" || err.message === "API_KEY_LEAKED") {
         errorMsg = "API Service Blocked. See Analysis section.";
         setAiState(prev => ({ ...prev, error: err.message }));
      }
      setDesignState(prev => ({ ...prev, loading: false, error: errorMsg }));
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setNotification({ message: "Logged out successfully", type: 'success' });
  };

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

  if (!isAuthenticated) {
    return (
      <>
        {notification && <NotificationBanner message={notification.message} type={notification.type} onClose={() => setNotification(null)} />}
        <LoginScreen onLogin={() => { setIsAuthenticated(true); setNotification({ message: "Welcome back, Sakis", type: 'success' }); }} />
      </>
    );
  }

  // Calculate percentage values for rings
  const plotPct = Math.round((inputs.plotPrice / results.constructionCostTotalInclPlot) * 100);
  const constrPct = Math.round((results.constructionCostTotal / results.constructionCostTotalInclPlot) * 100);
  const softPct = Math.round((results.miscCostsValue / results.constructionCostTotalInclPlot) * 100);

  // Revenue Chart Data
  const revenueData = [
    { name: 'Total Cost', value: results.constructionCostTotalInclPlot },
    { name: 'Revenue', value: results.revenueTotal },
  ];

  const costBreakdownData = [
    { name: 'Plot', value: inputs.plotPrice, color: isDarkMode ? '#3b82f6' : '#1e3a8a' }, 
    { name: 'Construction', value: results.constructionCostTotal, color: isDarkMode ? '#0ea5e9' : '#2563eb' }, 
    { name: 'Misc/Tax', value: results.miscCostsValue, color: isDarkMode ? '#94a3b8' : '#64748b' }, 
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 pb-12 transition-colors duration-200 relative">
      
      {/* --- MODALS --- */}
      {saveModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200 dark:border-slate-700">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Save Project</h3>
                <button onClick={() => setSaveModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Project Name</label>
                  <input type="text" value={saveProjectName} onChange={(e) => setSaveProjectName(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:ring-2 focus:ring-blue-500 outline-none" autoFocus />
                </div>
              </div>
              <div className="flex gap-3 mt-8 justify-end">
                <button onClick={() => setSaveModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">Cancel</button>
                <button onClick={handleConfirmSave} className="px-6 py-2 text-sm font-bold text-white bg-blue-900 dark:bg-blue-600 hover:bg-blue-950 rounded-lg shadow-sm">Save Project</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {duplicateWarningOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden border-2 border-amber-200 dark:border-amber-900/50">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mb-4 text-amber-600 mx-auto"><AlertTriangle size={32} /></div>
              <h3 className="text-xl font-bold">Duplicate Address Found</h3>
              <p className="text-slate-500 mt-2">A project with location "{inputs.location}" already exists.</p>
              <div className="flex flex-col gap-3 mt-6">
                <button onClick={executeSave} className="w-full py-3 text-sm font-bold text-white bg-blue-900 rounded-xl">Yes, Save Anyway</button>
                <button onClick={() => setDuplicateWarningOpen(false)} className="w-full py-3 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {deleteConfirmationId && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border-2 border-red-100 dark:border-red-900/50">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4 text-red-600 mx-auto"><Trash2 size={32} /></div>
              <h3 className="text-xl font-bold">Delete Project?</h3>
              <p className="text-slate-500 mt-2">Are you sure you want to delete "{savedProjects.find(p => p.id === deleteConfirmationId)?.name}"?</p>
              <div className="flex flex-col gap-3 mt-6">
                <button onClick={confirmDelete} className="w-full py-3 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl">Yes, Delete Permanently</button>
                <button onClick={() => setDeleteConfirmationId(null)} className="w-full py-3 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {notification && <NotificationBanner message={notification.message} type={notification.type} onClose={() => setNotification(null)} />}

      {/* --- HEADER --- */}
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-blue-900 text-white p-2 rounded-lg"><Building2 size={24} /></div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Domos</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium hidden sm:block">Development Calculator</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Primary Action Buttons */}
            {activeTab === 'overview' && (
              <div className="flex gap-2 mr-2">
                <button 
                  onClick={handleReset} 
                  className="hidden sm:flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700 rounded-lg transition-colors"
                  title="Reset All Inputs"
                >
                  <RotateCcw size={16} />
                  Reset
                </button>
                <button 
                  onClick={handleOpenSaveModal}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white text-sm font-bold rounded-lg shadow-sm transition-all active:scale-95"
                >
                  <Save size={16} />
                  Save Project
                </button>
                <button
                  onClick={() => window.print()}
                  className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg dark:text-slate-400 dark:hover:bg-slate-700"
                  title="Print / PDF"
                >
                  <Printer size={20} />
                </button>
              </div>
            )}

            <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-1"></div>
            
            <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700 rounded-lg">
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            <div className="flex items-center gap-2 ml-2">
              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-800 dark:text-blue-200 font-bold text-xs">S</div>
            </div>
            <button onClick={handleLogout} className="text-slate-400 hover:text-red-500 ml-1"><LogOut size={20} /></button>
          </div>
        </div>
      </header>

      {/* --- MAIN CONTENT --- */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl mb-8 max-w-md mx-auto shadow-inner">
          <button onClick={() => setActiveTab('overview')} className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all ${activeTab === 'overview' ? 'bg-white dark:bg-slate-700 text-blue-900 dark:text-white shadow-sm' : 'text-slate-500'}`}>
            <Calculator size={16} /> Calculator
          </button>
          <button onClick={() => setActiveTab('saved')} className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all ${activeTab === 'saved' ? 'bg-white dark:bg-slate-700 text-blue-900 dark:text-white shadow-sm' : 'text-slate-500'}`}>
            <FolderOpen size={16} /> Saved
          </button>
          <button onClick={() => setActiveTab('design')} className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all ${activeTab === 'design' ? 'bg-white dark:bg-slate-700 text-purple-700 dark:text-purple-300 shadow-sm' : 'text-slate-500'}`}>
            <Sparkles size={16} /> AI Design
          </button>
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* --- LEFT COLUMN: INPUTS & MAP --- */}
              <div className="lg:col-span-4 space-y-6">
                
                {/* Project Details Card */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm">
                  <h2 className="text-lg font-bold flex items-center gap-2 mb-4 text-slate-800 dark:text-white">
                    <MapPin size={20} className="text-blue-600" />
                    Plot Details
                  </h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Location / Area</label>
                      <input 
                        type="text" 
                        value={inputs.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-medium text-slate-900 dark:text-white"
                        placeholder="e.g. Glyfada, Athens"
                      />
                    </div>
                    
                    <div>
                       <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Owner Contact / Notes</label>
                       <textarea 
                          value={inputs.ownerNotes || ''}
                          onChange={(e) => handleInputChange('ownerNotes', e.target.value)}
                          className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm min-h-[60px] resize-none text-slate-900 dark:text-white"
                          placeholder="Name, Phone, Comments..."
                       />
                    </div>

                    {/* Google Map Embed */}
                    <MapView location={inputs.location} />
                  </div>
                </div>

                {/* Parameters Inputs */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <InputCard
                      label="Plot Price"
                      value={inputs.plotPrice}
                      onChange={(val) => handleInputChange('plotPrice', val)}
                      icon={Euro}
                      unit="EUR"
                      step={1000}
                      action={
                        <button onClick={handleEstimatePrice} disabled={isEstimatingPrice} className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded hover:bg-blue-100 transition-colors flex items-center gap-1">
                          {isEstimatingPrice ? <div className="animate-spin w-2 h-2 border-2 border-blue-600 border-t-transparent rounded-full"></div> : <Wand2 size={10} />}
                          Auto-Estimate
                        </button>
                      }
                    />
                    <InputCard
                      label="Plot Size"
                      value={inputs.plotSize}
                      onChange={(val) => handleInputChange('plotSize', val)}
                      icon={LandPlot}
                      unit="m²"
                      step={10}
                    />
                  </div>

                  <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                        <Scale size={18} />
                        <label className="text-sm font-medium">Building Coefficient (Factor)</label>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <input 
                        type="number" 
                        value={inputs.buildingCoefficient} 
                        onChange={(e) => handleInputChange('buildingCoefficient', parseFloat(e.target.value) || 0)}
                        step={0.1} min={0.1} max={5.0}
                        className="w-20 text-2xl font-bold bg-transparent outline-none text-slate-900 dark:text-white border-b-2 border-slate-200 focus:border-blue-500 text-center"
                      />
                      <span className="text-xs text-slate-400">Syntelesis Domisis (e.g. 0.8, 1.2)</span>
                    </div>
                    
                    {/* Highlighted Max Buildable */}
                    <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center bg-blue-50/50 dark:bg-blue-900/20 p-2 rounded-lg">
                      <span className="text-xs font-bold text-blue-900 dark:text-blue-300">Max Buildable Area (Calculated)</span>
                      <span className="text-lg font-extrabold text-blue-900 dark:text-blue-300">{Math.round(results.maxBuildableArea)} <span className="text-xs font-medium">m²</span></span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1 text-center">{inputs.plotSize} m² x {inputs.buildingCoefficient} Factor</p>
                  </div>

                  {/* Financials Header */}
                  <h3 className="text-sm font-bold text-slate-500 flex items-center gap-2 mt-6">
                    <Calculator size={16} /> Financials
                  </h3>

                  <InputCard
                    label="Construction Cost (Hard)"
                    value={inputs.constructionCostPerSqm}
                    onChange={(val) => handleInputChange('constructionCostPerSqm', val)}
                    icon={Hammer}
                    unit="€/m²"
                    step={50}
                    helperText="Excluding plot price"
                  />

                  <InputCard
                      label="Misc Costs Buffer"
                      value={inputs.miscCostsPercent}
                      onChange={(val) => handleInputChange('miscCostsPercent', val)}
                      icon={Layers}
                      unit="%"
                      step={1}
                      max={20}
                      helperText="Taxes, notary, permits"
                  />
                  
                  <InputCard
                    label="Target Sale Price"
                    value={inputs.salePricePerSqm}
                    onChange={(val) => handleInputChange('salePricePerSqm', val)}
                    icon={TrendingUp}
                    unit="€/m²"
                    step={50}
                    highlight
                  />
                </div>
              </div>

              {/* --- RIGHT COLUMN: STATS & CHARTS --- */}
              <div className="lg:col-span-8 space-y-6">
                
                {/* Key Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <StatCard 
                    label="Total Investment" 
                    value={formatNumber(results.constructionCostTotalInclPlot)}
                    subValue="Inc. Land & 5% Misc"
                    icon={Euro}
                    color="slate"
                  />
                  <StatCard 
                    label="Potential Revenue" 
                    value={formatNumber(results.revenueTotal)}
                    subValue={`@ ${inputs.salePricePerSqm} /m²`}
                    icon={TrendingUp}
                    color="blue"
                  />
                  <StatCard 
                    label="Net Profit" 
                    value={formatNumber(results.profitTotal)}
                    subValue={`${results.profitMargin.toFixed(1)}% Margin`}
                    icon={Wallet}
                    trend={results.profitTotal > 0 ? 'positive' : 'negative'}
                    color={results.profitTotal > 0 ? 'green' : 'amber'}
                  />
                </div>

                {/* Analysis Tabs Container */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                  <div className="border-b border-slate-100 dark:border-slate-700 px-6 py-3 flex gap-6 text-sm font-medium">
                    <button className="text-blue-900 dark:text-blue-400 border-b-2 border-blue-900 dark:border-blue-400 pb-2.5 -mb-3.5">Visual Analysis</button>
                    <button className="text-slate-500 hover:text-slate-800 pb-2.5">Cost Structure</button>
                    <button className="text-slate-500 hover:text-slate-800 pb-2.5">Design Studio</button>
                  </div>
                  
                  {/* Visual Analysis Main Content */}
                  <div className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                       {/* Left Column: Gauge + Risk Bar */}
                       <div className="flex flex-col gap-6">
                          <StrengthGauge margin={results.profitMargin} />
                          <RiskBar margin={results.profitMargin} />
                       </div>
                       
                       {/* Right Column: Expense Breakdown Only */}
                       <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 border border-slate-100 dark:border-slate-700 flex flex-col justify-between">
                           <h4 className="text-xs font-bold text-slate-500 uppercase mb-4 flex items-center gap-2"><Layers size={14}/> Expense Breakdown</h4>
                           
                           {/* Updated Grid Layout for Cards */}
                           <div className="grid grid-cols-3 gap-3 h-full">
                               <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-3 flex flex-col items-center justify-center shadow-sm">
                                   <ProgressRing 
                                      percentage={plotPct} 
                                      label="Plot" 
                                      colorClass="text-blue-900 dark:text-blue-500"
                                      icon={MapIcon}
                                   />
                               </div>
                               <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-3 flex flex-col items-center justify-center shadow-sm">
                                   <ProgressRing 
                                      percentage={constrPct} 
                                      label="Construction" 
                                      colorClass="text-blue-600 dark:text-blue-400"
                                      icon={Hammer}
                                   />
                               </div>
                               <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-3 flex flex-col items-center justify-center shadow-sm">
                                   <ProgressRing 
                                      percentage={softPct} 
                                      label="Soft Costs" 
                                      colorClass="text-slate-400 dark:text-slate-500"
                                      icon={Wallet}
                                   />
                               </div>
                           </div>
                        </div>
                    </div>

                    {/* Full Width Break-even Bar */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-100 dark:border-blue-800/50 mb-6">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-semibold text-blue-900 dark:text-blue-300">Break-even Price</span>
                          <span className="text-sm font-bold text-blue-900 dark:text-blue-300">{formatCurrency(results.costPerSqmInclPlot)} /m²</span>
                        </div>
                        <div className="h-3 w-full bg-blue-200 dark:bg-blue-800 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-900 dark:bg-blue-400" style={{ width: `${Math.min((results.costPerSqmInclPlot / inputs.salePricePerSqm) * 100, 100)}%` }}></div>
                        </div>
                        <div className="text-right mt-1">
                          <span className="text-xs text-blue-600 dark:text-blue-400">Current margin safety: {results.profitMargin.toFixed(1)}%</span>
                        </div>
                    </div>

                    {/* Revenue Chart */}
                    <div className="px-0 pt-2">
                        <h4 className="text-xs font-bold text-slate-500 uppercase mb-4">Revenue vs Investment</h4>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-xs mb-1">
                                  <span className="font-medium text-slate-500">Total Cost</span>
                                </div>
                                <div className="h-8 bg-slate-500 rounded-md relative flex items-center px-3 text-white text-xs font-bold" style={{ width: `${Math.min((results.constructionCostTotalInclPlot / results.revenueTotal) * 100, 100)}%` }}></div>
                            </div>
                            <div>
                                <div className="flex justify-between text-xs mb-1">
                                  <span className="font-medium text-slate-500">Revenue</span>
                                </div>
                                <div className="h-8 bg-emerald-500 rounded-md relative flex items-center px-3 text-white text-xs font-bold" style={{ width: '100%' }}></div>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100 dark:border-slate-700">
                            <div className="text-center">
                                <p className="text-[10px] font-bold text-slate-400 uppercase">Constr. Cost</p>
                                <p className="font-bold text-slate-800 dark:text-white">{formatNumber(results.constructionCostTotal)}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-[10px] font-bold text-slate-400 uppercase">Total Cost/m²</p>
                                <p className="font-bold text-slate-800 dark:text-white">{formatNumber(results.costPerSqmInclPlot)}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-[10px] font-bold text-slate-400 uppercase">ROI</p>
                                <p className="font-bold text-emerald-600">{results.roi.toFixed(1)}%</p>
                            </div>
                            <div className="text-center">
                                <p className="text-[10px] font-bold text-slate-400 uppercase">Margin</p>
                                <p className="font-bold text-emerald-600">{results.profitMargin.toFixed(1)}%</p>
                            </div>
                        </div>
                    </div>
                  </div>
                </div>

                {/* AI Consultant */}
                <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-slate-800 dark:to-slate-800/50 rounded-2xl border border-indigo-100 dark:border-slate-700 p-6 relative overflow-hidden">
                  <div className="flex justify-between items-start mb-4 relative z-10">
                      <div className="flex items-center gap-2">
                        <Sparkles className="text-indigo-600 dark:text-indigo-400" size={20} />
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Gemini AI Investment Consultant</h3>
                      </div>
                      <button
                        onClick={handleGenerateAI}
                        disabled={aiState.loading}
                        className="bg-indigo-900 hover:bg-indigo-800 text-white px-4 py-1.5 rounded-lg text-xs font-bold transition-colors shadow-sm disabled:opacity-50"
                      >
                        {aiState.loading ? 'Analyzing...' : 'Analyze Investment'}
                      </button>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-4 max-w-2xl relative z-10">
                      Get an instant professional opinion on this project's viability in the Greek market.
                  </p>
                  {aiState.error && (
                      <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-lg p-3 text-xs text-red-800 dark:text-red-200 mb-4 relative z-10">
                         <p className="font-bold">Error: {aiState.error}</p>
                      </div>
                  )}
                  {aiState.content && (
                      <div className="bg-white/80 dark:bg-slate-900/80 rounded-lg p-4 text-sm text-slate-800 dark:text-slate-200 border border-indigo-100 dark:border-slate-700 relative z-10 whitespace-pre-wrap">
                         {aiState.content}
                      </div>
                  )}
                  {/* Background Decor */}
                  <div className="absolute -bottom-4 -right-4 opacity-5 pointer-events-none">
                    <Sparkles size={150} />
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}
        
        {/* --- SAVED PROJECTS DASHBOARD (Separate Tab) --- */}
        {activeTab === 'saved' && (
           <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-3">
                     <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg"><FolderOpen size={24} /></div>
                     <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Saved Projects Dashboard</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Manage and compare your investment scenarios</p>
                     </div>
                  </div>
                  <div className="text-sm font-medium text-slate-500">{savedProjects.length} Records</div>
               </div>

               {isLoadingProjects ? (
                  <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                     <div className="animate-spin mb-3 text-blue-600"><RotateCcw size={24} /></div>
                     <p>Loading projects...</p>
                  </div>
               ) : savedProjects.length === 0 ? (
                  <div className="bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 p-8 text-center">
                     <p className="text-slate-500">No saved projects yet. Click "Save Project" to add one.</p>
                  </div>
               ) : (
                  <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                     <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                           <thead>
                              <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                                 <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Project Name & Owner</th>
                                 <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Address / Location</th>
                                 <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Total Investment</th>
                                 <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Potential Revenue</th>
                                 <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Net Profit</th>
                                 <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Strength</th>
                                 <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Actions</th>
                              </tr>
                           </thead>
                           <tbody>
                              {savedProjects.map((project) => {
                                 const metrics = calculateProjectMetrics(project.inputs);
                                 const strength = getStrengthLabel(metrics.margin);
                                 return (
                                    <tr key={project.id} className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group">
                                       <td className="p-4">
                                          <div className="font-bold text-slate-900 dark:text-white">{project.name}</div>
                                          <div className="text-xs text-slate-500 truncate max-w-[150px]">{project.inputs.ownerNotes}</div>
                                       </td>
                                       <td className="p-4">
                                          <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 text-sm">
                                             <MapPin size={14} className="text-slate-400" />
                                             {project.inputs.location}
                                          </div>
                                          <div className="text-xs text-slate-400 mt-1 pl-5">
                                             {project.inputs.plotSize} m² • {formatNumber(project.inputs.plotPrice)} €
                                          </div>
                                       </td>
                                       <td className="p-4 text-right font-medium text-slate-700 dark:text-slate-300">{formatNumber(metrics.totalInv)} €</td>
                                       <td className="p-4 text-right font-medium text-blue-600 dark:text-blue-400">{formatNumber(metrics.revenue)} €</td>
                                       <td className="p-4 text-right">
                                          <div className={`font-bold ${metrics.profit > 0 ? 'text-slate-900 dark:text-white' : 'text-red-600'}`}>{formatNumber(metrics.profit)} €</div>
                                          <div className="text-xs text-slate-500">{metrics.margin.toFixed(1)}% Margin</div>
                                       </td>
                                       <td className="p-4 text-center">
                                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${strength.color}`}>
                                             {strength.label}
                                          </span>
                                       </td>
                                       <td className="p-4 text-center">
                                          <div className="flex items-center justify-center gap-2">
                                             <button onClick={() => handleLoadProject(project)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Load"><ArrowRight size={16} /></button>
                                             <button onClick={(e) => handleDeleteClick(e, project.id)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete"><Trash2 size={16} /></button>
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

        {/* AI Design Tab Content */}
        {activeTab === 'design' && (
           <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
                 <div className="p-8 border-b border-slate-100 dark:border-slate-700">
                    <div className="flex items-center gap-3 mb-2">
                       <div className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg"><Wand2 size={24} /></div>
                       <h2 className="text-2xl font-bold">AI Design Studio</h2>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 max-w-2xl">Upload a photo of your plot or an existing structure, and let AI visualize potential developments or renovations instantly.</p>
                 </div>
                 <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                       <h3 className="font-semibold text-slate-900 dark:text-white">1. Upload Source Image</h3>
                       <div onClick={() => fileInputRef.current?.click()} className={`aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-slate-50 dark:hover:bg-slate-700/50 relative overflow-hidden group ${designState.originalImage ? 'border-purple-200 dark:border-purple-900' : 'border-slate-300 dark:border-slate-600'}`}>
                          {designState.originalImage ? (
                             <img src={designState.originalImage} alt="Source" className="w-full h-full object-cover" />
                          ) : (
                             <div className="text-center p-6"><Upload size={32} className="mx-auto text-slate-400 mb-2 group-hover:scale-110 transition-transform" /><p className="text-sm font-medium text-slate-600 dark:text-slate-400">Click to upload photo</p></div>
                          )}
                          <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*"/>
                       </div>
                    </div>
                    <div className="space-y-4">
                       <h3 className="font-semibold text-slate-900 dark:text-white">2. AI Generation</h3>
                       <div className={`aspect-square rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center relative overflow-hidden ${designState.loading ? 'animate-pulse' : ''}`}>
                          {designState.loading ? (
                             <div className="text-center"><Wand2 size={32} className="mx-auto text-purple-500 animate-spin mb-2" /><p className="text-sm font-medium text-purple-600 dark:text-purple-400">Generating Vision...</p></div>
                          ) : designState.generatedImage ? (
                             <><img src={designState.generatedImage} alt="Generated" className="w-full h-full object-cover animate-in fade-in" /><a href={designState.generatedImage} download="domos-design.png" className="absolute bottom-4 right-4 p-2 bg-white/90 text-slate-900 rounded-lg shadow-lg hover:bg-white transition-colors" title="Download"><Download size={18} /></a></>
                          ) : designState.error ? (
                             <div className="text-center p-6 text-red-500"><AlertTriangle size={32} className="mx-auto mb-2" /><p className="text-sm">{designState.error}</p></div>
                          ) : (
                             <div className="text-center p-6 text-slate-400"><ImagePlus size={32} className="mx-auto mb-2 opacity-50" /><p className="text-sm">Result will appear here</p></div>
                          )}
                       </div>
                    </div>
                 </div>
                 <div className="p-8 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-700">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Describe your vision</label>
                    <div className="flex gap-2">
                       <input type="text" value={designState.prompt} onChange={(e) => setDesignState(prev => ({ ...prev, prompt: e.target.value }))} className="flex-1 p-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-purple-500 outline-none" placeholder="e.g. Modern two-story villa..." />
                       <button onClick={handleGenerateDesign} disabled={!designState.originalImage || designState.loading} className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 rounded-xl font-bold flex items-center gap-2 transition-colors shadow-md"><Wand2 size={18} /> Generate</button>
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