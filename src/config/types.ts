/**
 * Shared types for the documentation framework.
 * Each package gets its own data file that implements PackageConfig.
 */

export interface NavLink {
  label: string;
  url: string;
}

export interface Feature {
  value?: string;
  label: string;
  description: string;
}

export interface ApiProp {
  name: string;
  type: string;
  default?: string;
  description: string;
}

export interface CodeExample {
  title: string;
  code: string;
  language?: string;
  description?: string;
}

export interface Cta {
  label: string;
  url: string;
  primary?: boolean;
}

export interface WorksWithItem {
  label: string;
  url: string;
}

export interface PackageConfig {
  /** Package display name */
  packageName: string;

  /** npm scope + name for install commands */
  installName: string;

  /** Short tagline in brackets */
  tagline?: string;

  /** One-liner description */
  description: string;

  /** Short title for the pixel heading (2-3 words max) */
  heroTitle: string;

  author: {
    name: string;
    handle: string;
    url: string;
  };

  navLinks: NavLink[];

  links: {
    npm: string;
    github: string;
    docs?: string;
    demo?: string;
  };

  ctas?: Cta[];
  worksWith?: WorksWithItem[];

  badges: {
    version: string;
    downloads: string;
    bundleSize: string;
  };

  why: {
    paragraphs: string[];
  };

  features: Feature[];
  apiProps: ApiProp[];
  /** Builder chain methods (.mod, .ctrl, .key(), .on(), etc.) */
  builderMethods?: ApiProp[];
  /** Return values from .on() */
  returnValues?: ApiProp[];
  /** Scope management API */
  scopeApi?: ApiProp[];
  /** Utility exports (formatShortcut, useShortcutMap, etc.) */
  utilityExports?: ApiProp[];
  codeExamples: CodeExample[];
  useCases: string;
}
