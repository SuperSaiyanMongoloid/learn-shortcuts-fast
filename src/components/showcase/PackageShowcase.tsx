import { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { InstallCommand } from "./InstallCommand";
import { DemoSection } from "./DemoSection";
import { FeatureGrid } from "./FeatureGrid";
import { ApiTable } from "./ApiTable";
import { CodeExamples } from "./CodeExamples";
import { FooterSection } from "./FooterSection";
import { BadgeBar } from "./BadgeBar";
import { WorksWith } from "./WorksWith";
import { PixelHeading } from "@/components/ui/pixel-heading";
import type { PackageConfig } from "@/config/types";
import { ArrowRight } from "lucide-react";

interface PackageShowcaseProps {
  config: PackageConfig;
  demoContent?: ReactNode;
}

export function PackageShowcase({ config, demoContent }: PackageShowcaseProps) {
  return (
    <div className="min-h-screen bg-background relative overflow-x-clip">
      <Navbar
        packageName={config.packageName}
        navLinks={config.navLinks}
        githubUrl={config.links.github}
      />

      {/* Extended border lines outside column */}
      <div className="hidden lg:block pointer-events-none select-none absolute inset-0" aria-hidden="true">
        {/* Horizontal rules that bleed outside the column */}
        <div className="absolute top-[320px] left-0 right-0 h-px bg-border/40" />
        <div className="absolute top-[320px] left-0 right-0 h-px border-t border-dashed border-border/30" style={{ top: "520px" }} />
        <div className="absolute left-0 right-0 h-px border-t border-dashed border-border/20" style={{ top: "780px" }} />
      </div>

      {/* Centered paper column */}
      <div className="mx-auto max-w-2xl border-x border-border min-h-screen relative z-10">
        {/* Header */}
        <header className="border-b border-border px-8 pt-12 pb-8">
          {config.tagline && (
            <p className="font-mono text-xs text-primary mb-4">
              [{config.tagline}]
            </p>
          )}

          <PixelHeading
            as="h1"
            mode="wave"
            autoPlay
            cycleInterval={250}
            staggerDelay={60}
            initialFont="square"
            className="text-3xl font-bold lowercase tracking-tight text-foreground sm:text-4xl leading-[1.1] mb-4"
          >
            {config.heroTitle}
          </PixelHeading>

          <p className="text-sm leading-relaxed text-muted-foreground lowercase max-w-lg">
            {config.description}
          </p>

          {config.ctas && config.ctas.length > 0 && (
            <div className="flex items-center gap-4 mt-6">
              {config.ctas.map((cta) =>
                cta.primary ? (
                  <a
                    key={cta.label}
                    href={cta.url}
                    className="inline-flex items-center gap-2 bg-foreground px-3.5 py-2 font-mono text-xs font-medium text-background hover:bg-foreground/90 transition-colors"
                  >
                    {cta.label}
                  </a>
                ) : (
                  <a
                    key={cta.label}
                    href={cta.url}
                    className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {cta.label}
                    <ArrowRight className="h-3 w-3" />
                  </a>
                )
              )}
            </div>
          )}
        </header>

        <div className="flex flex-col gap-0">
          {/* Install */}
          <div id="install" className="border-b border-dashed border-border -mx-[1px] px-8 py-8 bg-card/30">
            <InstallCommand packageName={config.installName} />
          </div>

          {/* Demo */}
          <div id="demo" className="border-b border-dashed border-border -mx-[1px] px-8 py-8 bg-card/30">
            <DemoSection>{demoContent}</DemoSection>
          </div>

          {/* Works with + Badge bar */}
          <div className="px-8 py-6 flex flex-col gap-4">
            {config.worksWith && config.worksWith.length > 0 && (
              <WorksWith items={config.worksWith} />
            )}
            <BadgeBar
              packageName={config.packageName}
              npmUrl={config.links.npm}
              githubUrl={config.links.github}
              version={config.badges.version}
              downloads={config.badges.downloads}
              bundleSize={config.badges.bundleSize}
            />
          </div>

          {/* Why section */}
          <div className="px-8 py-8 border-t border-border">
            <h2 className="font-display text-base font-bold lowercase tracking-tight text-foreground mb-3">
              why {config.packageName}?
            </h2>
            {config.why.paragraphs.map((p, i) => (
              <p key={i} className="text-xs leading-relaxed text-muted-foreground lowercase mb-4 last:mb-0">
                {p}
              </p>
            ))}
          </div>

          {/* Feature grid */}
          <div className="border-y border-dashed border-border -mx-[1px] px-8 py-8 bg-card/30">
            <FeatureGrid features={config.features} />
          </div>

          {/* Code examples */}
          <div className="px-8 py-8">
            <CodeExamples examples={config.codeExamples} />
          </div>

          {/* API reference */}
          <div id="api" className="border-y border-dashed border-border -mx-[1px] px-8 py-8 bg-card/30">
            <div className="flex flex-col gap-10">
              <ApiTable title="hook options" props={config.apiProps} />

              {config.builderMethods && config.builderMethods.length > 0 && (
                <ApiTable title="builder chain methods" props={config.builderMethods} />
              )}

              {config.returnValues && config.returnValues.length > 0 && (
                <ApiTable title=".on() return value" props={config.returnValues} />
              )}

              {config.scopeApi && config.scopeApi.length > 0 && (
                <ApiTable title="scope management" props={config.scopeApi} />
              )}

              {config.utilityExports && config.utilityExports.length > 0 && (
                <ApiTable title="utility exports" props={config.utilityExports} />
              )}
            </div>
          </div>

          {/* Use cases */}
          <div className="px-8 py-8">
            <h2 className="font-display text-base font-bold lowercase tracking-tight text-foreground mb-2">
              use cases
            </h2>
            <p className="text-xs text-muted-foreground lowercase leading-relaxed">
              {config.useCases}
            </p>
          </div>

          {/* Footer */}
          <div className="px-8 border-t border-dashed border-border">
            <FooterSection author={config.author.name} authorUrl={config.author.url} />
          </div>
        </div>
      </div>
    </div>
  );
}
