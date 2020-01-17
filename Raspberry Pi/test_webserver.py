import http.server
import os

PORT = 8080
DIRECTORY = "images"

class MyHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def translate_path(self, path):
        os.system("raspistill -n -t 1 -o images/image.jpg")
        return "images/image.jpg"

with http.server.HTTPServer(("", PORT), MyHandler) as httpd:
    print("serving at port", PORT)
    httpd.serve_forever()