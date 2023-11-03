interface ISteamProfilePhoto {
  value: string;
}

export interface ISteamProfilePayload {
  _json: {
    steamid: string;
    personaname: string;
    profileurl: string;
    avatar: string;
    avatarmedium: string;
    avatarfull: string;
    avatarhash: string;
    lastlogoff: number;
    personastate: number;
    realname: string;
    primaryclanid: string;
    timecreated: number;
    personastateflags: number;
    loccountrycode: string;
    locstatecode: string;
    loccityid: number;
  };
  id: string;
  displayName: string;
  photos: ISteamProfilePhoto[];
}

export interface ITwitterProfilePayload {
  provider: string;
  id: number;
  username: string;
  displayName: string;
  photos: { value: string }[];
}

export interface ITwitchProfilePayload {
  /**
   * @login name of the Twitch account
   */
  provider: string;
  id: string;
  login: string;
  display_name: string;
  type: string;
  broadcaster_type: string;
  description: string;
  profile_image_url: string;
  offline_image_url: string;
  view_count: number;
  created_at: string;
}
