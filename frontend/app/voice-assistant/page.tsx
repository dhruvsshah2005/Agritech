'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Mic, Send, Square } from 'lucide-react'
import { RealtimeAgent, RealtimeSession } from "@openai/agents/realtime"

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
    // Guard Clause: Stop animation if no analyser or state is idle
    if (!analyser || (!isPlaying && !isRecording)) {
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

    // Setup Frequency Data Buffer
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const renderFrame = () => {
      // Stop if context was closed externally
      if (analyser.context.state === 'closed') return;

      animationRef.current = requestAnimationFrame(renderFrame);

      // Get FFT (Frequency) Data: 0 - 255
      analyser.getByteFrequencyData(dataArray);

      let totalVolume = 0;
      const halfCount = BAR_COUNT / 2;

      // Render Bars (Mirrored Center-Out)
      for (let i = 0; i < halfCount; i++) {
        // With 24kHz sample rate & fftSize 64, the first few bins cover the
        // core human vocal range.
        const value = dataArray[i] || 0;
        totalVolume += value;

        // Calculate heights with max caps
        const height_right = Math.max(10, (value / 255) * 50); // Max 50%
        const height_left = Math.max(10, (value / 255) * 35);  // Max 35%
        const opacity = 0.4 + (value / 255) * 0.6;

        const leftIndex = halfCount - 1 - i;
        const rightIndex = halfCount + i;

        // Apply changes directly to DOM for performance
        if (barRefs.current[leftIndex]) {
          barRefs.current[leftIndex].style.height = `${height_right}%`;
          barRefs.current[leftIndex].style.opacity = `${opacity}`;
        }
        if (barRefs.current[rightIndex]) {
          barRefs.current[rightIndex].style.height = `${height_left}%`;
          barRefs.current[rightIndex].style.opacity = `${opacity}`;
        }
      }

      // Subtle "Pulse" Scale Effect
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
        {/* Glow Background */}
        <div className="absolute inset-0 bg-radial-gradient from-blue-400/20 to-transparent pointer-events-none" />

        {/* Bars Container */}
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
  const [isRecording, setIsRecording] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [analyserNode, setAnalyserNode] = useState<AnalyserNode | null>(null)

  const [messages, setMessages] = useState([
    { type: 'assistant', text: 'नमस्ते! मैं किसान सहायक हूँ। आप मुझसे कुछ भी पूछ सकते हैं।' },
  ])
  const [input, setInput] = useState('')

  // --- 1. NEW: Scroll Reference ---
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  const sessionRef = useRef<RealtimeSession | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const mediaStreamRef = useRef<MediaStream | null>(null)

  // --- 2. NEW: Auto-Scroll Logic ---
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  // Trigger scroll whenever messages array updates (new message or streaming update)
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    return () => {
      cleanupAudio();
      if (sessionRef.current) {
        sessionRef.current.disconnect()
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
 const endhistory = () =>{
  const res = fetch('http://localhost:3000/api/chat/end');
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

  const handleStartRecording = async () => {
    try {
      setIsRecording(true);
      await setupAudioVisualizer();

      const res = await fetch('http://localhost:3000/api/session');
      const { ephemeralKey } = await res.json();

      const agent = new RealtimeAgent({
        name: "Kisan Sahayak",
        instructions: "You are a helpful agricultural assistant..., you are regionalised for india, so speak in hindi at first and if the user speaks in a seperate indian language, talk in the same language",
      });

      const session = new RealtimeSession(agent);
      sessionRef.current = session;

      await session.connect({ apiKey: ephemeralKey });

      session.on('conversation.item.created', (item: any) => {
        if (item.role === 'assistant') {
          setIsPlaying(true);
        }
      });

      // --- 3. NEW: Capture Voice Response to Chat History ---
      session.on('conversation.item.completed', (item: any) => {
        if (item.role === 'assistant') {
          setIsPlaying(false);
          // If the item has a transcript or content, add it to the chat UI
          const content = item.content?.[0]?.transcript || item.content?.[0]?.text;
          if (content) {
             setMessages(prev => [...prev, { type: 'assistant', text: content }]);
          }
        }
      });

      session.on('input_audio_buffer.speech_started', () => {
         // Optional: You could add a "Listening..." temporary message here
      });

    } catch (error) {
      console.error("Failed to start session:", error);
      setIsRecording(false);
      cleanupAudio();
    }
  }

  const handleStopRecording = () => {
    if (sessionRef.current) {
      sessionRef.current.disconnect();
      sessionRef.current = null;
    }
    setIsRecording(false);
    setIsPlaying(false);
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

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    const userText = input.trim();

    // Add user message
    setMessages(prev => [...prev, { type: "user", text: userText }]);
    setInput("");

    // Create placeholder for assistant message
    setMessages(prev => [...prev, { type: "assistant", text: "" }]);

    try {
      const response = await fetch("http://localhost:3000/api/chat/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText })
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

        // Stream into UI - This will trigger the useEffect to scroll
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            type: "assistant",
            text: fullText
          };
          return updated;
        });
      }
    } catch (err) {
      console.error("Streaming failed", err);
      setMessages(prev => [
        ...prev,
        { type: "assistant", text: "Maaf kijiye, kuch gadbad ho gayi." }
      ]);
    }
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
            <CardHeader className="pb-3 border-b">
              <CardTitle>Live Conversation</CardTitle>
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
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type a question manually..."
                  className="flex-1 px-4 py-2 border border-slate-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                />
                <Button onClick={handleSendMessage} className="rounded-full w-10 h-10 p-0 bg-green-600 hover:bg-green-700">
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
              <Button onClick={endhistory}>
                <text>Delete history</text>
              </Button>
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