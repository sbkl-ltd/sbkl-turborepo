"use client";

import type { ComponentProps, Ref } from "react";

import { Button } from "@sbkl-turborepo/ui/components/button";
import { Spinner } from "@sbkl-turborepo/ui/components/spinner";
import { cn } from "@sbkl-turborepo/ui/lib/utils";
import { MicIcon, SquareIcon } from "lucide-react";
import {
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

export interface SpeechInputHandle {
  startRecording: () => void;
  stopRecording: () => void;
  isListening: boolean;
  isProcessing: boolean;
}

export type SpeechInputProps = Omit<ComponentProps<typeof Button>, "ref"> & {
  onTranscriptionChange?: (text: string) => void;
  /**
   * Called when audio recording finishes. Receives the raw audio Blob (audio/webm).
   * Return the transcribed text, which will be passed to onTranscriptionChange.
   */
  onAudioRecorded?: (audioBlob: Blob) => Promise<string>;
  ref?: Ref<SpeechInputHandle>;
};

function isMediaRecorderAvailable() {
  return (
    typeof window !== "undefined" &&
    "MediaRecorder" in window &&
    "mediaDevices" in navigator
  );
}

export function SpeechInput({
  className,
  onTranscriptionChange,
  onAudioRecorded,
  ref,
  ...props
}: SpeechInputProps) {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAvailable] = useState(isMediaRecorderAvailable);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const onTranscriptionChangeRef = useRef(onTranscriptionChange);
  const onAudioRecordedRef = useRef(onAudioRecorded);

  onTranscriptionChangeRef.current = onTranscriptionChange;
  onAudioRecordedRef.current = onAudioRecorded;

  useEffect(
    () => () => {
      if (mediaRecorderRef.current?.state === "recording") {
        mediaRecorderRef.current.stop();
      }
      if (streamRef.current) {
        for (const track of streamRef.current.getTracks()) {
          track.stop();
        }
      }
    },
    [],
  );

  const startRecording = useCallback(async () => {
    if (!onAudioRecordedRef.current || isListening) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mediaRecorder = new MediaRecorder(stream);
      audioChunksRef.current = [];

      const handleDataAvailable = (event: BlobEvent) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      const handleStop = async () => {
        for (const track of stream.getTracks()) {
          track.stop();
        }
        streamRef.current = null;

        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });

        if (audioBlob.size > 0 && onAudioRecordedRef.current) {
          setIsProcessing(true);
          try {
            const transcript = await onAudioRecordedRef.current(audioBlob);
            if (transcript) {
              onTranscriptionChangeRef.current?.(transcript);
            } else {
              console.warn(
                "[SpeechInput] transcript is empty/falsy, skipping onTranscriptionChange",
              );
            }
          } catch (err) {
            console.error("[SpeechInput] onAudioRecorded threw:", err);
          } finally {
            setIsProcessing(false);
          }
        } else {
          console.warn(
            "[SpeechInput] skipped onAudioRecorded — blob empty or callback missing",
            {
              blobSize: audioBlob.size,
              hasCallback: !!onAudioRecordedRef.current,
            },
          );
        }
      };

      const handleError = () => {
        setIsListening(false);
        for (const track of stream.getTracks()) {
          track.stop();
        }
        streamRef.current = null;
      };

      mediaRecorder.addEventListener("dataavailable", handleDataAvailable);
      mediaRecorder.addEventListener("stop", handleStop);
      mediaRecorder.addEventListener("error", handleError);

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsListening(true);
    } catch {
      setIsListening(false);
    }
  }, [isListening]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
    }
    setIsListening(false);
  }, []);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopRecording();
    } else {
      startRecording();
    }
  }, [isListening, startRecording, stopRecording]);

  useImperativeHandle(
    ref,
    () => ({
      startRecording: () => void startRecording(),
      stopRecording,
      isListening,
      isProcessing,
    }),
    [startRecording, stopRecording, isListening, isProcessing],
  );

  const isDisabled = !isAvailable || !onAudioRecorded || isProcessing;

  return (
    <Button
      className={cn(
        "relative transition-all duration-300",
        isListening && "text-destructive",
        className,
      )}
      disabled={isDisabled}
      onClick={toggleListening}
      type="button"
      {...props}
    >
      {isProcessing && <Spinner />}
      {!isProcessing && isListening && <SquareIcon className="size-4" />}
      {!(isProcessing || isListening) && <MicIcon className="size-4" />}
    </Button>
  );
}
