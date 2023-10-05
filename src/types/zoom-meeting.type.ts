export interface ZoomMeeting {
  agenda: string;
  default_password: boolean;
  duration: number;
  password: string;
  pre_schedule: boolean;
  recurrence: Recurrence;
  schedule_for: string;
  settings: Settings;
  start_time: string;
  template_id: string;
  timezone: string;
  topic: string;
  tracking_fields: TrackingField[];
  type: number;
}

export interface Recurrence {
  end_date_time: string;
  end_times: number;
  monthly_day: number;
  monthly_week: number;
  monthly_week_day: number;
  repeat_interval: number;
  type: number;
  weekly_days: string;
}

export interface Settings {
  additional_data_center_regions: string[];
  allow_multiple_devices: boolean;
  alternative_hosts: string;
  alternative_hosts_email_notification: boolean;
  approval_type: number;
  approved_or_denied_countries_or_regions: ApprovedOrDeniedCountriesOrRegions;
  audio: string;
  audio_conference_info: string;
  authentication_domains: string;
  authentication_exception: AuthenticationException[];
  authentication_option: string;
  auto_recording: string;
  breakout_room: BreakoutRoom;
  calendar_type: number;
  close_registration: boolean;
  contact_email: string;
  contact_name: string;
  email_notification: boolean;
  encryption_type: string;
  focus_mode: boolean;
  global_dial_in_countries: string[];
  host_video: boolean;
  jbh_time: number;
  join_before_host: boolean;
  language_interpretation: LanguageInterpretation;
  meeting_authentication: boolean;
  meeting_invitees: MeetingInvitee[];
  mute_upon_entry: boolean;
  participant_video: boolean;
  private_meeting: boolean;
  registrants_confirmation_email: boolean;
  registrants_email_notification: boolean;
  registration_type: number;
  show_share_button: boolean;
  use_pmi: boolean;
  waiting_room: boolean;
  watermark: boolean;
  host_save_video_order: boolean;
  alternative_host_update_polls: boolean;
}

export interface ApprovedOrDeniedCountriesOrRegions {
  approved_list: string[];
  denied_list: string[];
  enable: boolean;
  method: string;
}

export interface AuthenticationException {
  email: string;
  name: string;
}

export interface BreakoutRoom {
  enable: boolean;
  rooms: Room[];
}

export interface Room {
  name: string;
  participants: string[];
}

export interface LanguageInterpretation {
  enable: boolean;
  interpreters: Interpreter[];
}

export interface Interpreter {
  email: string;
  languages: string;
}

export interface MeetingInvitee {
  email: string;
}

export interface TrackingField {
  field: string;
  value: string;
}
