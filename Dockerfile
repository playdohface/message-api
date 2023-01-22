FROM rust:latest AS build
WORKDIR /build/
COPY ./ ./
RUN cargo build --release

FROM ubuntu:20.04
RUN apt update && apt install -y libssl-dev libpq-dev ca-certificates
COPY --from=build /build/target/release/kserver /opt/kserver/
WORKDIR /opt/kserver/
ENTRYPOINT ["/opt/kserver/kserver"]
EXPOSE 8000
