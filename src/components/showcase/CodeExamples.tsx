import { CodeBlock } from "./CodeBlock";

interface Example {
  title: string;
  code: string;
  language?: string;
  description?: string;
}

interface CodeExamplesProps {
  examples?: Example[];
}

const defaultExamples: Example[] = [
  {
    title: "how to use with react?",
    code: `import { usePackage } from "package-name"

function App() {
  const result = usePackage({
    option: "value",
    enabled: true,
  })

  return <div>{result.output}</div>
}`,
  },
  {
    title: "need a different setup?",
    code: `import { createInstance } from "package-name"

const instance = createInstance({
  target: document.body,
  option: "value",
})

instance.enable()`,
  },
];

export function CodeExamples({ examples = defaultExamples }: CodeExamplesProps) {
  return (
    <div id="examples" className="flex flex-col gap-10 w-full">
      <h2 className="font-display text-base font-bold lowercase tracking-tight text-foreground">
        real-world examples
      </h2>
      {examples.map((ex) => (
        <div key={ex.title} className="flex flex-col gap-2">
          {ex.description && (
            <p className="text-[11px] leading-relaxed text-muted-foreground lowercase">
              {ex.description}
            </p>
          )}
          <CodeBlock title={ex.title} code={ex.code} language={ex.language} />
        </div>
      ))}
    </div>
  );
}
