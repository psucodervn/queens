#!/bin/bash

export ROOT_DIR=$(pwd)
export DOCKER_NAMESPACE=psucoder
export DOCKER_REPO=kun-games

# build web-spa
cd $ROOT_DIR/web-spa
bun run build

# build server
cd $ROOT_DIR/server
rm -rf public
mkdir -p public
cp -r $ROOT_DIR/web-spa/dist/* public
bun run build

# docker build


# get tag from arguments or latest tag
if [ $# -eq 0 ]; then
    # No arguments provided, fetch latest tag
    LATEST_TAG=$(curl -s https://registry.hub.docker.com/v2/namespaces/$DOCKER_NAMESPACE/repositories/$DOCKER_REPO/tags | jq -r ".results.[0].name")
    # Increment the last part of semantic version
    NEW_TAG=$(echo $LATEST_TAG | awk -F. '{$NF = $NF + 1; print $1 "." $2 "." $NF}')
else
    # Use first argument as tag
    NEW_TAG=$1
fi

echo "Latest tag: $LATEST_TAG"
echo "New tag to use: $NEW_TAG"

docker buildx build --platform linux/amd64 . -t $DOCKER_NAMESPACE/$DOCKER_REPO:$NEW_TAG --push
