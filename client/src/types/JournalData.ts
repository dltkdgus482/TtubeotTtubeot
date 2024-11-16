import { Location } from './Location';

export type JournalData = {
  adventure_log_id: number;
  user_ttubeot_ownership_id: number;
  user_id: number;
  adventure_distance: number;
  adventure_calorie: number;
  adventure_coin: number;
  adventure_steps: number;
  start_at: string;
  end_at: string;
  gps_log_key: string;
  image_urls: string[];
  duration: number;
  ttubeot_name: string;
  ttubeot_id: number;
};

export type JournalDetailData = {
  adventure_log_id: number;
  user_ttubeot_ownership_id: number;
  user_id: number;
  adventure_distance: number;
  adventure_calorie: number;
  adventure_coin: number;
  adventure_steps: number;
  start_at: string;
  end_at: string;
  gps_log_key: string;
  gps_log: Location[];
  image_urls: string[];
  duration: number;
  ttubeot_name: string;
  ttubeot_id: number;
};
