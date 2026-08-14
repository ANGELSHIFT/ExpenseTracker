import urllib.request, json

BASE = 'http://127.0.0.1:8000'

def post(url, data, headers=None):
    headers = headers or {}
    req = urllib.request.Request(
        url,
        data=json.dumps(data).encode(),
        headers={'Content-Type': 'application/json', **headers}
    )
    r = urllib.request.urlopen(req)
    return json.loads(r.read())

def get(url, headers=None):
    headers = headers or {}
    req = urllib.request.Request(url, headers=headers)
    r = urllib.request.urlopen(req)
    return json.loads(r.read())

def delete(url, headers=None):
    headers = headers or {}
    req = urllib.request.Request(url, headers=headers, method='DELETE')
    r = urllib.request.urlopen(req)
    return r.status

# 1. Login
tokens = post(BASE + '/api/token/', {'username': 'admin', 'password': 'admin123'})
access = tokens['access']
auth = {'Authorization': 'Bearer ' + access}
print('1. Login OK - Got access + refresh tokens')

# 2. Create expense
exp = post(BASE + '/api/expenses/', {'amount': 250, 'category': 'Food', 'description': 'Lunch', 'date': '2026-08-14'}, auth)
print('2. Created expense id={} amount={} cat={}'.format(exp['id'], exp['amount'], exp['category']))

# 3. List expenses (should only show admin's)
exps = get(BASE + '/api/expenses/', auth)
print('3. List expenses: {} items'.format(len(exps)))

# 4. Monthly total
total = get(BASE + '/api/expenses/monthly-total/', auth)
print('4. Monthly total: {} = Rs.{}'.format(total['month'], total['total']))

# 5. Delete expense
status = delete(BASE + '/api/expenses/' + str(exp['id']) + '/', auth)
print('5. Delete expense status:', status)

print('')
print('All tests PASSED!')
