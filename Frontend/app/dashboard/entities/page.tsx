"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Brain, FileText } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function EntitiesPage() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [entitiesData, setEntitiesData] = useState<any[]>([]);

  useEffect(() => {
    if (!user) router.push("/login");
  }, [user]);

  useEffect(() => {
    if (!user) return;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/entities`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setEntitiesData(data);
        } else if (Array.isArray(data.entities)) {
          setEntitiesData(data.entities);
        } else {
          setEntitiesData([]);
        }
      })
      .catch(() => setEntitiesData([]));
  }, [user]);

  return (
    <main className="p-6 space-y-6">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <Brain className="text-green-600" />
        Extracted Clinical Entities
      </h1>

      {entitiesData.length === 0 && (
        <p className="text-gray-500">No entities found.</p>
      )}

      {Array.isArray(entitiesData) &&
        entitiesData.map((doc) => {
          let parsedEntities: any[] = [];

          try {
            const fixed = doc.entities
              ?.replace(/'/g, '"')
              ?.replace(/None/g, "null");

            parsedEntities = fixed ? JSON.parse(fixed) : [];
          } catch (err) {
            console.error("Entity parse failed", err);
          }

          return (
            <Card key={doc.document_id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <FileText className="h-4 w-4" />
                  {doc.filename}
                </CardTitle>
              </CardHeader>

              <CardContent className="flex flex-wrap gap-2">
                {parsedEntities.length === 0 && (
                  <span className="text-sm text-gray-400">
                    No entities extracted
                  </span>
                )}

                {parsedEntities.map((entity, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-700 border"
                  >
                    {entity.text} ({entity.label})
                  </span>
                ))}
              </CardContent>
            </Card>
          );
        })}
    </main>
  );
}
