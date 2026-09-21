import { useEffect, useRef, useState, type FormEvent } from "react";

type MessageRole = "user" | "assistant";

type ChatMessage = {
  id: string;
  role: MessageRole;
  text: string;
  createdAt: string;
};

function Assistant() {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const savedMessages = localStorage.getItem("smartlife_assistant_messages");

    if (savedMessages) {
      return JSON.parse(savedMessages);
    }

    return [
      {
        id: crypto.randomUUID(),
        role: "assistant",
        text: "Hi, I am your SmartLife assistant. I can help you plan tasks, understand expenses, and organize notes.",
        createdAt: new Date().toISOString(),
      },
    ];
  });

  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    localStorage.setItem(
      "smartlife_assistant_messages",
      JSON.stringify(messages),
    );
  }, [messages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  function getFakeAssistantReply(userText: string) {
    const lowerText = userText.toLowerCase();

    if (lowerText.includes("task")) {
      return "You can start by breaking your task into smaller steps, setting a priority, and completing the most urgent one first.";
    }

    if (lowerText.includes("expense") || lowerText.includes("money")) {
      return "A good way to manage expenses is to group them by category and review your monthly spending regularly.";
    }

    if (lowerText.includes("note")) {
      return "For notes, keep the title clear, use categories, and pin important notes so you can find them quickly.";
    }

    return "That sounds interesting. In the real AI version, I will connect to a backend API and give smarter answers based on your tasks, expenses, and notes.";
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!input.trim() || isThinking) {
      return;
    }

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      text: input.trim(),
      createdAt: new Date().toISOString(),
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput("");
    setIsThinking(true);

    setTimeout(() => {
      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        text: getFakeAssistantReply(userMessage.text),
        createdAt: new Date().toISOString(),
      };

      setMessages((prevMessages) => [...prevMessages, assistantMessage]);
      setIsThinking(false);
    }, 800);
  }

  function handleQuickPrompt(prompt: string) {
    setInput(prompt);
  }

  function handleClearChat() {
    const welcomeMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "assistant",
      text: "Chat cleared. How can I help you organize your day?",
      createdAt: new Date().toISOString(),
    };

    setMessages([welcomeMessage]);
  }

  return (
    <section className="flex h-[calc(100vh-4rem)] flex-col">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">AI Assistant</h1>
          <p className="mt-2 text-slate-400">
            Ask about tasks, expenses, notes, or daily planning.
          </p>
        </div>

        <button
          onClick={handleClearChat}
          className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-800"
        >
          Clear Chat
        </button>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <button
          onClick={() => handleQuickPrompt("Help me plan my tasks for today")}
          className="rounded-xl border border-slate-800 bg-slate-900 p-4 text-left text-sm text-slate-300 transition hover:border-teal-400/50 hover:bg-slate-800"
        >
          Plan my tasks
        </button>

        <button
          onClick={() => handleQuickPrompt("How can I reduce my expenses?")}
          className="rounded-xl border border-slate-800 bg-slate-900 p-4 text-left text-sm text-slate-300 transition hover:border-teal-400/50 hover:bg-slate-800"
        >
          Reduce expenses
        </button>

        <button
          onClick={() => handleQuickPrompt("How should I organize my notes?")}
          className="rounded-xl border border-slate-800 bg-slate-900 p-4 text-left text-sm text-slate-300 transition hover:border-teal-400/50 hover:bg-slate-800"
        >
          Organize notes
        </button>
      </div>

      <div className="mt-6 flex-1 overflow-y-auto rounded-xl border border-slate-800 bg-slate-900 p-5">
        <div className="flex flex-col gap-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  message.role === "user"
                    ? "bg-teal-400 text-slate-950"
                    : "bg-slate-800 text-slate-200"
                }`}
              >
                <p>{message.text}</p>

                <p
                  className={`mt-2 text-xs ${
                    message.role === "user"
                      ? "text-slate-700"
                      : "text-slate-500"
                  }`}
                >
                  {new Date(message.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))}

          {isThinking && (
            <div className="flex justify-start">
              <div className="rounded-2xl bg-slate-800 px-4 py-3 text-sm text-slate-400">
                Assistant is thinking...
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-4 flex gap-3">
        <input
          type="text"
          placeholder="Ask your assistant..."
          value={input}
          onChange={(event) => setInput(event.target.value)}
          className="flex-1 rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-teal-400"
        />

        <button
          type="submit"
          disabled={!input.trim() || isThinking}
          className="rounded-lg bg-teal-400 px-5 py-3 font-medium text-slate-950 transition hover:bg-teal-300 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </section>
  );
}

export default Assistant;
