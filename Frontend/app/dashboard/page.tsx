"use client"
import { useState, useEffect, useRef } from "react"
import type React from "react"
import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import {
  FileText,
  Upload,
  BarChart3,
  Database,
  Activity,
  Stethoscope,
  Brain,
  TrendingUp,
  Users,
  CheckCircle2,
  Zap,
  Cloud,
  Settings,
  Home,
  Eye,
  Sparkles,
  RefreshCw,
} from "lucide-react"

interface ProcessingStats {
  documentsProcessed: number
  entitiesExtracted: number
  accuracy: number
  activeIntegrations: number
  monthlyChange: number
}

interface ProcessingLog {
  id: string
  documentId: string
  status: string
  progress: number
  message: string
  timestamp: Date
}

interface AnalyticsData {
  mostFrequentDiagnoses: Array<{ name: string; count: number; icdCode: string }>
  medicationTrends: Array<{ medication: string; count: number; trend: number }>
  riskFactors: Array<{ factor: string; severity: string; count: number }>
}

export default function HealthcareNLPDashboard() {
  const { user, token, logout } = useAuth()
const router = useRouter()

useEffect(() => {
  if (!user) {
    router.push("/login")
  }
}, [user])

  const [isProcessing, setIsProcessing] = useState(false)
  const [processingProgress, setProcessingProgress] = useState(0)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [quickText, setQuickText] = useState("")
  const [quickResults, setQuickResults] = useState<any>(null)
  const [processingLogs, setProcessingLogs] = useState<ProcessingLog[]>([])
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [stats, setStats] = useState<ProcessingStats>({
    documentsProcessed: 1247,
    entitiesExtracted: 8934,
    accuracy: 94.7,
    activeIntegrations: 3,
    monthlyChange: 12.5,
  })

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [settings, setSettings] = useState({
    autoProcessing: true,
    realTimeUpdates: true,
    confidenceThreshold: 85,
    notificationsEnabled: true,
    darkMode: false,
  })

  useEffect(() => {
    // Fetch initial data
    fetchProcessingStatus()
    fetchAnalytics()

    // Set up polling for real-time updates
    const interval = setInterval(() => {
      fetchProcessingStatus()
      setStats((prev) => ({
        ...prev,
        documentsProcessed: prev.documentsProcessed + Math.floor(Math.random() * 3),
        entitiesExtracted: prev.entitiesExtracted + Math.floor(Math.random() * 15),
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const fetchProcessingStatus = async () => {
    try {
      const response = await fetch("/api/processing/status")
      const data = await response.json()
      if (data.logs) {
        setProcessingLogs(
          data.logs.map((log: any) => ({
            ...log,
            timestamp: new Date(log.timestamp),
          })),
        )
      }
    } catch (error) {
      console.error("Failed to fetch processing status:", error)
    }
  }

  const fetchAnalytics = async () => {
    try {
      const response = await fetch("/api/analytics")
      const data = await response.json()
      if (data.analytics) {
        setAnalytics(data.analytics)
      }
    } catch (error) {
      console.error("Failed to fetch analytics:", error)
    }
  }

const handleUploadDocuments = async () => {
  if (!uploadedFile) {
    fileInputRef.current?.click()
    return
  }

  setIsProcessing(true)
  setProcessingProgress(0)

  try {
    const formData = new FormData()
    formData.append("file", uploadedFile)

  const uploadResponse = await fetch("http://localhost:8000/upload", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`,
  },
  body: formData,
})

    const uploadResult = await uploadResponse.json()

    if (uploadResponse.ok) {
      // Simulate progress
      const interval = setInterval(() => {
        setProcessingProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            setIsProcessing(false)
            setUploadedFile(null)
            alert(`✅ Document "${uploadedFile.name}" processed successfully!`)
            return 100
          }
          return prev + 20
        })
      }, 400)

      console.log("Saved document:", uploadResult)
    } else {
      alert("❌ Upload failed")
      setIsProcessing(false)
    }
  } catch (error) {
    alert("❌ Upload failed: Network error")
    setIsProcessing(false)
  }
}
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      console.log("[v0] File selected:", file.name, file.type, file.size)
      setUploadedFile(file)
      console.log("[v0] File ready for upload")
    }
  }

  const handleEntityExtraction = () => {
    if (analytics) {
      const totalEntities =
        analytics.mostFrequentDiagnoses.reduce((sum, d) => sum + d.count, 0) +
        analytics.medicationTrends.reduce((sum, m) => sum + m.count, 0)
      alert(
        `Entity Extraction Complete!\n\nExtracted ${totalEntities} entities:\n- ${analytics.mostFrequentDiagnoses.length} diseases\n- ${analytics.medicationTrends.length} medications\n- ${analytics.riskFactors.length} risk factors`,
      )
    } else {
      alert("Entity Extraction: Analyzing clinical text for symptoms, diseases, medications, and procedures...")
    }
  }

  const handleAnalytics = () => {
    if (analytics) {
      const diagnosesText = analytics.mostFrequentDiagnoses
        .map((d) => `${d.name} (${d.count} cases, ICD: ${d.icdCode})`)
        .join("\n")
      const medicationsText = analytics.medicationTrends
        .map((m) => `${m.medication} (${m.count} prescriptions, ${m.trend > 0 ? "+" : ""}${m.trend}% trend)`)
        .join("\n")

      alert(`Analytics Dashboard:\n\nTop Diagnoses:\n${diagnosesText}\n\nMedication Trends:\n${medicationsText}`)
    } else {
      alert("Analytics Dashboard: Loading comprehensive charts and insights...")
    }
  }

  const handleEHRIntegration = async () => {
    try {
      const response = await fetch("/api/ehr/connections")
      const data = await response.json()

      if (data.connections) {
        const connectedSystems = data.connections.filter((c: any) => c.status === "connected")
        alert(
          `EHR Integration Status:\n\nConnected Systems: ${connectedSystems.length}\n${connectedSystems.map((c: any) => `- ${c.name} (${c.type})`).join("\n")}\n\nLast sync: ${new Date(connectedSystems[0]?.lastSync).toLocaleString()}`,
        )
      }
    } catch (error) {
      alert("EHR Integration: Connecting with hospital record systems...")
    }
  }

  const handleQuickExtraction = async () => {
    if (!quickText.trim()) {
      alert("Please enter some clinical text for quick extraction.")
      return
    }

    try {
      const response = await fetch("/api/entities/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: quickText }),
      })

      const result = await response.json()

      if (result.success) {
        setQuickResults(result)
        alert(
          `Quick Extraction Results:\n\nEntities found: ${result.entities}\nConfidence: ${(result.confidence * 100).toFixed(1)}%\n\nPreview:\n${result.preview.join("\n")}`,
        )
      }
    } catch (error) {
      alert("Quick Entity Extraction: Processing single document...")
    }
  }

  const handleLiveMonitor = () => {
    fetchProcessingStatus()
    alert(
      `Live Processing Monitor:\n\nActive logs: ${processingLogs.length}\nQueue status: ${processingLogs.filter((log) => log.status === "processing").length} processing\n\nReal-time updates enabled.`,
    )
  }

  const handleSettingsChange = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const handleNavigationUpload = () => {
    const uploadSection = document.querySelector("[data-upload-section]")
    if (uploadSection) {
      uploadSection.scrollIntoView({ behavior: "smooth" })
      setTimeout(() => {
        fileInputRef.current?.click()
      }, 500)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50">
      {/* Header Section */}
      <header className="bg-white border-b border-blue-100 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg">
                <Stethoscope className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  Healthcare NLP Dashboard
                  <Sparkles className="h-5 w-5 text-blue-600" />
                </h1>
                <p className="text-gray-600 font-medium">AI-powered clinical documentation and analytics</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex items-center gap-6">
              <Button variant="ghost" className="flex items-center gap-2 text-blue-700 hover:bg-blue-50">
                <Home className="h-4 w-4" />
                Home
              </Button>
              <Button
                variant="ghost"
                className="flex items-center gap-2 hover:bg-blue-50"
                onClick={handleNavigationUpload}
              >
                <Upload className="h-4 w-4" />
                Upload
              </Button>
              <Button variant="ghost" className="flex items-center gap-2 hover:bg-blue-50" onClick={handleAnalytics}>
                <BarChart3 className="h-4 w-4" />
                Analytics
              </Button>
              <Button
                variant="ghost"
                className="flex items-center gap-2 hover:bg-blue-50"
                onClick={handleEHRIntegration}
              >
                <Database className="h-4 w-4" />
                EHR
              </Button>
              <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 hover:bg-blue-50">
                    <Settings className="h-4 w-4" />
                    Settings
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      System Settings
                    </DialogTitle>
                    <DialogDescription>
                      Configure your NLP dashboard preferences and processing options.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-6 py-4">
                    {/* Auto Processing */}
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Auto Processing</Label>
                        <div className="text-sm text-gray-500">Automatically process uploaded documents</div>
                      </div>
                      <Switch
                        checked={settings.autoProcessing}
                        onCheckedChange={(checked) => handleSettingsChange("autoProcessing", checked)}
                      />
                    </div>

                    {/* Real-time Updates */}
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Real-time Updates</Label>
                        <div className="text-sm text-gray-500">Enable live processing status updates</div>
                      </div>
                      <Switch
                        checked={settings.realTimeUpdates}
                        onCheckedChange={(checked) => handleSettingsChange("realTimeUpdates", checked)}
                      />
                    </div>

                    {/* Confidence Threshold */}
                    <div className="space-y-3">
                      <div className="space-y-0.5">
                        <Label className="text-base">Confidence Threshold</Label>
                        <div className="text-sm text-gray-500">
                          Minimum confidence for entity extraction ({settings.confidenceThreshold}%)
                        </div>
                      </div>
                      <Slider
                        value={[settings.confidenceThreshold]}
                        onValueChange={(value) => handleSettingsChange("confidenceThreshold", value[0])}
                        max={100}
                        min={50}
                        step={5}
                        className="w-full"
                      />
                    </div>

                    {/* Notifications */}
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Notifications</Label>
                        <div className="text-sm text-gray-500">Receive processing completion alerts</div>
                      </div>
                      <Switch
                        checked={settings.notificationsEnabled}
                        onCheckedChange={(checked) => handleSettingsChange("notificationsEnabled", checked)}
                      />
                    </div>

                    {/* Dark Mode */}
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Dark Mode</Label>
                        <div className="text-sm text-gray-500">Switch to dark theme (coming soon)</div>
                      </div>
                      <Switch
                        checked={settings.darkMode}
                        onCheckedChange={(checked) => handleSettingsChange("darkMode", checked)}
                        disabled
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={() => setSettingsOpen(false)}>
                      Cancel
                    </Button>
                    <Button
                      onClick={() => {
                        setSettingsOpen(false)
                        console.log("[v0] Settings saved:", settings)
                      }}
                    >
                      Save Settings
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </nav>
            <Button
  variant="outline"
  onClick={() => {
    logout()
    router.push("/login")
  }}
>
  Logout
</Button>          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Main Functional Panels */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Upload Clinical Notes */}
          <Card
            className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border-blue-100"
            data-upload-section
          >
            <CardHeader className="text-center pb-4">
              <div className="mx-auto p-4 bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <Upload className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-lg text-gray-900">Upload Clinical Notes</CardTitle>
              <CardDescription className="text-sm">Upload documents (PDF, text, EHR exports)</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.txt,.json"
                onChange={handleFileSelect}
                className="hidden"
              />
              <Button
                onClick={handleUploadDocuments}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isProcessing}
              >
                {uploadedFile ? `Process ${uploadedFile.name}` : isProcessing ? "Processing..." : "Upload Documents"}
              </Button>
              {uploadedFile && !isProcessing && (
                <p className="text-xs text-blue-600 mt-2">File ready: {uploadedFile.name}</p>
              )}
              {isProcessing && (
                <div className="mt-3">
                  <Progress value={processingProgress} className="h-2" />
                  <p className="text-xs text-blue-600 mt-1">{processingProgress}% complete</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Entity Extraction */}
          <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border-green-100">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto p-4 bg-green-100 rounded-full w-16 h-16 flex items-center justify-center group-hover:bg-green-200 transition-colors">
                <Brain className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-lg text-gray-900">Entity Extraction</CardTitle>
              <CardDescription className="text-sm">Extract symptoms, diseases, medications</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button onClick={handleEntityExtraction} className="w-full bg-green-600 hover:bg-green-700 text-white">
                Extract Entities
              </Button>
            </CardContent>
          </Card>

          {/* Analytics & Insights */}
          <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border-purple-100">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto p-4 bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                <BarChart3 className="h-8 w-8 text-purple-600" />
              </div>
              <CardTitle className="text-lg text-gray-900">Analytics & Insights</CardTitle>
              <CardDescription className="text-sm">View charts (diagnoses, medication trends)</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button onClick={handleAnalytics} className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                View Analytics
              </Button>
            </CardContent>
          </Card>

          {/* EHR Integration */}
          <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border-orange-100">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto p-4 bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                <Cloud className="h-8 w-8 text-orange-600" />
              </div>
              <CardTitle className="text-lg text-gray-900">EHR Integration</CardTitle>
              <CardDescription className="text-sm">Connect with hospital record system</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button onClick={handleEHRIntegration} className="w-full bg-orange-600 hover:bg-orange-700 text-white">
                Connect EHR
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Real-time Features and Quick Tools */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Activity className="h-6 w-6 text-blue-600" />
                  Processing Dashboard
                  <Button variant="ghost" size="sm" onClick={fetchProcessingStatus}>
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </CardTitle>
                <CardDescription>Real-time monitoring of NLP processing activities</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="status" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="status">Processing Status</TabsTrigger>
                    <TabsTrigger value="logs">Activity Logs</TabsTrigger>
                  </TabsList>

                  <TabsContent value="status" className="space-y-4">
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-blue-900">Current Processing Status</h3>
                        <Badge className="bg-green-100 text-green-800 border-green-200">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Active
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">
                            {
                              processingLogs.filter((log) => log.status === "processing" || log.status === "queued")
                                .length
                            }
                          </div>
                          <div className="text-sm text-gray-600">Documents in Queue</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">156</div>
                          <div className="text-sm text-gray-600">Entities/min</div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="logs" className="space-y-2">
                    <div className="max-h-64 overflow-y-auto space-y-2">
                      {processingLogs.length > 0 ? (
                        processingLogs.slice(0, 8).map((log, index) => (
                          <div key={log.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-2 h-2 rounded-full ${
                                  log.status === "completed"
                                    ? "bg-green-500"
                                    : log.status === "error"
                                      ? "bg-red-500"
                                      : "bg-blue-500 animate-pulse"
                                }`}
                              />
                              <span className="text-sm">{log.message}</span>
                              {log.progress > 0 && log.progress < 100 && (
                                <Progress value={log.progress} className="w-16 h-1" />
                              )}
                            </div>
                            <span className="text-xs text-gray-500">
                              {new Date(log.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p>No recent processing activity</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Quick Tools */}
          <div className="space-y-6">
            {/* Quick Entity Extraction */}
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-600" />
                  Quick Entity Extraction
                </CardTitle>
                <CardDescription className="text-sm">Fast analysis for clinical text</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Textarea
                  placeholder="Enter clinical text for quick analysis..."
                  value={quickText}
                  onChange={(e) => setQuickText(e.target.value)}
                  className="min-h-[80px] text-sm"
                />
                <Button
                  onClick={handleQuickExtraction}
                  variant="outline"
                  className="w-full border-yellow-200 hover:bg-yellow-50 bg-transparent"
                  disabled={!quickText.trim()}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Quick Extract
                </Button>
                {quickResults && (
                  <div className="p-2 bg-yellow-50 rounded text-xs">
                    <p>
                      <strong>Entities:</strong> {quickResults.entities}
                    </p>
                    <p>
                      <strong>Confidence:</strong> {(quickResults.confidence * 100).toFixed(1)}%
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Live Processing Monitor */}
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Activity className="h-5 w-5 text-blue-600" />
                  Live Processing Monitor
                </CardTitle>
                <CardDescription className="text-sm">Real-time processing updates</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={handleLiveMonitor}
                  variant="outline"
                  className="w-full border-blue-200 hover:bg-blue-50 bg-transparent"
                >
                  <Activity className="h-4 w-4 mr-2" />
                  Monitor Live
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Enhanced Statistics Panel */}
        <Card className="bg-gradient-to-r from-slate-50 to-blue-50 border-slate-200">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-blue-600" />
              System Statistics
              <Button variant="ghost" size="sm" onClick={fetchAnalytics}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </CardTitle>
            <CardDescription>Real-time performance metrics and processing statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Documents Processed */}
              <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-blue-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-center mb-3">
                  <FileText className="h-8 w-8 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{stats.documentsProcessed.toLocaleString()}</div>
                <div className="text-sm text-gray-600 mb-2">Documents Processed</div>
                <Badge className="bg-green-100 text-green-800 border-green-200">
                  <TrendingUp className="h-3 w-3 mr-1" />+{stats.monthlyChange}% this month
                </Badge>
              </div>

              {/* Entities Extracted */}
              <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-green-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-center mb-3">
                  <Brain className="h-8 w-8 text-green-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{stats.entitiesExtracted.toLocaleString()}</div>
                <div className="text-sm text-gray-600 mb-2">Entities Extracted</div>
                <div className="text-xs text-gray-500">Diagnoses, symptoms, medications identified</div>
              </div>

              {/* Accuracy */}
              <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-purple-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-center mb-3">
                  <CheckCircle2 className="h-8 w-8 text-purple-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{stats.accuracy}%</div>
                <div className="text-sm text-gray-600 mb-2">NLP Model Accuracy</div>
                <Progress value={stats.accuracy} className="h-2 w-full" />
              </div>

              {/* Active Integrations */}
              <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-orange-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-center mb-3">
                  <Users className="h-8 w-8 text-orange-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{stats.activeIntegrations}</div>
                <div className="text-sm text-gray-600 mb-2">Active Integrations</div>
                <div className="text-xs text-gray-500">EHR systems connected</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
