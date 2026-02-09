"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  User,
  Mail,
  ShieldCheck,
  Calendar,
  Award,
  Activity,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface DashboardStats {
  documentsProcessed: number;
  accuracy: number;
}

export default function ProfilePage() {
  const { user, token } = useAuth();

  const [stats, setStats] = useState<DashboardStats | null>(null);

  // ✅ Fetch stats ONLY when token exists
  useEffect(() => {
    if (!token) return;

    fetch("http://localhost:8000/api/dashboard/stats", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch(() => setStats(null));
  }, [token]);

  // Layout already protects route
  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-8">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            My Profile
          </h1>
          <p className="text-slate-600">
            Manage your account information
          </p>
        </div>

        {/* Profile Card */}
        <Card className="shadow-xl border-0 mb-6 overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600"></div>

          <CardContent className="p-8 -mt-16">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">

              {/* Avatar */}
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-5xl font-bold shadow-xl ring-4 ring-white">
                {user.name?.charAt(0)}
              </div>

              {/* User Info */}
              <div className="flex-1 text-center md:text-left mt-4 md:mt-8">
                <h2 className="text-3xl font-bold text-slate-800 mb-2">
                  {user.name}
                </h2>

                <p className="text-slate-600 flex items-center justify-center md:justify-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-purple-600" />
                  Healthcare NLP Analyst
                </p>
              </div>

              {/* Stats */}
              <div className="flex gap-4 md:mt-8">
                <div className="text-center px-4 py-2 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {stats?.documentsProcessed ?? "—"}
                  </div>
                  <div className="text-xs text-slate-600">
                    Documents Extracted
                  </div>
                </div>

                <div className="text-center px-4 py-2 bg-indigo-50 rounded-lg">
                  <div className="text-2xl font-bold text-indigo-600">
                    {stats?.accuracy ?? "—"}%
                  </div>
                  <div className="text-xs text-slate-600">
                    Accuracy
                  </div>
                </div>
              </div>

            </div>
          </CardContent>
        </Card>

        {/* Info Grid */}
        <div className="grid md:grid-cols-2 gap-6">

          {/* Contact Info */}
          <Card className="shadow-lg border-0">
            <CardContent className="p-6">

              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Mail className="text-blue-600" />
                Contact Information
              </h3>

              <div className="space-y-4">

                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <Mail className="text-green-600 w-5 h-5" />
                  <div>
                    <p className="text-xs text-slate-500">Email</p>
                    <p className="font-medium text-slate-800">
                      {user.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <User className="text-blue-600 w-5 h-5" />
                  <div>
                    <p className="text-xs text-slate-500">Full Name</p>
                    <p className="font-medium text-slate-800">
                      {user.name}
                    </p>
                  </div>
                </div>

              </div>
            </CardContent>
          </Card>

          {/* Account Details */}
          <Card className="shadow-lg border-0">
            <CardContent className="p-6">

              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Activity className="text-indigo-600" />
                Account Details
              </h3>

              <div className="space-y-4">

                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <Calendar className="text-purple-600 w-5 h-5" />
                  <div>
                    <p className="text-xs text-slate-500">Member Since</p>
                    <p className="font-medium text-slate-800">
                      January 2024
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <Award className="text-amber-600 w-5 h-5" />
                  <div>
                    <p className="text-xs text-slate-500">Account Status</p>
                    <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                      Active
                    </span>
                  </div>
                </div>

              </div>
            </CardContent>
          </Card>
        </div>

        {/* Expertise */}
        <Card className="shadow-lg border-0 mt-6">
          <CardContent className="p-6">

            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <ShieldCheck className="text-indigo-600" />
              Expertise
            </h3>

            <div className="flex flex-wrap gap-2">
              {[
                "Natural Language Processing",
                "Healthcare Analytics",
                "Machine Learning",
                "Data Analysis",
                "Clinical Research",
              ].map((skill) => (
                <span
                  key={skill}
                  className="px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 rounded-full text-sm font-medium border border-blue-200"
                >
                  {skill}
                </span>
              ))}
            </div>

          </CardContent>
        </Card>

      </div>
    </div>
  );
}
