
#!/usr/bin/env bash

cd "$(dirname "$0")" || exit 1

case "$1" in
  up)
    docker compose -f docker-compose.database.yml up -d
    ;;
  down)
    docker compose -f docker-compose.database.yml down
    ;;
  restart)
    docker compose -f docker-compose.database.yml restart
    ;;
  logs)
    docker compose -f docker-compose.database.yml logs -f
    ;;
  status)
    docker compose -f docker-compose.database.yml ps
    ;;
  *)
    echo "Usage: ./database.sh {up|down|restart|logs|status}"
    ;;
esac