import { useState, useCallback, useRef } from "react";
import { useShortcut, formatShortcut } from "@remcostoeten/use-shortcut";
import { SyntaxHighlight } from "@/components/showcase/SyntaxHighlight";

interface ShortcutEvent {
  id: number;
  combo: string;
  display: string;
  label: string;
  timestamp: number;
}

const MAX_EVENTS = 12;

interface DemoShortcut {
  code: string;
  combo: string;
  display: string;
  label: string;
  /** 1-based line number in the source code block this shortcut maps to */
  sourceLine: number;
}

const DEMO_SHORTCUTS: DemoShortcut[] = [
  { code: '$.cmd.key("s").on(() => save())', combo: "cmd+s", display: "", label: "save", sourceLine: 3 },
  { code: '$.mod.key("k").on(() => search())', combo: "mod+k", display: "", label: "search", sourceLine: 4 },
  { code: '$.mod.key("z").on(() => undo())', combo: "mod+z", display: "", label: "undo", sourceLine: 5 },
  { code: '$.mod.key("c").on(() => copy())', combo: "mod+c", display: "", label: "copy", sourceLine: 6 },
  { code: '$.key("/").on(() => focusSearch())', combo: "/", display: "/", label: "focus search", sourceLine: 7 },
  { code: '$.key("escape").on(() => dismiss())', combo: "escape", display: "Esc", label: "dismiss", sourceLine: 8 },
];

