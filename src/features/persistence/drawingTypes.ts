import type { LocalDrawElement } from "../elements/elementTypes";

export type DrawingDbRecord = {
  id: string;
  name: string;
  description?: string;
  tags: string[];
  elements: LocalDrawElement[];
  viewport: {
    zoom: number;
    scrollX: number;
    scrollY: number;
  };
  metadata: {
    createdAt: string;
    updatedAt: string;
  };
};
