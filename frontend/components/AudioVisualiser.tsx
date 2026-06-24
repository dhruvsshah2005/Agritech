import { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
export const ReactiveAudioVisualizer = ({ 
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
    // 1. Guard Clause: Stop animation if no analyser or state is idle
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

    // 2. Setup Frequency Data Buffer
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const renderFrame = () => {
        // Stop if context was closed externally
        if(analyser.context.state === 'closed') return;

        animationRef.current = requestAnimationFrame(renderFrame);

        // Get FFT (Frequency) Data: 0 - 255
        analyser.getByteFrequencyData(dataArray);

        let totalVolume = 0;
        const halfCount = BAR_COUNT / 2;
        
        // 3. Render Bars (Mirrored Center-Out)
        for (let i = 0; i < halfCount; i++) {
          // With 24kHz sample rate & fftSize 64, the first few bins cover the
          // core human vocal range (0Hz - ~2kHz). We use these for the visual.
          const value = dataArray[i] || 0; 
          totalVolume += value;

          // Calculate heights with max caps
          const height_right = Math.max(10, (value / 255) * 50); // Max 50%
          const height_left = Math.max(10, (value / 255) * 35);  // Max 35% (asymmetric look)
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

        // 4. Subtle "Pulse" Scale Effect
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
      className={`absolute bottom-8 left-1/2 -translate-x-1/2 z-30 transition-all duration-500 ease-out ${
        show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
      }`}
    >
      <div 
        ref={containerRef}
        className="relative w-14 h-14 rounded-full bg-white/20 backdrop-blur-xl border-2 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.6)] flex items-center justify-center overflow-hidden transition-transform duration-75 will-change-transform"
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
export const SimulatedVoiceVisualizer = ({ className }: { className?: string }) => {
  const barRefs = useRef<HTMLDivElement[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);
  
  const BAR_COUNT = 10; 

  useEffect(() => {
    const animate = () => {
      const time = Date.now() / 150; // Speed of animation
      let totalVolume = 0;
      const halfCount = BAR_COUNT / 2;

      // Simulate frequency data generation
      for (let i = 0; i < halfCount; i++) {
        // Generate a smooth organic wave + some random noise to look like voice
        const noise = Math.random() * 30;
        const wave = Math.sin(time + i * 0.5) * 40 + 60; // Base value between 20-100
        const value = wave + noise; // 0-255 scale roughly
        
        totalVolume += value;

        // Height calculation (kept proportional to your original code)
        const height_right = Math.max(10, (value / 150) * 50); 
        const height_left = Math.max(10, (value / 150) * 35);
        
        // Opacity calc
        const opacity = 0.4 + (value / 200) * 0.6;

        // Left Side Mirror
        const leftIndex = halfCount - 1 - i;
        if (barRefs.current[leftIndex]) {
          barRefs.current[leftIndex].style.height = `${height_right}%`;
          barRefs.current[leftIndex].style.opacity = `${opacity}`;
        }

        // Right Side Mirror
        const rightIndex = halfCount + i;
        if (barRefs.current[rightIndex]) {
          barRefs.current[rightIndex].style.height = `${height_left}%`;
          barRefs.current[rightIndex].style.opacity = `${opacity}`;
        }
      }

      // Dynamic Circle Scaling
      const avgVolume = totalVolume / halfCount;
      const scale = 1 + (avgVolume / 200) * 0.15; // Subtle pulse

      if (containerRef.current) {
        containerRef.current.style.transform = `scale(${scale})`;
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <div className={cn("relative z-30 flex items-center justify-center", className)}>
      {/* Container: w-14/h-14 (56px) */}
      <div 
        ref={containerRef}
        className="relative w-14 h-14 rounded-full bg-white/20 backdrop-blur-xl border-2 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.6)] flex items-center justify-center overflow-hidden will-change-transform"
      >
        {/* Inner Radial Glow */}
        <div className="absolute inset-0 bg-radial-gradient from-blue-400/20 to-transparent pointer-events-none" />

        {/* Audio Bars */}
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
