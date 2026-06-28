// ============================================================
// Part PY — Python Refresher (from Complete-Python-Bootcamp)
// Quick-reference for refreshing Python before diving into ML.
// ============================================================

(function () {

// PY.0 — Overview
S("py-overview", "PY.0 Python Overview", "Part PY — Python Refresher", `
  <h1><span class="eyebrow">Part PY · Python Refresher</span>Python Overview</h1>
  <p>This section is a <strong>fast refresher</strong> — not a beginner tutorial. If you already know another language, skim the syntax and focus on the Python-specific idioms that matter for ML work: list comprehensions, generators, unpacking, and the data model.</p>

  <h2>Why Python for ML</h2>
  <ul>
    <li><strong>NumPy/Pandas/Scikit-learn/PyTorch</strong> — the entire ML ecosystem is Python-first.</li>
    <li><strong>Dynamic typing + REPL</strong> — fast prototyping in Jupyter notebooks.</li>
    <li><strong>Readable syntax</strong> — code reads like pseudocode, which matters when implementing papers.</li>
  </ul>

  <h2>Key things to know</h2>
  ${table(
    ["Feature", "Python", "Why it matters for ML"],
    [
      ["Typing", "Dynamic — type inferred at runtime", "Fast prototyping, but watch for silent type bugs"],
      ["Indentation", "Enforced (4 spaces = block)", "No braces; whitespace is syntax"],
      ["Indexing", "0-based, negative indexing from end", "NumPy/Pandas follow the same convention"],
      ["Mutability", "Lists mutable, tuples immutable", "Affects how data flows through pipelines"],
      ["First-class functions", "Functions are objects", "Enables map/filter/lambda patterns used everywhere in ML"],
    ]
  )}

  ${tip("How to use this section", `<p>If you're comfortable with Python, skip to <strong>PY.7 Advanced Python</strong> and <strong>PY.8 Comprehensions</strong> — those are the patterns that show up constantly in ML code. Come back to earlier sections only when you hit something unfamiliar.</p>`)}
`);

// PY.1 — Variables & Data Types
S("py-variables", "PY.1 Variables & Data Types", "Part PY — Python Refresher", `
  <h1><span class="eyebrow">Part PY · Python Refresher</span>Variables & Data Types</h1>

  <h3>Dynamic typing</h3>
  <p>Python variables don't have fixed types — the <em>value</em> has a type, not the variable. A variable is just a name pointing to an object in memory.</p>

  ${py(`# Variables are created on assignment — no declaration needed
age = 25              # int
height = 5.11         # float
name = "Flash"        # str
is_active = True      # bool

# Dynamic typing: same variable, different types
x = 10
print(type(x))    # <class 'int'>
x = "hello"
print(type(x))    # <class 'str'>

# Type conversion
age_str = str(age)          # "25"
price = float("19.99")     # 19.99
count = int("42")           # 42
# int("hello") → ValueError`)}

  ${notes([
    "<code>type(x)</code> — returns the type of any object. Use it when debugging unexpected behavior.",
    "Python is <strong>case-sensitive</strong>: <code>Name</code> and <code>name</code> are different variables.",
    "<code>int()</code>, <code>float()</code>, <code>str()</code> — explicit type conversion. Fails with <code>ValueError</code> if the string isn't parseable.",
  ])}

  <h3>Core data types</h3>
  ${table(
    ["Type", "Example", "Mutable?", "ML use"],
    [
      ["<code>int</code>", "<code>42</code>", "No", "Counts, indices, labels"],
      ["<code>float</code>", "<code>3.14</code>", "No", "Features, weights, losses"],
      ["<code>str</code>", "<code>'hello'</code>", "No", "Column names, text data"],
      ["<code>bool</code>", "<code>True</code>", "No", "Masks, flags, conditions"],
      ["<code>NoneType</code>", "<code>None</code>", "No", "Missing values, default args"],
    ]
  )}

  <h3>String essentials</h3>
  ${py(`# f-strings (Python 3.6+) — the only string formatting you need
name, accuracy = "RandomForest", 0.9423
print(f"{name}: {accuracy:.2%}")   # RandomForest: 94.23%
print(f"RMSE: {0.7432:.4f}")       # RMSE: 0.7432

# Common string methods
text = "  Hello, World!  "
text.strip()           # "Hello, World!" — removes whitespace
text.lower()           # "  hello, world!  "
text.split(",")        # ['  Hello', ' World!  ']
text.replace("World", "ML")  # "  Hello, ML!  "
"_".join(["a","b","c"])      # "a_b_c"`)}

  ${warn("Gotcha: mutable default arguments", `<p><code>def f(x=[])</code> shares the same list across calls. Use <code>def f(x=None)</code> and <code>x = x or []</code> inside the function instead.</p>`)}
`);

// PY.2 — Control Flow
S("py-control", "PY.2 Control Flow", "Part PY — Python Refresher", `
  <h1><span class="eyebrow">Part PY · Python Refresher</span>Control Flow</h1>

  <h3>Conditionals</h3>
  ${py(`age = 17

if age < 13:
    print("child")
elif age < 18:
    print("teenager")    # ← this runs
else:
    print("adult")

# Ternary (inline conditional) — common in ML for quick flags
label = "positive" if score > 0.5 else "negative"

# Truthiness: 0, None, "", [], {}, set() are all falsy
if not []:
    print("empty list is falsy")`)}

  <h3>For loops</h3>
  ${py(`# range(start, stop, step) — stop is exclusive
for i in range(0, 10, 2):
    print(i)    # 0, 2, 4, 6, 8

# Iterate over collections directly — don't use range(len(...))
features = ["age", "income", "score"]
for feature in features:
    print(feature)

# enumerate() gives index + value
for i, feature in enumerate(features):
    print(f"{i}: {feature}")
# 0: age
# 1: income
# 2: score

# zip() iterates over multiple sequences in parallel
names = ["Ridge", "Lasso", "ElasticNet"]
scores = [0.82, 0.79, 0.81]
for name, score in zip(names, scores):
    print(f"{name}: {score}")

# Dictionary iteration
params = {"C": 1.0, "kernel": "rbf", "gamma": "scale"}
for key, value in params.items():
    print(f"{key} = {value}")`)}

  ${notes([
    "<code>enumerate(iterable)</code> — always use this instead of <code>range(len(x))</code>. Cleaner and less error-prone.",
    "<code>zip(a, b)</code> — pairs up elements. Stops at the shorter sequence.",
    "<code>for k, v in dict.items()</code> — the idiomatic way to iterate over key-value pairs.",
  ])}

  <h3>While loops & control statements</h3>
  ${py(`# break exits the loop entirely
for i in range(10):
    if i == 5:
        break        # stops at 5
    print(i)         # 0, 1, 2, 3, 4

# continue skips to the next iteration
for i in range(10):
    if i % 2 == 0:
        continue     # skip even numbers
    print(i)         # 1, 3, 5, 7, 9

# for/else — the else runs only if the loop completed without break
for num in range(2, 20):
    for i in range(2, num):
        if num % i == 0:
            break
    else:
        print(f"{num} is prime")`)}
`);

// PY.3 — Data Structures
S("py-structures", "PY.3 Data Structures", "Part PY — Python Refresher", `
  <h1><span class="eyebrow">Part PY · Python Refresher</span>Data Structures</h1>

  <h3>Lists — ordered, mutable</h3>
  ${py(`# Creation
nums = [1, 2, 3, 4, 5]
mixed = [1, "hello", 3.14, True]   # can hold mixed types

# Indexing and slicing
nums[0]       # 1  (first element)
nums[-1]      # 5  (last element)
nums[1:4]     # [2, 3, 4]  (slice: start inclusive, end exclusive)
nums[::2]     # [1, 3, 5]  (every 2nd element)
nums[::-1]    # [5, 4, 3, 2, 1]  (reversed)

# Mutation
nums.append(6)            # [1,2,3,4,5,6]
nums.insert(0, 0)         # [0,1,2,3,4,5,6]
nums.extend([7, 8])       # [0,1,2,3,4,5,6,7,8]
removed = nums.pop()      # removes & returns last: 8
nums.remove(0)            # removes first occurrence of 0
nums.sort(reverse=True)   # in-place descending sort
sorted_copy = sorted(nums)  # returns new sorted list`)}

  <h3>Tuples — ordered, immutable</h3>
  ${py(`# Immutable — use for data that shouldn't change
point = (3, 4)
dimensions = (1920, 1080)

# Unpacking — extremely common in ML code
x, y = point
print(x)   # 3

# Extended unpacking
first, *middle, last = [1, 2, 3, 4, 5]
# first=1, middle=[2,3,4], last=5

# Tuples as dict keys (lists can't be used as keys)
grid = {}
grid[(0, 0)] = "origin"`)}

  <h3>Sets — unordered, unique elements</h3>
  ${py(`# Remove duplicates instantly
ids = [1, 2, 2, 3, 3, 3]
unique = set(ids)   # {1, 2, 3}

# Set operations
a = {1, 2, 3, 4, 5}
b = {4, 5, 6, 7, 8}

a | b    # union:        {1,2,3,4,5,6,7,8}
a & b    # intersection: {4,5}
a - b    # difference:   {1,2,3}
a ^ b    # symmetric:    {1,2,3,6,7,8}

# Membership test — O(1) vs O(n) for lists
5 in a   # True — instant lookup

# discard vs remove
a.discard(99)   # no error if missing
a.remove(99)    # KeyError if missing`)}

  <h3>Dictionaries — key-value pairs</h3>
  ${py(`# Creation
model_params = {"C": 1.0, "kernel": "rbf", "gamma": "scale"}

# Access
model_params["C"]                    # 1.0
model_params.get("alpha", 0.01)      # 0.01 (default if key missing)
# model_params["alpha"]              # KeyError!

# Mutation
model_params["C"] = 10.0             # update
model_params["degree"] = 3           # add new key
del model_params["degree"]           # delete

# Useful methods
model_params.keys()      # dict_keys(['C', 'kernel', 'gamma'])
model_params.values()    # dict_values([10.0, 'rbf', 'scale'])
model_params.items()     # dict_items([('C', 10.0), ...])

# Dictionary comprehension
scores = {"RF": 0.92, "SVM": 0.89, "KNN": 0.85}
good = {k: v for k, v in scores.items() if v > 0.90}
# {'RF': 0.92}

# Merge dicts (Python 3.9+)
defaults = {"lr": 0.001, "epochs": 10}
overrides = {"epochs": 50, "batch_size": 32}
config = {**defaults, **overrides}
# {'lr': 0.001, 'epochs': 50, 'batch_size': 32}`)}

  ${tip("When to use what", `<p><strong>List</strong> — ordered collection, allows duplicates. <strong>Tuple</strong> — immutable list, use for fixed records. <strong>Set</strong> — fast membership testing, auto-dedup. <strong>Dict</strong> — key→value mapping. In ML: dicts for hyperparameters, lists for data, sets for unique labels.</p>`)}
`);

// PY.4 — Functions & Lambda
S("py-functions", "PY.4 Functions & Lambda", "Part PY — Python Refresher", `
  <h1><span class="eyebrow">Part PY · Python Refresher</span>Functions & Lambda</h1>

  <h3>Functions</h3>
  ${py(`# Basic function with docstring
def compute_rmse(y_true, y_pred):
    """Compute root mean squared error."""
    mse = sum((a - b) ** 2 for a, b in zip(y_true, y_pred)) / len(y_true)
    return mse ** 0.5

error = compute_rmse([3, 5, 7], [2.5, 5.1, 6.8])
print(f"RMSE: {error:.4f}")

# Default parameters
def train_model(X, y, epochs=10, lr=0.001):
    print(f"Training for {epochs} epochs at lr={lr}")
    return {"trained": True}

train_model(X, y)                  # uses defaults
train_model(X, y, epochs=50)       # override one
train_model(X, y, lr=0.01)         # override another

# Return multiple values (as tuple)
def evaluate(y_true, y_pred):
    accuracy = sum(a == b for a, b in zip(y_true, y_pred)) / len(y_true)
    errors = sum(a != b for a, b in zip(y_true, y_pred))
    return accuracy, errors

acc, err = evaluate([1,0,1,1], [1,0,0,1])
print(f"Accuracy: {acc:.0%}, Errors: {err}")   # 75%, 1`)}

  <h3>*args and **kwargs</h3>
  ${py(`# *args — variable number of positional arguments (received as tuple)
def mean(*values):
    return sum(values) / len(values)

mean(1, 2, 3, 4, 5)   # 3.0

# **kwargs — variable number of keyword arguments (received as dict)
def create_model(**config):
    for key, value in config.items():
        print(f"  {key}: {value}")

create_model(n_estimators=100, max_depth=5, random_state=42)
# n_estimators: 100
# max_depth: 5
# random_state: 42

# Combining both
def log_experiment(name, *metrics, **params):
    print(f"Experiment: {name}")
    print(f"Metrics: {metrics}")
    print(f"Params: {params}")

log_experiment("run_1", 0.95, 0.12, lr=0.001, epochs=50)`)}

  <h3>Lambda functions</h3>
  ${py(`# Anonymous functions — single expression, no name needed
square = lambda x: x ** 2
square(5)   # 25

# Common with sorted()
models = [("RF", 0.92), ("SVM", 0.89), ("XGB", 0.95)]
sorted(models, key=lambda m: m[1], reverse=True)
# [('XGB', 0.95), ('RF', 0.92), ('SVM', 0.89)]

# map() — apply function to every element
numbers = [1, 2, 3, 4, 5]
squares = list(map(lambda x: x ** 2, numbers))   # [1, 4, 9, 16, 25]

# filter() — keep elements where function returns True
evens = list(filter(lambda x: x % 2 == 0, numbers))   # [2, 4]

# Practical: convert string numbers
str_nums = ["1", "2", "3"]
int_nums = list(map(int, str_nums))   # [1, 2, 3]`)}

  ${notes([
    "<code>lambda</code> — use for short throwaway functions, especially as <code>key=</code> arguments to <code>sorted()</code> and pandas methods.",
    "<code>map(fn, iterable)</code> — returns iterator, wrap in <code>list()</code> to see results. In practice, list comprehensions are more readable.",
    "<code>filter(fn, iterable)</code> — keeps items where fn returns True. Again, list comprehensions are often clearer.",
  ])}
`);

// PY.5 — OOP Essentials
S("py-oop", "PY.5 OOP Essentials", "Part PY — Python Refresher", `
  <h1><span class="eyebrow">Part PY · Python Refresher</span>OOP Essentials</h1>
  <p>You need OOP to understand sklearn's API (estimators are classes with <code>.fit()</code> and <code>.predict()</code>) and to build PyTorch models (subclassing <code>nn.Module</code>).</p>

  <h3>Classes and __init__</h3>
  ${py(`class LinearModel:
    def __init__(self, learning_rate=0.01):
        self.lr = learning_rate
        self.weights = None
        self.bias = None

    def fit(self, X, y):
        n_features = len(X[0])
        self.weights = [0.0] * n_features
        self.bias = 0.0
        print(f"Fitting with lr={self.lr}, {n_features} features")

    def predict(self, X):
        return [
            sum(w * x for w, x in zip(self.weights, row)) + self.bias
            for row in X
        ]

model = LinearModel(learning_rate=0.001)
model.fit([[1, 2], [3, 4]], [5, 6])
preds = model.predict([[1, 2]])`)}

  <h3>Inheritance</h3>
  ${py(`class BaseEstimator:
    def fit(self, X, y):
        raise NotImplementedError

    def predict(self, X):
        raise NotImplementedError

    def score(self, X, y):
        preds = self.predict(X)
        return sum(p == t for p, t in zip(preds, y)) / len(y)

class MyClassifier(BaseEstimator):
    def __init__(self, threshold=0.5):
        self.threshold = threshold

    def fit(self, X, y):
        self.mean_val = sum(y) / len(y)
        return self

    def predict(self, X):
        return [1 if self.mean_val > self.threshold else 0 for _ in X]

clf = MyClassifier(threshold=0.5)
clf.fit([[1],[2],[3]], [1, 0, 1])
print(clf.score([[1],[2]], [1, 1]))`)}

  <h3>Encapsulation</h3>
  ${py(`class BankAccount:
    def __init__(self, owner, balance=0):
        self.owner = owner          # public
        self._transactions = []     # protected (convention)
        self.__balance = balance    # private (name-mangled)

    def deposit(self, amount):
        if amount > 0:
            self.__balance += amount
            self._transactions.append(f"+{amount}")

    def get_balance(self):
        return self.__balance

acct = BankAccount("Flash", 1000)
acct.deposit(500)
print(acct.get_balance())   # 1500
# acct.__balance             # AttributeError
# acct._BankAccount__balance # works but don't do this`)}

  <h3>Polymorphism & Abstract Classes</h3>
  ${py(`from abc import ABC, abstractmethod

class Scaler(ABC):
    @abstractmethod
    def fit(self, data):
        pass

    @abstractmethod
    def transform(self, data):
        pass

class MinMaxScaler(Scaler):
    def fit(self, data):
        self.min_val = min(data)
        self.max_val = max(data)
        return self

    def transform(self, data):
        rng = self.max_val - self.min_val
        return [(x - self.min_val) / rng for x in data]

class StandardScaler(Scaler):
    def fit(self, data):
        self.mean = sum(data) / len(data)
        self.std = (sum((x - self.mean)**2 for x in data) / len(data)) ** 0.5
        return self

    def transform(self, data):
        return [(x - self.mean) / self.std for x in data]

# Polymorphism: same interface, different behavior
for scaler in [MinMaxScaler(), StandardScaler()]:
    scaler.fit([1, 2, 3, 4, 5])
    print(scaler.transform([1, 3, 5]))`)}

  ${tip("Why this matters for ML", `<p>Sklearn's entire API is built on this pattern: every estimator has <code>.fit()</code>, <code>.predict()</code>, and <code>.score()</code>. PyTorch's <code>nn.Module</code> uses inheritance + <code>forward()</code>. Understanding OOP makes these frameworks feel natural.</p>`)}
`);

// PY.6 — Files & Exceptions
S("py-files", "PY.6 Files & Exceptions", "Part PY — Python Refresher", `
  <h1><span class="eyebrow">Part PY · Python Refresher</span>Files & Exceptions</h1>

  <h3>File handling</h3>
  ${py(`# Always use 'with' — it auto-closes the file
with open("data.txt", "r") as f:
    content = f.read()          # entire file as string
    # or: lines = f.readlines() # list of lines

# Write (overwrites existing)
with open("results.txt", "w") as f:
    f.write("Model: RandomForest\\n")
    f.write(f"Accuracy: {0.94:.4f}\\n")

# Append
with open("results.txt", "a") as f:
    f.write("Recall: 0.91\\n")

# Read line by line (memory efficient for large files)
with open("large_data.csv", "r") as f:
    for line in f:
        row = line.strip().split(",")
        # process row`)}

  <h3>Exception handling</h3>
  ${py(`# Basic try/except
try:
    result = 10 / 0
except ZeroDivisionError as e:
    print(f"Error: {e}")   # division by zero

# Multiple exception types
try:
    value = int("not_a_number")
except ValueError:
    print("Invalid number format")
except TypeError:
    print("Wrong type")

# Full pattern: try / except / else / finally
try:
    data = open("model.pkl", "rb").read()
except FileNotFoundError:
    print("Model file not found — training from scratch")
    data = None
else:
    print("Model loaded successfully")   # only if no exception
finally:
    print("Cleanup complete")            # always runs

# Common ML exceptions to handle
import pickle
try:
    with open("model.pkl", "rb") as f:
        model = pickle.load(f)
except (FileNotFoundError, pickle.UnpicklingError) as e:
    print(f"Could not load model: {e}")
    model = None`)}

  ${notes([
    "<code>with open(...) as f</code> — context manager pattern. Guarantees the file is closed even if an error occurs.",
    "<code>except SomeError as e</code> — catches the specific error and stores the message in <code>e</code>.",
    "<code>else</code> block — runs only if <em>no</em> exception was raised. Use for code that should only run on success.",
    "<code>finally</code> — always runs. Use for cleanup (closing connections, releasing resources).",
  ])}
`);

// PY.7 — Advanced Python
S("py-advanced", "PY.7 Advanced Python", "Part PY — Python Refresher", `
  <h1><span class="eyebrow">Part PY · Python Refresher</span>Advanced Python</h1>
  <p>These patterns appear constantly in ML codebases. If you only read one section in this refresher, make it this one.</p>

  <h3>Iterators</h3>
  ${py(`# Any object with __iter__ and __next__ is an iterator
my_list = [1, 2, 3]
it = iter(my_list)
print(next(it))   # 1
print(next(it))   # 2
print(next(it))   # 3
# next(it)        # StopIteration

# Under the hood, 'for' loops use iterators:
# for x in [1,2,3]:  →  it = iter([1,2,3]); while True: x = next(it)`)}

  <h3>Generators — lazy evaluation</h3>
  ${py(`# yield produces values one at a time — no list stored in memory
def batch_generator(data, batch_size):
    for i in range(0, len(data), batch_size):
        yield data[i:i + batch_size]

# Used in ML for mini-batch training
dataset = list(range(100))
for batch in batch_generator(dataset, batch_size=32):
    print(f"Batch size: {len(batch)}")
# Batch size: 32, 32, 32, 4

# Generator expression (like list comprehension but lazy)
squares_gen = (x**2 for x in range(1000000))
# No memory allocated! Values computed on demand
first_10 = [next(squares_gen) for _ in range(10)]

# Practical: process large files without loading into memory
def read_large_csv(filepath):
    with open(filepath, "r") as f:
        header = f.readline().strip().split(",")
        for line in f:
            values = line.strip().split(",")
            yield dict(zip(header, values))

# for row in read_large_csv("huge_dataset.csv"):
#     process(row)   # memory-constant regardless of file size`)}

  ${tip("Generators in ML", `<p>PyTorch's <code>DataLoader</code> is essentially a generator. Keras' <code>fit_generator()</code> (now <code>fit()</code>) accepts generators. Understanding yield makes these APIs intuitive.</p>`)}

  <h3>Decorators — functions that modify functions</h3>
  ${py(`import time

# A decorator that times any function
def timer(func):
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)
        elapsed = time.time() - start
        print(f"{func.__name__} took {elapsed:.4f}s")
        return result
    return wrapper

@timer
def train_model(epochs):
    total = 0
    for _ in range(epochs):
        total += sum(range(10000))
    return total

train_model(100)   # train_model took 0.0523s

# Decorator with arguments
def repeat(n):
    def decorator(func):
        def wrapper(*args, **kwargs):
            for _ in range(n):
                result = func(*args, **kwargs)
            return result
        return wrapper
    return decorator

@repeat(3)
def greet(name):
    print(f"Hello, {name}!")

greet("Flash")   # prints "Hello, Flash!" three times`)}

  ${notes([
    "<code>@decorator</code> above a function is syntactic sugar for <code>func = decorator(func)</code>.",
    "Decorators are closures — the inner <code>wrapper</code> function captures <code>func</code> from the outer scope.",
    "Common uses: <code>@timer</code> for profiling, <code>@cache</code> for memoization, <code>@staticmethod</code>/<code>@classmethod</code> in classes.",
    "PyTorch uses <code>@torch.no_grad()</code> as a decorator to disable gradient tracking during inference.",
  ])}
`);

// PY.8 — Comprehensions & Functional
S("py-comprehensions", "PY.8 Comprehensions & Functional", "Part PY — Python Refresher", `
  <h1><span class="eyebrow">Part PY · Python Refresher</span>Comprehensions & Functional Tools</h1>
  <p>Comprehensions are the most Pythonic pattern and appear on nearly every line of ML data processing code.</p>

  <h3>List comprehensions</h3>
  ${py(`# Basic: [expression for item in iterable]
squares = [x**2 for x in range(10)]
# [0, 1, 4, 9, 16, 25, 36, 49, 64, 81]

# With condition: [expr for item in iterable if condition]
even_squares = [x**2 for x in range(10) if x % 2 == 0]
# [0, 4, 16, 36, 64]

# Nested comprehension
matrix = [[i + j for j in range(3)] for i in range(3)]
# [[0,1,2], [1,2,3], [2,3,4]]

# Flatten a nested list
nested = [[1, 2], [3, 4], [5, 6]]
flat = [x for sublist in nested for x in sublist]
# [1, 2, 3, 4, 5, 6]

# ML example: extract feature names matching a pattern
columns = ["age", "age_squared", "income", "income_log", "name"]
numeric_cols = [c for c in columns if c != "name"]
log_features = [c for c in columns if c.endswith("_log")]`)}

  <h3>Dictionary & set comprehensions</h3>
  ${py(`# Dict comprehension: {key_expr: val_expr for item in iterable}
names = ["RF", "SVM", "KNN"]
scores = [0.92, 0.89, 0.85]
results = {name: score for name, score in zip(names, scores)}
# {'RF': 0.92, 'SVM': 0.89, 'KNN': 0.85}

# Filter
good_models = {k: v for k, v in results.items() if v > 0.90}
# {'RF': 0.92}

# Set comprehension
unique_types = {type(v).__name__ for v in [1, "a", 2.0, "b", 3]}
# {'int', 'str', 'float'}

# Invert a dict
inverted = {v: k for k, v in results.items()}
# {0.92: 'RF', 0.89: 'SVM', 0.85: 'KNN'}`)}

  <h3>Useful built-in functions</h3>
  ${py(`scores = [0.82, 0.91, 0.78, 0.95, 0.88]

# any() / all() — short-circuit evaluation
any(s > 0.90 for s in scores)     # True (at least one > 0.90)
all(s > 0.80 for s in scores)     # False (0.78 fails)

# sorted with key
models = [("RF", 0.92), ("SVM", 0.89), ("XGB", 0.95), ("KNN", 0.85)]
by_score = sorted(models, key=lambda m: m[1], reverse=True)
# [('XGB', 0.95), ('RF', 0.92), ('SVM', 0.89), ('KNN', 0.85)]

# max/min with key
best = max(models, key=lambda m: m[1])   # ('XGB', 0.95)
worst = min(models, key=lambda m: m[1])  # ('KNN', 0.85)

# sum with generator expression (no intermediate list)
total = sum(s for s in scores if s > 0.80)

# Counter — instant frequency counting
from collections import Counter
labels = [0, 1, 1, 0, 1, 0, 0, 1, 1]
Counter(labels)   # Counter({1: 5, 0: 4})

# defaultdict — dict that auto-creates missing keys
from collections import defaultdict
groups = defaultdict(list)
for name, score in models:
    if score > 0.90:
        groups["good"].append(name)
    else:
        groups["ok"].append(name)
# {'good': ['RF', 'XGB'], 'ok': ['SVM', 'KNN']}`)}

  ${tip("Comprehension vs loop", `<p>Use comprehensions for simple transforms and filters. Use explicit loops when the body is complex, has side effects, or needs error handling. A comprehension that wraps past 80 characters should probably be a loop.</p>`)}
`);

console.log('[content-python] Python refresher sections registered');
})();
