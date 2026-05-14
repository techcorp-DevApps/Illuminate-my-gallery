from flask import Flask, g, jsonify, request, send_from_directory
import sqlite3
from pathlib import Path
from datetime import datetime

BASE = Path(__file__).parent
DB_PATH = BASE / 'portal.db'

app = Flask(__name__, static_folder='static', static_url_path='')

PHASES = [
    'contract_sent', 'booked', 'deposit_required', 'shoot_in_progress', 'shoot_completed'
]


def get_db():
    if 'db' not in g:
        g.db = sqlite3.connect(DB_PATH)
        g.db.row_factory = sqlite3.Row
    return g.db


@app.teardown_appcontext
def close_db(_=None):
    db = g.pop('db', None)
    if db is not None:
        db.close()


def init_db():
    db = sqlite3.connect(DB_PATH)
    db.executescript('''
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY,
      role TEXT NOT NULL,
      name TEXT NOT NULL,
      first_login INTEGER DEFAULT 1
    );
    CREATE TABLE IF NOT EXISTS shoots (
      id INTEGER PRIMARY KEY,
      client_id INTEGER NOT NULL,
      phase TEXT NOT NULL DEFAULT 'contract_sent',
      completed INTEGER DEFAULT 0,
      updated_at TEXT,
      FOREIGN KEY(client_id) REFERENCES users(id)
    );
    CREATE TABLE IF NOT EXISTS images (
      id INTEGER PRIMARY KEY,
      shoot_id INTEGER NOT NULL,
      url TEXT NOT NULL,
      selected INTEGER DEFAULT 0,
      FOREIGN KEY(shoot_id) REFERENCES shoots(id)
    );
    CREATE TABLE IF NOT EXISTS packages (
      id INTEGER PRIMARY KEY,
      shoot_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      price REAL NOT NULL,
      visible_before_completion INTEGER DEFAULT 1,
      moved_to_documents INTEGER DEFAULT 0,
      FOREIGN KEY(shoot_id) REFERENCES shoots(id)
    );
    CREATE TABLE IF NOT EXISTS docs (
      id INTEGER PRIMARY KEY,
      client_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      type TEXT NOT NULL,
      status TEXT NOT NULL,
      signed_text TEXT,
      created_at TEXT,
      FOREIGN KEY(client_id) REFERENCES users(id)
    );
    CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY,
      contact_name TEXT NOT NULL,
      contact_email TEXT NOT NULL,
      notes TEXT,
      status TEXT NOT NULL DEFAULT 'new',
      assigned_client_id INTEGER,
      created_at TEXT
    );
    ''')

    cur = db.execute("SELECT COUNT(*) c FROM users")
    if cur.fetchone()[0] == 0:
        db.execute("INSERT INTO users(role,name,first_login) VALUES ('admin','Studio Admin',0)")
        db.execute("INSERT INTO users(role,name,first_login) VALUES ('client','Taylor Client',1)")
        db.execute("INSERT INTO shoots(client_id,phase,completed,updated_at) VALUES (2,'contract_sent',0,?)", (datetime.utcnow().isoformat(),))
        for i in range(1, 13):
            db.execute("INSERT INTO images(shoot_id,url,selected) VALUES (1,?,0)", (f'https://picsum.photos/seed/shot{i}/600/400',))
        db.execute("INSERT INTO packages(shoot_id,name,price,visible_before_completion,moved_to_documents) VALUES (1,'Mini Session',250,1,0)")
        db.execute("INSERT INTO packages(shoot_id,name,price,visible_before_completion,moved_to_documents) VALUES (1,'Deluxe Session',550,1,0)")
    db.commit()
    db.close()


def q_all(sql, params=()):
    return [dict(r) for r in get_db().execute(sql, params).fetchall()]


@app.get('/')
def home():
    return send_from_directory('static', 'index.html')


