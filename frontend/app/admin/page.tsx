"use client";

import { useState } from "react";
import axios from "axios";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function AdminPage() {
  const [content, setContent] = useState<string>("");

  const uploadFAQ = async () => {
    if (!content.trim()) return;

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/docs`, { content });
      alert("FAQ uploaded successfully!");
      setContent("");
    } catch (err) {
      alert("Failed to upload FAQ");
    }
  };

  return (
    <Card className="max-w-xl mx-auto">
      <CardHeader>
        <h2 className="text-xl font-semibold">Upload FAQ / Company Info</h2>
      </CardHeader>

      <CardContent className="space-y-4">
        <Textarea
          placeholder="Paste your FAQ or company information here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[200px]"
        />

        <Button onClick={uploadFAQ} className="w-full">
          Upload Document
        </Button>
      </CardContent>
    </Card>
  );
}
