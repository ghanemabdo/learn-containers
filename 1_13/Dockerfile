FROM golang:1.16

WORKDIR /src/usr/app

EXPOSE 8080

# Copy project assets to the image
COPY . .

RUN go build

CMD ["./server"]