@app.get('/api/client/<int:client_id>/portal')
def client_portal(client_id):
    db = get_db()
    user = db.execute('SELECT * FROM users WHERE id=?', (client_id,)).fetchone()
    shoot = db.execute('SELECT * FROM shoots WHERE client_id=?', (client_id,)).fetchone()
    images = q_all('SELECT * FROM images WHERE shoot_id=?', (shoot['id'],)) if shoot else []
    inbox = q_all("SELECT * FROM docs WHERE client_id=? AND status='inbox'", (client_id,))
    documents = q_all("SELECT * FROM docs WHERE client_id=? AND status='documents'", (client_id,))
    packages = q_all('SELECT * FROM packages WHERE shoot_id=?', (shoot['id'],)) if shoot else []
    return jsonify({
        'user': dict(user) if user else None,
        'shoot': dict(shoot) if shoot else None,
        'gallery': {
            'all': [i for i in images if i['selected'] == 0],
            'selected': [i for i in images if i['selected'] == 1]
        },
        'inbox': inbox,
        'documents': documents,
        'packages': packages,
        'updateMessage': f"Current phase: {shoot['phase'].replace('_',' ').title()}" if shoot else ''
    })


@app.post('/api/images/<int:image_id>/select')
def select_image(image_id):
    db = get_db()
    db.execute('UPDATE images SET selected=1 WHERE id=?', (image_id,))
    db.commit()
    return jsonify({'ok': True})


@app.post('/api/admin/docs/send')
def send_doc():
    data = request.get_json()
    db = get_db()
    db.execute('INSERT INTO docs(client_id,title,type,status,created_at) VALUES (?,?,?,?,?)',
               (data['client_id'], data['title'], data.get('type', 'contract'), 'inbox', datetime.utcnow().isoformat()))
    db.commit()
    return jsonify({'ok': True})


@app.post('/api/docs/<int:doc_id>/sign')
def sign_doc(doc_id):
    data = request.get_json()
    db = get_db()
    db.execute("UPDATE docs SET signed_text=?, status='documents' WHERE id=?", (data.get('signature', ''), doc_id))
    db.commit()
    return jsonify({'ok': True})


@app.post('/api/admin/shoot/<int:shoot_id>/phase')
def update_phase(shoot_id):
    phase = request.get_json().get('phase')
    if phase not in PHASES:
        return jsonify({'error': 'invalid phase'}), 400
    db = get_db()
    completed = 1 if phase == 'shoot_completed' else 0
    db.execute('UPDATE shoots SET phase=?, completed=?, updated_at=? WHERE id=?', (phase, completed, datetime.utcnow().isoformat(), shoot_id))
    if completed:
        db.execute("UPDATE packages SET moved_to_documents=1 WHERE shoot_id=?", (shoot_id,))
        client = db.execute('SELECT client_id FROM shoots WHERE id=?', (shoot_id,)).fetchone()['client_id']
        rows = db.execute('SELECT name,price FROM packages WHERE shoot_id=?', (shoot_id,)).fetchall()
        for row in rows:
            db.execute('INSERT INTO docs(client_id,title,type,status,created_at) VALUES (?,?,?,?,?)',
                       (client, f"Package: {row['name']} (${row['price']})", 'package', 'documents', datetime.utcnow().isoformat()))
    db.commit()
    return jsonify({'ok': True})


@app.post('/api/admin/bookings')
def create_booking():
    data = request.get_json()
    db = get_db()
    db.execute('INSERT INTO bookings(contact_name,contact_email,notes,status,created_at) VALUES (?,?,?,?,?)',
               (data['contact_name'], data['contact_email'], data.get('notes', ''), 'new', datetime.utcnow().isoformat()))
    db.commit()
    return jsonify({'ok': True})


@app.post('/api/admin/bookings/<int:booking_id>/assign')
def assign_booking(booking_id):
    client_id = request.get_json().get('client_id')
    db = get_db()
    db.execute("UPDATE bookings SET assigned_client_id=?, status='assigned' WHERE id=?", (client_id, booking_id))
    db.commit()
    return jsonify({'ok': True})


@app.get('/api/admin/dashboard')
def admin_dashboard():
    return jsonify({
        'bookings': q_all('SELECT * FROM bookings ORDER BY id DESC'),
        'clients': q_all("SELECT id,name FROM users WHERE role='client'"),
        'shoots': q_all('SELECT * FROM shoots')
    })


if __name__ == '__main__':
    init_db()
    app.run(host='0.0.0.0', port=5000, debug=False)
