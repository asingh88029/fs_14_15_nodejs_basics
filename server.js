const http = require('http');
const fs = require("fs");
const httpStatus = require('http-status');

const PORT = 4000;

const server = http.createServer((request, response)=>{

    if(request.url==="/greet" && request.method==="GET"){ // /greet GET

        console.log("Server received request at /greet with GET HTTP Method")

        response.writeHead(httpStatus.OK, {'content-type': 'application/json'})

        const data = {
            message : "Hello World"
        }

        response.end(JSON.stringify(data));

    }else if(request.url.includes("/greet") && request.method==="POST"){ // /greet POST

        console.log("Server received request at /greet with POST HTTP Method")

        const url = request.url;

        const name = url.split("=")[1]

        response.writeHead(httpStatus.OK, {'content-type': 'application/json'});

        response.end(JSON.stringify({
            message : "Hello " + name.toUpperCase()
        }))

    }else if(request.url==="/product" && request.method==="GET"){ // /product GET

        const PATH = "data/product.json";

        let data = fs.readFileSync(PATH, {encoding : "utf-8"});

        data = JSON.parse(data);

        response.writeHead(httpStatus.OK, {'content-type': 'application/json'});

        response.end(JSON.stringify(data));

    }else if(request.url.includes("/product") && request.method==="POST"){

        // We will extract the product info from the request
        let name;
        let price;
        request.url.split("?")[1].split("&").forEach((elem)=>{
            const key = elem.split("=")[0]
            const value = elem.split("=")[1]
            if(key==="name"){
                name = value
            }else if(key==="price"){
                price = value
            }
        })
    
        // We will read data/product.json

        const PATH = "data/product.json";

        let data = fs.readFileSync(PATH, {encoding : "utf-8"});

        data = JSON.parse(data);

        // We will update the product.json with the reecived product

        data.push({
            "name" : name,
            "price" : price
        })

        fs.writeFileSync(PATH, JSON.stringify(data))

        // We will close the process

        response.writeHead(httpStatus.CREATED, {'content-type': 'application/json'});

        response.end(JSON.stringify({
            message : "Product is added successfully"
        }))

    }else{

        response.writeHead(httpStatus.NOT_FOUND, {'content-type': 'application/json'});

        response.end(JSON.stringify({
            message : "API ENDPOINT NOT FOUND"
        }))

    }

})

server.listen(4000, ()=>{
    console.log("Server is started at PORT " + PORT)
})