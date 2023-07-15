interface ISteamProfilePhoto {
  value: string;
}

export interface ISteamProfilePayload {
  id: string;
  displayName: string;
  photos: ISteamProfilePhoto[];
}
