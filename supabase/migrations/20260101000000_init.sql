-- Claudy Map — initial migration (Stage 0)
--
-- Sets up the dedicated schema and enables PostGIS.
-- Application tables (users, tracks, revealed tiles, ...) are intentionally
-- NOT created here — they come in later stages once the data model is defined.

create schema if not exists claudy_map;

create extension if not exists postgis;
