#!/usr/bin/env bash
set -euo pipefail

DEUDA_BIN="$(cd "$(dirname "$0")/.." && pwd)/deuda"
DEUDA_SRC="$(cd "$(dirname "$0")/.." && pwd)"

echo "=== Building deuda CLI ==="
cd "$DEUDA_SRC"
go build -o "$DEUDA_BIN" ./cmd/deuda/

echo ""
echo "=== Building Pemba Sherpa site ==="
"$DEUDA_BIN" build --dir "$DEUDA_SRC/examples/pemba-sherpa"

echo ""
echo "=== Building Chintan site ==="
"$DEUDA_BIN" build --dir "$DEUDA_SRC/examples/chintan-bio"

echo ""
echo "=== Building Bipin site ==="
"$DEUDA_BIN" build --dir "$DEUDA_SRC/examples/bipin-karki"

echo ""
echo "=== Building Deuda website ==="
cd "$DEUDA_SRC/website"
npm run build

echo ""
echo "=== Starting Docker services ==="
cd "$DEUDA_SRC/deploy"
docker compose up --build -d

echo ""
echo "=== Done! ==="
echo "Sites are running at:"
echo "  http://deuda.narmadainfosys.com"
echo "  http://psherpa.me"
echo "  http://chintan.narmadainfosys.com"
echo "  http://bipin.narmadainfosys.com"
