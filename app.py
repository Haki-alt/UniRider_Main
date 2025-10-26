from flask import Flask, render_template, request, redirect, url_for, session, flash

app = Flask(__name__)
app.secret_key = "your_secret_key"  # Needed for sessions

# Dummy credentials (for testing)
USERNAME = "admin"
PASSWORD = "12345"

@app.route('/')
def home():
    if 'user' in session:
        return render_template('index_main.html', user=session['user'])
    return redirect(url_for('login_main'))

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        
        if username == USERNAME and password == PASSWORD:
            session['user'] = username
            flash("Login Successful!", "success")
            return redirect(url_for('index_main'))
        else:
            flash("Invalid username or password", "danger")
            return redirect(url_for('login_main'))
    
    return render_template('login_main.html')

@app.route('/logout')
def logout():
    session.pop('user', None)
    flash("You have been logged out.", "info")
    return redirect(url_for('login_main'))

if __name__ == '_main_':
    app.run(debug=True)