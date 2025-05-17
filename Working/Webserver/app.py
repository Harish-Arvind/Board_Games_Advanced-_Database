# This version uses Flask + MySQL
# Install dependencies:
# pip install flask flask-mysqldb flask-login flask-wtf wtforms

from flask import Flask, render_template, request, redirect, url_for, session, flash, send_file
from flask_mysqldb import MySQL
from io import BytesIO
from flask_login import LoginManager, login_user, logout_user, login_required, UserMixin, current_user
from wtforms import Form, StringField, PasswordField, validators, TextAreaField, SubmitField, TextAreaField
from datetime import date
from werkzeug.security import generate_password_hash, check_password_hash
from wtforms.validators import DataRequired, Length
from flask_wtf import FlaskForm


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
    cur.execute("SELECT user_id, username, is_admin FROM Users WHERE user_id = %s", (user_id,))
    data = cur.fetchone()
    cur.close()
    if data:
        return User(id=data[0], username=data[1], role='admin' if data[2] else 'user')
    return None

# Forms
class RegistrationForm(FlaskForm):
    username = StringField('Username', validators=[DataRequired(), Length(min=4, max=25)])
    password = PasswordField('Password', validators=[DataRequired(), Length(min=6)])
    submit = SubmitField('Register')

class LoginForm(FlaskForm):
    username = StringField('Username', validators=[DataRequired()])
    password = PasswordField('Password', validators=[DataRequired()])
    submit = SubmitField('Login')

class AddGameForm(FlaskForm):
    name = StringField('Game Name', validators=[DataRequired(), Length(min=2, max=100)])
    description = TextAreaField('Description', validators=[DataRequired(), Length(min=10)])
    submit = SubmitField('Add Game')



@app.route('/')
def home():
    cur = mysql.connection.cursor()
    cur.execute("SELECT game_id, name, image FROM BOARD_GAMES ORDER BY updated_at DESC LIMIT 10")
    recent_games = cur.fetchall()
    cur.execute("""
        SELECT E.event_id, E.name, E.description, E.event_time, V.name, E.max_participants
        FROM EVENTS E
        JOIN VENUE V ON E.venue_id = V.venue_id
        WHERE E.event_time >= NOW()
        ORDER BY E.event_time
    """)
    events = cur.fetchall()
    cur.close()
    return render_template('home.html', recent_games=recent_games, events=events)

@app.route('/game/<int:game_id>')
def game_page(game_id):
    # You can load full game details here later
    return f"<h1>Game Page for Game ID: {game_id}</h1>"


@app.route('/game_image/<int:game_id>')
def serve_image(game_id):
    cur = mysql.connection.cursor()
    cur.execute("SELECT image FROM BOARD_GAMES WHERE game_id = %s", (game_id,))
    result = cur.fetchone()
    cur.close()

    if result and result[0]:
        return send_file(BytesIO(result[0]), mimetype='image/jpeg')
    return '', 404


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
    form = RegistrationForm()

    if form.validate_on_submit():
        username = form.username.data.strip()
        password = form.password.data
        hashed_password = generate_password_hash(password)

        cur = mysql.connection.cursor()
        try:
            # Check if username already exists
            cur.execute("SELECT * FROM Users WHERE username = %s", (username,))
            existing_user = cur.fetchone()

            if existing_user:
                flash("Username already exists", "warning")
                return render_template("register.html", form=form)

            # Insert new user
            cur.execute(
                "INSERT INTO Users (username, password, is_admin, is_blocked) VALUES (%s, %s, %s, %s)",
                (username, hashed_password, False, False)
            )
            mysql.connection.commit()
            flash("Registration successful. You can now log in.", "success")
            return redirect(url_for('login'))

        except Exception as e:
            flash(f"Database error: {e}", "danger")
        finally:
            cur.close()

    return render_template('register.html', form=form)



@app.route('/login', methods=['GET', 'POST'])
def login():
    form = LoginForm()

    if form.validate_on_submit():
        username = form.username.data.strip()
        password = form.password.data

        cur = mysql.connection.cursor()
        try:
            cur.execute(
                "SELECT user_id, username, password, is_admin FROM Users WHERE username = %s",
                (username,)
            )
            data = cur.fetchone()
        except Exception as e:
            flash('Database error: ' + str(e), 'danger')
            return render_template('login.html', form=form)
        finally:
            cur.close()

        if data:
            stored_hashed_password = data[2]
            if check_password_hash(stored_hashed_password, password):
                user = User(id=data[0], username=data[1], role='admin' if data[3] else 'user')
                login_user(user)
                flash('Login successful', 'success')
                return redirect(url_for('dashboard'))
            else:
                flash('Incorrect password', 'danger')
        else:
            flash('Username not found', 'danger')

    return render_template('login.html', form=form)



@app.route('/block_user/<int:user_id>', methods=['POST'])
@login_required
def block_user(user_id):
    if current_user.role != 'admin':
        return redirect(url_for('home'))
    cur = mysql.connection.cursor()
    cur.execute("UPDATE Users SET is_blocked = 1 WHERE user_id = %s", (user_id,))
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
    return f"""
    <html>
        <head><title>Dashboard</title></head>
        <body>
            <h1>Welcome to the Dashboard</h1>
            <p>Hello, {current_user.username}!</p>
        </body>
    </html>
    """


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

@app.route('/events/<int:event_id>')
def event_detail(event_id):
    cur = mysql.connection.cursor()

    # Get event details
    cur.execute("""
        SELECT E.name, E.description, E.event_time, E.max_participants, E.nb_participant, 
               V.name, V.address, V.max_capacity
        FROM EVENTS E
        JOIN VENUE V ON E.venue_id = V.venue_id
        WHERE E.event_id = %s
    """, (event_id,))
    event = cur.fetchone()
    cur.close()

    if not event:
        return "Event not found", 404

    return render_template('events.html', event=event)


if __name__ == '__main__':
    app.run(debug=True)