export function UseShortcutDemo() {
  const [events, setEvents] = useState<ShortcutEvent[]>([]);
  const [isActive, setIsActive] = useState(true);
  const [activeCombo, setActiveCombo] = useState<string | null>(null);
  const [activeLine, setActiveLine] = useState<number | null>(null);
  const idRef = useRef(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const pushEvent = useCallback((combo: string, display: string, label: string, line: number) => {
    const id = ++idRef.current;
    setEvents((prev) => [{ id, combo, display, label, timestamp: Date.now() }, ...prev].slice(0, MAX_EVENTS));
    setActiveCombo(combo);
    setActiveLine(line);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setActiveCombo(null);
      setActiveLine(null);
    }, 600);
  }, []);

  const $ = useShortcut({ disabled: !isActive, ignoreInputs: true });

  const save = $.cmd.key("s").on(
    () => pushEvent("cmd+s", formatShortcut("cmd+s"), "save", 3),
    { preventDefault: true }
  );
  const search = $.mod.key("k").on(
    () => pushEvent("mod+k", formatShortcut("mod+k"), "search", 4),
    { preventDefault: true }
  );
  const undo = $.mod.key("z").on(
    () => pushEvent("mod+z", formatShortcut("mod+z"), "undo", 5),
    { preventDefault: true }
  );
  const copyShortcut = $.mod.key("c").on(
    () => pushEvent("mod+c", formatShortcut("mod+c"), "copy", 6),
    { preventDefault: true }
  );
  $.key("slash").on(
    () => pushEvent("/", "/", "focus search", 7),
  );
  $.key("escape").on(
    () => pushEvent("escape", "Esc", "dismiss", 8),
  );

  // Resolve display strings from the actual results
  const shortcuts = DEMO_SHORTCUTS.map((s, i) => ({
    ...s,
    display: i === 0 ? save.display
      : i === 1 ? search.display
      : i === 2 ? undo.display
      : i === 3 ? copyShortcut.display
      : s.display,
  }));

  // Build the source code shown alongside
  const sourceCode = `const $ = useShortcut()

${shortcuts.map((s) => s.code).join("\n")}`;

  const sourceLines = sourceCode.split("\n");

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="font-mono text-xs text-muted-foreground lowercase">
          try these shortcuts -- press any combo below
        </p>
        <button
          onClick={() => setIsActive(!isActive)}
          className={`font-mono text-[10px] px-2 py-1 border border-dashed transition-colors ${
            isActive ? "border-primary/50 text-primary" : "border-border text-muted-foreground"
          }`}
        >
          [{isActive ? "active" : "paused"}]
        </button>
      </div>

      {/* Two-column: code + shortcuts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-border border border-border">
        {/* Source code */}
        <div className="bg-card p-4 overflow-x-auto code-scroll">
          <p className="font-mono text-[10px] text-muted-foreground lowercase mb-3">source</p>
          <pre className="text-[11px] leading-relaxed">
            <code className="font-mono text-muted-foreground">
              {sourceLines.map((line, i) => {
                const lineNum = i + 1;
                const isHighlighted = activeLine === lineNum;
                return (
                  <div
                    key={i}
                    className={`px-2 -mx-1 transition-all duration-300 border-l-2 ${
                      isHighlighted
                        ? "bg-primary/10 border-primary"
                        : "border-transparent"
                    }`}
                    style={{
                      transform: isHighlighted ? "translateX(2px)" : "translateX(0)",
                      transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)",
                    }}
                  >
                    <span className={`inline-block w-5 text-right mr-3 select-none text-[10px] ${
                      isHighlighted ? "text-primary" : "text-muted-foreground/30"
                    }`}>
                      {lineNum}
                    </span>
                    {line ? <SyntaxHighlight code={line} /> : "\u00A0"}
                  </div>
                );
              })}
            </code>
          </pre>
        </div>

        {/* Shortcut keys grid */}
        <div className="bg-background grid grid-cols-2 gap-px bg-border">
          {shortcuts.map((s) => {
            const isTriggered = activeCombo === s.combo;
            return (
              <div
                key={s.combo}
                className={`bg-background px-3 py-4 flex flex-col items-center gap-1.5 cursor-default transition-all duration-300 ${
                  isTriggered ? "bg-primary/5" : ""
                }`}
              >
                <kbd
                  className={`font-mono text-sm tracking-wider transition-all duration-300 ${
                    isTriggered ? "text-primary scale-110" : "text-foreground"
                  }`}
                  style={{ transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)" }}
                >
                  {s.display}
                </kbd>
                <span className={`font-mono text-[10px] lowercase transition-colors duration-300 ${
                  isTriggered ? "text-primary/80" : "text-muted-foreground"
                }`}>
                  {s.label}
                </span>
                {isTriggered && (
                  <div className="h-0.5 w-6 bg-primary/50 rounded-full" style={{
                    animation: "pulseBar 600ms ease-out forwards",
                  }} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Event log */}
      <div className="border border-border">
        <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-card/50">
          <span className="font-mono text-[10px] text-muted-foreground lowercase">event log</span>
          {events.length > 0 && (
            <button
              onClick={() => setEvents([])}
              className="font-mono text-[10px] text-muted-foreground hover:text-foreground transition-colors"
            >
              [clear]
            </button>
          )}
        </div>
        <div className="min-h-[80px] max-h-[160px] overflow-y-auto">
          {events.length === 0 ? (
            <div className="flex items-center justify-center h-[80px]">
              <p className="font-mono text-[10px] text-muted-foreground/50 lowercase">
                press a shortcut to see it here...
              </p>
            </div>
          ) : (
            <div className="flex flex-col">
              {events.map((ev, i) => (
                <div
                  key={ev.id}
                  className={`flex items-center gap-3 px-3 py-1.5 border-b border-border/50 last:border-0 ${
                    i === 0 ? "bg-primary/5" : ""
                  }`}
                  style={{ animation: i === 0 ? "slideIn 200ms ease-out" : undefined }}
                >
                  <kbd className="font-mono text-xs text-primary min-w-[60px]">{ev.display}</kbd>
                  <span className="font-mono text-[10px] text-muted-foreground lowercase flex-1">{ev.label}</span>
                  <span className="font-mono text-[10px] text-muted-foreground/40">
                    {new Date(ev.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulseBar {
          0% { opacity: 1; transform: scaleX(0.3); }
          50% { opacity: 1; transform: scaleX(1); }
          100% { opacity: 0; transform: scaleX(0.5); }
        }
      `}</style>
    </div>
  );
}
