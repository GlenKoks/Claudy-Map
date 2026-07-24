# OSRM — routing engine (self-hosted)

[OSRM](https://project-osrm.org/) (Open Source Routing Machine) provides the
routing/road-graph backend for Claudy Map. This directory holds the Docker
setup and the instructions to prepare the map data.

> **Nothing here is deployed automatically.** You run these steps on your own
> server. The commands below prepare an OSM extract of Moscow and start the
> OSRM HTTP API on port `5000`.

## Directory layout

```
infra/osrm/
├── docker-compose.yml   # OSRM service definition
├── data/                # OSM extract + processed .osrm* files (git-ignored)
└── README.md
```

Create the `data/` directory before you start:

```bash
mkdir -p infra/osrm/data
```

## Step 1 — Download an OSM extract of Moscow

Get a `.osm.pbf` extract from [Geofabrik](https://download.geofabrik.de/).
Moscow is inside the **Central Federal District** of Russia:

```bash
cd infra/osrm/data
# Central Federal District (includes Moscow). Rename to keep commands short.
curl -L -o moscow-latest.osm.pbf \
  https://download.geofabrik.de/russia/central-fed-district-latest.osm.pbf
```

> Geofabrik doesn't publish a Moscow-city-only extract. Options:
> - use the Central FD extract above (simplest), or
> - clip a smaller bounding box with [osmium](https://osmcode.org/osmium-tool/)
>   (`osmium extract -b <bbox> ...`) to reduce processing time and memory.

## Step 2 — Pre-process the data (extract → partition → customize)

Run OSRM's pipeline via the same Docker image. These write the `.osrm*` files
next to the `.pbf` in `data/`. We use the **MLD** pipeline (matches
`--algorithm mld` in `docker-compose.yml`).

Use the car profile bundled in the image (walking profile: `/opt/foot.lua`).

```bash
cd infra/osrm

# 1. extract — build the graph from the .pbf using a profile
docker run --rm -t -v "${PWD}/data:/data" osrm/osrm-backend \
  osrm-extract -p /opt/car.lua /data/moscow-latest.osm.pbf

# 2. partition — build multi-level partitions (MLD)
docker run --rm -t -v "${PWD}/data:/data" osrm/osrm-backend \
  osrm-partition /data/moscow-latest.osrm

# 3. customize — apply weights to the partitions (MLD)
docker run --rm -t -v "${PWD}/data:/data" osrm/osrm-backend \
  osrm-customize /data/moscow-latest.osrm
```

> For pedestrian routing use `-p /opt/foot.lua` in the extract step instead of
> `/opt/car.lua`. The profile only matters at extract time.

## Step 3 — Start the routing server

```bash
cd infra/osrm
docker compose up -d
```

Check it works:

```bash
# Sample route between two coordinates (lon,lat;lon,lat) in Moscow
curl "http://localhost:5000/route/v1/driving/37.6173,55.7558;37.6156,55.7520?overview=false"
```

Point the backend at it via `OSRM_URL=http://localhost:5000` in
`apps/server/.env`.

## Notes

- Processing memory scales with extract size — the Central FD extract needs a
  few GB of RAM. Clip a bounding box (Step 1) if your server is small.
- If you switch to the **contraction hierarchies** pipeline
  (`osrm-contract` instead of partition+customize), change the compose command
  to `osrm-routed --algorithm ch ...`.
- The `data/` directory is git-ignored (see root `.gitignore`) — the `.pbf`
  and `.osrm*` artifacts are large and must not be committed.
