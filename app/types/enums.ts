export enum UserRole {
  Admin = 'admin',
  Member = 'member',
}

export enum Platform {
  Instagram = 'instagram',
  TikTok = 'tiktok',
  YouTube = 'youtube',
  Manual = 'manual',
  Csv = 'csv',
  Other = 'other',
}

export enum SyncStatus {
  Pending = 'pending',
  Processing = 'processing',
  Processed = 'processed',
  Failed = 'failed',
}

export enum DifficultyLevel {
  Easy = 'easy',
  Medium = 'medium',
  Hard = 'hard',
}

export enum BudgetLevel {
  Low = 'low',
  Medium = 'medium',
  High = 'high',
}

export enum ValidationStatus {
  Draft = 'draft',
  Processed = 'processed',
  Reviewed = 'reviewed',
}

export enum GenerationStatus {
  Pending = 'pending',
  Processing = 'processing',
  Completed = 'completed',
  Failed = 'failed',
}

export enum GenerationType {
  IdeaExtraction = 'idea_extraction',
  Classification = 'classification',
  StructuredPlan = 'structured_plan',
  LaunchPack = 'launch_pack',
  Validation = 'validation',
}

export enum SyncRunStatus {
  Running = 'running',
  Completed = 'completed',
  Failed = 'failed',
}
