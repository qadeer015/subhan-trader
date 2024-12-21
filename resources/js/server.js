const http = require('http');
const fs = require('fs');

const server = http.createServer((req,res) => {
    
    res.setHeader('Content-Type','text/html');
    if(req.url == '/'){ 
       res.statusCode = 200; 
       const data = fs.readFileSync('./index.html')     
       res.end(data);
    }else if(req.url == '/products'){ 
        res.statusCode = 200; 
        const data = fs.readFileSync('./products.html')     
        res.end(data);
     }else{
        res.statusCode = 404;      
       res.end('not found');
    }
})

server.listen(3000,()=>{
    console.log("server is listening of port 3000.");
});