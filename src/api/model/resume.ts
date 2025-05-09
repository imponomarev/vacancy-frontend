/**
 * Generated by orval v7.9.0 🍺
 * Do not edit manually.
 * OpenAPI definition
 * OpenAPI spec version: v0
 */
import type { ExperienceEntry } from "./experienceEntry";

export interface Resume {
  source?: string;
  externalId?: string;
  firstName?: string;
  lastName?: string;
  position?: string;
  salary?: number;
  currency?: string;
  city?: string;
  updatedAt?: string;
  url?: string;
  age?: number;
  experienceMonths?: number;
  gender?: string;
  educationLevel?: string;
  experience?: ExperienceEntry[];
}
