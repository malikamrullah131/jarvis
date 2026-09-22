import http.server
import socketserver
import webbrowser
import os
import sys
import socket
import json
import urllib.request
import urllib.error
from urllib.parse import urlparse

# Mengubah Port dari 8080 ke 8081
PORT = 8081
DIRECTORY = os.path.dirname(os.path.abspath(__file__))
DEFAULT_N8N_WEBHOOK_URL = "https://janetcools.app.n8n.cloud/webhook/jarvis_query"

def get_local_ip():
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception:
        return "127.0.0.1"

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def do_OPTIONS(self):
        self.send_response(200)
        self._send_cors_headers()
        self.end_headers()

    def do_POST(self):
        if self.path == "/proxy/n8n":
            self._handle_proxy()
        else:
            self.send_response(404)
            self.end_headers()

    def do_GET(self):
        # Abaikan permintaan favicon.ico agar tidak memunculkan log error 404
        if self.path == '/favicon.ico':
            self.send_response(204)  # No Content
            self.end_headers()
            return
        super().do_GET()

    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

    def _send_cors_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Accept")

    def _handle_proxy(self):
        try:
            content_length = int(self.headers.get("Content-Length", 0))
            body = self.rfile.read(content_length)

            target_url = DEFAULT_N8N_WEBHOOK_URL
            try:
                payload = json.loads(body.decode('utf-8'))
                if isinstance(payload, dict) and "override_n8n_url" in payload:
                    target_url = payload.pop("override_n8n_url")
                    body = json.dumps(payload).encode('utf-8')
            except Exception:
                pass

            req = urllib.request.Request(
                target_url,
                data=body,
                headers={
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                method="POST"
            )

            # Timeout di-set None (menunggu AI n8n selesai tanpa terputus)
            with urllib.request.urlopen(req, timeout=None) as resp:
                resp_body = resp.read()
                self.send_response(resp.status)
                self._send_cors_headers()
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(resp_body)

        except urllib.error.HTTPError as e:
            body = e.read()
            self.send_response(e.code)
            self._send_cors_headers()
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(body)

        except Exception as e:
            error_body = json.dumps({"error": f"Gagal terhubung ke n8n: {str(e)}"}).encode()
            self.send_response(500)
            self._send_cors_headers()
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(error_body)

    def log_message(self, format, *args):
        print(f"[SIKAP] {self.address_string()} - {format % args}")

local_ip = get_local_ip()

print("=" * 65)
print(" SIKAP - KANWIL KEMENTERIAN IMIGRASI DAN PEMASYARAKATAN BABEL")
print("=" * 65)
print(f" Server Lokal        : http://localhost:{PORT}")
print(f" Akses dari HP/PC    : http://{local_ip}:{PORT}")
print(f" Proxy n8n           : http://localhost:{PORT}/proxy/n8n")
print(" Konfigurasi Timeout : DISABLED (Full Otomatis sampai AI selesai)")
print("=" * 65)

webbrowser.open(f"http://localhost:{PORT}")

# Mengizinkan reuse socket address agar tidak mengalami error 10048 lagi
socketserver.TCPServer.allow_reuse_address = True

try:
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        httpd.serve_forever()
except KeyboardInterrupt:
    print("\nServer SIKAP dihentikan.")
    sys.exit(0)