"use client";

import { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, UserCircle, Loader2, Check, CheckCheck } from "lucide-react";
import { useChat } from "@/hooks/useChat";

interface Conversation {
  id: string;
  requestId: string;
  projectTitle: string;
  otherParty: {
    name: string;
    image: string | null;
  };
  lastMessage: {
    content: string | null;
    createdAt: Date;
    isMine: boolean;
  } | null;
}

export default function MessagesClient({
  conversations,
  currentUserId,
}: {
  conversations: Conversation[];
  currentUserId: string;
}) {
  const [activeConvId, setActiveConvId] = useState<string | null>(
    conversations.length > 0 ? conversations[0].id : null
  );
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConv = conversations.find((c) => c.id === activeConvId);

  // Use our new Realtime chat hook
  const { messages, loading, isTyping, sendMessage, sendTypingEvent } = useChat(
    activeConvId,
    currentUserId
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Scroll when new messages arrive or when typing status changes
  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !activeConvId) return;

    const messageContent = input.trim();
    setInput("");
    
    try {
      await sendMessage(messageContent);
    } catch (err) {
      // Revert input on error
      setInput(messageContent);
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    sendTypingEvent(e.target.value.length > 0);
  };

  if (conversations.length === 0) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", padding: 24 }}>
        <div style={{ textAlign: "center", maxWidth: 400 }}>
          <div style={{ width: 64, height: 64, borderRadius: 20, background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            <MessageSquare size={32} style={{ color: "rgba(255,255,255,0.2)" }} />
          </div>
          <h3 style={{ color: "white", fontSize: 18, fontWeight: 700, margin: "0 0 8px" }}>No conversations yet</h3>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, margin: 0, lineHeight: 1.5 }}>
            Conversations will appear here once a professional accepts a project request.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", height: "100%" }}>
      {/* Conversation List */}
      <div
        style={{
          width: 320,
          borderRight: "1px solid rgba(255,255,255,0.06)",
          background: "rgba(255,255,255,0.01)",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
        }}
        className="msg-sidebar"
      >
        {conversations.map((conv) => (
          <div
            key={conv.id}
            onClick={() => setActiveConvId(conv.id)}
            style={{
              padding: "16px 20px",
              borderBottom: "1px solid rgba(255,255,255,0.04)",
              cursor: "pointer",
              background: activeConvId === conv.id ? "rgba(37,99,235,0.1)" : "transparent",
              transition: "background 150ms ease",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {conv.otherParty.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={conv.otherParty.image} alt={conv.otherParty.name} style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover" }} />
              ) : (
                <div style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <UserCircle size={24} style={{ color: "rgba(255,255,255,0.3)" }} />
                </div>
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 2 }}>
                  <span style={{ color: "white", fontSize: 14, fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {conv.otherParty.name}
                  </span>
                  {conv.lastMessage && (
                    <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 11 }}>
                      {new Date(conv.lastMessage.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </span>
                  )}
                </div>
                <div style={{ color: "#60A5FA", fontSize: 12, fontWeight: 500, marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {conv.projectTitle}
                </div>
                <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {conv.lastMessage ? (
                    <span>{conv.lastMessage.isMine ? "You: " : ""}{conv.lastMessage.content}</span>
                  ) : (
                    <span style={{ fontStyle: "italic" }}>No messages yet</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Chat Area */}
      {activeConv ? (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
          {/* Header */}
          <div style={{ padding: "16px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)", display: "flex", alignItems: "center", gap: 12 }}>
            {activeConv.otherParty.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={activeConv.otherParty.image} alt={activeConv.otherParty.name} style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover" }} />
            ) : (
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <UserCircle size={20} style={{ color: "rgba(255,255,255,0.3)" }} />
              </div>
            )}
            <div>
              <h2 style={{ color: "white", fontSize: 15, fontWeight: 700, margin: 0 }}>{activeConv.otherParty.name}</h2>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, margin: 0 }}>{activeConv.projectTitle}</p>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, padding: "24px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 16 }}>
            {loading && messages.length === 0 ? (
              <div style={{ display: "flex", justifyContent: "center", padding: 40 }}>
                <Loader2 size={24} style={{ color: "rgba(255,255,255,0.2)", animation: "spin 1s linear infinite" }} />
              </div>
            ) : messages.length === 0 ? (
              <div style={{ textAlign: "center", color: "rgba(255,255,255,0.3)", fontSize: 14, marginTop: 40 }}>
                This is the beginning of your conversation.
              </div>
            ) : (
              messages.map((msg, idx) => {
                const isMine = msg.senderId === currentUserId;
                const showAvatar = !isMine && (idx === 0 || messages[idx - 1].senderId !== msg.senderId);
                
                return (
                  <div key={msg.id} style={{ display: "flex", gap: 12, alignSelf: isMine ? "flex-end" : "flex-start", maxWidth: "75%" }}>
                    {!isMine && (
                      <div style={{ width: 28, flexShrink: 0 }}>
                        {showAvatar && (
                          activeConv.otherParty.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={activeConv.otherParty.image} alt="" style={{ width: 28, height: 28, borderRadius: "50%" }} />
                          ) : (
                            <div style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <UserCircle size={16} style={{ color: "rgba(255,255,255,0.5)" }} />
                            </div>
                          )
                        )}
                      </div>
                    )}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: isMine ? "flex-end" : "flex-start", gap: 4 }}>
                      <div
                        style={{
                          background: isMine ? "#2563EB" : "rgba(255,255,255,0.06)",
                          color: "white",
                          padding: "10px 16px",
                          borderRadius: 16,
                          borderBottomRightRadius: isMine ? 4 : 16,
                          borderBottomLeftRadius: !isMine ? 4 : 16,
                          fontSize: 14,
                          lineHeight: 1.5,
                        }}
                      >
                        {msg.content}
                      </div>
                      
                      {/* Read receipts indicator */}
                      {isMine && (
                        <div style={{ display: "flex", alignItems: "center", gap: 4, paddingRight: 4 }}>
                          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          {msg.readAt ? (
                            <CheckCheck size={14} style={{ color: "#60A5FA" }} />
                          ) : (
                            <Check size={14} style={{ color: "rgba(255,255,255,0.3)" }} />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}

            {/* Typing Indicator */}
            {isTyping && (
              <div style={{ display: "flex", gap: 12, alignSelf: "flex-start", maxWidth: "75%", alignItems: "center", marginTop: 8 }}>
                <div style={{ width: 28, flexShrink: 0 }}>
                  {activeConv.otherParty.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={activeConv.otherParty.image} alt="" style={{ width: 28, height: 28, borderRadius: "50%" }} />
                  ) : (
                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <UserCircle size={16} style={{ color: "rgba(255,255,255,0.5)" }} />
                    </div>
                  )}
                </div>
                <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, display: "flex", alignItems: "center", gap: 4 }}>
                  <span className="typing-dot" />
                  <span className="typing-dot" style={{ animationDelay: "0.2s" }} />
                  <span className="typing-dot" style={{ animationDelay: "0.4s" }} />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div style={{ padding: "16px 24px", borderTop: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}>
            <form onSubmit={handleSend} style={{ display: "flex", gap: 12 }}>
              <input
                type="text"
                value={input}
                onChange={handleInput}
                onBlur={() => sendTypingEvent(false)}
                placeholder="Type a message..."
                style={{
                  flex: 1,
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 24,
                  padding: "12px 20px",
                  color: "white",
                  fontSize: 14,
                  outline: "none",
                }}
              />
              <button
                type="submit"
                disabled={!input.trim()}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  background: input.trim() ? "#2563EB" : "rgba(255,255,255,0.1)",
                  border: "none",
                  color: input.trim() ? "white" : "rgba(255,255,255,0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: input.trim() ? "pointer" : "not-allowed",
                  transition: "all 150ms ease",
                }}
              >
                <Send size={18} style={{ marginLeft: 2 }} />
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.3)" }}>
          Select a conversation
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes blink { 0% { opacity: 0.2; } 20% { opacity: 1; } 100% { opacity: 0.2; } }
        .typing-dot { width: 4px; height: 4px; background: currentColor; border-radius: 50%; display: inline-block; animation: blink 1.4s infinite both; }
        @media (max-width: 768px) {
          .msg-sidebar { display: ${activeConvId ? "none" : "flex"} !important; width: 100% !important; }
        }
      `}</style>
    </div>
  );
}
