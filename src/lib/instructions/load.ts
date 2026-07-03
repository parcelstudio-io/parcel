import fs from "fs/promises";
import path from "path";
import type { AgentMemory } from "@/types/database";

const INSTRUCTIONS_ROOT = path.join(process.cwd(), "instructions");

export interface InstructionSet {
  system: string;
  developer: string;
}

export async function loadInstructions(
  userId: string,
  overrides?: { system?: string | null; developer?: string | null }
): Promise<InstructionSet> {
  const defaultSystem = await readFileSafe(path.join(INSTRUCTIONS_ROOT, "defaults", "system.md"));
  const defaultDeveloper = await readFileSafe(path.join(INSTRUCTIONS_ROOT, "defaults", "developer.md"));

  const userSystem = overrides?.system ?? (await readFileSafe(path.join(INSTRUCTIONS_ROOT, "users", userId, "system.md")));
  const userDeveloper = overrides?.developer ?? (await readFileSafe(path.join(INSTRUCTIONS_ROOT, "users", userId, "developer.md")));

  return {
    system: [defaultSystem, userSystem].filter(Boolean).join("\n\n"),
    developer: [defaultDeveloper, userDeveloper].filter(Boolean).join("\n\n"),
  };
}

async function readFileSafe(filePath: string): Promise<string> {
  try {
    return await fs.readFile(filePath, "utf-8");
  } catch {
    return "";
  }
}

export function formatMemoryForPrompt(memory: AgentMemory): string {
  const facts = memory.facts?.length
    ? `Known facts about the user:\n${memory.facts.map((f) => `- ${f}`).join("\n")}`
    : "";
  const prefs = Object.keys(memory.preferences || {}).length
    ? `User preferences:\n${Object.entries(memory.preferences)
        .map(([k, v]) => `- ${k}: ${v}`)
        .join("\n")}`
    : "";
  return [facts, prefs].filter(Boolean).join("\n\n");
}

export async function saveUserInstructions(
  userId: string,
  system: string,
  developer: string
): Promise<void> {
  const userDir = path.join(INSTRUCTIONS_ROOT, "users", userId);
  await fs.mkdir(userDir, { recursive: true });
  await fs.writeFile(path.join(userDir, "system.md"), system, "utf-8");
  await fs.writeFile(path.join(userDir, "developer.md"), developer, "utf-8");
}
