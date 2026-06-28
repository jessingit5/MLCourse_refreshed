// ============================================================
// Content Gap Fixes — Missing crucial theory
// ============================================================

(function () {

function addTheory(sectionId, html) {
  if (typeof CONTENT === 'undefined' || !CONTENT.sections[sectionId]) {
    console.warn('[gaps] Section not found:', sectionId);
    return;
  }
  CONTENT.sections[sectionId].html += html;
}

// ============================================================
// DECISION TREE CLASSIFIER — Full Feature Selection Walkthrough
// ============================================================

addTheory('p4-dt-cls', `
  <h2>How the Tree Decides Which Feature to Split On</h2>
  <p>This is the core of CART. At every node, the algorithm evaluates <strong>every feature</strong>, computes the impurity reduction for each, and picks the one with the highest reduction. Here's the full process.</p>

  <h3>Step-by-step: Building a Decision Tree (Play Tennis dataset)</h3>
  <p>Dataset: 14 days, 4 features (Outlook, Temperature, Humidity, Wind), target: Play Tennis (Yes/No). Overall: 9 Yes, 5 No.</p>

  <h4>Step 1 — Compute impurity of the root node</h4>
  <p>Before any split, the root has all 14 samples (9Y, 5N):</p>
  ${math("Entropy(root) = -\\frac{9}{14}\\log_2\\frac{9}{14} - \\frac{5}{14}\\log_2\\frac{5}{14} = 0.940")}
  ${math("Gini(root) = 1 - \\left(\\frac{9}{14}\\right)^2 - \\left(\\frac{5}{14}\\right)^2 = 0.459")}

  <h4>Step 2 — Evaluate every feature as a candidate split</h4>
  <p>For each feature, split the data and compute the <strong>weighted average impurity</strong> of the children:</p>

  <p><strong>Feature: Outlook</strong> (Sunny / Overcast / Rain)</p>
  ${table(
    ["Split", "Samples", "Distribution", "Entropy"],
    [
      ["Sunny", "5", "2Y, 3N", "0.971"],
      ["Overcast", "4", "4Y, 0N", "0.000 (pure!)"],
      ["Rain", "5", "3Y, 2N", "0.971"],
    ]
  )}
  ${math("Entropy_{weighted}(Outlook) = \\frac{5}{14}(0.971) + \\frac{4}{14}(0) + \\frac{5}{14}(0.971) = 0.693")}
  ${math("\\text{Information Gain}(Outlook) = 0.940 - 0.693 = \\textbf{0.247}")}

  <p><strong>Feature: Wind</strong> (Weak / Strong)</p>
  ${table(
    ["Split", "Samples", "Distribution", "Entropy"],
    [
      ["Weak", "8", "6Y, 2N", "0.811"],
      ["Strong", "6", "3Y, 3N", "1.000"],
    ]
  )}
  ${math("Entropy_{weighted}(Wind) = \\frac{8}{14}(0.811) + \\frac{6}{14}(1.0) = 0.892")}
  ${math("\\text{Information Gain}(Wind) = 0.940 - 0.892 = \\textbf{0.048}")}

  <p>Similarly compute for Temperature (Gain = 0.029) and Humidity (Gain = 0.152).</p>

  <h4>Step 3 — Pick the feature with highest Information Gain</h4>
  ${table(
    ["Feature", "Information Gain", "Selected?"],
    [
      ["<strong>Outlook</strong>", "<strong>0.247</strong>", "<strong>Yes — highest gain</strong>"],
      ["Humidity", "0.152", "No"],
      ["Wind", "0.048", "No"],
      ["Temperature", "0.029", "No"],
    ]
  )}
  <p>Outlook is selected as the root split because it produces the most homogeneous children.</p>

  <h4>Step 4 — Recurse on each child node</h4>
  <p>The <strong>Overcast</strong> branch is already pure (4Y, 0N) — it becomes a leaf predicting "Yes".</p>
  <p>For the <strong>Sunny</strong> branch (2Y, 3N) and <strong>Rain</strong> branch (3Y, 2N), repeat Steps 1-3: compute the entropy of the child node, evaluate every remaining feature, pick the best split. Continue until:</p>
  <ul>
    <li>A node is <strong>pure</strong> (all same class) → leaf node</li>
    <li><strong>max_depth</strong> is reached → leaf predicts majority class</li>
    <li><strong>min_samples_split</strong> threshold not met → leaf</li>
    <li>No feature provides positive Information Gain → leaf</li>
  </ul>

  <h3>How numerical features get split</h3>
  <p>For a feature like "Temperature = [65, 69, 70, 71, 72, 75, 80, 81, 83, 85]":</p>
  <ol>
    <li><strong>Sort</strong> the values: 65, 69, 70, 71, 72, 75, 80, 81, 83, 85</li>
    <li><strong>Compute midpoints</strong> between consecutive values: 67, 69.5, 70.5, 71.5, 73.5, 77.5, 80.5, 82, 84</li>
    <li><strong>For each midpoint</strong>, split into ≤ threshold and > threshold</li>
    <li><strong>Compute Gini/Entropy</strong> for each split:
      <ul>
        <li>Split at 67: Left=[65] → 1Y,0N; Right=[69..85] → 8Y,5N → compute weighted Gini</li>
        <li>Split at 73.5: Left=[65..72] → 4Y,1N; Right=[75..85] → 5Y,4N → compute weighted Gini</li>
        <li>...try all 9 midpoints</li>
      </ul>
    </li>
    <li><strong>Pick the threshold</strong> with the lowest weighted impurity</li>
  </ol>
  <p>The best numerical threshold is then compared against all other features' gains to decide the overall best split.</p>

  ${py(`# See exactly what the tree learned
from sklearn.tree import DecisionTreeClassifier, export_text

dt = DecisionTreeClassifier(max_depth=3, criterion='gini', random_state=42)
dt.fit(X_train, y_train)

# Print the tree as text rules
print(export_text(dt, feature_names=list(X.columns)))
# |--- worst radius <= 16.80
# |   |--- worst concave points <= 0.14
# |   |   |--- class: 1 (benign)
# |   |--- worst concave points > 0.14
# |   |   |--- class: 0 (malignant)
# |--- worst radius > 16.80
# |   |--- class: 0 (malignant)

# Feature importance = total Gini reduction across all splits
for name, imp in sorted(zip(X.columns, dt.feature_importances_),
                         key=lambda x: x[1], reverse=True)[:5]:
    print(f"  {name}: {imp:.4f}")
# This shows which features the tree relies on most`)}

  ${warn("Gini vs Entropy — which to use?", `<p><strong>Gini</strong> is the default in sklearn and is computationally faster (no log). <strong>Entropy</strong> is slightly more sensitive to class imbalance. In practice, they produce nearly identical trees 95% of the time. Use Gini unless you have a specific reason for Entropy.</p>`)}
`);

// ============================================================
// DECISION TREE REGRESSOR — Variance Reduction & Leaf Prediction
// ============================================================

addTheory('p3-dt-reg', `
  <h2>Deep Theory: How Regression Trees Split</h2>
  <p>Classification trees split to maximize purity (Gini/Entropy). Regression trees split to <strong>minimize variance</strong> (MSE) — make each child node's target values as similar as possible.</p>

  <h3>Splitting criterion: Variance Reduction</h3>
  <p>At each node, for every candidate split, compute:</p>
  ${math("\\text{Variance Reduction} = Var(parent) - \\left[\\frac{n_{left}}{n} \\cdot Var(left) + \\frac{n_{right}}{n} \\cdot Var(right)\\right]")}
  <p>The split with the <strong>highest variance reduction</strong> wins.</p>

  <h3>Worked example</h3>
  <p>Dataset: 5 houses with prices [200K, 220K, 500K, 480K, 510K]. Feature: "Size" = [800, 900, 1800, 2000, 2100] sq ft.</p>

  <h4>Step 1 — Root node variance</h4>
  <p>Mean price = (200+220+500+480+510)/5 = 382K</p>
  ${math("Var(root) = \\frac{1}{5}[(200-382)^2 + (220-382)^2 + (500-382)^2 + (480-382)^2 + (510-382)^2] = 18,\\!376")}

  <h4>Step 2 — Try splitting at Size ≤ 1350</h4>
  <p>Left: [200K, 220K] → Mean = 210K, Var = 100</p>
  <p>Right: [500K, 480K, 510K] → Mean = 496.7K, Var = 156</p>
  ${math("Var_{weighted} = \\frac{2}{5}(100) + \\frac{3}{5}(156) = 40 + 93.6 = 133.6")}
  ${math("\\text{Variance Reduction} = 18,\\!376 - 133.6 = \\textbf{18,\\!242.4} \\text{ (huge reduction!)}")}

  <h4>Step 3 — Leaf prediction = mean of target values</h4>
  <p>Once splitting stops, each leaf predicts the <strong>average</strong> of all training target values in that leaf.</p>
  <ul>
    <li>Left leaf (small houses): predicts <strong>210K</strong> (mean of 200, 220)</li>
    <li>Right leaf (large houses): predicts <strong>496.7K</strong> (mean of 500, 480, 510)</li>
  </ul>
  <p>For a new house with Size=1900 → falls in right leaf → predicted price = <strong>496.7K</strong>.</p>

  ${py(`from sklearn.tree import DecisionTreeRegressor, export_text

dt_reg = DecisionTreeRegressor(max_depth=3, min_samples_leaf=5, random_state=42)
dt_reg.fit(X_train, y_train)
y_pred = dt_reg.predict(X_test)

# See the split rules
print(export_text(dt_reg, feature_names=list(X.columns), decimals=2))

# Each leaf shows "value = [mean_prediction]"
# The tree splits where variance reduction is highest

from sklearn.metrics import mean_squared_error, r2_score
print(f"RMSE: {mean_squared_error(y_test, y_pred, squared=False):.4f}")
print(f"R²:   {r2_score(y_test, y_pred):.4f}")`)}

  ${tip("Why DT Regressor predictions are step-functions", `<p>A regression tree creates rectangular regions in feature space, each with a constant prediction (the leaf mean). The prediction surface looks like a staircase, not a smooth curve. This is why single trees are poor at extrapolation — they can only predict values they've seen in training leaves. Ensemble methods (Random Forest, XGBoost) smooth this out.</p>`)}
`);

// ============================================================
// RANDOM FOREST — The Two Sources of Randomness
// ============================================================

addTheory('p4-rf-cls', `
  <h3>The two sources of randomness</h3>
  <p>Random Forest introduces randomness in two ways to decorrelate the trees:</p>
  <ol>
    <li><strong>Row sampling (Bootstrap):</strong> Each tree trains on a random ~63.2% of rows, drawn <em>with replacement</em>. Some rows appear multiple times, others are left out (OOB samples).</li>
    <li><strong>Feature sampling:</strong> At each split, only a random subset of features is considered:
      <ul>
        <li>Classification: \\(\\sqrt{p}\\) features (e.g., 30 features → consider only ~5 per split)</li>
        <li>Regression: \\(p/3\\) features</li>
      </ul>
    </li>
  </ol>
  <p>Without feature sampling, every tree would pick the same dominant feature for the first split. Feature sampling forces trees to explore different features, making the ensemble diverse.</p>

  <h3>Why Random Forest reduces overfitting</h3>
  ${table(
    ["Model", "Bias", "Variance", "Overfitting risk"],
    [
      ["Single Decision Tree", "Low", "High", "High — memorizes noise"],
      ["Bagging (same features)", "Low", "Medium", "Medium — trees still correlated"],
      ["<strong>Random Forest</strong>", "Low", "Low", "Low — decorrelated trees average out noise"],
    ]
  )}
  <p>A single tree overfits (train accuracy 100%, test accuracy drops). Random Forest averages hundreds of slightly different trees — the noise cancels out, while the signal reinforces. This is the bias-variance tradeoff in action: variance drops dramatically with minimal increase in bias.</p>
`);

// ============================================================
// RANDOM FOREST REGRESSION — same randomness explanation
// ============================================================

addTheory('p3-rf-reg', `
  <h3>Random Forest for Regression</h3>
  <p>Same algorithm as RF classification, but each tree is a <strong>Decision Tree Regressor</strong> (splits by variance reduction, leaves predict mean). The final prediction is the <strong>average</strong> of all trees' predictions.</p>

  ${py(`from sklearn.ensemble import RandomForestRegressor

rf_reg = RandomForestRegressor(
    n_estimators=200,       # number of trees
    max_depth=None,          # let trees grow deep
    max_features='sqrt',     # random feature subset per split
    min_samples_leaf=5,
    oob_score=True,          # out-of-bag evaluation
    random_state=42,
    n_jobs=-1                # parallelize
)
rf_reg.fit(X_train, y_train)
print(f"OOB R²: {rf_reg.oob_score_:.4f}")
print(f"Test R²: {rf_reg.score(X_test, y_test):.4f}")
print(f"Test RMSE: {mean_squared_error(y_test, rf_reg.predict(X_test), squared=False):.4f}")`)}
`);

// ============================================================
// XGBOOST — Sequential Boosting Concept
// ============================================================

addTheory('p4-xgb-cls', `
  <h3>Bagging vs Boosting — the key difference</h3>
  ${table(
    ["", "Bagging (Random Forest)", "Boosting (XGBoost)"],
    [
      ["Tree training", "Parallel — each tree is independent", "Sequential — each tree learns from the previous tree's errors"],
      ["What each tree fits", "Original target values", "Residuals (errors) of the current ensemble"],
      ["Combination", "Average / majority vote", "Weighted sum with learning rate"],
      ["Main benefit", "Reduces variance (averaging)", "Reduces bias (correcting errors)"],
      ["Overfitting", "Hard to overfit", "Can overfit without regularization"],
    ]
  )}

  <p><strong>Boosting intuition:</strong> Think of it as a student taking a test. After the first attempt (tree 1), the teacher points out which questions were wrong. The student studies those specific questions harder (tree 2 focuses on residuals). After each round, the student gets better at the hard questions. The final grade is the sum of all improvements.</p>

  <h3>Weak learner → Strong learner</h3>
  <p>Each individual tree in XGBoost is intentionally kept <strong>shallow</strong> (weak learner — low accuracy alone). But when hundreds of weak learners are combined sequentially, each correcting the previous ensemble's mistakes, the result is a strong learner with high accuracy.</p>
`);

// ============================================================
// SVM — Hinge Loss
// ============================================================

addTheory('p4-svm', `
  <h3>Hinge Loss — the SVM loss function</h3>
  <p>SVM uses hinge loss instead of log-loss (logistic regression) or MSE (linear regression):</p>
  ${math("L = \\max(0,\\; 1 - y_i \\cdot f(x_i))")}
  <p>Where \\(y_i \\in \\{-1, +1\\}\\) and \\(f(x) = W^Tx + b\\).</p>
  <ul>
    <li>If the point is correctly classified AND far from the boundary (\\(y_i \\cdot f(x_i) \\geq 1\\)): <strong>loss = 0</strong></li>
    <li>If the point is on the margin or misclassified (\\(y_i \\cdot f(x_i) < 1\\)): <strong>loss = 1 - y_i \\cdot f(x_i)</strong></li>
  </ul>
  <p>The full SVM objective combines hinge loss with margin maximization:</p>
  ${math("\\min_{W,b} \\;\\frac{1}{2}\\|W\\|^2 + C\\sum_{i=1}^{n}\\max(0,\\; 1 - y_i(W^Tx_i + b))")}
  <p>The first term maximizes the margin. The second term (weighted by C) penalizes violations. This is why C controls the bias-variance tradeoff.</p>
`);

// ============================================================
// K-MEANS — Random Initialization Trap
// ============================================================

addTheory('p5-kmeans', `
  <h3>The random initialization trap</h3>
  <p>If initial centroids are placed poorly, K-Means can converge to a <strong>suboptimal solution</strong>:</p>
  <ul>
    <li>Two centroids might start in the same natural cluster → one cluster gets split, another gets merged</li>
    <li>The algorithm converges (centroids stop moving) but the clusters are wrong</li>
    <li>Different random starts → different final clusters</li>
  </ul>

  <h3>K-Means++ solves this</h3>
  <p>K-Means++ is a smart initialization strategy (default in sklearn):</p>
  <ol>
    <li>Pick the first centroid uniformly at random</li>
    <li>For each remaining point, compute distance to the nearest existing centroid</li>
    <li>Pick the next centroid with probability proportional to distance² (farther points more likely)</li>
    <li>Repeat until K centroids are placed</li>
  </ol>
  <p>This spreads centroids apart, avoiding the initialization trap. sklearn uses <code>init='k-means++'</code> by default and runs <code>n_init=10</code> different initializations, keeping the best one.</p>

  ${py(`# K-Means with explicit initialization control
from sklearn.cluster import KMeans

# Default: K-Means++ with 10 random restarts
km = KMeans(n_clusters=3, init='k-means++', n_init=10, random_state=42)

# Compare: random init (prone to the trap)
km_random = KMeans(n_clusters=3, init='random', n_init=1, random_state=42)

# See how inertia differs
km.fit(X_scaled)
km_random.fit(X_scaled)
print(f"K-Means++ inertia: {km.inertia_:.1f}")
print(f"Random init inertia: {km_random.inertia_:.1f}")
# K-Means++ should give equal or lower inertia (better clustering)`)}
`);

// ============================================================
// LOGISTIC REGRESSION — Decision Boundary & Threshold
// ============================================================

addTheory('p4-logistic', `
  <h3>Decision boundary and threshold</h3>
  <p>The sigmoid outputs a probability. The <strong>default threshold is 0.5</strong>:</p>
  <ul>
    <li>\\(\\hat{y} \\geq 0.5\\) → predict class 1</li>
    <li>\\(\\hat{y} < 0.5\\) → predict class 0</li>
  </ul>
  <p>But 0.5 is not always optimal. For <strong>medical diagnosis</strong> (where missing a disease is dangerous), lower the threshold to 0.3 to catch more positives (higher recall, lower precision). For <strong>spam detection</strong> (where false alarms are costly), raise it to 0.7 (higher precision, lower recall).</p>

  ${py(`# Threshold tuning
from sklearn.metrics import precision_recall_curve

y_proba = lr.predict_proba(X_test_s)[:, 1]

# Find the best threshold for F1 score
precisions, recalls, thresholds = precision_recall_curve(y_test, y_proba)
f1_scores = 2 * precisions * recalls / (precisions + recalls + 1e-8)
best_idx = f1_scores.argmax()
best_threshold = thresholds[best_idx]
print(f"Optimal threshold: {best_threshold:.3f}")
print(f"F1 at optimal: {f1_scores[best_idx]:.4f}")

# Apply custom threshold
y_pred_custom = (y_proba >= best_threshold).astype(int)`)}

  <h3>Why the cost function must be convex</h3>
  <p>If you use MSE with sigmoid, the cost surface has many local minima — gradient descent gets stuck. The log-loss (binary cross-entropy) is specifically designed to be <strong>convex</strong> when combined with sigmoid, guaranteeing a single global minimum that gradient descent always finds.</p>
`);

// ============================================================
// GRADIENT BOOSTING REGRESSION — how it differs
// ============================================================

addTheory('p3-xgb-reg', `
  <h3>Gradient Boosting for Regression — step by step</h3>
  <ol>
    <li><strong>Base prediction:</strong> Start with the mean of all target values: \\(F_0 = \\bar{y}\\)</li>
    <li><strong>Compute residuals:</strong> \\(r_i = y_i - F_0\\) for every training sample</li>
    <li><strong>Fit tree to residuals:</strong> Train a shallow decision tree on the residuals (not the original targets)</li>
    <li><strong>Update predictions:</strong> \\(F_1(x) = F_0 + \\eta \\cdot \\text{tree}_1(x)\\) where \\(\\eta\\) is the learning rate</li>
    <li><strong>Repeat:</strong> Compute new residuals from \\(F_1\\), fit tree 2 to those, add to ensemble</li>
    <li><strong>Final prediction:</strong> \\(F_M(x) = \\bar{y} + \\eta \\cdot \\text{tree}_1(x) + \\eta \\cdot \\text{tree}_2(x) + \\ldots\\)</li>
  </ol>
  <p>Each tree corrects the remaining error. With learning rate 0.1, it takes ~100-300 trees to converge, but generalizes better than learning rate 1.0 with fewer trees.</p>
`);

console.log('[content-gaps] Gap fixes registered');
})();
