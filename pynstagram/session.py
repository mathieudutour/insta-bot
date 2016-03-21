import requests
import hmac
import hashlib
import json
import time
import urllib

USER_AGENT = 'Instagram 4.1.0 Android (11/2.4.2; 320; 720x1280; samsung; SM-N9000; SM-N9000; smdkc210; en_US)'
GUID = '78791800-eb02-11e5-a03b-5cf9388caf78'
DEVICE_ID = 'android-%s' % GUID

ENDPOINT_URL = 'https://i.instagram.com/api/v1'

def generate_signature(data):
    return hmac.new(
        'b4a23f5e39b5929e0666ac5de94c89d1618a2916'.encode('utf-8'),
        data.encode('utf-8'), hashlib.sha256).hexdigest()


class PynstagramSession(object):

    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({'User-Agent': USER_AGENT})

    def login(self, username, password):
        data = json.dumps({
            'device_id': DEVICE_ID,
            'guid': GUID,
            'username': username,
            'password': password,
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        })

        sig = generate_signature(data)

        payload = 'signed_body=%s.%s&ig_sig_key_version=4' % (sig, urllib.quote(data))
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
            'device_id': DEVICE_ID,
            'guid': GUID,
            'media_id': media_id,
            'caption': caption,
            'device_timestamp': time.time(),
            'source_type': "5",
            'filter_type': "0",
            'extra': '{}',
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        })

        sig = generate_signature(data)

        payload = 'signed_body={}.{}&ig_sig_key_version=4'.format(
            sig,
            urllib.quote(data))

        resp = self.session.post(ENDPOINT_URL + '/media/configure/', payload)
        resp_json = resp.json()

        if resp_json.get('status') != 'ok':
            raise IOError(resp_json.get('message'))
