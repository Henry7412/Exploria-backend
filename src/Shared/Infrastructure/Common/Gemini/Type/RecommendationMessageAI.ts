export interface RecommendationMessageAI {
  value: string;
  actions: string[];
  recommendations: RecommendationItemAI[];
}

export interface RecommendationItemAI {
  name: string;
  type: string;
  description: string;
  relevantData: string[];
  link: string;
  external: boolean;
}
