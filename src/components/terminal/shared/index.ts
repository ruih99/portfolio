// Hooks
export {
  TIMING,
  SKILLS_TIMING,
  useAnimationTrigger,
  useTypewriter,
  useInstantComplete,
} from "./hooks/animation-hooks";
export type { AnimationPhase, StandardPhase } from "./hooks/animation-hooks";

// Components
export { XIcon, GitHubIcon, LinkedInIcon } from "./components/Icons";
export {
  ActiveCommandLine,
  ActiveInstantLine,
  CompletedCommandLine,
  TerminalPrompt,
} from "./components/TerminalComponents";

// Utils
export { translations, getTranslation } from "./utils/translations";
export type { Locale, Translations, TranslationData } from "./utils/translations";

// Tab View Helpers
export {
  getLineDelay,
  createLineCompletionHandler,
} from "./utils/tabViewHelpers";
export type { DelayMap } from "./utils/tabViewHelpers";
