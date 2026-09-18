export interface SettingsView {
  productName: string;
  contractingEntityLine?: string;
  contactEmails?: string;
  socialsLine?: string;
}

export async function getSettings(): Promise<SettingsView | undefined> {
  const { getCollection } = await import("astro:content");
  const [entry] = await getCollection("settings");
  return entry?.data;
}
