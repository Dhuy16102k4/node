#!/usr/bin/env bash

HOST=$1
shift
PORT=$1
shift
CMD=$@

while ! nc -z "$HOST" "$PORT"; do
  echo "Waiting for $HOST:$PORT..."
  sleep 2
done

exec $CMD
