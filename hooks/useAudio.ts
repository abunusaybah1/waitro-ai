import { useEffect, useRef, useState } from "react";

function getRecognitionCtor() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
}

function extractTranscript(event: SpeechRecognitionEvent): string {
  const results = event.results;
  if (!results || results.length === 0) {
    return "";
  }

  const latestResult = results[results.length - 1];
  if (!latestResult) {
    return "";
  }

  const parts: string[] = [];
  for (let index = 0; index < latestResult.length; index += 1) {
    const alternative = latestResult[index] as unknown as { transcript?: string } | undefined;
    if (alternative?.transcript) {
      parts.push(alternative.transcript);
    }
  }

  return parts.join(" ").trim();
}

export function useAudio() {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
    };
  }, []);

  const start = async () => {
    const RecognitionCtor = getRecognitionCtor();

    if (!RecognitionCtor) {
      setError("Speech recognition is not supported in this browser. Please try Chrome or Edge.");
      return;
    }

    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    if (typeof navigator !== "undefined" && navigator.mediaDevices?.getUserMedia) {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
      } catch {
        setError("Microphone access was denied. Please allow microphone access and try again.");
        return;
      }
    }

    const recognition = new RecognitionCtor();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setListening(true);
      setError(null);
      setTranscript("");
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const nextTranscript = extractTranscript(event);
      if (nextTranscript) {
        setTranscript(nextTranscript);
      }
    };

    recognition.onerror = (event: Event) => {
      setListening(false);
      const detail = event instanceof ErrorEvent ? event.message : event.type;
      setError(`Audio capture failed: ${detail}. Try using the text input instead.`);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognitionRef.current = recognition;

    try {
      recognition.start();
    } catch (startError) {
      setListening(false);
      setError(`Could not start microphone: ${startError instanceof Error ? startError.message : "unknown error"}`);
    }
  };

  const stop = () => {
    recognitionRef.current?.stop();
    setListening(false);
  };

  return { listening, transcript, error, start, stop, setTranscript };
}
