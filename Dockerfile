# ==============================================================================
# SETUP STAGE
#
# The setup stage is responsible for installing the required dependencies
# ==============================================================================
FROM node:16.13.1-alpine3.14 AS setup

# Create and change to the app directory.
WORKDIR /src

# Copy application dependency manifests to the container image.
# A wildcard is used to ensure both package.json AND package-lock.json are copied.
# Copying this separately prevents re-running npm install on every code change.
COPY package*.json ./

# ==============================================================================
# BUILD STAGE
#
# The build stage is responsible for compiling the API application code and removing
# any development dependencies.
# ==============================================================================
FROM node:16.13.1-alpine3.14 AS build

WORKDIR /src

COPY . .

# Add private registry access token
# and install dependencies
RUN npm ci

# Build the application and remove development dependencies.
RUN \
  npm run build && \
  npm prune --production

# ==============================================================================
# PRODUCTION STAGE
#
# The production stage serves the application from the container image using the
# compiled artifacts from the build stage.
# ==============================================================================

FROM node:16.13.1-alpine3.14 AS prod

RUN addgroup -S appgroup && adduser -S app -G appgroup
USER app

ENV TZ="Etc/UTC"

WORKDIR /usr/src/app

COPY --from=build /src/node_modules /usr/src/app/node_modules
COPY --from=build /src/dist /usr/src/app/dist
COPY ./package* /usr/src/app/

EXPOSE 3000

# Run the web service on container startup.
CMD [ "npm", "run", "start:prod" ]
