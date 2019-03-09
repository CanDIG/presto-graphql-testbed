FROM golang

ENV DIR=/go/src/github.com/synthetichealth
WORKDIR ${DIR}

RUN git clone  --recurse-submodules https://github.com/synthetichealth/gofhir.git
RUN cd gofhir; go build

EXPOSE 3001

ENTRYPOINT [ "/go/src/github.com/synthetichealth/gofhir/gofhir" ]
