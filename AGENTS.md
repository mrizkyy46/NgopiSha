<!-- BEGIN:nextjs-agent-rules -->

# AGENTS.md

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

## Project

#NgopiSha is a smart V60 Coffee Brewing Recommendation System.

The application generates brewing recommendations for Hot and Ice V60 coffee based on user-input variables.

Act as a Senior Full-Stack Developer specializing in:

- Next.js App Router
- TypeScript
- Tailwind CSS
- React
- Coffee brewing logic

Prioritize correctness, maintainability, mobile usability, and simple architecture.

---

## Tech Stack

- Next.js 14+
- App Router
- TypeScript
- React
- Tailwind CSS
- shadcn/ui or Radix UI equivalents
- Lucide React

Do not introduce another UI framework unless explicitly requested.

Avoid unnecessary dependencies.

---

## Core Product

The application has three main stages:

1. Collect coffee and brewing variables.
2. Calculate a recommended V60 recipe.
3. Display the recipe as a clear step-by-step brewing guide.

Supported brewing methods:

- Hot
- Ice

Brewer:

- V60

The architecture should allow additional brewing devices in the future without requiring a major rewrite.

---

## Input Model

The brewing form contains these groups.

### Coffee

- Brand / Origin
- Coffee Dose (grams)
- Processing Method
- Variety
- Roast Profile

Processing methods: **added at any time**

- Washed
- Natural
- Honey
- Anaerobic Fermentation
- Experimental

Varieties: **added at any time**

- Bourbon
- Caturra
- Typica
- Gesha
- Mix Variety
- Local/Sigarar Utang

Roast profiles:

- Light
- Light-Medium
- Medium
- Dark

### Brewing Device

- Brewing Method: Hot / Ice
- Brewer: V60 **added at any time**
- Grinder
- Water Source

Supported grinders: **added at any time**

- Timemore C2/C3
- Comandante C40
- Kingrinder K6
- 1Zpresso Q2/JX-Pro
- Fellow Ode
- Generic

Supported water sources: **added at any time**

- Cleo
- Le Minerale
- Aqua
- RO Water
- Custom Mineral Water

### Flavor Target

- Balance & Clean
- More Sweetness
- More Acidity
- More Body

Do not silently add new user-input variables without a clear product reason.

---

## Recommendation Engine

The main calculation function is:

```ts
calculateBrewRecipe(inputs);
```

Keep brewing calculations inside:

```text
src/lib/brewing-logic.ts
```

Do not put brewing calculation logic directly inside React components.

The function should produce a structured recipe containing:

- Coffee-to-water ratio
- Total water
- Water temperature
- Grinder recommendation
- Total brewing time
- Pouring steps

---

## Brewing Logic

### Hot Coffee

Typical ratio range:

```text
1:15 - 1:16.6
```

### Ice Coffee

Typical base ratio range:

```text
1:10 - 1:12
```

Temperature guidance:

```text
Light       → 92-94°C
Medium      → 88-91°C
Dark        → 83-86°C
```

Grind recommendations must consider:

- Selected grinder
- Coffee processing method

Example ranges from the product specification:

```text
Comandante → 18-24 clicks
Timemore C2 → 13-18 clicks
```

Do not invent precision that the existing product specification does not justify.

Brewing time should be represented as a meaningful range where appropriate.

---

## Recipe Steps

Each pouring step should contain structured data.

Example conceptual model:

```ts
type BrewStep = {
  name: string;
  targetWater: number;
  cumulativeWater: number;
  startTime: number;
  duration: number;
  techniqueNote: string;
};
```

Possible steps:

- Bloom
- Pour 1
- Pour 2
- Pour 3
- Ice addition

The output must be machine-readable first and presentation-ready second.

Do not store formatted UI strings inside the calculation layer when the underlying numeric data can be represented directly.

---

## TypeScript

Keep domain types in:

```text
src/types/brewing.ts
```

Use strongly typed interfaces/types for:

- Form inputs
- Roast profile
- Processing method
- Grinder
- Water source
- Flavor target
- Brewing method
- Brew recipe
- Brew step

Avoid:

```ts
any;
```

Prefer discriminated unions or literal types when appropriate.

Avoid unnecessary type assertions.

Do not duplicate domain types across components.

---

## Architecture

Use the following structure as the baseline:

```text
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── ...
│
├── components/
│   └── brewing/
│       ├── BrewForm.tsx
│       ├── BrewResult.tsx
│       └── BrewTimer.tsx
│
├── lib/
│   └── brewing-logic.ts
│
└── types/
    └── brewing.ts
```

Do not create additional architectural layers unless they solve an actual problem.

If the application grows, feature-based organization may be introduced deliberately.

---

## React / Next.js

Use Next.js App Router conventions.

Prefer Server Components by default.

Use:

```tsx
"use client";
```

only when client-side functionality is actually required.

Client Components are appropriate for:

- Form state
- Interactive controls
- Timer
- Browser APIs
- Client-side interactions

Do not turn the entire application into a Client Component unnecessarily.

---

## UI Components

Use shadcn/ui or Radix UI equivalents for common controls where appropriate:

- Input
- Select
- RadioGroup
- Button
- Card
- Tabs

Use Lucide React for icons.

Before creating a new reusable UI component:

