export interface Feature {
  type:       FeatureType;
  properties: Properties;
  geometry:   Geometry;
  id:         string;
}

export interface Geometry {
  type:        GeometryType;
  coordinates: number[];
}

export enum GeometryType {
  Point = "Point",
}

export interface Properties {
  mag:     number;
  place:   string;
  time:    number;
  updated: number;
  tz:      null;
  url:     string;
  detail:  string;
  felt:    number | null;
  cdi:     number | null;
  mmi:     number | null;
  alert:   null | string;
  status:  Status;
  tsunami: number;
  sig:     number;
  net:     Net;
  code:    string;
  ids:     string;
  sources: string;
  types:   string;
  nst:     number | null;
  dmin:    number | null;
  rms:     number;
  gap:     number | null;
  magType: MagType;
  type:    PropertiesType;
  title:   string;
}

export enum MagType {
  MB = "mb",
  MBLg = "mb_lg",
  Md = "md",
  Ml = "ml",
  Mw = "mw",
  Mwr = "mwr",
  Mww = "mww",
}

export enum Net {
  Ak = "ak",
  Ci = "ci",
  Hv = "hv",
  Nc = "nc",
  Nm = "nm",
  Nn = "nn",
  Ok = "ok",
  PR = "pr",
  SE = "se",
  Tx = "tx",
  Us = "us",
  Uu = "uu",
}

export enum Status {
  Automatic = "automatic",
  Reviewed = "reviewed",
}

export enum PropertiesType {
  Earthquake = "earthquake",
}

export enum FeatureType {
  Feature = "Feature",
}

export interface Metadata {
  generated: number;
  url:       string;
  title:     string;
  status:    number;
  api:       string;
  count:     number;
}

export interface EarthquakeResponse {
  type: string;
  metadata: Metadata;
  features: Feature[];
  bbox: number[];
}
