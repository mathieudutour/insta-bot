import requests
import hmac
import hashlib
import json
import time
import urllib

ENDPOINT_URL = 'https://i.instagram.com/api/v1'

def generate_payload(data, key, version):
    sig = hmac.new(
        key.encode('utf-8'),
        data.encode('utf-8'), hashlib.sha256).hexdigest()
    return 'signed_body=%s.%s&ig_sig_key_version=%s' % (sig, urllib.quote(data), version)


class PynstagramSession(object):

    def __init__(self, USER_AGENT, UUID, INSTAGRAM_SIGNATURE_KEY, INSTAGRAM_SIGNATURE_VERSION):
        self.session = requests.Session()
        self.USER_AGENT = USER_AGENT
        self.UUID = UUID
        self.INSTAGRAM_SIGNATURE_KEY = INSTAGRAM_SIGNATURE_KEY
        self.INSTAGRAM_SIGNATURE_VERSION = INSTAGRAM_SIGNATURE_VERSION
        self.DEVICE_ID = 'android-%s' % UUID
        self.session.headers.update({'User-Agent': USER_AGENT})

    def login(self, username, password):
        data = json.dumps({
            'device_id': self.DEVICE_ID,
            'guid': self.UUID,
            'username': username,
            'password': password,
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        })

        payload = generate_payload(data, self.INSTAGRAM_SIGNATURE_KEY, self.INSTAGRAM_SIGNATURE_VERSION)

        resp = self.session.post(ENDPOINT_URL + '/accounts/login/', payload)
        resp_json = resp.json()

        if resp_json.get('status') != 'ok':
            raise IOError(resp_json.get('message'))

    def upload_photo(self, path):
        data = {'device_timestamp': time.time()}
        files = {'photo': open(path, 'rb')}
        resp = self.session.post(ENDPOINT_URL + '/media/upload/', data, files=files)
        resp_json = resp.json()

        media_id = resp_json.get('media_id')
        if media_id is None:
            raise IOError(resp_json.get('message'))
        return media_id

    def configure_photo(self, media_id, caption):
        if caption[0] is '$':
            caption = caption[1:]

        data = json.dumps({
            'device_id': self.DEVICE_ID,
            'guid': self.UUID,
            'media_id': media_id,
            'caption': caption,
            'device_timestamp': time.time(),
            'source_type': "5",
            'filter_type': "0",
            'extra': '{}',
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        })

        payload = generate_payload(data, self.INSTAGRAM_SIGNATURE_KEY, self.INSTAGRAM_SIGNATURE_VERSION)

        resp = self.session.post(ENDPOINT_URL + '/media/configure/', payload)
        resp_json = resp.json()

        if resp_json.get('status') != 'ok':
            raise IOError(resp_json.get('message'))
