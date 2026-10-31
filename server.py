"""Static website and transactional email endpoint (Python standard library)."""
import json
import os
from pathlib import Path
import re
import threading
import time
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parent
RECIPIENT = 'nastanikol10105@gmail.com'
MAX_BODY = 8192
_attempts = {}
_lock = threading.Lock()


def validate(data):
    if not isinstance(data, dict):
        raise ValueError('Некорректная заявка.')
    fields = {}
    for key, limit in [('name', 100), ('contact', 150), ('product', 3000)]:
        value = data.get(key)
        if not isinstance(value, str) or not value.strip() or len(value) > limit:
            raise ValueError('Заполните имя, контакт и описание продукции.')
        fields[key] = value.strip()
    if data.get('consent') is not True:
        raise ValueError('Необходимо согласие на обработку данных.')
    contact = fields['contact']
    if not (re.fullmatch(r'[^\s@]+@[^\s@]+\.[^\s@]+', contact) or
            re.fullmatch(r'\+?[\d\s()\-]{7,25}', contact)):
        raise ValueError('Укажите корректный телефон или email.')
    return fields


def send_email(fields):
    key = os.environ.get('VFC_MAIL_API_KEY')
    if not key:
        return 503, 'Отправка пока не настроена. Напишите на ' + RECIPIENT
    payload = {
        'from': os.environ.get('VFC_MAIL_FROM', 'VFC <onboarding@resend.dev>'),
        'to': [RECIPIENT],
        'subject': 'Новая заявка с сайта VFC',
        'text': f"Имя: {fields['name']}\nКонтакт: {fields['contact']}\nПродукция:\n{fields['product']}",
    }
    if '@' in fields['contact']:
        payload['reply_to'] = fields['contact']
    request = Request('https://api.resend.com/emails',
                      data=json.dumps(payload).encode(),
                      headers={'Authorization': 'Bearer ' + key,
                               'Content-Type': 'application/json',
                               'User-Agent': 'VFC-Website/1.0'}, method='POST')
    try:
        with urlopen(request, timeout=20) as response:
            result = json.load(response)
        if not isinstance(result, dict) or not result.get('id'):
            return 502, 'Почтовый сервис не подтвердил приём. Попробуйте позже.'
    except (HTTPError, URLError, TimeoutError, OSError, ValueError):
        # Never expose provider responses, authentication details or form data.
        return 502, 'Не удалось отправить заявку. Повторите позже или напишите на ' + RECIPIENT
    return 200, 'Заявка принята почтовым сервисом. Мы свяжемся с вами.'


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def log_message(self, format, *args):
        pass

    def do_GET(self):
        path = self.path.split('?', 1)[0]
        if path == '/api/health':
            return self.respond(200, {'ok': True, 'mail_configured': bool(os.environ.get('VFC_MAIL_API_KEY'))})
        if path not in ['/', '/index.html', '/style.css', '/app.js'] and not re.fullmatch(r'/assets/[a-z]+\.(webp|png)', path):
            return self.respond(404, {'message': 'Страница не найдена.'})
        super().do_GET()

    def do_HEAD(self):
        self.do_GET()

    def respond(self, status, payload):
        body = json.dumps(payload, ensure_ascii=False).encode()
        self.send_response(status)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Content-Length', str(len(body)))
        self.send_header('Cache-Control', 'no-store')
        self.end_headers()
        if self.command != 'HEAD':
            self.wfile.write(body)

    def do_POST(self):
        if self.path != '/api/contact':
            return self.respond(404, {'message': 'Страница не найдена.'})
        if self.headers.get('Content-Type', '').split(';')[0] != 'application/json':
            return self.respond(415, {'message': 'Требуется JSON.'})
        origin = self.headers.get('Origin')
        if origin:
            from urllib.parse import urlsplit
            if urlsplit(origin).netloc != self.headers.get('Host'):
                return self.respond(403, {'message': 'Недопустимый источник запроса.'})
        try:
            length = int(self.headers.get('Content-Length', '0'))
            if length <= 0 or length > MAX_BODY:
                return self.respond(413, {'message': 'Слишком большой запрос.'})
            fields = validate(json.loads(self.rfile.read(length)))
        except (ValueError, UnicodeError):
            return self.respond(400, {'message': 'Проверьте поля формы и согласие на обработку данных.'})
        now = time.monotonic()
        client = self.client_address[0]
        with _lock:
            for address in list(_attempts):
                if now - _attempts[address] >= 60:
                    del _attempts[address]
            if client in _attempts:
                return self.respond(429, {'message': 'Подождите минуту перед повторной отправкой.'})
            _attempts[client] = now
        status, message = send_email(fields)
        if status != 200:
            with _lock:
                _attempts.pop(client, None)
        self.respond(status, {'message': message})


if __name__ == '__main__':
    server = ThreadingHTTPServer(('0.0.0.0', int(os.environ.get('PORT', '3000'))), Handler)
    print('VFC server listening on port', server.server_port, flush=True)
    server.serve_forever()
