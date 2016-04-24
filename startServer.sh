#!/usr/bin/env bash

#DEBUG=myapp:* npm start

supervisor -w ./ ./bin/www
