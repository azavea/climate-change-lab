ARG NODE_VERSION

FROM node:${NODE_VERSION}

RUN set -ex \
	&& apt-get update -yq \
	&& karmaDeps=' \
		g++ \
		chromium \
	' \
	&& apt-get install -y ${karmaDeps} \
	&& npm  install --global --force npm@${NPM_VERSION}