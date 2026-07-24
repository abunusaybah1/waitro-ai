import { menuItems, type MenuItem } from "@/data/data";

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

export function getMenuItemById(id: string): MenuItem | undefined {
  return menuItems.find((item) => item.id === id);
}

export function getPopularItems(): MenuItem[] {
  return menuItems.filter((item) => item.recommended).slice(0, 3);
}

export function getRecommendedItems(): MenuItem[] {
  return menuItems.filter((item) => item.recommended);
}

export function findSimilarItems(query: string): MenuItem[] {
  const normalized = query.toLowerCase();
  const available = menuItems.filter((item) => item.availability);
  const terms = normalized.split(/\s+/).filter(Boolean);

  const scored = available
    .map((item) => {
      const haystack = [item.name, item.description, item.category, ...item.ingredients].join(" ").toLowerCase();
      let score = 0;

      if (haystack.includes(normalized)) {
        score += 4;
      }

      terms.forEach((term) => {
        if (haystack.includes(term)) {
          score += 1;
        }
      });

      if (item.recommended) {
        score += 1;
      }

      return { item, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, 3).map(({ item }) => item);
}

export function createOrderNumber(): string {
  return `WT-${Math.floor(1000 + Math.random() * 9000)}`;
}

export function createEstimatedTime(minutes: number): string {
  const ready = new Date(Date.now() + minutes * 60000);
  return ready.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}
