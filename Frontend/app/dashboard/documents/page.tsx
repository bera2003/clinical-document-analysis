"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Brain, Trash2, FileText } from "lucide-react";

interface Document {
  id: number;
  filename: string;
  created_at: string;
  status: "Processed" | "Pending";
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const fetchDocuments = async () => {
    try {
      const token = localStorage.getItem("token")

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/documents`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (Array.isArray(data)) {
        setDocuments(data);
      } else {
        console.error("API did not return array:", data);
        setDocuments([]);
      }

    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchDocuments();
}, []);

  const processedCount = documents.filter(
    (doc) => doc.status === "Processed"
  ).length;

  const pendingCount = documents.filter(
    (doc) => doc.status === "Pending"
  ).length;

  if (loading) {
    return (
      <div className="p-6 text-gray-500">
        Loading documents...
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white shadow-lg">
        <h1 className="text-3xl font-bold">Clinical Documents</h1>
        <p className="text-blue-100 mt-1">
          Manage and analyze uploaded medical reports
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="rounded-2xl shadow-md">
          <CardContent className="p-6 flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm">Total Documents</p>
              <h2 className="text-2xl font-bold">
                {documents.length}
              </h2>
            </div>
            <FileText className="text-blue-600" />
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-md">
          <CardContent className="p-6 flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm">Processed</p>
              <h2 className="text-2xl font-bold text-green-600">
                {processedCount}
              </h2>
            </div>
            <Badge className="bg-green-600">✔</Badge>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-md">
          <CardContent className="p-6 flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm">Pending</p>
              <h2 className="text-2xl font-bold text-yellow-600">
                {pendingCount}
              </h2>
            </div>
            <Badge variant="secondary">⏳</Badge>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card className="rounded-2xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Document List
          </CardTitle>
        </CardHeader>

        <CardContent>
          {documents.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              No documents uploaded yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b text-gray-600">
                  <tr>
                    <th className="py-3 text-left">File Name</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {documents.map((doc) => (
                    <tr
                      key={doc.id}
                      className="border-b hover:bg-slate-50 transition duration-200"
                    >
                      <td className="py-4 font-medium">
                        {doc.filename}
                      </td>

                      <td>
                        {new Date(doc.created_at).toLocaleDateString()}
                      </td>

                      <td>
                        {doc.status === "Processed" ? (
                          <Badge className="bg-green-600">
                            Processed
                          </Badge>
                        ) : (
                          <Badge className="bg-yellow-500">
                            Pending
                          </Badge>
                        )}
                      </td>

                      <td className="flex justify-end gap-2 py-3">
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={doc.status === "Pending"}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>

                        {doc.status === "Pending" && (
                          <Button size="sm">
                            <Brain className="w-4 h-4 mr-1" />
                            Analyze
                          </Button>
                        )}

                        <Button
                          size="sm"
                          variant="destructive"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}