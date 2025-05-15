#!/usr/bin/env bash
set -e

# Variables
REPO="aayush90"
TAG="latest"
SERVICES=("frontend" "backend" "sqlserver" "nginx") # Added nginx

# Authenticate with Docker Hub
echo "Logging into Docker Hub..."
docker login -u "$REPO"

# Build, Tag, and Push
for SERVICE in "${SERVICES[@]}"; do
  IMG="$REPO/$SERVICE:$TAG"
  echo "Processing $SERVICE..."
  # Remove existing image if it exists
  if docker image inspect "$IMG" > /dev/null 2>&1; then
    echo "Removing existing image $IMG..."
    docker rmi -f "$IMG"
  fi
  # Build
  echo "Building $SERVICE image..."
  docker build -t "$IMG" -f "DevOps/Dockerfile.$SERVICE" .. || { echo "Failed to build $SERVICE"; exit 1; }
  # Push
  echo "Pushing $SERVICE image to Docker Hub..."
  docker push "$IMG" || { echo "Failed to push $SERVICE"; exit 1; }
done

# Deploy with Docker Compose
echo "Pulling images and deploying containers..."
docker compose -f DevOps/docker-compose.yml pull || { echo "Failed to pull images"; exit 1; }
docker compose -f DevOps/docker-compose.yml up -d || { echo "Failed to deploy containers"; exit 1; }

# Cleanup
echo "Pruning unused resources..."
docker system prune -f

echo "Deployment complete."