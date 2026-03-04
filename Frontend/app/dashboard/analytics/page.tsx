"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import {
  BarChart3,
  FileText,
  Brain,
  CheckCircle2,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AnalyticsPage() {
  const { user, token } = useAuth();
  const router = useRouter();

  const [stats, setStats] = useState<any>(null);
  const [entityCounts, setEntityCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!user) router.push("/login");
  }, [user]);

  useEffect(() => {
    if (!user) return;

    // 🔹 Fetch entity distribution
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/entities`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const counts: Record<string, number> = {};

        data.forEach((doc: any) => {
          try {
            const parsed = JSON.parse(
              doc.entities
                ?.replace(/'/g, '"')
                ?.replace(/None/g, "null")
            );

            parsed.forEach((e: any) => {
              counts[e.label] = (counts[e.label] || 0) + 1;
            });
          } catch {}
        });

        setEntityCounts(counts);
      });

    // 🔹 Fetch stats
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/stats`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setStats(data));
  }, [user]);

  const maxEntityCount =
    Math.max(...Object.values(entityCounts), 1);

  return (
    <main className="p-8 space-y-8 bg-slate-50 dark:bg-slate-900 min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-xl bg-purple-600 text-white shadow-lg">
          <BarChart3 className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
            Analytics Dashboard
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            System performance & entity insights
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Documents Processed"
            value={stats.documentsProcessed}
            icon={FileText}
            gradient="from-blue-500 to-indigo-600"
          />
          <StatCard
            title="Entities Extracted"
            value={stats.entitiesExtracted}
            icon={Brain}
            gradient="from-green-500 to-emerald-600"
          />
          <StatCard
            title="Accuracy"
            value={`${stats.accuracy}%`}
            icon={CheckCircle2}
            gradient="from-purple-500 to-pink-600"
          />
        </div>
      )}

      {/* Entity Distribution */}
      <Card className="shadow-xl border-0">
        <CardHeader>
          <CardTitle className="text-lg">
            Entity Type Distribution
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.keys(entityCounts).length === 0 && (
            <p className="text-sm text-slate-500">
              No entity data available.
            </p>
          )}

          {Object.entries(entityCounts).map(
            ([label, count]) => (
              <div key={label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    {label}
                  </span>
                  <span className="text-slate-500">
                    {count}
                  </span>
                </div>

                <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-indigo-600"
                    style={{
                      width: `${
                        (count / maxEntityCount) * 100
                      }%`,
                    }}
                  />
                </div>
              </div>
            )
          )}
        </CardContent>
      </Card>
    </main>
  );
}

/* ---------- REUSABLE STAT CARD ---------- */

function StatCard({
  title,
  value,
  icon: Icon,
  gradient,
}: {
  title: string;
  value: string | number;
  icon: any;
  gradient: string;
}) {
  return (
    <Card className="border-0 shadow-xl hover:scale-[1.02] transition">
      <CardContent className="p-6">
        <div
          className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${gradient} text-white shadow-lg mb-4`}
        >
          <Icon className="h-6 w-6" />
        </div>
        <p className="text-sm text-slate-500 mb-1">
          {title}
        </p>
        <p className="text-3xl font-bold text-slate-800 dark:text-white">
          {value}
        </p>
      </CardContent>
    </Card>
  );
}
