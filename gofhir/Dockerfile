FROM golang

ENV DIR=/go/src/github.com/synthetichealth
WORKDIR ${DIR}

RUN git clone  --recurse-submodules https://github.com/synthetichealth/gofhir.git
RUN cd gofhir; go get -t ./...; git checkout -b stu3_jan2017; git branch -u origin/fhir-updates fhir-update; git pull origin stu3_jan2017; go build

EXPOSE 3001

ENTRYPOINT [ "/go/src/github.com/synthetichealth/gofhir/gofhir" ]
