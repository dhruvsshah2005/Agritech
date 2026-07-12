'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Mic, Send, Square, Camera } from 'lucide-react'
import { useLanguage } from '@/lib/i18n'

// --- 1. The Reactive Audio Visualizer Component ---
const ReactiveAudioVisualizer = ({
  analyser,
  isPlaying,
  isRecording
}: {
  analyser: AnalyserNode | null;
  isPlaying: boolean;
  isRecording: boolean;
}) => {
  const barRefs = useRef<HTMLDivElement[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);
  const BAR_COUNT = 10;

  useEffect(() => {
    // Guard Clause: Stop animation if no states are active
    if (!isPlaying && !isRecording) {
      if (containerRef.current) containerRef.current.style.transform = `scale(1)`;
      barRefs.current.forEach(bar => {
        if (bar) {
          bar.style.height = '10%';
          bar.style.opacity = '0.3';
        }
      });
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      return;
    }

    if (!analyser) {
      if (isPlaying) {
        // Simulate volume wave oscillations for Text-to-Speech playback visualizer
        const renderSimulatedFrame = () => {
          animationRef.current = requestAnimationFrame(renderSimulatedFrame);
          const halfCount = BAR_COUNT / 2;
          let totalVolume = 0;
          for (let i = 0; i < halfCount; i++) {
            const value = Math.floor(Math.sin(Date.now() * 0.008 + i) * 50 + 90 + Math.random() * 30);
            totalVolume += value;
            const height_right = Math.max(10, (value / 255) * 50);
            const height_left = Math.max(10, (value / 255) * 35);
            const opacity = 0.4 + (value / 255) * 0.6;
            const leftIndex = halfCount - 1 - i;
            const rightIndex = halfCount + i;
            if (barRefs.current[leftIndex]) {
              barRefs.current[leftIndex].style.height = `${height_right}%`;
              barRefs.current[leftIndex].style.opacity = `${opacity}`;
            }
            if (barRefs.current[rightIndex]) {
              barRefs.current[rightIndex].style.height = `${height_left}%`;
              barRefs.current[rightIndex].style.opacity = `${opacity}`;
            }
          }
          const avgVolume = totalVolume / halfCount;
          const scale = 1 + (avgVolume / 255) * 0.2;
          if (containerRef.current) {
            containerRef.current.style.transform = `scale(${scale})`;
          }
        };
        renderSimulatedFrame();
        return () => {
          if (animationRef.current) cancelAnimationFrame(animationRef.current);
        };
      }
      return;
    }

    // Setup Frequency Data Buffer for microphone
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const renderFrame = () => {
      if (analyser.context.state === 'closed') return;
      animationRef.current = requestAnimationFrame(renderFrame);

      analyser.getByteFrequencyData(dataArray);

      let totalVolume = 0;
      const halfCount = BAR_COUNT / 2;

      for (let i = 0; i < halfCount; i++) {
        const value = dataArray[i] || 0;
        totalVolume += value;

        const height_right = Math.max(10, (value / 255) * 50);
        const height_left = Math.max(10, (value / 255) * 35);
        const opacity = 0.4 + (value / 255) * 0.6;

        const leftIndex = halfCount - 1 - i;
        const rightIndex = halfCount + i;

        if (barRefs.current[leftIndex]) {
          barRefs.current[leftIndex].style.height = `${height_right}%`;
          barRefs.current[leftIndex].style.opacity = `${opacity}`;
        }
        if (barRefs.current[rightIndex]) {
          barRefs.current[rightIndex].style.height = `${height_left}%`;
          barRefs.current[rightIndex].style.opacity = `${opacity}`;
        }
      }

      const avgVolume = totalVolume / halfCount;
      const scale = 1 + (avgVolume / 255) * 0.2;

      if (containerRef.current) {
        containerRef.current.style.transform = `scale(${scale})`;
      }
    };

    renderFrame();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [analyser, isPlaying, isRecording]);

  const show = isPlaying || isRecording;

  return (
    <div
      className={`absolute bottom-8 left-1/2 -translate-x-1/2 z-30 transition-all duration-500 ease-out ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
        }`}
    >
      <div
        ref={containerRef}
        className="relative w-24 h-24 rounded-full bg-white/20 backdrop-blur-xl border-2 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.6)] flex items-center justify-center overflow-hidden transition-transform duration-75 will-change-transform"
      >
        <div className="absolute inset-0 bg-radial-gradient from-blue-400/20 to-transparent pointer-events-none" />

        <div className="flex items-center justify-center gap-[3px] h-full w-full px-2">
          {[...Array(BAR_COUNT)].map((_, i) => (
            <div
              key={i}
              ref={(el) => { if (el) barRefs.current[i] = el; }}
              className="rounded-full bg-gradient-to-t from-blue-600 via-cyan-400 to-white shadow-[0_0_4px_rgba(34,211,238,0.8)] transition-all duration-75"
              style={{ width: '2px', height: '10%', opacity: 0.3 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};


// --- 2. Main Voice Assistant Component ---
export default function VoiceAssistant() {
  const { language, t } = useLanguage()

  const [isRecording, setIsRecording] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [analyserNode, setAnalyserNode] = useState<AnalyserNode | null>(null)
  const [ttsSupported, setTtsSupported] = useState(true)
  const [speechError, setSpeechError] = useState<string | null>(null)

  const [messages, setMessages] = useState<{ type: string; text: string; image?: string }[]>([])
  const [input, setInput] = useState('')
  const [analyzingImage, setAnalyzingImage] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Image Upload and Disease Analysis Handler
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const base64Data = reader.result as string;

      // Add user message with image preview
      setMessages(prev => [...prev, {
        type: 'user',
        text: 'Uploaded crop image for diagnosis.',
        image: base64Data
      }]);

      // Add assistant thinking placeholder
      setMessages(prev => [...prev, {
        type: 'assistant',
        text: 'Analyzing leaf image for pathology...'
      }]);

      setAnalyzingImage(true);

      try {
        const response = await fetch("http://localhost:3000/api/plant-disease/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageBase64: base64Data, language })
        });

        const data = await response.json();
        const analysisResult = data.diagnosis || data.analysis || "I could not analyze the image. Please try again.";

        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            type: "assistant",
            text: analysisResult
          };
          return updated;
        });

        speakText(analysisResult);
      } catch (err) {
        console.error("Pathology analysis failed:", err);
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            type: "assistant",
            text: "Failed to connect to image analysis service. Please try again later."
          };
          return updated;
        });
      } finally {
        setAnalyzingImage(false);
      }
    };

    reader.readAsDataURL(file);
  };

  // Sync greeting translation on language updates
  useEffect(() => {
    setMessages([
      { type: 'assistant', text: t('voiceGreeting') }
    ])
  }, [language, t])

  // Automatically trigger image upload if mode=scan query parameter is present
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('mode') === 'scan') {
        setTimeout(() => {
          fileInputRef.current?.click();
        }, 800);
      }
    }
  }, []);

  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  const recognitionRef = useRef<any>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const mediaStreamRef = useRef<MediaStream | null>(null)

  // Map settings language to browser STT/TTS locale
  const localeMap: Record<string, string> = {
    hi: 'hi-IN',
    en: 'en-US',
    bn: 'bn-IN',
    te: 'te-IN',
    mr: 'mr-IN',
    ta: 'ta-IN',
    gu: 'gu-IN',
    kn: 'kn-IN',
    pa: 'pa-IN',
    ml: 'ml-IN',
    or: 'or-IN',
    as: 'as-IN',
    ur: 'ur-IN',
    sa: 'sa-IN',
    es: 'es-ES',
    ne: 'ne-NP'
  };
  const currentLocale = localeMap[language] || 'hi-IN';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    return () => {
      cleanupAudio();
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    }
  }, [])

  const cleanupAudio = () => {
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
  }

  const endhistory = () => {
    fetch('http://localhost:3000/api/chat/end', { method: 'POST' });
  }

  const setupAudioVisualizer = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioContext;
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 64; 
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);
      setAnalyserNode(analyser);
    } catch (err) {
      console.error("Error setting up audio visualizer:", err);
    }
  };

  useEffect(() => {
    const checkTtsSupport = () => {
      if (typeof window === "undefined" || !window.speechSynthesis) return;
      const voices = window.speechSynthesis.getVoices();
      if (voices.length === 0) return; // Voices loaded dynamically later

      const cleanLocale = currentLocale.toLowerCase().replace('_', '-');
      const voiceExists = voices.some(v => {
        const vLang = v.lang.toLowerCase().replace('_', '-');
        return vLang === cleanLocale || vLang.startsWith(language + '-');
      });

      setTtsSupported(voiceExists);
    };

    checkTtsSupport();

    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = checkTtsSupport;
    }
  }, [language, currentLocale]);

  const speakText = (text: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();

    // Clean markdown characters out of speech
    const cleanText = text
      .replace(/[\*\#\`\_]/g, "")
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    
    const voices = window.speechSynthesis.getVoices();
    const cleanLocale = currentLocale.toLowerCase().replace('_', '-');
    
    // Find matching voice
    const voice = voices.find(v => {
      const vLang = v.lang.toLowerCase().replace('_', '-');
      return vLang === cleanLocale || vLang.startsWith(language + '-');
    });

    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang;
    } else {
      const backupVoice = voices.find(v => v.lang.toLowerCase().startsWith(language));
      if (backupVoice) {
        utterance.voice = backupVoice;
        utterance.lang = backupVoice.lang;
      } else {
        // Fall back to default browser voice if no voice packs found
        utterance.lang = 'en-US'; 
      }
    }

    utterance.onstart = () => {
      setIsPlaying(true);
    };
    utterance.onend = () => {
      setIsPlaying(false);
    };
    utterance.onerror = () => {
      setIsPlaying(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const handleStartRecording = async () => {
    try {
      setIsRecording(true);
      setSpeechError(null);
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      setIsPlaying(false);

      await setupAudioVisualizer();

      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        alert("Speech recognition is not supported in this browser. Please use Chrome or Edge.");
        setIsRecording(false);
        cleanupAudio();
        return;
      }

      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = currentLocale;

      recognition.onresult = async (event: any) => {
        const transcript = event.results[0]?.[0]?.transcript;
        if (transcript) {
          console.log("Speech recognition output:", transcript);
          handleStopRecording();
          await handleSendMessageWithText(transcript);
        }
      };

      recognition.onerror = (err: any) => {
        console.error("Speech recognition error:", err.error, err.message);
        if (err.error === 'aborted' || err.error === 'no-speech') {
          handleStopRecording();
          return;
        }
        let errorMsg = "Speech recognition failed.";
        if (err.error === 'not-allowed') {
          errorMsg = "Microphone access denied. Please allow microphone permissions in your browser settings.";
        } else if (err.error === 'network') {
          errorMsg = "Network connection error. Google Speech Recognition requires an active internet connection.";
        } else if (err.error === 'language-not-supported') {
          errorMsg = `Language locale (${currentLocale}) is not supported for speech recognition in this browser.`;
        }
        setSpeechError(errorMsg);
        setTimeout(() => setSpeechError(null), 6000);
        handleStopRecording();
      };

      recognition.onend = () => {
        setIsRecording(false);
        cleanupAudio();
        setAnalyserNode(null);
      };

      recognition.start();
    } catch (error) {
      console.error("Failed to start recording:", error);
      setIsRecording(false);
      cleanupAudio();
    }
  }

  const handleStopRecording = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
      recognitionRef.current = null;
    }
    setIsRecording(false);
    cleanupAudio();
    setAnalyserNode(null);
  }

  const toggleRecording = () => {
    if (isRecording) {
      handleStopRecording();
    } else {
      handleStartRecording();
    }
  }

  const handleSendMessageWithText = async (textToSend: string) => {
    // Add user message
    setMessages(prev => [...prev, { type: "user", text: textToSend }]);

    // Create placeholder for assistant message
    setMessages(prev => [...prev, { type: "assistant", text: "" }]);

    try {
      const response = await fetch("http://localhost:3000/api/chat/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: textToSend, language })
      });

      const reader = response.body?.getReader();
      if (!reader) return;

      const decoder = new TextDecoder();
      let fullText = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        fullText += chunk;

        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            type: "assistant",
            text: fullText
          };
          return updated;
        });
      }

      // Read response out loud
      speakText(fullText);
    } catch (err) {
      console.error("Streaming failed", err);
      setMessages(prev => [
        ...prev,
        { type: "assistant", text: "माफ़ कीजिये, कुछ गड़बड़ हो गई।" }
      ]);
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    const userText = input.trim();
    setInput("");
    await handleSendMessageWithText(userText);
  };

  return (
    <div className="space-y-6 relative min-h-[600px]">
      <div className="bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-lg p-8 shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Kisan Voice Assistant</h1>
        <p className="text-lg opacity-90">Ask questions in Hindi or English (खेती बाड़ी के सवाल)</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Area */}
        <div className="lg:col-span-2">
          <Card className="h-[500px] flex flex-col border-slate-200 shadow-sm">
            <CardHeader className="pb-3 border-b flex flex-row items-center justify-between">
              <CardTitle className="text-base font-semibold">Live Conversation</CardTitle>
              <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>RAG Verified (ICAR Grounded)</span>
              </div>
            </CardHeader>
            
            {/* --- 4. MODIFIED: Chat Content Area --- */}
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm shadow-sm ${
                      msg.type === 'user'
                        ? 'bg-green-600 text-white rounded-br-none'
                        : 'bg-slate-100 text-slate-800 rounded-bl-none border border-slate-200'
                    }`}
                  >
                    {msg.image && (
                      <div className="mb-2 overflow-hidden rounded-lg border border-black/10">
                        <img src={msg.image} alt="Crop scan" className="max-w-[240px] max-h-[180px] object-cover" />
                      </div>
                    )}
                    <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                    {/* Optional: Add a blinking cursor for empty streaming messages */}
                    {msg.type === 'assistant' && msg.text === '' && (
                        <span className="inline-block w-2 h-4 bg-slate-400 animate-pulse ml-1 align-middle"></span>
                    )}
                  </div>
                </div>
              ))}
              {/* Invisible element to scroll to */}
              <div ref={messagesEndRef} />
            </CardContent>

            {/* Text Input Area */}
            <div className="p-4 bg-slate-50 border-t">
              <div className="flex gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  className="rounded-full w-10 h-10 p-0 bg-white border-slate-300 hover:bg-slate-100 shrink-0"
                  disabled={analyzingImage}
                >
                  <Camera className="w-5 h-5 text-slate-500" />
                </Button>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type a question manually..."
                  className="flex-1 px-4 py-2 border border-slate-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                  disabled={analyzingImage}
                />
                <Button onClick={handleSendMessage} className="rounded-full w-10 h-10 p-0 bg-green-600 hover:bg-green-700" disabled={analyzingImage}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Voice Control Panel */}
        <div>
          <Card className="border-slate-200 shadow-sm h-full min-h-[500px]">
            <CardHeader>
              <CardTitle>Voice Control</CardTitle>
              <CardDescription>Tap to speak with the AI</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">

              {/* Main Record Button */}
              <div className="flex justify-center py-4">
                <button
                  onClick={toggleRecording}
                  className={`relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl ${
                    isRecording ? '' : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  {isRecording ? (
                    <ReactiveAudioVisualizer
                      analyser={analyserNode}
                      isRecording={isRecording}
                      isPlaying={isPlaying}
                    />
                  ) : (
                    <Mic className="w-10 h-10 text-white" />
                  )}

                  {isRecording && (
                    <span className="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75 animate-ping"></span>
                  )}
                </button>
              </div>
              
              {/* Status Indicator */}
              <div className={`text-center transition-opacity ${isRecording ? 'opacity-100' : 'opacity-50'}`}>
                {isRecording ? (
                  <div className="flex items-center justify-center gap-2 text-red-500 font-medium animate-pulse">
                    {isPlaying ? "AI Speaking..." : "Listening..."}
                  </div>
                ) : (
                  <p className="text-slate-500 text-sm">Mic is off</p>
                )}
              </div>
              {speechError && (
                <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded-lg text-xs text-center font-medium animate-pulse leading-relaxed">
                  ⚠️ {speechError}
                </div>
              )}

              <Button onClick={endhistory} variant="destructive" className="w-full">
                Delete history
              </Button>

              {!ttsSupported && (
                <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-3 rounded-lg text-xs text-left leading-relaxed">
                  ⚠️ <strong>TTS voice not installed:</strong> Your browser does not have a Text-to-Speech voice installed for this language. The translation is shown in the chat window. Try using <strong>Microsoft Edge</strong> which supports online neural voices for all 10 Indian languages.
                </div>
              )}
              {/* Quick Actions */}
              <div className="space-y-2 pt-2">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Quick Ask</p>
                {[
                  'गेहूँ की बुवाई कब करें?',
                  'टमाटर में कीड़ा लगा है',
                  'Aaj ka mausam kaisa hai?'
                ].map((q, idx) => (
                  <Button
                    key={idx}
                    variant="outline"
                    className="w-full justify-start text-left text-sm font-normal text-slate-600 hover:text-green-700 hover:border-green-200"
                    onClick={() => {
                      setInput(q)
                    }}
                  >
                    {q}
                  </Button>
                ))}
              </div>

            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}