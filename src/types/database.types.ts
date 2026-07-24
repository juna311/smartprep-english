// Replace or refresh this snapshot whenever the Supabase schema changes.

export type Database = {
  public: {
    Tables: {
      review_sessions: {
        Row: {
          correct_answers: number;
          created_at: string;
          id: string;
          mode: string;
          needs_review_count: number;
          review_label: string | null;
          total_questions: number;
          user_id: string;
        };
        Insert: {
          correct_answers: number;
          created_at?: string;
          id?: string;
          mode: string;
          needs_review_count: number;
          review_label?: string | null;
          total_questions: number;
          user_id: string;
        };
        Update: {
          correct_answers?: number;
          created_at?: string;
          id?: string;
          mode?: string;
          needs_review_count?: number;
          review_label?: string | null;
          total_questions?: number;
          user_id?: string;
        };
        Relationships: [];
      };
      saved_words: {
        Row: {
          association: string | null;
          created_at: string;
          example: string;
          id: string;
          image: string | null;
          level: string;
          topic_id: string;
          translation: string;
          user_id: string;
          word: string;
          word_id: string;
        };
        Insert: {
          association?: string | null;
          created_at?: string;
          example: string;
          id?: string;
          image?: string | null;
          level: string;
          topic_id: string;
          translation: string;
          user_id: string;
          word: string;
          word_id: string;
        };
        Update: {
          association?: string | null;
          created_at?: string;
          example?: string;
          id?: string;
          image?: string | null;
          level?: string;
          topic_id?: string;
          translation?: string;
          user_id?: string;
          word?: string;
          word_id?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

export type SavedWord = Database["public"]["Tables"]["saved_words"]["Row"];
export type NewSavedWord =
  Database["public"]["Tables"]["saved_words"]["Insert"];
export type ReviewSession =
  Database["public"]["Tables"]["review_sessions"]["Row"];
export type NewReviewSession =
  Database["public"]["Tables"]["review_sessions"]["Insert"];
