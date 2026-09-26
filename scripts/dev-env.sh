#!/usr/bin/env bash
# Carga en el PATH el JDK 21, Maven y PostgreSQL 16 instalados localmente
# para este proyecto (no requieren Homebrew ni Xcode Command Line Tools).
# Uso: source scripts/dev-env.sh
export JAVA_HOME="$HOME/dev-tools/jdk-21.0.12.1+1/Contents/Home"
export MAVEN_HOME="$HOME/dev-tools/apache-maven-3.9.16"
export PGHOME="$HOME/dev-tools/Postgres.app/Contents/Versions/16"
export PGDATA="$HOME/dev-tools/pgdata"
export PGPORT=5433
export PATH="$JAVA_HOME/bin:$MAVEN_HOME/bin:$PGHOME/bin:$PATH"
