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
  }
  id: string;
  displayName: string;
  photos: ISteamProfilePhoto[];

}
