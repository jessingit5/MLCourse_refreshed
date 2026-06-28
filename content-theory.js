// ============================================================
// ML Theory Enhancements + New Sections
// Adds deep theoretical intuition from handwritten notes
// (Krish Naik's Complete Data Science with ML & NLP 2024)
// ============================================================

(function () {

// Helper: append theory to existing section
function addTheory(sectionId, theoryHTML) {
  if (typeof CONTENT === 'undefined' || !CONTENT.sections[sectionId]) {
    console.warn('[theory] Section not found:', sectionId);
    return;
  }
  CONTENT.sections[sectionId].html += theoryHTML;
}

// ============================================================
// LINEAR REGRESSION — Deep Theory
// ============================================================

addTheory('p3-linear', `
  <h2>Deep Theory: OLS Derivation</h2>
  <p>Ordinary Least Squares finds the weights that minimize the sum of squared residuals. The derivation is pure linear algebra.</p>

  <h3>Step-by-step OLS derivation</h3>
  <p>We want to minimize the cost function:</p>
  ${math("J(W) = (y - XW)^T(y - XW)")}
  <p>Expand:</p>
  ${math("J(W) = y^Ty - 2W^TX^Ty + W^TX^TXW")}
  <p>Take the gradient and set to zero:</p>
  ${math("\\frac{\\partial J}{\\partial W} = -2X^Ty + 2X^TXW = 0")}
  <p>Solve for W:</p>
  ${math("W = (X^TX)^{-1}X^Ty")}

  ${warn("When OLS fails", `<p><strong>Multicollinearity</strong> makes \\(X^TX\\) nearly singular (non-invertible). Symptoms: huge coefficients, sign flips, unstable predictions. Fix: use Ridge regression (adds \\(\\lambda I\\) to \\(X^TX\\)), or drop correlated features.</p>`)}

  <h3>Gradient Descent alternative</h3>
  <p>For large datasets where matrix inversion is expensive (O(n³)), use iterative gradient descent:</p>
  ${math("W_{new} = W_{old} - \\alpha \\cdot \\frac{2}{n} X^T(XW - y)")}
  <p>Where \\(\\alpha\\) is the learning rate. Too large → overshoots. Too small → converges slowly.</p>

  ${py(`# Gradient Descent for Linear Regression from scratch
import numpy as np

def gradient_descent_lr(X, y, lr=0.01, epochs=1000):
    n, d = X.shape
    W = np.zeros(d)
    b = 0

    for epoch in range(epochs):
        y_pred = X @ W + b
        residuals = y_pred - y

        # Gradients
        dW = (2 / n) * (X.T @ residuals)
        db = (2 / n) * np.sum(residuals)

        # Update
        W -= lr * dW
        b -= lr * db

        if epoch % 200 == 0:
            mse = np.mean(residuals ** 2)
            print(f"Epoch {epoch}: MSE = {mse:.4f}")

    return W, b

# Usage
from sklearn.datasets import fetch_california_housing
from sklearn.preprocessing import StandardScaler

housing = fetch_california_housing()
X = StandardScaler().fit_transform(housing.data)
y = housing.target

W, b = gradient_descent_lr(X, y, lr=0.01, epochs=1000)`)}

  <h3>Assumptions diagnostic tests</h3>
  ${table(
    ["Assumption", "Test", "What to look for"],
    [
      ["Linearity", "Residuals vs fitted plot", "Random scatter = good. Curve = nonlinear relationship"],
      ["Normality of errors", "Q-Q plot or Shapiro-Wilk test", "Points on diagonal = normal. p > 0.05 = normal"],
      ["Homoscedasticity", "Residuals vs fitted plot", "Constant spread = good. Funnel shape = heteroscedastic"],
      ["No multicollinearity", "VIF (Variance Inflation Factor)", "VIF > 10 = severe collinearity. Drop or combine features"],
      ["Independence", "Durbin-Watson test", "Value near 2 = independent. Near 0 or 4 = autocorrelation"],
    ]
  )}

  ${py(`# Check multicollinearity with VIF
from statsmodels.stats.outliers_influence import variance_inflation_factor

def check_vif(X_df):
    vif_data = []
    for i, col in enumerate(X_df.columns):
        vif = variance_inflation_factor(X_df.values, i)
        vif_data.append({"Feature": col, "VIF": round(vif, 2)})
    return sorted(vif_data, key=lambda x: x["VIF"], reverse=True)

# VIF > 10 means severe multicollinearity — consider dropping that feature`)}

  <h3>Performance metrics deep dive</h3>
  ${table(
    ["Metric", "Formula", "When to use"],
    [
      ["MAE", "\\(\\frac{1}{n}\\sum|y_i - \\hat{y}_i|\\)", "Robust to outliers. Interpretable in original units"],
      ["MSE", "\\(\\frac{1}{n}\\sum(y_i - \\hat{y}_i)^2\\)", "Penalizes large errors more. Standard loss for training"],
      ["RMSE", "\\(\\sqrt{MSE}\\)", "Same units as target. Most commonly reported"],
      ["R²", "\\(1 - \\frac{SS_{res}}{SS_{tot}}\\)", "0–1 scale. 1 = perfect. Can be negative for bad models"],
      ["Adjusted R²", "\\(1 - \\frac{(1-R^2)(n-1)}{n-p-1}\\)", "Penalizes extra features. Use for model comparison"],
    ]
  )}
`);

// ============================================================
// POLYNOMIAL REGRESSION — Theory Enhancement
// ============================================================

addTheory('p3-poly', `
  <h2>Deep Theory: Polynomial Features</h2>
  <p>Polynomial regression is still linear regression — it's linear in the <em>parameters</em>, not the features. We create new features by raising existing ones to powers.</p>

  ${math("y = w_0 + w_1 x + w_2 x^2 + w_3 x^3 + \\ldots")}

  <p>For degree \\(d\\) with \\(p\\) features, PolynomialFeatures generates \\(\\binom{p+d}{d}\\) features including interactions.</p>

  ${py(`from sklearn.preprocessing import PolynomialFeatures
import numpy as np

X = np.array([[2, 3]])
poly = PolynomialFeatures(degree=2, include_bias=False)
X_poly = poly.fit_transform(X)
print(poly.get_feature_names_out())
# ['x0', 'x1', 'x0^2', 'x0 x1', 'x1^2']
print(X_poly)
# [[2, 3, 4, 6, 9]]`)}

  <h3>Overfitting in polynomial regression</h3>
  ${table(
    ["Degree", "Behavior", "Bias", "Variance"],
    [
      ["1 (linear)", "Underfits — misses curvature", "High", "Low"],
      ["2–3", "Usually good balance", "Medium", "Medium"],
      ["10+", "Overfits — wiggles through every point", "Low", "High"],
    ]
  )}

  ${warn("The overfitting trap", `<p>A degree-20 polynomial will fit training data perfectly (R² ≈ 1.0) but predict wildly on new data. Always cross-validate. Use Ridge regression with polynomial features to control overfitting.</p>`)}
`);

// ============================================================
// LOGISTIC REGRESSION — Deep Theory
// ============================================================

addTheory('p4-logistic', `
  <h2>Deep Theory: From Linear to Logistic</h2>

  <h3>The sigmoid function — why it works</h3>
  <p>Linear regression outputs any number. For classification, we need probabilities (0 to 1). The sigmoid function does exactly that:</p>
  ${math("\\sigma(z) = \\frac{1}{1 + e^{-z}}")}
  <p>Properties: \\(\\sigma(0) = 0.5\\), \\(\\sigma(\\infty) = 1\\), \\(\\sigma(-\\infty) = 0\\). It maps the entire real line to (0, 1).</p>

  <h3>Log-odds interpretation</h3>
  <p>The linear combination \\(z = WX + b\\) represents the <strong>log-odds</strong> (logit) of the positive class:</p>
  ${math("\\log\\frac{P(y=1)}{P(y=0)} = W^TX + b")}
  <p>Each coefficient \\(w_i\\) tells you: "a 1-unit increase in feature \\(x_i\\) changes the log-odds by \\(w_i\\)."</p>

  <h3>Why MSE doesn't work for classification</h3>
  <p>MSE with sigmoid creates a non-convex loss surface with many local minima. Binary cross-entropy (log-loss) is convex → guaranteed global minimum:</p>
  ${math("L = -\\frac{1}{n}\\sum_{i=1}^{n}\\left[y_i\\log(\\hat{y}_i) + (1-y_i)\\log(1-\\hat{y}_i)\\right]")}
  <p>When \\(y=1\\): penalizes low \\(\\hat{y}\\) (predicted 0 when true was 1). When \\(y=0\\): penalizes high \\(\\hat{y}\\).</p>

  <h3>Multi-class: OVR vs Softmax</h3>
  ${table(
    ["Method", "How it works", "When to use"],
    [
      ["One-vs-Rest (OVR)", "Train K binary classifiers, each separating one class from all others", "Default in sklearn. Works well when classes don't overlap much"],
      ["Multinomial (Softmax)", "Single model outputs K probabilities that sum to 1", "Better when classes are mutually exclusive. Requires 'lbfgs' or 'saga' solver"],
    ]
  )}

  ${py(`# Multinomial logistic regression
from sklearn.linear_model import LogisticRegression

# OVR (default)
lr_ovr = LogisticRegression(multi_class='ovr', max_iter=1000)

# Softmax
lr_softmax = LogisticRegression(multi_class='multinomial', solver='lbfgs', max_iter=1000)

# Hyperparameter tuning with GridSearchCV
from sklearn.model_selection import GridSearchCV, StratifiedKFold

params = {
    'C': [0.01, 0.1, 1.0, 10, 100],
    'penalty': ['l1', 'l2'],
    'solver': ['liblinear', 'saga']
}
grid = GridSearchCV(
    LogisticRegression(max_iter=1000),
    params, cv=StratifiedKFold(5), scoring='accuracy'
)
grid.fit(X_train_s, y_train)
print(f"Best params: {grid.best_params_}")
print(f"Best score: {grid.best_score_:.4f}")`)}

  <h3>Classification metrics deep dive</h3>
  ${table(
    ["Metric", "Formula", "When to use"],
    [
      ["Accuracy", "\\(\\frac{TP+TN}{TP+TN+FP+FN}\\)", "Balanced classes only. Misleading for imbalanced data"],
      ["Precision", "\\(\\frac{TP}{TP+FP}\\)", "When false positives are costly (spam detection)"],
      ["Recall", "\\(\\frac{TP}{TP+FN}\\)", "When false negatives are costly (disease detection)"],
      ["F1-Score", "\\(\\frac{2 \\cdot P \\cdot R}{P + R}\\)", "Harmonic mean of precision and recall. Use for imbalanced data"],
      ["ROC-AUC", "Area under TPR vs FPR curve", "Threshold-independent. Good for comparing models overall"],
    ]
  )}
`);

// ============================================================
// DECISION TREE — Deep Theory
// ============================================================

addTheory('p4-dt-cls', `
  <h2>Deep Theory: How Decision Trees Split</h2>

  <h3>Gini Impurity — worked example</h3>
  <p>Gini measures how "mixed" the classes are in a node. Pure node = 0, perfectly mixed = 0.5 (binary).</p>
  ${math("Gini = 1 - \\sum_{k=1}^{K} p_k^2")}
  <p><strong>Example:</strong> A node has 30 cats and 10 dogs (40 total):</p>
  ${math("Gini = 1 - \\left(\\frac{30}{40}\\right)^2 - \\left(\\frac{10}{40}\\right)^2 = 1 - 0.5625 - 0.0625 = 0.375")}

  <h3>Entropy & Information Gain</h3>
  ${math("Entropy = -\\sum_{k=1}^{K} p_k \\log_2(p_k)")}
  <p>Information Gain = Entropy(parent) − weighted average Entropy(children). The split with highest gain wins.</p>
  <p><strong>Example:</strong> Same node (30 cats, 10 dogs):</p>
  ${math("Entropy = -\\frac{30}{40}\\log_2\\frac{30}{40} - \\frac{10}{40}\\log_2\\frac{10}{40} = 0.811")}

  <h3>Splitting numerical features</h3>
  <ol>
    <li>Sort values of the feature</li>
    <li>Consider midpoints between consecutive distinct values as candidate thresholds</li>
    <li>For each threshold, compute the Gini/Entropy of the resulting split</li>
    <li>Pick the threshold with lowest weighted impurity</li>
  </ol>

  ${py(`from sklearn.tree import DecisionTreeClassifier, plot_tree
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

# Train and visualize
dt = DecisionTreeClassifier(max_depth=3, criterion='gini', random_state=42)
dt.fit(X_train, y_train)

# Visualize the tree
fig, ax = plt.subplots(figsize=(16, 8))
plot_tree(dt, feature_names=feature_names, class_names=['0','1'],
          filled=True, rounded=True, ax=ax, fontsize=9)
plt.tight_layout()
plt.savefig('decision_tree.png', dpi=150)

# Feature importance (based on total Gini reduction)
for name, imp in sorted(zip(feature_names, dt.feature_importances_),
                         key=lambda x: x[1], reverse=True)[:5]:
    print(f"  {name}: {imp:.4f}")`)}

  <h3>Pruning strategies</h3>
  ${table(
    ["Strategy", "Parameter", "Effect"],
    [
      ["Max depth", "<code>max_depth=5</code>", "Limits tree height. Most important hyperparameter"],
      ["Min samples split", "<code>min_samples_split=20</code>", "Won't split nodes with fewer samples"],
      ["Min samples leaf", "<code>min_samples_leaf=10</code>", "Every leaf must have at least this many samples"],
      ["Max features", "<code>max_features='sqrt'</code>", "Random subset of features at each split (decorrelates trees in RF)"],
      ["Cost-complexity pruning", "<code>ccp_alpha=0.01</code>", "Post-pruning: removes branches that don't reduce error enough"],
    ]
  )}

  <h3>Decision Tree Regressor</h3>
  <p>Instead of Gini/Entropy, regression trees split to minimize <strong>variance</strong> (MSE) within each child node:</p>
  ${math("MSE_{node} = \\frac{1}{n}\\sum_{i \\in node}(y_i - \\bar{y}_{node})^2")}
  <p>Leaf prediction = mean of target values in that leaf.</p>
`);

// ============================================================
// RANDOM FOREST — Deep Theory
// ============================================================

addTheory('p4-rf-cls', `
  <h2>Deep Theory: Bagging & Random Forest</h2>

  <h3>Bagging (Bootstrap Aggregating)</h3>
  <ol>
    <li><strong>Bootstrap:</strong> Create \\(B\\) random samples (with replacement) from the training set. Each sample is ~63.2% unique rows.</li>
    <li><strong>Train:</strong> Fit a decision tree on each bootstrap sample independently.</li>
    <li><strong>Aggregate:</strong> Classification = majority vote. Regression = average.</li>
  </ol>

  <h3>Why random feature subsets matter</h3>
  <p>Regular bagging still produces correlated trees (they all pick the same strong feature for the first split). Random Forest forces each split to consider only \\(\\sqrt{p}\\) (classification) or \\(p/3\\) (regression) random features. This <strong>decorrelates</strong> the trees, reducing variance.</p>

  <h3>Out-of-Bag (OOB) evaluation</h3>
  <p>Each bootstrap sample leaves out ~36.8% of rows. These "out-of-bag" samples are free validation data.</p>
  ${py(`from sklearn.ensemble import RandomForestClassifier

rf = RandomForestClassifier(
    n_estimators=200,
    max_depth=None,
    min_samples_split=5,
    max_features='sqrt',
    oob_score=True,          # enable OOB evaluation
    random_state=42,
    n_jobs=-1
)
rf.fit(X_train, y_train)

print(f"OOB Score: {rf.oob_score_:.4f}")    # free estimate, no CV needed
print(f"Test Score: {rf.score(X_test, y_test):.4f}")

# Feature importance
importances = rf.feature_importances_
indices = np.argsort(importances)[::-1]
for i in range(min(10, len(indices))):
    print(f"  {feature_names[indices[i]]}: {importances[indices[i]]:.4f}")`)}

  ${tip("Random Forest vs Gradient Boosting", `<p><strong>RF</strong>: trees trained in parallel, reduces variance, robust to hyperparameters. <strong>GB</strong>: trees trained sequentially on residuals, reduces bias, needs careful tuning. RF is harder to overfit; GB usually achieves higher accuracy when tuned well.</p>`)}
`);

// ============================================================
// SVM — Deep Theory
// ============================================================

addTheory('p4-svm', `
  <h2>Deep Theory: Margin Maximization</h2>

  <h3>Hard margin vs soft margin</h3>
  <p><strong>Hard margin:</strong> Requires perfect separation. Fails if data isn't linearly separable or has outliers.</p>
  <p><strong>Soft margin:</strong> Allows some misclassifications. The parameter \\(C\\) controls the tradeoff:</p>
  ${math("\\min_{W,b} \\frac{1}{2}\\|W\\|^2 + C\\sum_{i=1}^{n}\\xi_i")}
  <p>Where \\(\\xi_i\\) are slack variables (how much each point violates the margin).</p>
  <ul>
    <li><strong>Large C:</strong> Penalizes violations heavily → narrow margin, fits tighter (risk of overfit)</li>
    <li><strong>Small C:</strong> Allows more violations → wider margin, more generalization</li>
  </ul>

  <h3>The Kernel Trick</h3>
  <p>When data isn't linearly separable, map to higher dimensions where it becomes separable. The kernel trick computes dot products in the high-dimensional space <em>without</em> actually transforming the data.</p>
  ${table(
    ["Kernel", "Formula", "Use case"],
    [
      ["Linear", "\\(K(x,y) = x^Ty\\)", "High-dim sparse data (text), >50k features"],
      ["RBF (Gaussian)", "\\(K(x,y) = e^{-\\\\gamma\\\\|x-y\\\\|^2}\\)", "Default choice. Works for most nonlinear problems"],
      ["Polynomial", "\\(K(x,y) = (\\\\gamma x^Ty + r)^d\\)", "When interactions between features matter"],
      ["Sigmoid", "\\(K(x,y) = \\\\tanh(\\\\gamma x^Ty + r)\\)", "Rarely used. Similar to neural network activation"],
    ]
  )}

  <h3>Gamma parameter intuition</h3>
  <ul>
    <li><strong>Small gamma:</strong> Each point influences a large area → smoother decision boundary → underfitting risk</li>
    <li><strong>Large gamma:</strong> Each point influences only nearby points → complex boundary → overfitting risk</li>
  </ul>

  <h3>Support Vector Regression (SVR)</h3>
  <p>SVR fits a tube of width \\(\\epsilon\\) around the data. Points inside the tube have zero loss; only points outside contribute to the error:</p>
  ${math("L = \\max(0, |y - f(x)| - \\epsilon)")}

  ${py(`# SVM with different kernels — comparison
from sklearn.svm import SVC
from sklearn.model_selection import GridSearchCV

# GridSearch for optimal C and gamma
param_grid = {
    'C': [0.1, 1, 10, 100],
    'gamma': [1, 0.1, 0.01, 0.001],
    'kernel': ['rbf']
}
grid = GridSearchCV(SVC(), param_grid, cv=5, scoring='accuracy', refit=True)
grid.fit(X_train_s, y_train)
print(f"Best params: {grid.best_params_}")
print(f"Best accuracy: {grid.best_score_:.4f}")`)}
`);

// ============================================================
// KNN — Deep Theory
// ============================================================

addTheory('p4-knn-cls', `
  <h2>Deep Theory: Distance Metrics & Search Trees</h2>

  <h3>Distance metrics</h3>
  ${table(
    ["Metric", "Formula", "When to use"],
    [
      ["Euclidean (L2)", "\\(\\sqrt{\\sum(x_i - y_i)^2}\\)", "Default. Assumes features are on similar scales"],
      ["Manhattan (L1)", "\\(\\sum|x_i - y_i|\\)", "Better for high-dimensional data. More robust to outliers"],
      ["Minkowski", "\\(\\\\left(\\sum|x_i - y_i|^p\\\\right)^{1/p}\\)", "Generalization: p=1 → Manhattan, p=2 → Euclidean"],
    ]
  )}

  <h3>KD-Tree and Ball Tree</h3>
  <p>Brute-force KNN is O(n) per query — too slow for large datasets. Tree structures speed up neighbor search:</p>
  <ul>
    <li><strong>KD-Tree:</strong> Recursively partitions space along feature axes. Works well up to ~20 dimensions. O(log n) average query time.</li>
    <li><strong>Ball Tree:</strong> Partitions space using hyperspheres. Works better in high dimensions than KD-Tree.</li>
  </ul>

  ${py(`from sklearn.neighbors import KNeighborsClassifier

# KNN with different algorithms
knn_brute = KNeighborsClassifier(n_neighbors=5, algorithm='brute')
knn_kd = KNeighborsClassifier(n_neighbors=5, algorithm='kd_tree')
knn_ball = KNeighborsClassifier(n_neighbors=5, algorithm='ball_tree')
knn_auto = KNeighborsClassifier(n_neighbors=5, algorithm='auto')  # picks best

# Weighted KNN — closer neighbors have more influence
knn_weighted = KNeighborsClassifier(n_neighbors=5, weights='distance')
knn_weighted.fit(X_train_s, y_train)
print(f"Weighted KNN: {knn_weighted.score(X_test_s, y_test):.4f}")

# Finding optimal K
from sklearn.model_selection import cross_val_score
k_scores = []
for k in range(1, 31):
    knn = KNeighborsClassifier(n_neighbors=k)
    scores = cross_val_score(knn, X_train_s, y_train, cv=5, scoring='accuracy')
    k_scores.append(scores.mean())

best_k = k_scores.index(max(k_scores)) + 1
print(f"Optimal K: {best_k}, Score: {max(k_scores):.4f}")`)}

  ${warn("Curse of dimensionality", `<p>In high dimensions, all points become roughly equidistant. KNN degrades above ~20 features. Solutions: PCA before KNN, or use a model that doesn't rely on distance (tree-based models).</p>`)}
`);

// ============================================================
// NAIVE BAYES — Deep Theory
// ============================================================

addTheory('p4-nb', `
  <h2>Deep Theory: Bayes' Theorem Applied</h2>

  <h3>Bayes' theorem</h3>
  ${math("P(y|X) = \\frac{P(X|y) \\cdot P(y)}{P(X)}")}
  <p>Where: \\(P(y|X)\\) = posterior (what we want), \\(P(X|y)\\) = likelihood, \\(P(y)\\) = prior, \\(P(X)\\) = evidence (constant for all classes).</p>

  <h3>The "naive" assumption</h3>
  <p>Features are conditionally independent given the class. This is almost never true in practice, but the model works surprisingly well anyway:</p>
  ${math("P(x_1, x_2, \\ldots, x_n | y) = \\prod_{i=1}^{n} P(x_i | y)")}

  <h3>Worked example</h3>
  <p>Spam detection: Email with words "free" and "money". Is it spam?</p>
  <ul>
    <li>P(spam) = 0.3, P(ham) = 0.7</li>
    <li>P("free"|spam) = 0.8, P("free"|ham) = 0.1</li>
    <li>P("money"|spam) = 0.6, P("money"|ham) = 0.05</li>
  </ul>
  ${math("P(spam|\\text{free, money}) \\propto 0.3 \\times 0.8 \\times 0.6 = 0.144")}
  ${math("P(ham|\\text{free, money}) \\propto 0.7 \\times 0.1 \\times 0.05 = 0.0035")}
  <p>Normalize: P(spam) = 0.144/(0.144+0.0035) = <strong>97.6%</strong> — classified as spam.</p>

  <h3>Variants</h3>
  ${table(
    ["Variant", "P(x|y) distribution", "Use case"],
    [
      ["<code>GaussianNB</code>", "Gaussian (bell curve)", "Continuous features. Assumes normal distribution per class"],
      ["<code>MultinomialNB</code>", "Multinomial (word counts)", "Text classification (BoW/TF-IDF). Works with word frequencies"],
      ["<code>BernoulliNB</code>", "Bernoulli (binary)", "Binary features (word present/absent). Good for short texts"],
    ]
  )}

  <h3>Laplace smoothing</h3>
  <p>If a word never appears in spam training data, P(word|spam) = 0, making the entire product zero. Laplace smoothing (alpha=1) adds 1 to every count:</p>
  ${math("P(x_i|y) = \\frac{count(x_i, y) + \\alpha}{count(y) + \\alpha \\cdot |V|}")}

  ${py(`from sklearn.naive_bayes import GaussianNB, MultinomialNB, BernoulliNB

# Gaussian for continuous features
gnb = GaussianNB()
gnb.fit(X_train, y_train)
print(f"GaussianNB: {gnb.score(X_test, y_test):.4f}")

# Multinomial for text (with TF-IDF)
mnb = MultinomialNB(alpha=1.0)  # alpha = Laplace smoothing

# Bernoulli for binary features
bnb = BernoulliNB(alpha=1.0)`)}
`);

// ============================================================
// GRADIENT BOOSTING / XGBOOST — Deep Theory
// ============================================================

addTheory('p4-xgb-cls', `
  <h2>Deep Theory: Gradient Boosting & XGBoost</h2>

  <h3>How gradient boosting works</h3>
  <ol>
    <li>Start with a base prediction (e.g., mean of y for regression, log-odds for classification)</li>
    <li>Compute <strong>residuals</strong> (errors) of the current model</li>
    <li>Fit a new tree to the residuals (not the original targets)</li>
    <li>Add the new tree's predictions (scaled by learning rate) to the ensemble</li>
    <li>Repeat for \\(n\\) iterations</li>
  </ol>

  ${math("F_m(x) = F_{m-1}(x) + \\eta \\cdot h_m(x)")}
  <p>Where \\(\\eta\\) is the learning rate (shrinkage) and \\(h_m\\) is the new tree.</p>

  <h3>XGBoost specific: Similarity Score & Gain</h3>
  <p>XGBoost uses a custom split criterion based on second-order Taylor expansion of the loss:</p>
  ${math("\\text{Similarity} = \\frac{\\left(\\sum \\text{residuals}\\right)^2}{\\sum(\\text{prev\\_prob} \\times (1 - \\text{prev\\_prob})) + \\lambda}")}
  ${math("\\text{Gain} = \\text{Similarity}_{left} + \\text{Similarity}_{right} - \\text{Similarity}_{root}")}
  <p>The split with highest Gain wins. \\(\\lambda\\) is L2 regularization — larger \\(\\lambda\\) makes the tree more conservative.</p>

  <h3>XGBoost hyperparameters</h3>
  ${table(
    ["Parameter", "Default", "Effect"],
    [
      ["<code>n_estimators</code>", "100", "Number of trees. More = better but slower. Use early stopping"],
      ["<code>learning_rate</code>", "0.3", "Shrinkage. Lower = more trees needed but better generalization"],
      ["<code>max_depth</code>", "6", "Tree depth. 3-10 typical. Deeper = more complex"],
      ["<code>colsample_bytree</code>", "1.0", "Fraction of features per tree. 0.5-0.8 reduces overfitting"],
      ["<code>subsample</code>", "1.0", "Fraction of rows per tree. 0.5-0.8 reduces overfitting"],
      ["<code>reg_lambda</code>", "1.0", "L2 regularization on weights"],
      ["<code>reg_alpha</code>", "0.0", "L1 regularization (sparsity)"],
      ["<code>gamma</code>", "0.0", "Min gain to split. Higher = fewer splits (pruning)"],
    ]
  )}

  ${py(`from xgboost import XGBClassifier
from sklearn.model_selection import GridSearchCV

xgb = XGBClassifier(
    n_estimators=200,
    learning_rate=0.1,
    max_depth=5,
    colsample_bytree=0.8,
    subsample=0.8,
    reg_lambda=1.0,
    use_label_encoder=False,
    eval_metric='logloss',
    random_state=42
)

# Early stopping to prevent overfitting
xgb.fit(X_train, y_train,
        eval_set=[(X_test, y_test)],
        verbose=False)

print(f"XGBoost accuracy: {xgb.score(X_test, y_test):.4f}")

# GridSearch for tuning
params = {
    'max_depth': [3, 5, 7],
    'learning_rate': [0.01, 0.1],
    'n_estimators': [100, 200, 300],
    'colsample_bytree': [0.5, 0.8, 1.0]
}
grid = GridSearchCV(xgb, params, cv=3, scoring='accuracy', n_jobs=-1)
grid.fit(X_train, y_train)
print(f"Best params: {grid.best_params_}")`)}
`);

// ============================================================
// ADABOOST — New Section
// ============================================================

S("p4-adaboost", "4.8 AdaBoost", "Part 4 — Classification", `
  <h1><span class="eyebrow">Part 4 · Classification</span>AdaBoost (Adaptive Boosting)</h1>

  <h3>Intuition</h3>
  <p>AdaBoost combines many <strong>weak learners</strong> (usually decision stumps — depth-1 trees) into a strong ensemble. After each round, it increases the weight of misclassified samples, forcing the next learner to focus on the hard cases.</p>

  <h3>Algorithm step by step</h3>
  <ol>
    <li><strong>Initialize:</strong> All samples get equal weight \\(w_i = 1/n\\)</li>
    <li><strong>For each round m:</strong>
      <ul>
        <li>Train weak learner \\(h_m\\) on weighted data</li>
        <li>Compute weighted error: \\(\\epsilon_m = \\sum_{i: h_m(x_i) \\neq y_i} w_i\\)</li>
        <li>Compute learner weight: \\(\\alpha_m = \\frac{1}{2}\\ln\\frac{1-\\epsilon_m}{\\epsilon_m}\\)</li>
        <li>Update sample weights: misclassified ↑, correct ↓</li>
      </ul>
    </li>
    <li><strong>Final prediction:</strong> Weighted majority vote</li>
  </ol>

  ${math("\\alpha_m = \\frac{1}{2}\\ln\\frac{1-\\epsilon_m}{\\epsilon_m}")}
  ${math("H(x) = \\text{sign}\\left(\\sum_{m=1}^{M} \\alpha_m \\cdot h_m(x)\\right)")}

  <h3>Weight update intuition</h3>
  <p>If \\(\\epsilon_m < 0.5\\) (better than random), \\(\\alpha_m > 0\\) → this learner gets a positive vote. A learner with \\(\\epsilon = 0.3\\) gets \\(\\alpha = 0.42\\); one with \\(\\epsilon = 0.1\\) gets \\(\\alpha = 1.10\\) — much more influence.</p>

  ${py(`from sklearn.ensemble import AdaBoostClassifier
from sklearn.tree import DecisionTreeClassifier

# AdaBoost with decision stumps
ada = AdaBoostClassifier(
    estimator=DecisionTreeClassifier(max_depth=1),
    n_estimators=100,
    learning_rate=0.5,
    algorithm='SAMME.R',
    random_state=42
)
ada.fit(X_train, y_train)
print(f"AdaBoost accuracy: {ada.score(X_test, y_test):.4f}")

# Staged prediction — accuracy at each boosting round
import numpy as np
staged_scores = [score for score in ada.staged_score(X_test, y_test)]
print(f"After 10 trees: {staged_scores[9]:.4f}")
print(f"After 50 trees: {staged_scores[49]:.4f}")
print(f"After 100 trees: {staged_scores[99]:.4f}")

# Compare SAMME vs SAMME.R
ada_samme = AdaBoostClassifier(algorithm='SAMME', n_estimators=100)
ada_sammer = AdaBoostClassifier(algorithm='SAMME.R', n_estimators=100)
# SAMME.R uses probability estimates → usually converges faster`)}

  ${table(
    ["Parameter", "Effect"],
    [
      ["<code>n_estimators</code>", "Number of boosting rounds. More = better until overfitting. Use with learning_rate"],
      ["<code>learning_rate</code>", "Shrinks each learner's contribution. Lower = more rounds needed but better generalization"],
      ["<code>algorithm='SAMME.R'</code>", "Uses probability estimates. Faster convergence than 'SAMME'"],
      ["<code>estimator</code>", "Base learner. Default = DecisionTreeClassifier(max_depth=1). Can use any weak classifier"],
    ]
  )}

  ${tip("AdaBoost vs Gradient Boosting", `<p>AdaBoost adjusts <em>sample weights</em>. Gradient Boosting fits on <em>residuals</em>. In practice, Gradient Boosting (and XGBoost) usually outperforms AdaBoost, but AdaBoost is simpler and easier to understand — learning it first makes GB intuitive.</p>`)}
`);

// ============================================================
// K-MEANS — Deep Theory
// ============================================================

addTheory('p5-kmeans', `
  <h2>Deep Theory: K-Means Internals</h2>

  <h3>Algorithm step by step</h3>
  <ol>
    <li><strong>Initialize:</strong> Choose K centroids (randomly or via K-Means++)</li>
    <li><strong>Assign:</strong> Each point → nearest centroid (Euclidean distance)</li>
    <li><strong>Update:</strong> Move each centroid to the mean of its assigned points</li>
    <li><strong>Repeat</strong> steps 2–3 until centroids stop moving (or max iterations)</li>
  </ol>

  <h3>K-Means++ initialization</h3>
  <p>Random initialization can lead to poor convergence. K-Means++ spreads initial centroids apart:</p>
  <ol>
    <li>Pick first centroid randomly</li>
    <li>For each remaining centroid: pick the point with probability proportional to its squared distance from the nearest existing centroid</li>
  </ol>
  <p>This ensures centroids start far apart, leading to faster and more consistent convergence.</p>

  <h3>Elbow method for choosing K</h3>
  <p>Plot the <strong>Within-Cluster Sum of Squares (WCSS/Inertia)</strong> vs K. The "elbow" point where the curve bends is the optimal K.</p>

  ${py(`from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score

# Elbow method
inertias = []
sil_scores = []
K_range = range(2, 11)

for k in K_range:
    km = KMeans(n_clusters=k, init='k-means++', n_init=10, random_state=42)
    km.fit(X_scaled)
    inertias.append(km.inertia_)
    sil_scores.append(silhouette_score(X_scaled, km.labels_))

# Optional: use KneeLocator to find elbow automatically
# from kneed import KneeLocator
# kl = KneeLocator(K_range, inertias, curve="convex", direction="decreasing")
# print(f"Optimal K (elbow): {kl.elbow}")

# Train final model
best_k = 3
km_final = KMeans(n_clusters=best_k, init='k-means++', n_init=10, random_state=42)
km_final.fit(X_scaled)
print(f"Inertia: {km_final.inertia_:.2f}")
print(f"Silhouette: {silhouette_score(X_scaled, km_final.labels_):.4f}")`)}

  ${warn("K-Means limitations", `<p>Only finds <em>spherical</em> clusters of similar size. Fails for non-convex shapes (use DBSCAN), varying densities, or high-dimensional data. Always standardize features first — K-Means uses Euclidean distance.</p>`)}
`);

// ============================================================
// HIERARCHICAL CLUSTERING — Deep Theory
// ============================================================

addTheory('p5-hier', `
  <h2>Deep Theory: Linkage Methods & Dendrograms</h2>

  <h3>Agglomerative (bottom-up) algorithm</h3>
  <ol>
    <li>Start: each point is its own cluster (n clusters)</li>
    <li>Find the two closest clusters</li>
    <li>Merge them into one cluster</li>
    <li>Repeat until only 1 cluster remains (or desired K is reached)</li>
  </ol>

  <h3>Linkage methods — how to measure cluster distance</h3>
  ${table(
    ["Method", "Distance between clusters A and B", "Behavior"],
    [
      ["<strong>Single</strong>", "Min distance between any pair of points", "Produces long, chain-like clusters. Sensitive to noise"],
      ["<strong>Complete</strong>", "Max distance between any pair of points", "Produces compact, spherical clusters. Sensitive to outliers"],
      ["<strong>Average</strong>", "Mean distance between all pairs", "Compromise between single and complete"],
      ["<strong>Ward's</strong>", "Increase in total within-cluster variance", "Minimizes variance. Best for spherical clusters. Most commonly used"],
    ]
  )}

  <h3>Reading dendrograms</h3>
  <p>The Y-axis shows the merge distance. Cut the dendrogram at a height to get K clusters. Large vertical gaps suggest natural cluster boundaries.</p>

  ${py(`import scipy.cluster.hierarchy as sch
from sklearn.cluster import AgglomerativeClustering

# Dendrogram — visualize the merging process
plt.figure(figsize=(12, 5))
dendrogram = sch.dendrogram(sch.linkage(X_scaled, method='ward'))
plt.title("Dendrogram (Ward's linkage)")
plt.xlabel("Sample index")
plt.ylabel("Merge distance")
plt.axhline(y=6, color='r', linestyle='--', label='Cut at k=3')
plt.legend()
plt.tight_layout()

# Agglomerative clustering
agg = AgglomerativeClustering(n_clusters=3, linkage='ward')
labels = agg.fit_predict(X_scaled)
print(f"Silhouette score: {silhouette_score(X_scaled, labels):.4f}")`)}

  ${tip("K-Means vs Hierarchical", `<p><strong>K-Means:</strong> faster (O(n)), needs K upfront, spherical clusters only. <strong>Hierarchical:</strong> slower (O(n²-n³)), dendrogram helps choose K, captures non-spherical shapes with single linkage. Use hierarchical for small-medium data when you want to explore cluster structure.</p>`)}
`);

// ============================================================
// DBSCAN — Deep Theory
// ============================================================

addTheory('p5-dbscan', `
  <h2>Deep Theory: Density-Based Clustering</h2>

  <h3>Core concepts</h3>
  <ul>
    <li><strong>Core point:</strong> Has at least <code>min_samples</code> points within radius <code>eps</code></li>
    <li><strong>Border point:</strong> Within eps of a core point, but has fewer than min_samples neighbors itself</li>
    <li><strong>Noise point:</strong> Neither core nor border — classified as outlier (label = -1)</li>
  </ul>

  <h3>Algorithm</h3>
  <ol>
    <li>Pick an unvisited point</li>
    <li>Find all points within eps distance</li>
    <li>If ≥ min_samples neighbors → it's a core point. Start a new cluster, recursively add all density-reachable points</li>
    <li>If &lt; min_samples → mark as noise (may later become a border point)</li>
    <li>Repeat until all points are visited</li>
  </ol>

  <h3>Choosing eps and min_samples</h3>
  <p><strong>K-distance plot:</strong> For each point, compute distance to its k-th nearest neighbor (k = min_samples). Sort these distances. The "elbow" of the curve suggests a good eps value.</p>

  ${py(`from sklearn.cluster import DBSCAN
from sklearn.neighbors import NearestNeighbors

# K-distance plot to find optimal eps
nn = NearestNeighbors(n_neighbors=5)
nn.fit(X_scaled)
distances, _ = nn.kneighbors(X_scaled)
k_distances = np.sort(distances[:, -1])

plt.figure(figsize=(8, 4))
plt.plot(k_distances)
plt.xlabel("Points (sorted)")
plt.ylabel("5th nearest neighbor distance")
plt.title("K-Distance Plot — look for the elbow")
plt.tight_layout()

# DBSCAN
db = DBSCAN(eps=0.3, min_samples=5)
labels = db.fit_predict(X_scaled)

n_clusters = len(set(labels)) - (1 if -1 in labels else 0)
n_noise = list(labels).count(-1)
print(f"Clusters: {n_clusters}, Noise points: {n_noise}")
if n_clusters > 1:
    print(f"Silhouette: {silhouette_score(X_scaled[labels != -1], labels[labels != -1]):.4f}")`)}

  ${tip("When DBSCAN shines", `<p>DBSCAN finds arbitrarily-shaped clusters (moons, rings, blobs) that K-Means cannot. It automatically detects outliers as noise. It doesn't require specifying K. Downside: sensitive to eps choice and struggles with clusters of varying densities.</p>`)}
`);

// ============================================================
// PCA — Deep Theory
// ============================================================

addTheory('p5-pca', `
  <h2>Deep Theory: Eigendecomposition & Variance</h2>

  <h3>What PCA actually does</h3>
  <ol>
    <li><strong>Standardize</strong> features (zero mean, unit variance)</li>
    <li>Compute the <strong>covariance matrix</strong> \\(\\Sigma = \\frac{1}{n-1}X^TX\\)</li>
    <li>Find the <strong>eigenvectors</strong> (principal components) and <strong>eigenvalues</strong> of \\(\\Sigma\\)</li>
    <li>Sort eigenvectors by eigenvalue (largest first)</li>
    <li>Project data onto the top-k eigenvectors</li>
  </ol>

  <p>Each eigenvalue tells you how much variance is captured along that direction. The first PC captures the most variance, the second captures the most remaining variance (orthogonal to the first), and so on.</p>

  <h3>Explained variance ratio</h3>
  ${math("\\text{Explained variance ratio}_k = \\frac{\\lambda_k}{\\sum_{i=1}^{p} \\lambda_i}")}
  <p>Rule of thumb: keep enough components to explain 90-95% of total variance.</p>

  ${py(`from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler

# Standardize first — PCA is sensitive to scale
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Full PCA to see all explained variances
pca_full = PCA()
pca_full.fit(X_scaled)

# Cumulative explained variance plot
cumvar = np.cumsum(pca_full.explained_variance_ratio_)
n_95 = np.argmax(cumvar >= 0.95) + 1
print(f"Components for 95% variance: {n_95} out of {X.shape[1]}")

# Apply PCA with chosen n_components
pca = PCA(n_components=n_95)
X_reduced = pca.fit_transform(X_scaled)
print(f"Shape: {X.shape} → {X_reduced.shape}")
print(f"Explained variance: {sum(pca.explained_variance_ratio_):.1%}")

# 2D visualization
pca_2d = PCA(n_components=2)
X_2d = pca_2d.fit_transform(X_scaled)
plt.scatter(X_2d[:, 0], X_2d[:, 1], c=y, cmap='plasma', alpha=0.6)
plt.xlabel(f"PC1 ({pca_2d.explained_variance_ratio_[0]:.1%})")
plt.ylabel(f"PC2 ({pca_2d.explained_variance_ratio_[1]:.1%})")
plt.title("PCA projection")`)}

  ${warn("PCA pitfalls", `<p>1) Always standardize first — otherwise the feature with largest scale dominates. 2) PCA finds linear combinations — it can't capture nonlinear structure (use t-SNE/UMAP for visualization). 3) Components are not interpretable as individual features.</p>`)}
`);

// ============================================================
// ANOMALY DETECTION — New Section
// ============================================================

S("p5-anomaly", "5.5 Anomaly Detection", "Part 5 — Unsupervised", `
  <h1><span class="eyebrow">Part 5 · Unsupervised</span>Anomaly Detection</h1>

  <h3>Intuition</h3>
  <p>Find data points that don't conform to expected patterns. Applications: fraud detection, network intrusion, manufacturing defects, medical anomalies.</p>

  <h2>Isolation Forest</h2>
  <h3>How it works</h3>
  <p>Random splits isolate anomalies faster than normal points. In a random tree, an outlier needs fewer splits to be isolated (shorter path length = more anomalous).</p>
  <ol>
    <li>Build many random trees: at each node, pick a random feature and random split value</li>
    <li>For each point, measure the average path length across all trees</li>
    <li>Short path = easy to isolate = likely anomaly</li>
  </ol>

  ${math("\\text{Anomaly score } s(x) = 2^{-E(h(x))/c(n)}")}
  <p>Where \\(E(h(x))\\) is average path length and \\(c(n)\\) normalizes by expected path length. Score close to 1 = anomaly, close to 0.5 = normal.</p>

  ${py(`from sklearn.ensemble import IsolationForest
import numpy as np

# Generate data with outliers
np.random.seed(42)
X_normal = np.random.randn(200, 2) * 0.5
X_outliers = np.random.uniform(-4, 4, (20, 2))
X = np.vstack([X_normal, X_outliers])

# Isolation Forest
iso = IsolationForest(
    contamination=0.1,    # expected fraction of outliers
    n_estimators=100,
    random_state=42
)
predictions = iso.fit_predict(X)
# 1 = normal, -1 = anomaly

anomaly_mask = predictions == -1
print(f"Anomalies detected: {anomaly_mask.sum()} out of {len(X)}")

# Get anomaly scores (lower = more anomalous)
scores = iso.decision_function(X)
# More negative = more anomalous`)}

  <h2>Local Outlier Factor (LOF)</h2>
  <h3>How it works</h3>
  <p>LOF compares the local density of a point to its neighbors. A point in a sparse region surrounded by dense regions is an outlier.</p>
  <ol>
    <li>For each point, compute its k-nearest neighbors</li>
    <li>Compute the <strong>local reachability density</strong> (inverse of average reachability distance to neighbors)</li>
    <li>Compare each point's density to its neighbors' densities</li>
    <li>LOF ≈ 1 = normal density. LOF >> 1 = less dense than neighbors = outlier</li>
  </ol>

  ${py(`from sklearn.neighbors import LocalOutlierFactor

# LOF (note: default is novelty=False → only fit_predict, not predict on new data)
lof = LocalOutlierFactor(
    n_neighbors=20,
    contamination=0.1
)
predictions = lof.fit_predict(X)
anomaly_mask = predictions == -1
print(f"LOF anomalies: {anomaly_mask.sum()}")

# Get LOF scores
lof_scores = lof.negative_outlier_factor_
# More negative = more anomalous

# For novelty detection (predict on new data):
lof_novelty = LocalOutlierFactor(n_neighbors=20, novelty=True)
lof_novelty.fit(X_train)
new_preds = lof_novelty.predict(X_test)`)}

  ${table(
    ["Method", "Strengths", "Weaknesses"],
    [
      ["<strong>Isolation Forest</strong>", "Fast, handles high dimensions, no distance metric needed", "Struggles with local anomalies in dense regions"],
      ["<strong>LOF</strong>", "Detects local anomalies, considers neighborhood density", "Slower (O(n²)), sensitive to n_neighbors choice"],
      ["<strong>DBSCAN noise</strong>", "Clustering + anomaly detection in one step", "Need to tune eps/min_samples"],
    ]
  )}

  ${tip("Choosing contamination", `<p>If you don't know the anomaly rate, start with <code>contamination='auto'</code> (Isolation Forest) or 0.05–0.1. In production, threshold on the decision_function score instead of using contamination — it gives you more control.</p>`)}
`);

// ============================================================
// SILHOUETTE ANALYSIS — New Section
// ============================================================

S("p5-silhouette", "5.6 Silhouette Analysis", "Part 5 — Unsupervised", `
  <h1><span class="eyebrow">Part 5 · Unsupervised</span>Silhouette Analysis</h1>

  <h3>Intuition</h3>
  <p>The silhouette score measures how similar a point is to its own cluster vs the nearest other cluster. It's the best general-purpose metric for evaluating clustering quality.</p>

  <h3>Formula</h3>
  ${math("s(i) = \\frac{b(i) - a(i)}{\\max(a(i), b(i))}")}
  <p>Where:</p>
  <ul>
    <li>\\(a(i)\\) = average distance to all points in the <em>same</em> cluster (cohesion)</li>
    <li>\\(b(i)\\) = average distance to the <em>nearest other</em> cluster (separation)</li>
    <li>\\(s(i) \\in [-1, 1]\\): +1 = well clustered, 0 = on boundary, -1 = wrong cluster</li>
  </ul>

  <h3>Overall silhouette score</h3>
  <p>Average s(i) across all points. Use it to compare different K values:</p>

  ${py(`from sklearn.metrics import silhouette_score, silhouette_samples
from sklearn.cluster import KMeans
import numpy as np

# Find optimal K using silhouette score
sil_scores = {}
for k in range(2, 11):
    km = KMeans(n_clusters=k, init='k-means++', n_init=10, random_state=42)
    labels = km.fit_predict(X_scaled)
    score = silhouette_score(X_scaled, labels)
    sil_scores[k] = score
    print(f"K={k}: Silhouette = {score:.4f}")

best_k = max(sil_scores, key=sil_scores.get)
print(f"\\nBest K: {best_k} (silhouette = {sil_scores[best_k]:.4f})")

# Per-sample silhouette analysis
km_best = KMeans(n_clusters=best_k, init='k-means++', n_init=10, random_state=42)
labels = km_best.fit_predict(X_scaled)
sample_scores = silhouette_samples(X_scaled, labels)

# Check for poorly clustered points
for cluster_id in range(best_k):
    cluster_scores = sample_scores[labels == cluster_id]
    n_negative = (cluster_scores < 0).sum()
    print(f"Cluster {cluster_id}: mean={cluster_scores.mean():.3f}, "
          f"negative={n_negative}/{len(cluster_scores)}")`)}

  ${table(
    ["Score range", "Interpretation"],
    [
      ["0.71 – 1.0", "Strong cluster structure"],
      ["0.51 – 0.70", "Reasonable structure found"],
      ["0.26 – 0.50", "Weak structure, could be artificial"],
      ["< 0.25", "No substantial structure"],
    ]
  )}

  ${tip("Silhouette vs Elbow", `<p>The elbow method (WCSS/inertia) always decreases with more clusters — you're looking for a bend. Silhouette score has a clear maximum. Use both: elbow for a rough estimate, silhouette for confirmation.</p>`)}
`);

// ============================================================
// NLP — Theory Enhancement
// ============================================================

addTheory('p9-basics', `
  <h2>Deep Theory: NLP Pipeline</h2>

  <h3>Complete text preprocessing pipeline</h3>
  <ol>
    <li><strong>Tokenization:</strong> Split text into words/sentences. NLTK's <code>word_tokenize</code> handles contractions ("don't" → ["do", "n't"])</li>
    <li><strong>Lowercasing:</strong> "The" and "the" should be the same token</li>
    <li><strong>Stopword removal:</strong> Remove common words ("the", "is", "at") that carry little meaning</li>
    <li><strong>Stemming:</strong> Reduce words to root form. "running"→"run", "better"→"better". Fast but crude (Porter, Snowball)</li>
    <li><strong>Lemmatization:</strong> Reduce to dictionary form. "better"→"good", "ran"→"run". Slower but more accurate (WordNet)</li>
    <li><strong>Vectorization:</strong> Convert text to numbers (BoW, TF-IDF, embeddings)</li>
  </ol>

  ${py(`import nltk
from nltk.tokenize import word_tokenize, sent_tokenize
from nltk.corpus import stopwords
from nltk.stem import PorterStemmer, WordNetLemmatizer

text = "The runners were running quickly through the beautiful gardens"

# Tokenization
tokens = word_tokenize(text.lower())
# ['the', 'runners', 'were', 'running', 'quickly', 'through', 'the', 'beautiful', 'gardens']

# Stopword removal
stop_words = set(stopwords.words('english'))
filtered = [w for w in tokens if w not in stop_words]
# ['runners', 'running', 'quickly', 'beautiful', 'gardens']

# Stemming (fast, crude)
ps = PorterStemmer()
stemmed = [ps.stem(w) for w in filtered]
# ['runner', 'run', 'quickli', 'beauti', 'garden']

# Lemmatization (slower, accurate)
lem = WordNetLemmatizer()
lemmatized = [lem.lemmatize(w) for w in filtered]
# ['runner', 'running', 'quickly', 'beautiful', 'garden']`)}

  <h3>Named Entity Recognition (NER)</h3>
  ${py(`import spacy
nlp = spacy.load("en_core_web_sm")

doc = nlp("Apple released the iPhone 15 in Cupertino on September 12, 2023")
for ent in doc.ents:
    print(f"{ent.text:20} → {ent.label_}")
# Apple                → ORG
# iPhone 15            → PRODUCT
# Cupertino            → GPE
# September 12, 2023   → DATE`)}
`);

// ============================================================
// TF-IDF — Theory Enhancement
// ============================================================

addTheory('p9-tfidf', `
  <h2>Deep Theory: Bag-of-Words & TF-IDF Math</h2>

  <h3>Bag of Words (BoW)</h3>
  <p>Create a vocabulary of all unique words, then represent each document as a count vector.</p>
  <p>Document: "the cat sat on the mat" → Vocabulary: [cat, mat, on, sat, the] → Vector: [1, 1, 1, 1, 2]</p>

  <h3>TF-IDF formula</h3>
  ${math("\\text{TF-IDF}(t, d) = \\text{TF}(t, d) \\times \\text{IDF}(t)")}
  ${math("\\text{TF}(t, d) = \\frac{\\text{count of term } t \\text{ in document } d}{\\text{total terms in } d}")}
  ${math("\\text{IDF}(t) = \\log\\frac{N}{\\text{docs containing } t}")}

  <p><strong>Intuition:</strong> TF measures how important a word is <em>within</em> a document. IDF measures how unique it is <em>across</em> all documents. Words that appear in every document (like "the") get low IDF. Words unique to a few documents (like "eigenvalue") get high IDF.</p>

  ${py(`from sklearn.feature_extraction.text import CountVectorizer, TfidfVectorizer

corpus = [
    "machine learning is great",
    "deep learning is a subset of machine learning",
    "natural language processing uses machine learning"
]

# Bag of Words
cv = CountVectorizer()
bow = cv.fit_transform(corpus)
print("Vocabulary:", cv.get_feature_names_out())
print("BoW matrix:\\n", bow.toarray())

# TF-IDF
tfidf = TfidfVectorizer()
X_tfidf = tfidf.fit_transform(corpus)
print("\\nTF-IDF matrix:\\n", X_tfidf.toarray().round(3))

# With n-grams (bigrams capture phrases like "machine learning")
tfidf_bigram = TfidfVectorizer(ngram_range=(1, 2), max_features=100)
X_bigram = tfidf_bigram.fit_transform(corpus)`)}

  ${table(
    ["Method", "Pros", "Cons"],
    [
      ["Bag of Words", "Simple, interpretable", "Ignores word order and importance. High-frequency words dominate"],
      ["TF-IDF", "Downweights common words. Better for ML", "Still ignores word order and context"],
      ["N-grams", "Captures phrases ('New York', 'machine learning')", "Vocabulary explosion. Needs max_features limit"],
      ["Word2Vec/Embeddings", "Captures semantic meaning and context", "Not interpretable. Needs pretrained model or large corpus"],
    ]
  )}
`);

// ============================================================
// DEEP LEARNING — Theory Enhancement
// ============================================================

addTheory('p8-intro', `
  <h2>Deep Theory: Neural Network Foundations</h2>

  <h3>The perceptron</h3>
  <p>A single neuron: weighted sum + activation function. The building block of all neural networks.</p>
  ${math("y = f\\left(\\sum_{i=1}^{n} w_i x_i + b\\right)")}

  <h3>Activation functions deep dive</h3>
  ${table(
    ["Function", "Formula", "Range", "When to use"],
    [
      ["<strong>Sigmoid</strong>", "\\(\\frac{1}{1+e^{-x}}\\)", "(0, 1)", "Binary classification output layer. Avoid in hidden layers (vanishing gradient)"],
      ["<strong>Tanh</strong>", "\\(\\frac{e^x - e^{-x}}{e^x + e^{-x}}\\)", "(-1, 1)", "Zero-centered version of sigmoid. Better than sigmoid but same gradient issue"],
      ["<strong>ReLU</strong>", "\\(\\\\max(0, x)\\)", "[0, ∞)", "Default for hidden layers. Fast, avoids vanishing gradient. Can 'die' (output 0 permanently)"],
      ["<strong>Leaky ReLU</strong>", "\\(\\\\max(0.01x, x)\\)", "(-∞, ∞)", "Fixes dying ReLU by allowing small negative values"],
      ["<strong>ELU</strong>", "\\(x \\\\text{ if } x>0, \\\\alpha(e^x-1) \\\\text{ if } x \\\\leq 0\\)", "(-α, ∞)", "Smooth version of Leaky ReLU. Slightly better performance but slower"],
      ["<strong>GELU</strong>", "\\(x \\cdot \\\\Phi(x)\\)", "(-∞, ∞)", "Used in Transformers (BERT, GPT). Smooth approximation of ReLU"],
    ]
  )}
`);

addTheory('p8-mlp', `
  <h2>Deep Theory: Loss Functions & Optimizers</h2>

  <h3>Loss functions</h3>
  ${table(
    ["Loss", "Formula", "Task"],
    [
      ["MSE", "\\(\\frac{1}{n}\\sum(y-\\hat{y})^2\\)", "Regression. Penalizes large errors quadratically"],
      ["MAE", "\\(\\frac{1}{n}\\sum|y-\\hat{y}|\\)", "Regression. Robust to outliers"],
      ["Binary Cross-Entropy", "\\(-[y\\\\log\\hat{y} + (1-y)\\\\log(1-\\hat{y})]\\)", "Binary classification"],
      ["Categorical Cross-Entropy", "\\(-\\sum y_k \\\\log \\hat{y}_k\\)", "Multi-class classification"],
      ["Huber Loss", "MSE if |error| < δ, MAE otherwise", "Regression. Combines MSE and MAE — robust yet differentiable"],
    ]
  )}

  <h3>Optimizers evolution</h3>
  ${table(
    ["Optimizer", "Key idea", "When to use"],
    [
      ["<strong>SGD</strong>", "Update = -lr × gradient", "Simple baseline. Needs careful lr tuning"],
      ["<strong>SGD + Momentum</strong>", "Adds velocity term: accelerates in consistent directions", "Faster convergence than vanilla SGD"],
      ["<strong>AdaGrad</strong>", "Per-parameter lr that decreases for frequent features", "Sparse data (NLP). lr decays too aggressively for deep nets"],
      ["<strong>RMSProp</strong>", "Like AdaGrad but uses exponential moving average (fixes decay)", "Good for RNNs. Non-convex problems"],
      ["<strong>Adam</strong>", "Combines momentum + RMSProp. Adaptive lr per parameter", "Default choice for most problems. lr=0.001 is a good starting point"],
      ["<strong>AdamW</strong>", "Adam with decoupled weight decay", "State of the art. Use for Transformers"],
    ]
  )}

  <h3>Weight initialization</h3>
  <p>Bad initialization causes vanishing or exploding gradients. The goal: keep activations and gradients at roughly unit variance through all layers.</p>
  ${table(
    ["Method", "Variance", "Best with"],
    [
      ["<strong>Xavier/Glorot</strong>", "\\(\\frac{2}{n_{in} + n_{out}}\\)", "Sigmoid, Tanh activations"],
      ["<strong>He/Kaiming</strong>", "\\(\\frac{2}{n_{in}}\\)", "ReLU and variants — the standard for modern networks"],
      ["<strong>LeCun</strong>", "\\(\\frac{1}{n_{in}}\\)", "SELU activation"],
    ]
  )}

  ${py(`import torch
import torch.nn as nn

# PyTorch handles initialization automatically based on layer type
# But you can customize:
class MyModel(nn.Module):
    def __init__(self):
        super().__init__()
        self.fc1 = nn.Linear(784, 256)
        self.fc2 = nn.Linear(256, 10)

        # He initialization for ReLU layers
        nn.init.kaiming_normal_(self.fc1.weight, nonlinearity='relu')
        nn.init.kaiming_normal_(self.fc2.weight, nonlinearity='relu')

    def forward(self, x):
        x = torch.relu(self.fc1(x))
        return self.fc2(x)`)}
`);

// ============================================================
// RIDGE, LASSO, ELASTICNET — Theory Enhancement
// ============================================================

addTheory('p2-regularization', `
  <h2>Deep Theory: L1 vs L2 Geometric Intuition</h2>

  <h3>Why L1 (Lasso) produces sparsity</h3>
  <p>Imagine the loss function contours as ellipses. The L1 constraint region is a <strong>diamond</strong>; L2 is a <strong>circle</strong>.</p>
  <p>The optimal point is where the ellipse first touches the constraint region. The diamond has corners on the axes — the ellipse is much more likely to hit a corner (where some weights = 0) than a smooth point. The circle has no corners, so weights shrink but rarely reach exactly zero.</p>

  <h3>Regularization formulas</h3>
  ${table(
    ["Method", "Penalty term", "Effect"],
    [
      ["<strong>Ridge (L2)</strong>", "\\(\\\\lambda \\sum w_j^2\\)", "Shrinks all weights toward zero. Never eliminates features. Good for multicollinearity"],
      ["<strong>Lasso (L1)</strong>", "\\(\\\\lambda \\sum |w_j|\\)", "Pushes some weights to exactly zero → automatic feature selection"],
      ["<strong>ElasticNet</strong>", "\\(\\\\lambda_1 \\sum|w_j| + \\\\lambda_2 \\sum w_j^2\\)", "Best of both. Use when features are correlated (Lasso picks one randomly; ElasticNet keeps correlated features together)"],
    ]
  )}

  <h3>Cross-validation for alpha selection</h3>
  ${py(`from sklearn.linear_model import RidgeCV, LassoCV, ElasticNetCV

# RidgeCV — built-in cross-validation
ridge = RidgeCV(alphas=[0.001, 0.01, 0.1, 1, 10, 100], cv=5)
ridge.fit(X_train, y_train)
print(f"Best alpha: {ridge.alpha_}")
print(f"R²: {ridge.score(X_test, y_test):.4f}")

# LassoCV
lasso = LassoCV(alphas=None, cv=5, max_iter=10000)  # auto alpha range
lasso.fit(X_train, y_train)
print(f"Best alpha: {lasso.alpha_:.6f}")
print(f"Features used: {(lasso.coef_ != 0).sum()} / {len(lasso.coef_)}")

# ElasticNetCV
enet = ElasticNetCV(l1_ratio=[0.1, 0.3, 0.5, 0.7, 0.9], cv=5, max_iter=10000)
enet.fit(X_train, y_train)
print(f"Best l1_ratio: {enet.l1_ratio_}, alpha: {enet.alpha_:.6f}")`)}

  <h3>Types of cross-validation</h3>
  ${table(
    ["Method", "How it works", "When to use"],
    [
      ["K-Fold", "Split into K equal folds. Train on K-1, test on 1. Rotate K times", "Default choice. K=5 or K=10"],
      ["Stratified K-Fold", "Same as K-Fold but preserves class distribution in each fold", "Classification with imbalanced classes"],
      ["LOOCV", "K = n (each sample is a test set once). Most expensive", "Very small datasets (<100 samples)"],
      ["Group K-Fold", "Ensures all samples from same group stay together", "When samples are grouped (e.g., multiple images per patient)"],
      ["Time Series Split", "Train on past, test on future. No shuffle", "Time-dependent data. Prevents lookahead bias"],
    ]
  )}
`);

// ============================================================
// WORD EMBEDDINGS — Theory Enhancement
// ============================================================

addTheory('p9-embeddings', `
  <h2>Deep Theory: Word2Vec Architecture</h2>

  <h3>CBOW vs Skip-gram</h3>
  ${table(
    ["Architecture", "Input → Output", "Strengths"],
    [
      ["<strong>CBOW</strong>", "Context words → center word", "Faster training. Better for frequent words. Smooths over distributions"],
      ["<strong>Skip-gram</strong>", "Center word → context words", "Better for rare words. Works well with small datasets"],
    ]
  )}

  <p><strong>CBOW example:</strong> Given context ["the", "cat", "on", "the", "mat"], predict center word "sat".</p>
  <p><strong>Skip-gram example:</strong> Given center word "sat", predict context words ["cat", "on"].</p>

  <h3>Key properties of word vectors</h3>
  <ul>
    <li>Similar words have similar vectors: cosine_similarity("king", "queen") ≈ 0.8</li>
    <li>Semantic arithmetic: vector("king") - vector("man") + vector("woman") ≈ vector("queen")</li>
    <li>Typical dimension: 100-300</li>
  </ul>

  ${py(`from gensim.models import Word2Vec

# Train Word2Vec on a corpus
sentences = [
    ["machine", "learning", "is", "great"],
    ["deep", "learning", "is", "subset", "of", "machine", "learning"],
    ["natural", "language", "processing", "uses", "machine", "learning"],
]

model = Word2Vec(sentences, vector_size=100, window=5, min_count=1,
                 sg=1)  # sg=1 for Skip-gram, sg=0 for CBOW

# Find similar words
model.wv.most_similar("machine", topn=3)

# Document embedding: average word vectors
def document_vector(doc_tokens, model):
    vectors = [model.wv[w] for w in doc_tokens if w in model.wv]
    return np.mean(vectors, axis=0) if vectors else np.zeros(model.vector_size)`)}
`);

console.log('[content-theory] Theory enhancements and new sections registered');
})();
