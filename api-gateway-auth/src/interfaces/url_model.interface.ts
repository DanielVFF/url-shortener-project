export interface Url {
  url_id: string;
  original_url: string;
  short_url: string;
  click_count: number;
  created_at: Date;
  status: number;
  deleted_at?: Date | null;
  user_id?: string | null;
}
