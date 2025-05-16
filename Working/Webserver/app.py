# This version uses Flask + MySQL
# Install dependencies:
# pip install flask flask-mysqldb flask-login flask-wtf wtforms

from flask import Flask, render_template, request, redirect, url_for, session, flash
from flask_mysqldb import MySQL
from flask_login import LoginManager, login_user, logout_user, login_required, UserMixin, current_user
from wtforms import Form, StringField, PasswordField, validators, TextAreaField
from datetime import date

app = Flask(__name__)
app.secret_key = 'dont tell anyone'

# MySQL config
app.config['MYSQL_HOST'] = 'localhost' #Change according to your host
app.config['MYSQL_USER'] = 'Admin' #Change according to your username
app.config['MYSQL_PASSWORD'] = 'Admin' #Change according to your password
app.config['MYSQL_DB'] = 'Bored_Games'

mysql = MySQL(app)
login_manager = LoginManager(app)

# User class
class User(UserMixin):
    def __init__(self, id, username, role):
        self.id = id
        self.username = username
        self.role = role

@login_manager.user_loader
def load_user(user_id):
    cur = mysql.connection.cursor()
    cur.execute("SELECT user_id, username, is_admin FROM users WHERE user_id = %s", (user_id,))
    data = cur.fetchone()
    cur.close()
    if data:
        return User(id=data[0], username=data[1], role='admin' if data[2] else 'user')
    return None

# Forms
class RegisterForm(Form):
    username = StringField('Username', [validators.Length(min=4, max=25)])
    password = PasswordField('Password', [validators.InputRequired()])

class LoginForm(Form):
    username = StringField('Username', [validators.InputRequired()])
    password = PasswordField('Password', [validators.InputRequired()])

class AddGameForm(Form):
    title = StringField('Title', [validators.InputRequired()])
    genre = StringField('Genre', [validators.InputRequired()])
    description = TextAreaField('Description', [validators.Optional()])

@app.route('/')
def home():
    cur = mysql.connection.cursor()
    cur.execute("SELECT name FROM BOARD_GAMES")
    games = cur.fetchall()
    cur.execute("SELECT name FROM BOARD_GAMES ORDER BY updated_at DESC LIMIT 5")
    recent_games = cur.fetchall()
    cur.execute("SELECT name, venue_id, event_time, description FROM EVENTS")
    events = cur.fetchall()
    cur.close()
    return render_template('home.html', games=games, events=events, recent_games=recent_games)

@app.route('/search')
def search():
    query = request.args.get('q', '')
    cur = mysql.connection.cursor()
    cur.execute("SELECT name FROM BOARD_GAMES WHERE name LIKE %s", ('%' + query + '%',))
    results = cur.fetchall()
    cur.close()
    return render_template('search_results.html', query=query, results=results)


@app.route('/register', methods=['GET', 'POST'])
def register():
    form = RegisterForm(request.form)
    if request.method == 'POST' and form.validate():
        cur = mysql.connection.cursor()
        cur.execute("INSERT INTO users (username, password, is_admin, is_blocked) VALUES (%s, %s, 0, 0)", 
                    (form.username.data, form.password.data))
        mysql.connection.commit()
        cur.close()
        return redirect(url_for('login'))
    return render_template('register.html', form=form)

@app.route('/login', methods=['GET', 'POST'])
def login():
    form = LoginForm(request.form)
    if request.method == 'POST' and form.validate():
        cur = mysql.connection.cursor()
        cur.execute("SELECT user_id, username, password, is_admin FROM users WHERE username = %s", (form.username.data,))
        data = cur.fetchone()
        cur.close()
        if data and form.password.data == data[2]:
            user = User(id=data[0], username=data[1], role='admin' if data[3] else 'user')
            login_user(user)
            return redirect(url_for('dashboard'))
        flash('Invalid credentials')
    return render_template('login.html', form=form)

@app.route('/block_user/<int:user_id>', methods=['POST'])
@login_required
def block_user(user_id):
    if current_user.role != 'admin':
        return redirect(url_for('home'))
    cur = mysql.connection.cursor()
    cur.execute("UPDATE users SET is_blocked = 1 WHERE user_id = %s", (user_id,))
    mysql.connection.commit()
    cur.close()
    flash('User blocked.')
    return redirect(url_for('admin_panel'))


@app.route('/logout')
def logout():
    logout_user()
    return redirect(url_for('home'))

@app.route('/dashboard')
@login_required
def dashboard():
    return render_template('dashboard.html', user=current_user)

@app.route('/admin')
@login_required
def admin_panel():
    if current_user.role != 'admin':
        return redirect(url_for('home'))
    return render_template('admin.html')

@app.route('/add_game', methods=['GET', 'POST'])
@login_required
def add_game():
    if current_user.role != 'admin':
        return redirect(url_for('home'))
    form = AddGameForm(request.form)
    if request.method == 'POST' and form.validate():
        cur = mysql.connection.cursor()
        cur.execute("INSERT INTO BOARD_GAMES (name, publisher, min_players, max_players, updated_at, average_rating) VALUES (%s, %s, 2, 4, NOW(), 0.0)",
                    (form.title.data, form.genre.data))
        mysql.connection.commit()
        cur.close()
        flash('Game added successfully')
        return redirect(url_for('admin_panel'))
    return render_template('add_game.html', form=form)

@app.route('/add_to_owned/<int:game_id>', methods=['POST'])
@login_required
def add_to_owned(game_id):
    cur = mysql.connection.cursor()
    cur.execute("INSERT IGNORE INTO GameOwned (game_id, user_id, since) VALUES (%s, %s, %s)", (game_id, current_user.id, date.today()))
    mysql.connection.commit()
    cur.close()
    flash('Game added to your owned list.')
    return redirect(url_for('dashboard'))

@app.route('/add_to_wishlist/<int:game_id>', methods=['POST'])
@login_required
def add_to_wishlist(game_id):
    cur = mysql.connection.cursor()
    cur.execute("INSERT IGNORE INTO WishList (game_id, user_id) VALUES (%s, %s)", (game_id, current_user.id))
    mysql.connection.commit()
    cur.close()
    flash('Game added to your wishlist.')
    return redirect(url_for('dashboard'))

@app.route('/rate_game/<int:game_id>', methods=['POST'])
@login_required
def rate_game(game_id):
    rating = request.form.get('rating')
    comment = request.form.get('comment', '')
    if not rating or not rating.isdigit() or not (1 <= int(rating) <= 5):
        flash('Invalid rating. Please choose a number from 1 to 5.')
        return redirect(url_for('dashboard'))
    cur = mysql.connection.cursor()
    cur.execute("""
        INSERT INTO Rating (user_id, game_id, Stars, comment)
        VALUES (%s, %s, %s, %s)
        ON DUPLICATE KEY UPDATE Stars = VALUES(Stars), comment = VALUES(comment)
    """, (current_user.id, game_id, int(rating), comment))
    mysql.connection.commit()
    cur.close()
    flash('Rating submitted.')
    return redirect(url_for('dashboard'))

if __name__ == '__main__':
    app.run(debug=True)
