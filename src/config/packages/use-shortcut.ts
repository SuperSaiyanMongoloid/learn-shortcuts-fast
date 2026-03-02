import type { PackageConfig } from "../types";

const useShortcutConfig: PackageConfig = {
  packageName: "use-shortcut",
  installName: "@remcostoeten/use-shortcut",
  tagline: "chainable keyboard shortcuts",
  description:
    "chainable keyboard shortcuts for react with perfect typescript intellisense. zero dependencies, ~3kb gzipped.",
  heroTitle: "use-shortcut",

  author: {
    name: "Remco Stoeten",
    handle: "@remcostoeten",
    url: "https://github.com/remcostoeten",
  },

  navLinks: [
    { label: "docs", url: "#api" },
    { label: "playground", url: "#demo" },
    { label: "examples", url: "#examples" },
    { label: "changelog", url: "https://github.com/remcostoeten/use-shortcut/releases" },
  ],

  links: {
    npm: "https://www.npmjs.com/package/@remcostoeten/use-shortcut",
    github: "https://github.com/remcostoeten/use-shortcut",
    demo: "https://use-shortcuts.vercel.app/",
  },

  ctas: [
    { label: "get started", url: "#install", primary: true },
    { label: "live playground", url: "https://use-shortcuts.vercel.app/" },
  ],

  worksWith: [
    { label: "react", url: "https://react.dev/" },
    { label: "next.js", url: "https://nextjs.org/" },
    { label: "vite", url: "https://vitejs.dev/" },
    { label: "remix", url: "https://remix.run/" },
  ],

  badges: {
    version: "v1.3.0",
    downloads: "185/wk",
    bundleSize: "~3kb",
  },

  why: {
    paragraphs: [
      "most shortcut libraries give you a hook and a string. you lose type safety, can't chain modifiers, and have zero conflict detection. use-shortcut gives you a fluent, chainable api with perfect intellisense at every step.",
      "sequences like g→d, named scopes for context switching, recording mode for custom keybind UIs, shortcut maps for bulk registration — all with zero dependencies and ~3kb gzipped.",
    ],
  },

  features: [
    { value: "~3kb", label: "zero dependencies", description: "only react as peer dep. tiny bundle." },
    { value: "chain", label: "chainable api", description: "$.cmd.shift.key('s').on(() => save())" },
    { value: "ts", label: "perfect typescript", description: "intellisense at every step of the chain." },
    { value: "seq", label: "sequences & chords", description: "multi-step bindings like $.key('g').then('d')" },
    { value: "scope", label: "named scopes", description: "activate/deactivate shortcut contexts." },
    { value: "mod", label: "cross-platform", description: "mod = cmd on mac, ctrl on windows/linux." },
  ],

  apiProps: [
    { name: "debug", type: "boolean", default: "false", description: "log all shortcuts to console." },
    { name: "delay", type: "number", default: "0", description: "global delay for all shortcuts (ms)." },
    { name: "ignoreInputs", type: "boolean", default: "true", description: "ignore shortcuts in form elements." },
    { name: "disabled", type: "boolean", default: "false", description: "disable all shortcuts." },
    { name: "eventType", type: '"keydown" | "keyup"', default: '"keydown"', description: "keyboard event type." },
    { name: "activeScopes", type: "string | string[]", default: "---", description: "active named scopes." },
    { name: "sequenceTimeout", type: "number", default: "800", description: "ms to complete a sequence." },
    { name: "conflictWarnings", type: "boolean", default: "true", description: "warn on shortcut overlaps." },
    { name: "blockedByModal", type: "boolean", default: "false", description: "prevent shortcuts when modal is open." },
  ],

  builderMethods: [
    { name: ".mod", type: "chain", description: "standard modifier. cmd on mac, ctrl on windows/linux." },
    { name: ".ctrl", type: "chain", description: "control key modifier." },
    { name: ".shift", type: "chain", description: "shift key modifier." },
    { name: ".alt", type: "chain", description: "alt/option key modifier." },
    { name: ".cmd", type: "chain", description: "command key (mac) or windows key." },
    { name: ".key(char)", type: "chain", description: "specifies the action key. must be last before handlers." },
    { name: ".except(condition)", type: "chain", description: 'skip shortcut when condition matches. presets: "input", "typing", "modal".' },
    { name: ".on(handler, opts?)", type: "ShortcutResult", description: "registers the listener. returns { display, enabled, destroy }." },
    { name: ".then(key)", type: "chain", description: "creates a key sequence (e.g. g then d)." },
    { name: ".in(scope)", type: "chain", description: "binds shortcut to a named scope." },
  ],

  returnValues: [
    { name: "display", type: "string", description: 'formatted display string (e.g. "⌘S").' },
    { name: "enabled", type: "boolean", description: "whether the shortcut is currently active." },
    { name: "destroy", type: "() => void", description: "manually unbind the shortcut." },
  ],

  scopeApi: [
    { name: "$.setScopes(scope)", type: "(string | string[]) => void", description: "replace all active scopes." },
    { name: "$.enableScope(scope)", type: "(string) => void", description: "add a scope to active set." },
    { name: "$.disableScope(scope)", type: "(string) => void", description: "remove a scope from active set." },
    { name: "$.getScopes()", type: "() => string[]", description: "get the current active scopes." },
  ],

  utilityExports: [
    { name: "formatShortcut(combo)", type: "(string) => string", description: 'formats a combo string for display (e.g. "cmd+s" => "⌘S").' },
    { name: "useShortcutMap(map)", type: "(map) => void", description: "register multiple shortcuts in a declarative object." },
    { name: "$.record(opts?)", type: "Promise<string>", description: "enter recording mode. returns the captured key combo string." },
  ],

  codeExamples: [
    {
      title: "command palette with search",
      description: "real-world command palette using mod+k to toggle visibility and escape to dismiss. integrates with react state for search filtering.",
      code: `import { useShortcut } from "@remcostoeten/use-shortcut"
import { useState, useRef, useEffect } from "react"

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const $ = useShortcut()

  $.mod.key("k").on(
    () => {
      setOpen((prev) => !prev)
      setQuery("")
    },
    { preventDefault: true }
  )

  $.key("escape").on(() => {
    if (open) setOpen(false)
  })

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]">
      <div className="bg-card border border-border w-full max-w-lg p-4">
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search commands..."
          className="w-full bg-transparent font-mono text-sm"
        />
      </div>
    </div>
  )
}`,
      language: "tsx",
    },
    {
      title: "text editor with undo/redo stack",
      description: "standard text editor shortcuts with a full undo/redo stack. demonstrates chaining multiple modifiers, using .except([]) to work inside inputs, and preventDefault.",
      code: `import { useShortcut } from "@remcostoeten/use-shortcut"
import { useState, useCallback, useRef } from "react"

export function TextEditor() {
  const [content, setContent] = useState("")
  const history = useRef<string[]>([""])
  const pointer = useRef(0)
  const $ = useShortcut()

  const push = useCallback((text: string) => {
    history.current = history.current.slice(0, pointer.current + 1)
    history.current.push(text)
    pointer.current++
    setContent(text)
  }, [])

  // Undo: Mod+Z - works inside the textarea
  $.mod.key("z").except([]).on(
    () => {
      if (pointer.current > 0) {
        pointer.current--
        setContent(history.current[pointer.current])
      }
    },
    { preventDefault: true }
  )

  // Redo: Mod+Shift+Z
  $.mod.shift.key("z").except([]).on(
    () => {
      if (pointer.current < history.current.length - 1) {
        pointer.current++
        setContent(history.current[pointer.current])
      }
    },
    { preventDefault: true }
  )

  // Save: Mod+S
  $.mod.key("s").on(
    () => console.log("Saving:", content),
    { preventDefault: true }
  )

  // Bold: Mod+B
  $.mod.key("b").except([]).on(
    () => push(content + "**bold**"),
    { preventDefault: true }
  )

  return (
    <textarea
      value={content}
      onChange={(e) => push(e.target.value)}
      className="w-full h-64 bg-card border border-border p-4 font-mono"
    />
  )
}`,
      language: "tsx",
    },
    {
      title: "vim-style navigation with sequences",
      description: "multi-key sequences for vim-style navigation. press g then h to go home, g then d to go to dashboard. uses .then() for sequence chaining.",
      code: `import { useShortcut } from "@remcostoeten/use-shortcut"
import { useNavigate } from "react-router-dom"

export function VimNavigation() {
  const navigate = useNavigate()
  const $ = useShortcut({ sequenceTimeout: 600 })

  // g → h: go home
  $.key("g").then("h").on(() => navigate("/"))

  // g → d: go to dashboard
  $.key("g").then("d").on(() => navigate("/dashboard"))

  // g → s: go to settings
  $.key("g").then("s").on(() => navigate("/settings"))

  // g → p: go to profile
  $.key("g").then("p").on(() => navigate("/profile"))

  // j/k: scroll down/up
  $.key("j").on(() => window.scrollBy(0, 100))
  $.key("k").on(() => window.scrollBy(0, -100))

  // shift+g: scroll to bottom
  $.shift.key("g").on(() =>
    window.scrollTo(0, document.body.scrollHeight)
  )

  // g → g: scroll to top
  $.key("g").then("g").on(() =>
    window.scrollTo(0, 0)
  )

  return null // headless hook usage
}`,
      language: "tsx",
    },
    {
      title: "scoped shortcuts with context switching",
      description: "named scopes to separate shortcut contexts. navigation and editor scopes are activated/deactivated based on which panel is focused.",
      code: `import { useShortcut } from "@remcostoeten/use-shortcut"
import { useState } from "react"

type Panel = "navigation" | "editor"

export function ScopedApp() {
  const [activePanel, setActivePanel] = useState<Panel>("navigation")
  const $ = useShortcut({ activeScopes: activePanel })

  // Navigation scope
  $.in("navigation").key("j").on(() => console.log("nav: next item"))
  $.in("navigation").key("k").on(() => console.log("nav: prev item"))
  $.in("navigation").key("enter").on(() => {
    setActivePanel("editor")
    $.setScopes("editor")
  })

  // Editor scope
  $.in("editor").mod.key("s").on(
    () => console.log("editor: save file"),
    { preventDefault: true }
  )
  $.in("editor").key("escape").on(() => {
    setActivePanel("navigation")
    $.setScopes("navigation")
  })

  // Global shortcut (works in any scope)
  $.mod.key("k").on(
    () => console.log("global: open command palette"),
    { preventDefault: true }
  )

  return (
    <div className="flex gap-4">
      <div className={activePanel === "navigation" ? "border-primary" : "border-border"}>
        sidebar
      </div>
      <div className={activePanel === "editor" ? "border-primary" : "border-border"}>
        editor
      </div>
    </div>
  )
}`,
      language: "tsx",
    },
    {
      title: "bulk registration with useShortcutMap",
      description: "register multiple shortcuts at once using a declarative object map. cleaner syntax for apps with many bindings. supports sequences via array keys.",
      code: `import { useShortcutMap } from "@remcostoeten/use-shortcut"

export function AppShortcuts() {
  useShortcutMap({
    save: {
      keys: "mod+s",
      handler: () => saveDocument(),
      options: { preventDefault: true },
    },
    undo: {
      keys: "mod+z",
      handler: () => undoAction(),
      options: { preventDefault: true },
    },
    redo: {
      keys: "mod+shift+z",
      handler: () => redoAction(),
      options: { preventDefault: true },
    },
    selectAll: {
      keys: "mod+a",
      handler: () => selectAll(),
      options: { preventDefault: true },
    },
    goToDashboard: {
      keys: ["g", "d"],  // sequence: press g, then d
      handler: () => navigate("/dashboard"),
    },
    goToSettings: {
      keys: ["g", "s"],
      handler: () => navigate("/settings"),
    },
    toggleSidebar: {
      keys: "mod+b",
      handler: () => toggleSidebar(),
      options: { preventDefault: true },
    },
    search: {
      keys: "mod+k",
      handler: () => openSearch(),
      options: { preventDefault: true },
    },
  })

  return null
}`,
      language: "tsx",
    },
    {
      title: "recording mode for custom keybinds",
      description: "let users record their own shortcut combos. useful for settings pages where users customize keybindings. $.record() returns a promise with the captured combo.",
      code: `import { useShortcut, formatShortcut } from "@remcostoeten/use-shortcut"
import { useState } from "react"

interface Keybind {
  action: string
  combo: string
  display: string
}

export function KeybindSettings() {
  const $ = useShortcut()
  const [keybinds, setKeybinds] = useState<Keybind[]>([
    { action: "Save", combo: "mod+s", display: formatShortcut("mod+s") },
    { action: "Search", combo: "mod+k", display: formatShortcut("mod+k") },
  ])
  const [recording, setRecording] = useState<number | null>(null)

  async function recordKeybind(index: number) {
    setRecording(index)
    try {
      const combo = await $.record({ timeoutMs: 5000 })
      setKeybinds((prev) =>
        prev.map((kb, i) =>
          i === index
            ? { ...kb, combo, display: formatShortcut(combo) }
            : kb
        )
      )
    } catch {
      // timeout or cancel
    } finally {
      setRecording(null)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      {keybinds.map((kb, i) => (
        <div key={kb.action} className="flex items-center justify-between">
          <span>{kb.action}</span>
          <button onClick={() => recordKeybind(i)}>
            {recording === i ? "press any key..." : kb.display}
          </button>
        </div>
      ))}
    </div>
  )
}`,
      language: "tsx",
    },
    {
      title: "conditional shortcuts with .except()",
      description: 'skip shortcuts based on context. built-in presets "input", "typing", and "modal" cover common cases. pass an empty array to override ignoreInputs and enable inside form elements.',
      code: `import { useShortcut } from "@remcostoeten/use-shortcut"

export function ConditionalShortcuts() {
  const $ = useShortcut()

  // Skip when typing in any input/textarea
  $.key("/").except("typing").on(() => {
    focusSearchBar()
  })

  // Skip when a modal is open
  $.key("escape").except("modal").on(() => {
    closePanel()
  })

  // Skip when focused on any form input
  $.mod.key("enter").except("input").on(() => {
    submitForm()
  })

  // Override ignoreInputs: force-enable inside inputs
  $.mod.key("s").except([]).on(
    (e) => {
      e.preventDefault()
      saveDocument()
    },
    { preventDefault: true }
  )

  return null
}`,
      language: "tsx",
    },
    {
      title: "accessibility toolbar",
      description: "keyboard-first accessibility controls. increase/decrease font size, toggle high contrast mode, and jump to main content. uses formatShortcut for dynamic display strings.",
      code: `import { useShortcut, formatShortcut } from "@remcostoeten/use-shortcut"
import { useState } from "react"

export function A11yToolbar() {
  const [fontSize, setFontSize] = useState(16)
  const [highContrast, setHighContrast] = useState(false)
  const $ = useShortcut()

  const increase = $.mod.key("=").on(
    () => setFontSize((s) => Math.min(s + 2, 32)),
    { preventDefault: true }
  )

  const decrease = $.mod.key("-").on(
    () => setFontSize((s) => Math.max(s - 2, 10)),
    { preventDefault: true }
  )

  const contrast = $.mod.shift.key("h").on(
    () => setHighContrast((v) => !v),
    { preventDefault: true }
  )

  // Skip to main content
  $.key("1").on(() => {
    document.getElementById("main-content")?.focus()
  })

  return (
    <div role="toolbar" aria-label="Accessibility controls">
      <span>Font size: {fontSize}px</span>
      <kbd>{increase.display}</kbd>
      <kbd>{decrease.display}</kbd>
      <span>High contrast: {highContrast ? "on" : "off"}</span>
      <kbd>{contrast.display}</kbd>
    </div>
  )
}`,
      language: "tsx",
    },
    {
      title: "install (cli)",
      code: `npm install @remcostoeten/use-shortcut

# or copy-paste (shadcn-style)
npx @remcostoeten/use-shortcut init

# scaffold full architecture
npx @remcostoeten/use-shortcut scaffold`,
      language: "bash",
    },
  ],

  useCases:
    "command palettes, editor shortcuts, vim-style navigation, custom keybind UIs, accessibility tooling, game controls, multi-step workflows — anywhere you need keyboard shortcuts with zero friction.",
};

export default useShortcutConfig;
