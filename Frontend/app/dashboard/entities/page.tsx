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

type Entity = {
  text: string;
  label: string;
};

type EntityDoc = {
  document_id: number | string;
  filename: string;
  entities: string | Entity[] | null;
};

export default function EntitiesPage() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [entitiesData, setEntitiesData] = useState<EntityDoc[]>([]);

  useEffect(() => {
    if (!user) router.push("/login");
  }, [user, router]);

  useEffect(() => {
    if (!user) return;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/entities`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Entities API response:", data);

        if (Array.isArray(data)) {
          setEntitiesData(data);
        } else if (Array.isArray(data.entities)) {
          setEntitiesData(data.entities);
        } else {
          setEntitiesData([]);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch entities:", err);
        setEntitiesData([]);
      });
  }, [user, token]);

  const parseEntities = (raw: string | Entity[] | null | undefined): Entity[] => {
    if (!raw) return [];

    if (Array.isArray(raw)) {
      return raw;
    }

    if (typeof raw === "string") {
      try {
        const fixed = raw.replace(/'/g, '"').replace(/None/g, "null");
        const parsed = JSON.parse(fixed);
        return Array.isArray(parsed) ? parsed : [];
      } catch (err) {
        console.error("Entity parse failed:", err, raw);
        return [];
      }
    }

    return [];
  };

  return (
    <main className="p-6 space-y-6">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <Brain className="text-green-600" />
        Extracted Clinical Entities
      </h1>

      {entitiesData.length === 0 && (
        <p className="text-gray-500">No entities found.</p>
      )}

      {entitiesData.map((doc, index) => {
        const parsedEntities = parseEntities(doc.entities);

        return (
          <Card key={doc.document_id ?? index}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <FileText className="h-4 w-4" />
                {doc.filename}
              </CardTitle>
            </CardHeader>

            <CardContent className="flex flex-wrap gap-2">
              {parsedEntities.length === 0 ? (
                <span className="text-sm text-gray-400">
                  No entities extracted
                </span>
              ) : (
                parsedEntities.map((entity, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-700 border"
                  >
                    {entity.text} ({entity.label})
                  </span>
                ))
              )}
            </CardContent>
          </Card>
        );
      })}
    </main>
  );
}