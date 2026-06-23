"use client";

import { useEffect, useState, useCallback } from "react";
import { createSupabaseClient } from "@/lib/supabase";

interface Message {
  id: string;
  content: string;
  senderId: string;
  createdAt: string;
  readAt?: string | null;
}

export function useChat(conversationId: string | null, currentUserId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const supabase = createSupabaseClient();

  // Fetch initial messages
  useEffect(() => {
    if (!conversationId) return;

    const fetchMessages = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/messages?conversationId=${conversationId}`);
        if (res.ok) {
          const data = await res.json();
          setMessages(data.messages);
          // Mark as read immediately on open
          await fetch("/api/messages/read", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ conversationId }),
          });
        }
      } catch (err) {
        console.error("Failed to fetch messages:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [conversationId]);

  // Supabase Realtime Subscription
  useEffect(() => {
    if (!conversationId) return;

    // 1. Listen to Postgres Changes for new messages & read receipts
    const channel = supabase
      .channel(`chat:${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
          filter: `conversationId=eq.${conversationId}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            const newMessage = payload.new as Message;
            // Only add if it wasn't already added optimistically
            setMessages((prev) => {
              if (prev.some((m) => m.id === newMessage.id)) return prev;
              return [...prev, newMessage];
            });

            // Mark as read if the message is from the other party
            if (newMessage.senderId !== currentUserId) {
              fetch("/api/messages/read", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ conversationId }),
              });
            }
          } else if (payload.eventType === "UPDATE") {
            const updatedMessage = payload.new as Message;
            setMessages((prev) =>
              prev.map((m) => (m.id === updatedMessage.id ? updatedMessage : m))
            );
          }
        }
      )
      // 2. Listen to Broadcast for typing indicators
      .on("broadcast", { event: "typing" }, (payload) => {
        if (payload.payload.userId !== currentUserId) {
          setIsTyping(payload.payload.isTyping);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, supabase, currentUserId]);

  const sendTypingEvent = useCallback(
    (typing: boolean) => {
      if (!conversationId) return;
      supabase.channel(`chat:${conversationId}`).send({
        type: "broadcast",
        event: "typing",
        payload: { userId: currentUserId, isTyping: typing },
      });
    },
    [conversationId, currentUserId, supabase]
  );

  const sendMessage = async (content: string) => {
    if (!conversationId || !content.trim()) return;

    // Optimistic UI update
    const tempId = `temp-${Date.now()}`;
    const optimisticMsg: Message = {
      id: tempId,
      content: content.trim(),
      senderId: currentUserId,
      createdAt: new Date().toISOString(),
    };
    
    setMessages((prev) => [...prev, optimisticMsg]);
    sendTypingEvent(false);

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId, content: content.trim() }),
      });

      if (!res.ok) throw new Error("Failed to send message");
      const data = await res.json();

      // Replace temp with real
      setMessages((prev) =>
        prev.map((m) => (m.id === tempId ? data.message : m))
      );
    } catch (error) {
      console.error(error);
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
      throw error;
    }
  };

  return {
    messages,
    loading,
    isTyping,
    sendMessage,
    sendTypingEvent,
  };
}
