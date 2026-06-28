export type ProjectSummary = {
  id: string;
  name: string;
  updatedAt: string;
};

export type ProjectDetail = ProjectSummary & {
  description?: string;
  tags: string[];
};
