import articlesB from "./beginner/articles-b";
import presentSimpleB from "./beginner/present-simple-b";
import toBeB from "./beginner/to-be-b";
import comparativesI from "./intermediate/comparatives-i";
import presentContinuousI from "./intermediate/present-continuous-i";
import presentPerfectI from "./intermediate/present-perfect-i";
import cleftA from "./advanced/cleft-a";
import passiveA from "./advanced/passive-a";
import pastSimpleA from "./advanced/past-simple-a";

export const LESSONS = {
  "articles-b": articlesB,
  "present-simple-b": presentSimpleB,
  "to-be-b": toBeB,
  "comparatives-i": comparativesI,
  "present-continuous-i": presentContinuousI,
  "present-perfect-i": presentPerfectI,
  "cleft-a": cleftA,
  "passive-a": passiveA,
  "past-simple-a": pastSimpleA,
} as const;

