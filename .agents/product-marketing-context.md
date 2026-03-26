# Product Marketing Context

*Last updated: 2026-03-26*

## Product Overview
**One-liner:** Drop-in onboarding flows for Next.js + shadcn/ui.
**What it does:** A reusable React component for building multi-step data collection flows. Define steps as config, get structured answers back. Supports 9 input types, conditional logic, Zod validation, auto-advance, and a responsive split-panel layout — all styled with shadcn/ui. One command to install.
**Product category:** UI component / open-source developer tool
**Product type:** Free, open-source shadcn registry component
**Business model:** Free, MIT licensed. No paid tier.

## Target Audience
**Target users:** Developers and founders launching multiple products who need onboarding/data collection flows repeatedly.
**Primary use cases:**
- Pre-signup qualification (lead gen, waitlists)
- Post-signup onboarding (user profiling, preference collection)
- Data entry and information retrieval from guests/users
**Jobs to be done:**
- Ship an onboarding flow fast without building from scratch every time
- Collect structured data from users in a flow that converts well
- Keep the onboarding UI consistent with the rest of the app (shadcn/ui)

## Problems & Pain Points
**Core problem:** Building onboarding flows is repetitive. Every new product needs one, and they all need the same things — step logic, validation, conditional branching, responsive layout, animations.
**Why alternatives fall short:**
- Form libraries (React Hook Form, Formik) aren't designed for step-by-step flows
- Hosted tools (Typeform, Tally) don't match your design system and add external dependencies
- Rolling your own means re-wiring state, validation, conditional logic, and layout every time
**What it costs them:** Hours of repetitive UI work on every new product launch.
**Emotional tension:** "I've built this same flow three times already."

## Competitive Landscape
**Direct:** No direct competitors — no equivalent shadcn-native onboarding component exists.
**Secondary:** Typeform, Tally, Formspark — hosted form builders that don't integrate with your codebase or design system.
**Indirect:** Building it yourself with React Hook Form + custom step logic + custom UI.

## Differentiation
**Key differentiators:**
- Native shadcn/ui — matches your app's design system out of the box
- Config-driven — define steps as data, not JSX
- One-command install via shadcn registry
- Proven conversion — built from a flow pattern that has outperformed other approaches in production
**Why customers choose this:** It's free, it's fast to set up, and it looks like it belongs in the app.

## Switching Dynamics
**Push:** "I'm tired of rebuilding the same onboarding flow for every product."
**Pull:** One command, config-driven, already styled, proven to convert.
**Habit:** Developers are used to building custom flows or using form libraries they already know.
**Anxiety:** "Will it be flexible enough for my use case? Can I customize it?"

## Customer Language
**How they describe the problem:**
- "I keep rebuilding the same onboarding flow"
- "Typeform doesn't match my app"
- "I just need a quick way to collect user info at signup"
**How they describe the solution:**
- "Drop-in onboarding"
- "Config-driven steps"
- "Looks native to my app"
**Words to use:** onboarding, steps, flow, data collection, drop-in, config-driven
**Words to avoid:** survey (externally — use "onboarding flow" or "data collection"), form builder, SaaS
**Glossary:**
| Term | Meaning |
|------|---------|
| Step | A single screen in the onboarding flow (equivalent to a question) |
| Attributes | The structured data collected from the user |
| Auto-advance | Automatically moving to the next step when the user selects an option |

## Brand Voice
**Tone:** Direct, minimal, no fluff
**Style:** Developer-to-developer. Show the code, not the pitch.
**Personality:** Practical, honest, unpretentious

## Proof Points
**Metrics:** Built from the highest-converting onboarding flow pattern across multiple product launches.
**Customers:** Used by the author across multiple products.
**Value themes:**
| Theme | Proof |
|-------|-------|
| Speed | One command install, config-driven setup |
| Conversion | Pattern refined across multiple product launches |
| Consistency | Native shadcn/ui styling, no design mismatch |

## Goals
**Business goal:** Become the default onboarding component for the Next.js + shadcn ecosystem.
**Conversion action:** Install via shadcn registry command.
**Current metrics:** Early stage — just open-sourced, sharing with friends first.
