"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Leaf } from "lucide-react";
import { motion } from "framer-motion";
import { MarkdownLaTeX } from "@/components/MarkdownRenderer";

export default function PlantDiseaseCheckerPage() {
  const [image, setImage] = useState<string | null>(null);
  const [diagnosis, setDiagnosis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (file: File) => {
    const reader = new FileReader();

    reader.onload = async () => {
      const base64Image = reader.result as string;

      setImage(base64Image);
      setDiagnosis(null);
      setError(null);
      setLoading(true);

      try {
        /**
         * 1. Get Supabase session
         */
        

        /**
         * 2. Call backend with Supabase JWT
         */
        const response = await fetch(
          "http://localhost:3000/api/plant-disease/analyze",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
                // lang:"hindi"
              imageBase64: base64Image
            })
          }
        );

        if (!response.ok) {
          const err = await response.json();
          throw new Error(err?.error || "Analysis failed");
        }

        const data = await response.json();

        setDiagnosis(data.diagnosis);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 flex justify-center">
      <div className="w-full max-w-3xl space-y-6">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-semibold flex items-center gap-2"
        >
          <Leaf className="h-7 w-7" />
          Plant Disease Detection
        </motion.h1>

        <Card className="rounded-2xl shadow-sm">
          <CardContent className="p-6 space-y-4">
            <label className="block">
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) =>
                  e.target.files && handleUpload(e.target.files[0])
                }
              />

              <Button className="flex gap-2" asChild>
                <span>
                  <Upload className="h-4 w-4" />
                  Upload Plant Image
                </span>
              </Button>
            </label>

            {image && (
              <motion.img
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                src={image}
                alt="Uploaded plant"
                className="rounded-xl max-h-80 object-contain border"
              />
            )}
          </CardContent>
        </Card>

        {loading && (
          <Card className="rounded-2xl">
            <CardContent className="p-6 text-sm">
              Analyzing image using AI model...
            </CardContent>
          </Card>
        )}

        {error && (
          <Card className="rounded-2xl border-red-300">
            <CardContent className="p-6 text-sm text-red-600">
              {error}
            </CardContent>
          </Card>
        )}

        {diagnosis && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="rounded-2xl border-green-200">
              <CardContent className="p-6 space-y-3">
                <div className="text-lg font-medium">Diagnosis</div>
                <p className="text-sm text-gray-700 whitespace-pre-line">
                    {/* <text>{diagnosis}</text> */}
                  <MarkdownLaTeX text={diagnosis}/>
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
