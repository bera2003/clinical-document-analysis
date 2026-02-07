"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import {
  FileText,
  Upload,
  BarChart3,
  Activity,
  Brain,
  TrendingUp,
  Users,
  CheckCircle2,
  Zap,
  Cloud,
  Eye,
} from "lucide-react";

/* ---------- TYPES ---------- */

interface ProcessingStats {
  documentsProcessed: number;
  entitiesExtracted: number;
  accuracy: number;
  activeIntegrations: number;
}

interface ProcessingLog {
  id: string;
  message: string;
  status: "success" | "error" | "processing";
  timestamp: string;
}

const colorMap: Record<string, string> = {
  blue: "bg-blue-600 text-white",
  green: "bg-green-600 text-white",
  purple: "bg-purple-600 text-white",
  orange: "bg-orange-600 text-white",
};

/* ---------- MAIN COMPONENT ---------- */

export default function HealthcareNLPDashboard() {
  const { user, token, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {

  if (loading) return; // ⭐ WAIT FOR AUTH

  if (!user) router.push("/login");

}, [user, loading]);

  const [stats, setStats] = useState<ProcessingStats | null>(null);
  const [processingLogs, setProcessingLogs] = useState<ProcessingLog[]>([]);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [quickText, setQuickText] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {

    if (loading) return;

    if (!user) {
      router.push("/login");
    }

  }, [user, loading, router]);

  /* ---------- API ---------- */

  const fetchDashboardStats = async () => {
    const res = await fetch("http://localhost:8000/api/dashboard/stats", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setStats(await res.json());
  };

  const fetchProcessingLogs = async () => {
    const res = await fetch("http://localhost:8000/api/dashboard/logs", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setProcessingLogs(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    if (!user) return;
    fetchDashboardStats();
    fetchProcessingLogs();
  }, [user]);

  /* ---------- UPLOAD HANDLER ---------- */

  const handleUploadDocuments = async () => {
    if (!uploadedFile) {
      fileInputRef.current?.click();
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    const formData = new FormData();
    formData.append("file", uploadedFile);

    const res = await fetch("http://localhost:8000/upload", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    if (res.ok) {
      const interval = setInterval(() => {
        setProgress((p) => {
          if (p >= 100) {
            clearInterval(interval);
            setIsProcessing(false);
            setUploadedFile(null);
            fetchDashboardStats();
            fetchProcessingLogs();
            return 100;
          }
          return p + 20;
        });
      }, 400);
    } else {
      setIsProcessing(false);
    }
  };

  return (
    <main className="px-6 py-8 space-y-8 bg-slate-50 min-h-screen">

      {/* ACTION CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <UploadCard
          uploadedFile={uploadedFile}
          isProcessing={isProcessing}
          progress={progress}
          fileInputRef={fileInputRef}
          onFileChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setUploadedFile(e.target.files?.[0] || null)
          }
          onUploadClick={handleUploadDocuments}
        />
        <ActionCard
  icon={Brain}
  title="Entity Extraction"
  color="green"
  route="/dashboard/entities"
/>

<ActionCard
  icon={BarChart3}
  title="Analytics"
  color="purple"
  route="/dashboard/analytics"
/>

<ActionCard
  icon={Cloud}
  title="EHR Integration"
  color="orange"
  route="/dashboard/ehr"
/>
      </div>

      {/* PROCESSING MONITOR */}
<Card className="shadow-xl border-0">
  <CardHeader>
    <CardTitle className="flex items-center gap-2 text-lg">
      <div className="p-2 rounded-lg bg-blue-100">
        <Activity className="text-blue-600 h-5 w-5" />
      </div>
      Processing Monitor
    </CardTitle>
  </CardHeader>

  <CardContent className="space-y-3">
    {processingLogs.length === 0 && (
      <div className="text-sm text-slate-500 text-center py-6">
        No recent processing activity
      </div>
    )}

    {processingLogs.slice(0, 5).map((log) => (
      <div
        key={log.id}
        className="flex items-center justify-between bg-slate-50 rounded-lg p-4 shadow-sm hover:shadow-md transition"
      >
        {/* Left */}
        <div className="flex items-center gap-3">
          <div
            className={`p-2 rounded-full ${
              log.status === "success"
                ? "bg-green-100"
                : log.status === "error"
                ? "bg-red-100"
                : "bg-yellow-100"
            }`}
          >
            {log.status === "success" && (
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            )}
            {log.status === "error" && (
              <Users className="h-4 w-4 text-red-600" />
            )}
            {log.status === "processing" && (
              <Activity className="h-4 w-4 text-yellow-600 animate-pulse" />
            )}
          </div>

          <div>
            <p className="text-sm font-medium text-slate-800">
              {log.message}
            </p>
            <p className="text-xs text-slate-500">
              {new Date(log.timestamp + "Z").toLocaleString("en-IN", {
  hour: "numeric",
  minute: "numeric",
  hour12: true,
  day: "2-digit",
  month: "short",
  year: "numeric",
})}
            </p>
          </div>
        </div>

        {/* Status Badge */}
        <span
          className={`text-xs font-semibold px-3 py-1 rounded-full ${
            log.status === "success"
              ? "bg-green-100 text-green-700"
              : log.status === "error"
              ? "bg-red-100 text-red-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {log.status}
        </span>
      </div>
    ))}
  </CardContent>
</Card>

      {/* QUICK EXTRACTION */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="text-yellow-500" />
            Quick Extraction
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Enter clinical text..."
            value={quickText}
            onChange={(e) => setQuickText(e.target.value)}
          />
          <Button className="mt-3 w-full">
            <Eye className="mr-2 h-4 w-4" />
            Extract Entities
          </Button>
        </CardContent>
      </Card>

      {/* STATISTICS */}
      {stats && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="text-blue-600" />
              System Statistics
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Stat icon={FileText} label="Documents" value={stats.documentsProcessed} />
            <Stat icon={Brain} label="Entities" value={stats.entitiesExtracted} />
            <Stat icon={CheckCircle2} label="Accuracy" value={stats.accuracy} suffix="%" />
            <Stat icon={Users} label="Integrations" value={stats.activeIntegrations} />
          </CardContent>
        </Card>
      )}
    </main>
  );
}

/* ---------- UPLOAD CARD ---------- */

function UploadCard({
  uploadedFile,
  isProcessing,
  progress,
  fileInputRef,
  onFileChange,
  onUploadClick,
}: any) {
  return (
    <Card className="bg-gradient-to-br from-blue-50 to-white shadow-xl">
      <CardHeader className="text-center">
        <Upload className="mx-auto text-blue-600 h-8 w-8" />
        <CardTitle>Upload Documents</CardTitle>
        <CardDescription>PDF • TXT • JSON</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={onFileChange}
        />

        <Button className="w-full" onClick={onUploadClick}>
          {uploadedFile ? "Process File" : "Upload"}
        </Button>

        {uploadedFile && (
          <p className="text-xs text-center">
            Selected: {uploadedFile.name}
          </p>
        )}

        {isProcessing && <Progress value={progress} />}
      </CardContent>
    </Card>
  );
}

/* ---------- OTHER COMPONENTS ---------- */

function ActionCard({ icon: Icon, title, color, route }: any) {
  return (
    <Link href={route}>
      <Card className="cursor-pointer hover:shadow-xl transition">
        <CardHeader className="text-center">
          <div className={`mx-auto p-3 rounded-full ${colorMap[color]}`}>
            <Icon className="h-6 w-6" />
          </div>
          <CardTitle>{title}</CardTitle>
        </CardHeader>

        <CardContent>
          <Button className={`w-full ${colorMap[color]}`}>
            {title}
          </Button>
        </CardContent>
      </Card>
    </Link>
  );
}

function Stat({ icon: Icon, label, value, suffix = "" }: any) {
  return (
    <div className="text-center p-4 bg-white rounded-lg shadow">
      <Icon className="mx-auto mb-2 text-blue-600" />
      <div className="text-xl font-bold">
        {value}
        {suffix}
      </div>
      <div className="text-sm text-gray-600">{label}</div>
    </div>
  );
}