1. Check existing components.
2. Reuse existing components when possible.
3. Extend existing components when appropriate.
4. Create a new component only when necessary.

---

## Tailwind CSS

Use Tailwind CSS for styling.

Design direction:

- Modern
- Clean
- Coffee-craft aesthetic
- Warm neutrals
- Deep coffee brown
- Soft cream
- Clean dark/light mode

Primary coffee brown:

```text
#3E2723
```

Do not hard-code colors repeatedly when the same design token can be reused.

Avoid unnecessary custom CSS.

Prefer responsive Tailwind utilities.

---

## Mobile First

Mobile usability is a primary requirement.

Design for phone usage first because users may interact with the application while actively brewing coffee.

Prioritize:

- Large touch targets
- Clear hierarchy
- Easy-to-read numbers
- Minimal scrolling where practical
- Clear brewing steps
- Readable timer
- Simple form interaction

Then enhance the experience for tablet and desktop.

Do not sacrifice mobile usability for desktop aesthetics.

---

## Brew Result UI

The result screen should clearly expose:

### Recipe Summary

- Ratio
- Total Water
- Temperature
- Grind
- Total Time

### Brewing Timeline

Show:

```text
00:00 - 00:45
Bloom
45g
```

and subsequent pouring stages.

The user should be able to understand the entire recipe without reading implementation details.

---

## Timer

`BrewTimer.tsx` is optional/bonus functionality.

If implemented:

- Support start
- Support pause
- Highlight the current brewing step
- Show elapsed time clearly
- Keep timer logic isolated from brewing calculation logic

Do not make the timer a prerequisite for generating a recipe.

---

## Validation

After code changes, use the checks that actually exist in `package.json`.

Prefer:

```bash
npm run lint
npm run typecheck
npm run build
```

Do not assume `typecheck` exists.

Inspect `package.json` first.

If a check fails because of an existing unrelated issue, distinguish it from issues introduced by the current change.

---

## Bug Fix Workflow

When fixing an issue:

1. Investigate first.
2. Identify the root cause.
3. Inspect related components and logic.
4. Identify the smallest affected scope.
5. Implement the smallest safe fix.
6. Do not modify unrelated files.
7. Run relevant validation.
8. Review the final diff.
9. Report the root cause and fix.

Do not rewrite working code merely to make it look different.

---

## Feature Development Workflow

Before implementing a feature:

1. Inspect the existing project structure.
2. Find related components.
3. Find related types.
4. Find related brewing logic.
5. Reuse existing patterns.
6. Implement the smallest coherent change.
7. Validate.
8. Review the diff.

Do not immediately create new abstractions.

---

## Brewing Logic Rules

Brewing calculations are domain logic.

Keep them deterministic whenever possible.

Prefer:

```ts
const recipe = calculateBrewRecipe(inputs);
```

over calculations scattered across:

```text
BrewForm.tsx
BrewResult.tsx
BrewTimer.tsx
```

UI components should display the result, not independently recalculate it.

When changing brewing formulas:

- Explain the affected behavior.
- Keep calculations testable.
- Avoid magic numbers when possible.
- Name constants according to their brewing meaning.

---

## Data Flow

Preferred flow:

```text
User Input
    ↓
BrewForm
    ↓
Typed Brewing Inputs
    ↓
calculateBrewRecipe()
    ↓
BrewRecipe
    ↓
BrewResult
    ↓
BrewTimer (optional)
```

Do not create circular dependencies between these layers.

---

## Code Quality

Prefer:

- Simple code
- Strong typing
- Small focused components
- Deterministic calculations
- Reusable UI
- Clear naming
- Minimal dependencies
- Minimal changes
- Existing project conventions

Avoid:

- `any`
- Dead code
- Duplicate logic
- Unnecessary abstractions
- Premature optimization
- Unnecessary dependencies
- Large components
- Business logic inside JSX
- Unrelated refactoring

---

## Git

Use Conventional Commits.

Examples:

```text
feat(brewing): add hot v60 recipe calculation

feat(brewing): add ice brewing recommendation

fix(brewing): correct coffee water ratio calculation

fix(brewing): adjust grinder recommendation

feat(timer): add interactive brewing timer

refactor(brewing): simplify recipe calculation

style(brewing): improve mobile recipe layout
```

Keep commits focused.

Do not mix unrelated fixes into one commit.

---

## Agent Behavior

Before modifying code, inspect the existing implementation.

Do not guess when the repository already contains the answer.

Do not modify unrelated files.

Prefer minimal diffs.

Do not generate lengthy explanations while working.

Keep responses concise and actionable.

When a task is complete, report:

1. Root cause / objective
2. Files changed
3. Changes made
4. Validation performed
5. Remaining issues, if any

---

## Caveman Workflow

Use Caveman to keep agent communication concise.

Do not sacrifice:

- Code correctness
- Exact error messages
- Command accuracy
- TypeScript syntax
- File paths
- API names
- Important technical details

When investigating:

```text
Investigate → identify root cause → report concise findings
```

When implementing:

```text
Inspect → implement minimal change → validate
```

When fixing:

```text
Root cause → smallest safe fix → test → review diff
```

Avoid unnecessary narration.

Focus on actionable output.

<!-- END:nextjs-agent-rules -->
