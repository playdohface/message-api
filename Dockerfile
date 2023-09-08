FROM rust:slim AS build
RUN apt-get update -y && \
    apt-get install -y pkg-config make g++ libssl-dev
WORKDIR /build/
COPY ./ ./
RUN cargo build --release 

FROM ubuntu:22.04
RUN apt update && apt install -y libssl3 libpq-dev ca-certificates
COPY --from=build /build/target/release/kserver /opt/kserver/
WORKDIR /opt/kserver/
ENTRYPOINT ["/opt/kserver/kserver"]
