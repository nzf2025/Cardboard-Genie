export interface ProjectIdea {
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  estimatedTime: string;
  toolsNeeded: string[];
  category: string;
}

export interface ProjectDetail extends ProjectIdea {
  steps: string[];
  tips: string;
  safetyWarning: string;
}

export enum AppState {
  INPUT = 'INPUT',
  LOADING_IDEAS = 'LOADING_IDEAS',
  IDEAS_LIST = 'IDEAS_LIST',
  PROJECT_DETAIL = 'PROJECT_DETAIL',
}

export interface UserInput {
  boxType: string;
  boxCondition: string;
  intendedUse: string;
}