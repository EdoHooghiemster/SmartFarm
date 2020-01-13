import http.server
import socketserver

PORT = 80
HANDLER = http.server.SimpleHTTPRequestHandler

with socketserver.TCPServer(("", PORT), HANDLER) as httpd:
    print("serving at port", PORT)
    httpd.serve_forever()