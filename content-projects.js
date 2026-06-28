// ============================================================
// ML Complete Reference — Big Projects for Every Section
// Adds a resume-worthy capstone project block to every section
// that didn't already have one.
// ============================================================

(function () {

// Helper: append a project block to an existing section
function addProject(sectionId, projectHTML) {
  const s = CONTENT.sections[sectionId];
  if (!s) { console.warn('[projects] section not found:', sectionId); return; }
  s.html += projectHTML;
}

// ============================================================
// Shared project card builder
// ============================================================
function projectCard(opts) {
  // opts: { title, tagline, tags[], difficulty, time, dataset, goal, why, parts[], bonus }
  const tagHtml = (opts.tags || []).map(t =>
    `<span style="display:inline-block;padding:2px 10px;border-radius:20px;background:var(--accent-soft);color:var(--accent);font-size:11px;font-weight:600;margin-right:6px">${t}</span>`
  ).join('');

  const partsHtml = (opts.parts || []).map((p, i) =>
    `<div style="display:flex;gap:14px;margin-bottom:20px;align-items:flex-start">
      <div style="min-width:32px;height:32px;border-radius:50%;background:var(--accent);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:13px">${i+1}</div>
      <div>
        <div style="font-weight:700;font-size:14px;color:var(--text)">${p.title}</div>
        <div style="font-size:13px;color:var(--text-muted);margin-top:4px;line-height:1.6">${p.desc}</div>
        ${p.code ? `<div class="code-block" style="margin-top:10px"><div class="code-block-header"><span class="code-lang">python</span></div><pre><code class="language-python">${p.code}</code></pre></div>` : ''}
      </div>
    </div>`
  ).join('');

  return `
  <div style="margin-top:48px;padding:28px 30px;border:2px solid var(--accent);border-radius:16px;background:var(--surface)">
    <div style="display:flex;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;gap:12px;margin-bottom:18px">
      <div>
        <div style="font-size:11px;font-weight:700;letter-spacing:1.5px;color:var(--accent);text-transform:uppercase;margin-bottom:6px">★ Section Capstone Project</div>
        <h2 style="margin:0 0 6px;font-size:22px">${opts.title}</h2>
        <p style="margin:0;color:var(--text-muted);font-size:14px">${opts.tagline}</p>
      </div>
      <div style="text-align:right;font-size:12px;color:var(--text-muted)">
        <div>⏱ ${opts.time}</div>
        <div style="margin-top:4px">📊 ${opts.dataset}</div>
        <div style="margin-top:4px">🎯 ${opts.difficulty}</div>
      </div>
    </div>
    <div style="margin-bottom:16px">${tagHtml}</div>
    <div style="padding:14px 18px;background:var(--accent-soft);border-radius:10px;margin-bottom:24px;font-size:13.5px;line-height:1.7">
      <strong>Goal:</strong> ${opts.goal}
    </div>
    <div style="padding:12px 16px;background:rgba(255,200,50,0.08);border-left:3px solid var(--accent-2);border-radius:0 8px 8px 0;margin-bottom:24px;font-size:13px;line-height:1.6">
      <strong>Why recruiters care:</strong> ${opts.why}
    </div>
    <div>${partsHtml}</div>
    ${opts.bonus ? `<div style="margin-top:20px;padding:12px 16px;border-radius:8px;background:var(--surface-2);font-size:13px"><strong>🚀 Stretch goal:</strong> ${opts.bonus}</div>` : ''}
  </div>`;
}

// ============================================================
// PART 0 — MATH FOR ML  (add to each lesson section)
// ============================================================

addProject('p0-linalg', projectCard({
  title: 'PCA Image Compressor — Linear Algebra in Action',
  tagline: 'Compress and reconstruct images using nothing but matrix operations and eigendecomposition.',
  tags: ['SVD', 'Eigendecomposition', 'NumPy', 'Image Processing'],
  difficulty: 'Intermediate',
  time: '3–4 hours',
  dataset: 'Any JPEG/PNG image (or sklearn digits dataset)',
  goal: 'Build a from-scratch image compression system using SVD that shows the visual quality vs compression tradeoff — the same math behind JPEG compression and collaborative filtering.',
  why: 'This proves you understand SVD beyond a definition. When an interviewer asks about dimensionality reduction or matrix factorization, you can say: "I built an image compressor with SVD and showed how keeping k singular values affects reconstruction error." That is concrete.',
  parts: [
    {
      title: 'Implement SVD compression from scratch',
      desc: 'Use numpy.linalg.svd to decompose an image matrix. Reconstruct using only the top k singular values. Measure compression ratio and RMSE.',
      code: `import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from sklearn.datasets import load_digits

# Load digits dataset (8x8 grayscale images)
digits = load_digits()
img = digits.images[0]  # shape (8, 8)

# For a real image, convert to grayscale first:
# from PIL import Image
# img = np.array(Image.open('photo.jpg').convert('L')).astype(float)

# SVD decomposition
U, S, Vt = np.linalg.svd(img, full_matrices=False)
print(f"U: {U.shape}, S: {S.shape}, Vt: {Vt.shape}")
print(f"Singular values: {S.round(2)}")

def compress(img, k):
    U, S, Vt = np.linalg.svd(img, full_matrices=False)
    # Keep only top k components
    compressed = U[:, :k] @ np.diag(S[:k]) @ Vt[:k, :]
    return compressed

def compression_ratio(original, k):
    m, n = original.shape
    # Original: m*n values. Compressed: k*(m+n+1) values
    original_size = m * n
    compressed_size = k * (m + n + 1)
    return original_size / compressed_size

def rmse(original, reconstructed):
    return np.sqrt(((original - reconstructed)**2).mean())

# Compare different k values
fig, axes = plt.subplots(2, 4, figsize=(14, 7))
k_values = [1, 2, 3, 4, 5, 6, 7, 8]  # for 8x8 image
for i, k in enumerate(k_values):
    reconstructed = compress(img, k)
    ratio = compression_ratio(img, k)
    error = rmse(img, reconstructed)
    axes[i//4, i%4].imshow(reconstructed, cmap='gray')
    axes[i//4, i%4].set_title(f'k={k}\\nRatio: {ratio:.1f}x\\nRMSE: {error:.3f}', fontsize=9)
    axes[i//4, i%4].axis('off')
plt.tight_layout()
plt.savefig('/tmp/svd_compression.png', dpi=150)

# For a LARGER image - show the variance explained
def variance_explained(img):
    _, S, _ = np.linalg.svd(img, full_matrices=False)
    variance = S**2
    total = variance.sum()
    cumulative = np.cumsum(variance) / total
    return cumulative

cum_var = variance_explained(img)
for k in range(len(S)):
    print(f"k={k+1}: {cum_var[k]*100:.1f}% variance explained")`
    },
    {
      title: 'Covariance matrix and eigenfaces',
      desc: 'Apply PCA to the full digits dataset. Visualize the top 10 "eigendigits" — the directions of maximum variance. Show how you can reconstruct any digit as a weighted sum of eigendigits.',
      code: `from sklearn.datasets import load_digits
from sklearn.preprocessing import StandardScaler
import numpy as np

digits = load_digits()
X = digits.data.astype(float)  # (1797, 64) — each row is an 8x8 image flattened

# Center the data
X_centered = X - X.mean(axis=0)

# Covariance matrix (the PCA way)
cov = (X_centered.T @ X_centered) / (len(X) - 1)  # (64, 64)

# Eigendecomposition
eigenvalues, eigenvectors = np.linalg.eig(cov)
# Sort descending
idx = np.argsort(eigenvalues)[::-1]
eigenvalues = eigenvalues[idx].real
eigenvectors = eigenvectors[:, idx].real

print(f"Covariance matrix shape: {cov.shape}")
print(f"Top 5 eigenvalues: {eigenvalues[:5].round(2)}")
print(f"Variance explained by top 10: {eigenvalues[:10].sum()/eigenvalues.sum()*100:.1f}%")

# Project data onto top k components (this IS PCA)
k = 20
X_pca = X_centered @ eigenvectors[:, :k]  # (1797, 20)

# Reconstruct from k components
X_reconstructed = X_pca @ eigenvectors[:, :k].T + X.mean(axis=0)

# Reconstruction error per k
for k in [2, 5, 10, 20, 40, 64]:
    X_proj = X_centered @ eigenvectors[:, :k]
    X_rec  = X_proj @ eigenvectors[:, :k].T + X.mean(axis=0)
    err = np.sqrt(((X - X_rec)**2).mean())
    print(f"k={k:2d}: RMSE = {err:.3f}")`
    },
    {
      title: 'Compare with sklearn PCA (verify your math)',
      desc: 'Run sklearn.decomposition.PCA on the same data and confirm the transformed values match your manual eigendecomposition within floating point tolerance.',
      code: `from sklearn.decomposition import PCA
from sklearn.datasets import load_digits
import numpy as np

X = load_digits().data.astype(float)
X_c = X - X.mean(axis=0)

# Sklearn PCA
pca = PCA(n_components=20)
X_sk = pca.fit_transform(X_c)

# Your PCA
cov = X_c.T @ X_c / (len(X)-1)
vals, vecs = np.linalg.eig(cov)
idx = np.argsort(vals)[::-1]
vecs = vecs[:, idx].real
X_manual = X_c @ vecs[:, :20]

# They should be equal (up to sign flips in eigenvectors)
print("Max abs difference:", np.abs(np.abs(X_sk) - np.abs(X_manual)).max())
print("Results match:", np.allclose(np.abs(X_sk), np.abs(X_manual), atol=1e-6))`
    }
  ],
  bonus: 'Apply to a real color image by decomposing each RGB channel separately. Plot the "scree plot" of singular values to show the elbow. Compare compression quality to Python\'s PIL JPEG compression at equivalent file sizes.'
}));

addProject('p0-calculus', projectCard({
  title: 'Gradient Descent Visualizer — Optimizing a Real Loss Surface',
  tagline: 'Build an interactive optimizer that shows exactly how learning rate and momentum affect convergence on a real non-convex loss landscape.',
  tags: ['Gradient Descent', 'Adam', 'SGD', 'Optimization', 'NumPy'],
  difficulty: 'Intermediate',
  time: '3–4 hours',
  dataset: 'Synthetic + sklearn California Housing',
  goal: 'Implement SGD, SGD with momentum, RMSProp, and Adam from scratch. Compare their convergence on both a 2D loss surface (so you can visualize the path) and a real regression task. Plot the loss curves and show why Adam almost always wins in practice.',
  why: 'Every ML interview eventually asks "what optimizer do you use and why?" Being able to say you implemented all four from scratch, plotted their trajectories, and can explain the momentum/adaptive-lr difference puts you in the top 5% of candidates.',
  parts: [
    {
      title: 'Implement 4 optimizers from scratch',
      desc: 'SGD, SGD+Momentum, RMSProp, Adam — all pure NumPy. Then run them on a linear regression problem.',
      code: `import numpy as np

class SGD:
    def __init__(self, lr=0.01):
        self.lr = lr
    def step(self, params, grads):
        return [p - self.lr * g for p, g in zip(params, grads)]

class SGDMomentum:
    def __init__(self, lr=0.01, momentum=0.9):
        self.lr = lr; self.momentum = momentum; self.v = None
    def step(self, params, grads):
        if self.v is None:
            self.v = [np.zeros_like(p) for p in params]
        self.v = [self.momentum*v + self.lr*g for v,g in zip(self.v, grads)]
        return [p - v for p, v in zip(params, self.v)]

class RMSProp:
    def __init__(self, lr=0.01, rho=0.9, eps=1e-8):
        self.lr=lr; self.rho=rho; self.eps=eps; self.s=None
    def step(self, params, grads):
        if self.s is None:
            self.s = [np.zeros_like(p) for p in params]
        self.s = [self.rho*s + (1-self.rho)*g**2 for s,g in zip(self.s, grads)]
        return [p - self.lr*g/(np.sqrt(s)+self.eps)
                for p,g,s in zip(params, grads, self.s)]

class Adam:
    def __init__(self, lr=0.001, b1=0.9, b2=0.999, eps=1e-8):
        self.lr=lr; self.b1=b1; self.b2=b2; self.eps=eps
        self.m=None; self.v=None; self.t=0
    def step(self, params, grads):
        if self.m is None:
            self.m=[np.zeros_like(p) for p in params]
            self.v=[np.zeros_like(p) for p in params]
        self.t += 1
        self.m=[self.b1*m+(1-self.b1)*g for m,g in zip(self.m,grads)]
        self.v=[self.b2*v+(1-self.b2)*g**2 for v,g in zip(self.v,grads)]
        m_hat=[m/(1-self.b1**self.t) for m in self.m]
        v_hat=[v/(1-self.b2**self.t) for v in self.v]
        return [p-self.lr*mh/(np.sqrt(vh)+self.eps)
                for p,mh,vh in zip(params,m_hat,v_hat)]

# Test on linear regression: y = 3x1 - 2x2 + 1
np.random.seed(42)
n = 200
X = np.random.randn(n, 2)
y = 3*X[:,0] - 2*X[:,1] + 1 + 0.2*np.random.randn(n)
X_b = np.column_stack([np.ones(n), X])

def loss_and_grad(theta, X, y):
    pred = X @ theta
    err  = pred - y
    loss = (err**2).mean()
    grad = 2/len(y) * X.T @ err
    return loss, grad

results = {}
for name, opt in [('SGD', SGD(0.05)), ('Momentum', SGDMomentum(0.05)),
                   ('RMSProp', RMSProp(0.05)), ('Adam', Adam(0.001))]:
    theta = np.zeros(3)
    losses = []
    for _ in range(300):
        loss, grad = loss_and_grad(theta, X_b, y)
        losses.append(loss)
        [theta] = opt.step([theta], [grad])
    results[name] = losses
    print(f"{name:12s}: final loss={losses[-1]:.6f}, theta={theta.round(3)}")`
    },
    {
      title: 'Visualize convergence paths on a 2D loss surface',
      desc: 'Use a 2D Rosenbrock function (a classic hard optimization problem) and plot each optimizer\'s path from start to minimum.',
      code: `import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

# Rosenbrock function: f(x,y) = (1-x)^2 + 100(y-x^2)^2
# Minimum at (1,1). Notoriously hard — narrow curved valley
def rosenbrock(xy):
    x, y = xy
    return (1-x)**2 + 100*(y-x**2)**2

def rosenbrock_grad(xy):
    x, y = xy
    dfdx = -2*(1-x) - 400*x*(y-x**2)
    dfdy = 200*(y-x**2)
    return np.array([dfdx, dfdy])

# Plot the loss landscape
x_range = np.linspace(-2, 2, 300)
y_range = np.linspace(-1, 3, 300)
X_grid, Y_grid = np.meshgrid(x_range, y_range)
Z = (1-X_grid)**2 + 100*(Y_grid-X_grid**2)**2

fig, axes = plt.subplots(1, 2, figsize=(14, 6))

# Contour plot
ax = axes[0]
ax.contourf(X_grid, Y_grid, np.log(Z+1), levels=40, cmap='RdYlBu_r', alpha=0.8)
ax.contour(X_grid, Y_grid, np.log(Z+1), levels=20, colors='black', alpha=0.2, linewidths=0.5)
ax.plot(1, 1, 'w*', markersize=15, label='Global min (1,1)')

# Run each optimizer and plot its path
configs = [
    ('SGD',      SGD(lr=0.001),          'steelblue'),
    ('Momentum', SGDMomentum(lr=0.001),  'coral'),
    ('RMSProp',  RMSProp(lr=0.001),      'seagreen'),
    ('Adam',     Adam(lr=0.01),          'gold'),
]

start = np.array([-1.5, 2.0])
loss_curves = {}

for name, opt, color in configs:
    xy = start.copy()
    path = [xy.copy()]
    losses = []
    for _ in range(1000):
        g = rosenbrock_grad(xy)
        losses.append(rosenbrock(xy))
        [xy] = opt.step([xy], [g])
        path.append(xy.copy())
    path = np.array(path)
    loss_curves[name] = losses
    ax.plot(path[:,0], path[:,1], color=color, lw=1.5, alpha=0.8, label=name)
    ax.plot(path[-1,0], path[-1,1], 'o', color=color, markersize=8)

ax.set_xlim(-2, 2); ax.set_ylim(-1, 3)
ax.set_title('Optimizer Paths on Rosenbrock Surface')
ax.legend(fontsize=9)

# Loss curves
ax2 = axes[1]
for (name, _, color), losses in zip(configs, loss_curves.values()):
    ax2.plot(losses, color=color, label=name, lw=2)
ax2.set_yscale('log')
ax2.set_xlabel('Iteration'); ax2.set_ylabel('Loss (log scale)')
ax2.set_title('Convergence Speed'); ax2.legend()

plt.tight_layout()
plt.savefig('/tmp/optimizer_comparison.png', dpi=150, bbox_inches='tight')
print("Saved to /tmp/optimizer_comparison.png")`
    }
  ],
  bonus: 'Add learning rate scheduling (cosine annealing, step decay) and show how it improves Adam on the real regression task. Add gradient clipping and show it prevents explosions on the Rosenbrock function.'
}));

addProject('p0-prob', projectCard({
  title: 'A/B Test Analyzer — Statistical Decisions from Real Data',
  tagline: 'Build a complete A/B testing framework from scratch: power analysis, t-tests, bootstrap confidence intervals, and Bayesian inference.',
  tags: ['Statistics', 'Hypothesis Testing', 'Bootstrap', 'Bayesian', 'SciPy'],
  difficulty: 'Intermediate',
  time: '3–4 hours',
  dataset: 'Simulated e-commerce conversion data (realistic)',
  goal: 'Build the exact tool a data scientist uses to decide whether a product change is real or noise. Implement frequentist (t-test, chi-square) AND Bayesian (Beta distribution posterior) approaches. Show when they agree and when they disagree.',
  why: 'A/B testing is THE most common data science task at product companies. Uber, Airbnb, Netflix run hundreds of A/B tests simultaneously. Being able to implement and explain both frequentist and Bayesian approaches shows senior-level statistical thinking.',
  parts: [
    {
      title: 'Power analysis — how many users do you need?',
      desc: 'Before running any experiment, calculate the required sample size. This is what separates data scientists from data analysts.',
      code: `import numpy as np
from scipy import stats

def sample_size_for_proportions(p1, p2, alpha=0.05, power=0.80):
    """
    Calculate required sample size per group for a two-proportion z-test.
    p1: baseline conversion rate
    p2: expected new conversion rate  
    alpha: significance level (false positive rate)
    power: 1 - beta (false negative rate)
    """
    # Effect size (Cohen's h)
    effect_size = 2 * np.arcsin(np.sqrt(p1)) - 2 * np.arcsin(np.sqrt(p2))
    effect_size = abs(effect_size)
    
    # z-scores for alpha and beta
    z_alpha = stats.norm.ppf(1 - alpha/2)  # two-tailed
    z_beta  = stats.norm.ppf(power)
    
    n = ((z_alpha + z_beta) / effect_size) ** 2
    return int(np.ceil(n))

# Real scenario: current conversion = 5%, want to detect +1% lift
p_control = 0.05   # 5% baseline
p_variants = [0.055, 0.06, 0.07, 0.08, 0.10]

print("Required sample size per group:")
print(f"{'Target rate':>12} {'Lift':>8} {'N per group':>12} {'Total N':>10}")
print("-" * 45)
for p_treat in p_variants:
    lift = (p_treat - p_control) / p_control * 100
    n = sample_size_for_proportions(p_control, p_treat)
    print(f"{p_treat:>12.1%} {lift:>7.0f}% {n:>12,} {2*n:>10,}")`
    },
    {
      title: 'Frequentist analysis — t-test and chi-square',
      desc: 'Simulate an A/B test and analyze with proper statistical tests. Include multiple comparison correction for testing multiple variants.',
      code: `import numpy as np
from scipy import stats

np.random.seed(42)

# Simulate e-commerce A/B test
# Control: 5% conversion, 10,000 users
# Variant A: 5.8% conversion, 10,000 users  
# Variant B: 4.9% conversion, 10,000 users (no real effect)

n_users = 10_000
control_rate = 0.050
variantA_rate = 0.058   # real 16% lift
variantB_rate = 0.049   # no real effect

control  = np.random.binomial(1, control_rate,  n_users)
variantA = np.random.binomial(1, variantA_rate, n_users)
variantB = np.random.binomial(1, variantB_rate, n_users)

def analyze_ab_test(control, variant, variant_name, alpha=0.05):
    n_c, n_v = len(control), len(variant)
    conv_c = control.mean()
    conv_v = variant.mean()
    lift = (conv_v - conv_c) / conv_c * 100
    
    # Two-proportion z-test (chi-square)
    contingency = np.array([
        [control.sum(), n_c - control.sum()],
        [variant.sum(), n_v - variant.sum()]
    ])
    chi2, p_val, _, _ = stats.chi2_contingency(contingency)
    
    # 95% confidence interval on the lift
    se = np.sqrt(conv_c*(1-conv_c)/n_c + conv_v*(1-conv_v)/n_v)
    diff = conv_v - conv_c
    ci_low  = diff - 1.96 * se
    ci_high = diff + 1.96 * se
    
    significant = p_val < alpha
    print(f"\n--- Variant {variant_name} ---")
    print(f"Control:   {conv_c:.3%} ({control.sum():,}/{n_c:,} conversions)")
    print(f"Variant:   {conv_v:.3%} ({variant.sum():,}/{n_v:,} conversions)")
    print(f"Lift:      {lift:+.1f}%")
    print(f"p-value:   {p_val:.4f} {'← SIGNIFICANT' if significant else '← not significant'}")
    print(f"95% CI:    ({ci_low:+.4f}, {ci_high:+.4f})")
    return p_val

pA = analyze_ab_test(control, variantA, 'A (true effect)')
pB = analyze_ab_test(control, variantB, 'B (no effect)')

# Bonferroni correction for multiple comparisons
print("\n--- Multiple Comparison Correction (Bonferroni) ---")
adjusted_alpha = 0.05 / 2  # testing 2 variants
print(f"Adjusted alpha: {adjusted_alpha:.4f}")
print(f"Variant A significant: {pA < adjusted_alpha}")
print(f"Variant B significant: {pB < adjusted_alpha}")`
    },
    {
      title: 'Bayesian A/B testing — Beta-Binomial model',
      desc: 'Implement the Bayesian approach: update a Beta prior with observed conversions, compute posterior probability that variant beats control.',
      code: `import numpy as np
from scipy import stats

np.random.seed(42)

# Same data as before
n_users = 10_000
control  = np.random.binomial(1, 0.050, n_users)
variantA = np.random.binomial(1, 0.058, n_users)

# Bayesian model:
# Prior: Beta(alpha, beta) — represents our beliefs before seeing data
# Posterior: Beta(alpha + successes, beta + failures)
# This is the conjugate prior for binomial likelihood

def bayesian_ab_test(control, variant, prior_alpha=1, prior_beta=1, n_samples=100_000):
    """
    Returns P(variant > control) using Monte Carlo sampling from posteriors.
    """
    # Posterior parameters (Beta-Binomial conjugacy)
    c_success = control.sum()
    c_fail    = len(control) - c_success
    v_success = variant.sum()
    v_fail    = len(variant) - v_success
    
    # Posterior distributions
    post_control = stats.beta(prior_alpha + c_success, prior_beta + c_fail)
    post_variant = stats.beta(prior_alpha + v_success, prior_beta + v_fail)
    
    # Sample from posteriors
    samples_c = post_control.rvs(n_samples)
    samples_v = post_variant.rvs(n_samples)
    
    # P(variant > control)
    prob_variant_better = (samples_v > samples_c).mean()
    
    # Expected lift and credible interval
    lift_samples = (samples_v - samples_c) / samples_c * 100
    lift_median = np.median(lift_samples)
    ci_95 = np.percentile(lift_samples, [2.5, 97.5])
    
    return {
        'prob_variant_better': prob_variant_better,
        'lift_median': lift_median,
        'ci_95': ci_95,
        'post_control_mean': post_control.mean(),
        'post_variant_mean': post_variant.mean(),
    }

result = bayesian_ab_test(control, variantA)
print("Bayesian A/B Test Results:")
print(f"  Control posterior mean:  {result['post_control_mean']:.4%}")
print(f"  Variant posterior mean:  {result['post_variant_mean']:.4%}")
print(f"  P(Variant > Control):    {result['prob_variant_better']:.1%}")
print(f"  Expected lift:           {result['lift_median']:+.1f}%")
print(f"  95% Credible Interval:   ({result['ci_95'][0]:+.1f}%, {result['ci_95'][1]:+.1f}%)")

# Decision rule
if result['prob_variant_better'] > 0.95:
    print("\nDecision: SHIP IT — 95%+ confidence variant is better")
elif result['prob_variant_better'] < 0.05:
    print("\nDecision: REVERT — 95%+ confidence control is better")
else:
    print(f"\nDecision: COLLECT MORE DATA — only {result['prob_variant_better']:.0%} confident")`
    }
  ],
  bonus: 'Add a "peeking correction" using sequential testing (alpha-spending with O\'Brien-Fleming boundaries) to show why checking results early inflates false positive rates. Build a simulation that proves the uncorrected approach has 40%+ false positive rate when you peek at p-values daily.'
}));

// ============================================================
// NUMPY SECTION PROJECTS
// ============================================================

addProject('pn-arrays', projectCard({
  title: 'NumPy Image Processing Pipeline — Filters from Scratch',
  tagline: 'Build convolution, edge detection, and image augmentation using only NumPy array operations.',
  tags: ['NumPy', 'Computer Vision', 'Convolution', 'Image Processing'],
  difficulty: 'Beginner–Intermediate',
  time: '2–3 hours',
  dataset: 'sklearn digits dataset (no file I/O needed)',
  goal: 'Implement image convolution, Gaussian blur, Sobel edge detection, and data augmentation (flip, rotate, noise) from scratch using only NumPy. This is the math behind CNNs — before you use PyTorch, understand what it does.',
  why: 'CNN interviews always ask "what is a convolution?" The standard answer is abstract. Your answer: "I implemented 2D convolution from scratch — it\'s a sliding dot product between a kernel and a local patch of the image." That is concrete and memorable.',
  parts: [
    {
      title: 'Build 2D convolution from scratch',
      desc: 'Implement the sliding window dot product that is the core of every CNN layer.',
      code: `import numpy as np
from sklearn.datasets import load_digits

digits = load_digits()
img = digits.images[0].astype(float)  # (8, 8) grayscale

def convolve2d(image, kernel, padding=0):
    """
    Manual 2D convolution — this is what torch.nn.Conv2d does internally.
    image:  (H, W)
    kernel: (kH, kW) — the filter
    returns: (H - kH + 1 + 2*padding, W - kW + 1 + 2*padding)
    """
    if padding > 0:
        image = np.pad(image, padding, mode='constant', constant_values=0)
    
    kH, kW = kernel.shape
    H, W   = image.shape
    outH   = H - kH + 1
    outW   = W - kW + 1
    output = np.zeros((outH, outW))
    
    for i in range(outH):
        for j in range(outW):
            # Dot product of kernel with image patch
            patch = image[i:i+kH, j:j+kW]
            output[i, j] = (patch * kernel).sum()
    
    return output

# Sobel edge detection kernels
sobel_x = np.array([[-1, 0, 1],
                     [-2, 0, 2],
                     [-1, 0, 1]])

sobel_y = np.array([[-1, -2, -1],
                     [ 0,  0,  0],
                     [ 1,  2,  1]])

# Gaussian blur kernel
def gaussian_kernel(size, sigma):
    ax = np.linspace(-(size-1)/2, (size-1)/2, size)
    gauss = np.exp(-0.5 * (ax/sigma)**2)
    kernel = np.outer(gauss, gauss)
    return kernel / kernel.sum()

# Apply kernels
blurred  = convolve2d(img, gaussian_kernel(3, 1.0))
edges_x  = convolve2d(img, sobel_x)
edges_y  = convolve2d(img, sobel_y)
edges    = np.sqrt(edges_x**2 + edges_y**2)  # gradient magnitude

print("Original shape:", img.shape)
print("After convolution:", edges.shape)
print("Max edge response:", edges.max().round(3))`
    },
    {
      title: 'Image augmentation pipeline',
      desc: 'Build the data augmentation operations used in deep learning training: flip, rotation, crop, brightness, noise injection.',
      code: `import numpy as np
from sklearn.datasets import load_digits

digits = load_digits()
images = digits.images[:100].astype(float) / 16.0  # normalize to [0,1]

class AugmentationPipeline:
    """Data augmentation using only NumPy"""
    
    def horizontal_flip(self, img):
        return img[:, ::-1]
    
    def add_gaussian_noise(self, img, std=0.05):
        noise = np.random.randn(*img.shape) * std
        return np.clip(img + noise, 0, 1)
    
    def brightness(self, img, factor):
        return np.clip(img * factor, 0, 1)
    
    def random_crop_pad(self, img, max_shift=1):
        """Shift image by up to max_shift pixels in each direction"""
        shift_h = np.random.randint(-max_shift, max_shift+1)
        shift_w = np.random.randint(-max_shift, max_shift+1)
        result = np.roll(np.roll(img, shift_h, axis=0), shift_w, axis=1)
        return result
    
    def mixup(self, img1, img2, alpha=0.2):
        """MixUp augmentation: blend two images with Beta-distributed weight"""
        lam = np.random.beta(alpha, alpha)
        return lam * img1 + (1 - lam) * img2
    
    def augment_dataset(self, images, n_augments=3):
        augmented = [images]
        for _ in range(n_augments):
            batch = []
            for img in images:
                ops = np.random.choice(['flip','noise','bright','crop'], 2, replace=False)
                aug = img.copy()
                for op in ops:
                    if op == 'flip':   aug = self.horizontal_flip(aug)
                    elif op == 'noise': aug = self.add_gaussian_noise(aug)
                    elif op == 'bright': aug = self.brightness(aug, np.random.uniform(0.8, 1.2))
                    elif op == 'crop':  aug = self.random_crop_pad(aug)
                batch.append(aug)
            augmented.append(np.array(batch))
        
        return np.vstack(augmented)

aug = AugmentationPipeline()
X_aug = aug.augment_dataset(images)
print(f"Original dataset: {images.shape}")
print(f"Augmented dataset: {X_aug.shape}  ({X_aug.shape[0]/images.shape[0]:.0f}x more data)")`
    }
  ],
  bonus: 'Vectorize the convolution using np.lib.stride_tricks.as_strided to create an efficient view of all patches at once — this makes it 50-100x faster than the loop version. Compare timing with timeit.'
}));

addProject('pn-indexing', projectCard({
  title: 'Recommendation Engine — Collaborative Filtering with NumPy',
  tagline: 'Build a real movie recommendation system from scratch using matrix operations and cosine similarity.',
  tags: ['NumPy', 'Collaborative Filtering', 'Cosine Similarity', 'Matrix Factorization'],
  difficulty: 'Intermediate',
  time: '3–4 hours',
  dataset: 'Simulated user-movie ratings (MovieLens style)',
  goal: 'Implement user-based and item-based collaborative filtering using NumPy fancy indexing and vectorized cosine similarity. Show how sparse ratings matrices work, how to handle missing values, and why matrix factorization (SVD) improves on plain similarity.',
  why: 'Recommender systems are used everywhere: Netflix, Spotify, Amazon, LinkedIn. Being able to implement one end-to-end shows you understand both the data structures (sparse matrices, masking) and the linear algebra (similarity, decomposition) — two things that come up constantly in ML interviews.',
  parts: [
    {
      title: 'Build a ratings matrix and handle sparsity',
      desc: 'Create the user-item ratings matrix with realistic sparsity (most users rate very few items). Use boolean masking to handle missing values correctly.',
      code: `import numpy as np

np.random.seed(42)

# Simulate MovieLens-style ratings
n_users, n_movies = 200, 100
sparsity = 0.08  # each user rates ~8% of movies

# Create sparse ratings matrix (0 = not rated, 1-5 = rating)
R = np.zeros((n_users, n_movies))
n_ratings = int(n_users * n_movies * sparsity)

# Assign random ratings
users_idx  = np.random.randint(0, n_users, n_ratings)
movies_idx = np.random.randint(0, n_movies, n_ratings)
ratings    = np.random.choice([1, 2, 3, 4, 5], n_ratings, p=[0.05, 0.10, 0.20, 0.35, 0.30])
R[users_idx, movies_idx] = ratings

# Boolean mask: True where rated
rated_mask = R > 0

print(f"Ratings matrix: {R.shape}")
print(f"Total ratings: {rated_mask.sum():,}")
print(f"Sparsity: {1 - rated_mask.mean():.1%}")
print(f"Avg ratings per user: {rated_mask.sum(axis=1).mean():.1f}")

# User-specific stats using boolean indexing
user_0_ratings = R[0, rated_mask[0]]  # only rated movies
print(f"\nUser 0 rated {len(user_0_ratings)} movies, avg rating: {user_0_ratings.mean():.2f}")`
    },
    {
      title: 'User-based collaborative filtering',
      desc: 'Find the k most similar users using vectorized cosine similarity, then predict ratings from their weighted average.',
      code: `import numpy as np

# (Continuing from Part 1 — R and rated_mask already defined)

def cosine_similarity_matrix(R):
    """
    Compute (n_users, n_users) cosine similarity matrix.
    Only counts movies that BOTH users have rated.
    """
    # Normalize each user vector
    norms = np.linalg.norm(R, axis=1, keepdims=True)
    norms[norms == 0] = 1  # avoid divide-by-zero
    R_norm = R / norms
    return R_norm @ R_norm.T  # (n_users, n_users)

def predict_rating(user_id, movie_id, R, sim_matrix, k=20):
    """Predict user's rating for a movie using k nearest neighbors."""
    # Users who rated this movie
    raters_mask = R[:, movie_id] > 0
    raters_idx  = np.where(raters_mask)[0]
    
    if len(raters_idx) == 0:
        return R[R > 0].mean()  # fallback to global mean
    
    # Similarity of target user to all raters
    sims = sim_matrix[user_id, raters_idx]
    
    # Top-k most similar raters
    top_k_idx = np.argsort(sims)[::-1][:k]
    top_k_sims = sims[top_k_idx]
    top_k_ratings = R[raters_idx[top_k_idx], movie_id]
    
    # Weighted average (handle negative similarity)
    pos_mask = top_k_sims > 0
    if not pos_mask.any():
        return R[raters_idx, movie_id].mean()
    
    weighted_sum = (top_k_sims[pos_mask] * top_k_ratings[pos_mask]).sum()
    weight_total = top_k_sims[pos_mask].sum()
    return weighted_sum / weight_total

# Build similarity matrix
np.random.seed(42)
n_users, n_movies = 200, 100
R = np.zeros((n_users, n_movies))
rated_mask = R > 0

sim = cosine_similarity_matrix(R)

# Evaluate: leave-one-out on rated items
errors = []
test_pairs = [(u, m) for u in range(min(50, n_users))
              for m in np.where(R[u] > 0)[0][:3]]

for user_id, movie_id in test_pairs:
    true_rating = R[user_id, movie_id]
    # Hide this rating during prediction
    R[user_id, movie_id] = 0
    pred = predict_rating(user_id, movie_id, R, sim)
    R[user_id, movie_id] = true_rating
    errors.append(abs(true_rating - pred))

print(f"Leave-one-out MAE: {np.mean(errors):.4f}")
print(f"(Baseline - predict mean: {np.mean([abs(R[R>0].mean() - r) for _,r in [(0,0)]*len(test_pairs)]):.4f})")`
    },
    {
      title: 'Matrix factorization with SVD (upgrade)',
      desc: 'Replace similarity-based CF with SVD-based latent factor model. Show the improvement in recommendation quality.',
      code: `import numpy as np

np.random.seed(42)
n_users, n_movies = 200, 100

# Create ratings with latent structure (so SVD can find it)
# 5 hidden genres, each user/movie has genre preferences
n_genres = 5
user_prefs  = np.random.dirichlet(np.ones(n_genres), n_users)   # (200, 5)
movie_prefs = np.random.dirichlet(np.ones(n_genres), n_movies)  # (100, 5)

# True ratings = user preferences dot movie preferences * 5
true_R = (user_prefs @ movie_prefs.T) * 5  # (200, 100)

# Observe only 8% of ratings with noise
observed = np.random.rand(n_users, n_movies) < 0.08
noise = np.random.randn(n_users, n_movies) * 0.3
R_observed = np.where(observed, true_R + noise, 0).clip(0, 5)

# SVD-based Matrix Factorization
def svd_recommend(R, k=10):
    """Use SVD to find k latent factors."""
    U, S, Vt = np.linalg.svd(R, full_matrices=False)
    # Reconstruct with top k factors
    R_hat = U[:, :k] @ np.diag(S[:k]) @ Vt[:k, :]
    return np.clip(R_hat, 0, 5)

R_svd = svd_recommend(R_observed, k=15)

# Evaluate RMSE on observed ratings
mask = R_observed > 0
rmse_svd  = np.sqrt(((R_observed[mask] - R_svd[mask])**2).mean())
global_mean = R_observed[mask].mean()
rmse_base = np.sqrt(((R_observed[mask] - global_mean)**2).mean())

print(f"Baseline RMSE (global mean): {rmse_base:.4f}")
print(f"SVD RMSE (k=15):             {rmse_svd:.4f}")
print(f"Improvement:                 {(rmse_base-rmse_svd)/rmse_base*100:.1f}%")

# Top-5 movie recommendations for user 0
user_0_pred = R_svd[0]
already_rated = R_observed[0] > 0
user_0_pred[already_rated] = -1  # exclude already rated
top5 = np.argsort(user_0_pred)[::-1][:5]
print(f"\nTop 5 recommendations for user 0: movies {top5}")
print(f"Predicted ratings: {user_0_pred[top5].round(2)}")`
    }
  ],
  bonus: 'Implement Alternating Least Squares (ALS) matrix factorization, which handles missing values better than SVD. Compare ALS vs SVD on the cold-start problem (new users with very few ratings).'
}));

addProject('pn-operations', projectCard({
  title: 'Neural Network Training Speed Benchmark',
  tagline: 'Prove with numbers why vectorized NumPy is mandatory for ML. Build the same forward pass 4 ways and benchmark them.',
  tags: ['NumPy', 'Performance', 'Vectorization', 'Profiling', 'Neural Nets'],
  difficulty: 'Intermediate',
  time: '2–3 hours',
  dataset: 'Synthetic (no download needed)',
  goal: 'Implement a neural network forward pass using: (1) pure Python loops, (2) partial vectorization, (3) full NumPy vectorization, (4) batched matrix multiply. Benchmark all four and show the exact speedup at each step. Then profile where time is spent using cProfile.',
  why: 'Production ML is all about throughput — how many samples per second can you process. Understanding what makes code fast (and being able to measure it) is what separates an ML engineer from a researcher who just runs notebooks.',
  parts: [
    {
      title: 'Four implementations, one benchmark',
      desc: 'Build the same sigmoid-layer forward pass four ways and measure the speedup from vectorization.',
      code: `import numpy as np
import time

np.random.seed(42)
n_samples = 10_000
n_features = 256
n_hidden = 128

X = np.random.randn(n_samples, n_features)
W = np.random.randn(n_features, n_hidden) * 0.01
b = np.zeros(n_hidden)

def sigmoid(z):
    return 1 / (1 + np.exp(-z))

# Version 1: Pure Python nested loop (never do this)
def forward_loop(X, W, b):
    n, p = X.shape
    _, h = W.shape
    out = np.zeros((n, h))
    for i in range(n):
        for j in range(h):
            s = b[j]
            for k in range(p):
                s += X[i, k] * W[k, j]
            out[i, j] = 1 / (1 + np.exp(-s))
    return out

# Version 2: Vectorize inner loop, keep sample loop
def forward_partial(X, W, b):
    n = X.shape[0]
    out = np.zeros((n, W.shape[1]))
    for i in range(n):
        z = X[i] @ W + b   # vectorized dot product
        out[i] = sigmoid(z)
    return out

# Version 3: Full vectorization (correct way)
def forward_vectorized(X, W, b):
    Z = X @ W + b          # (n, h) in one shot
    return sigmoid(Z)

# Version 4: Batched (process mini-batches for memory efficiency)
def forward_batched(X, W, b, batch_size=512):
    results = []
    for i in range(0, len(X), batch_size):
        batch = X[i:i+batch_size]
        Z = batch @ W + b
        results.append(sigmoid(Z))
    return np.vstack(results)

# Benchmark (skip loop version for large N — it would take hours)
print(f"{'Method':<25} {'Time (ms)':>12} {'Speedup':>10}")
print("-" * 50)

# Baseline: loop on small sample
X_small = X[:100]
t0 = time.time()
r_loop = forward_loop(X_small, W, b)
t_loop = (time.time() - t0) * 1000
print(f"{'Loop (100 samples)':<25} {t_loop:>12.1f} {'1x':>10}")

t0 = time.time()
r_partial = forward_partial(X, W, b)
t_partial = (time.time() - t0) * 1000
print(f"{'Partial (10k samples)':<25} {t_partial:>12.1f}")

t0 = time.time()
r_vec = forward_vectorized(X, W, b)
t_vec = (time.time() - t0) * 1000
speedup = (t_loop / 100 * 10_000) / t_vec
print(f"{'Vectorized (10k)':<25} {t_vec:>12.1f} {speedup:>9.0f}x")

t0 = time.time()
r_batch = forward_batched(X, W, b)
t_batch = (time.time() - t0) * 1000
print(f"{'Batched (10k)':<25} {t_batch:>12.1f}")

# Verify all give same result
print(f"\nPartial vs Vectorized match: {np.allclose(r_partial, r_vec, atol=1e-10)}")
print(f"Batched vs Vectorized match: {np.allclose(r_batch, r_vec, atol=1e-10)}")`
    }
  ],
  bonus: 'Profile using cProfile + pstats to find the exact bottleneck. Then try replacing the @ operator with np.einsum and compare. Finally, try numba @jit on the loop version and show it approaches vectorized speed.'
}));

// ============================================================
// PANDAS SECTION PROJECTS
// ============================================================

addProject('pp-loading', projectCard({
  title: 'Data Quality Audit Tool — Automated EDA Report',
  tagline: 'Build an automated data quality checker that any analyst can drop a CSV into and get a full report.',
  tags: ['Pandas', 'EDA', 'Data Quality', 'Profiling', 'Automation'],
  difficulty: 'Beginner–Intermediate',
  time: '2–3 hours',
  dataset: 'Any CSV you have — the tool works on any dataset',
  goal: 'Build a DataProfiler class that accepts any DataFrame and outputs a comprehensive quality report: missing values, dtypes, distributions, outliers, cardinality, and correlation alerts. This is a tool you actually use on every new project.',
  why: 'Every ML project starts with "understand the data." Being able to automate this and produce a structured report is a real productivity skill. Companies like Great Expectations and pandas-profiling built entire products around this idea.',
  parts: [
    {
      title: 'DataProfiler class',
      desc: 'Build a class that wraps a DataFrame and provides instant quality insights.',
      code: `import pandas as pd
import numpy as np

class DataProfiler:
    """Automated data quality and EDA report generator."""
    
    def __init__(self, df):
        self.df = df.copy()
        self.n_rows, self.n_cols = df.shape
    
    def missing_report(self):
        missing = self.df.isnull().sum()
        pct = (missing / self.n_rows * 100).round(2)
        report = pd.DataFrame({
            'missing_count': missing,
            'missing_pct': pct,
            'dtype': self.df.dtypes
        })
        return report[report['missing_count'] > 0].sort_values('missing_pct', ascending=False)
    
    def numeric_summary(self):
        num = self.df.select_dtypes(include='number')
        if num.empty:
            return pd.DataFrame()
        summary = num.describe().T
        summary['skewness'] = num.skew().round(3)
        summary['kurtosis'] = num.kurtosis().round(3)
        # Outlier count using IQR
        Q1, Q3 = num.quantile(0.25), num.quantile(0.75)
        IQR = Q3 - Q1
        outlier_counts = ((num < Q1 - 1.5*IQR) | (num > Q3 + 1.5*IQR)).sum()
        summary['outlier_count'] = outlier_counts
        summary['outlier_pct'] = (outlier_counts / self.n_rows * 100).round(1)
        return summary
    
    def categorical_summary(self):
        cat = self.df.select_dtypes(include=['object', 'category'])
        if cat.empty:
            return pd.DataFrame()
        return pd.DataFrame({
            'unique_values': cat.nunique(),
            'top_value': cat.mode().iloc[0] if not cat.empty else None,
            'top_freq': cat.apply(lambda x: x.value_counts().iloc[0] if not x.dropna().empty else 0),
            'top_pct': cat.apply(lambda x: x.value_counts(normalize=True).iloc[0]*100 if not x.dropna().empty else 0).round(1),
        })
    
    def correlation_alerts(self, threshold=0.85):
        num = self.df.select_dtypes(include='number')
        if num.shape[1] < 2:
            return []
        corr = num.corr().abs()
        # Find highly correlated pairs
        pairs = []
        cols = corr.columns
        for i in range(len(cols)):
            for j in range(i+1, len(cols)):
                if corr.iloc[i, j] > threshold:
                    pairs.append({
                        'feature_1': cols[i],
                        'feature_2': cols[j],
                        'correlation': round(corr.iloc[i, j], 3)
                    })
        return pd.DataFrame(pairs).sort_values('correlation', ascending=False) if pairs else pd.DataFrame()
    
    def full_report(self):
        print("=" * 60)
        print("DATA QUALITY REPORT")
        print("=" * 60)
        print(f"Shape: {self.n_rows:,} rows × {self.n_cols} columns")
        print(f"Memory: {self.df.memory_usage(deep=True).sum() / 1024**2:.1f} MB")
        print(f"Duplicate rows: {self.df.duplicated().sum():,}")
        
        print("\n--- MISSING VALUES ---")
        mv = self.missing_report()
        print(mv.to_string() if not mv.empty else "None")
        
        print("\n--- NUMERIC FEATURES ---")
        ns = self.numeric_summary()
        if not ns.empty:
            print(ns[['mean','std','min','max','skewness','outlier_pct']].round(3).to_string())
        
        print("\n--- CATEGORICAL FEATURES ---")
        cs = self.categorical_summary()
        if not cs.empty:
            print(cs.to_string())
        
        print("\n--- CORRELATION ALERTS (|r| > 0.85) ---")
        ca = self.correlation_alerts()
        print(ca.to_string() if not ca.empty else "None found")

# Test on a messy dataset
np.random.seed(42)
n = 500
df_test = pd.DataFrame({
    'age':      np.where(np.random.rand(n) < 0.05, np.nan, np.random.randint(18, 80, n)),
    'income':   np.random.lognormal(10.5, 0.8, n),
    'score':    np.random.normal(70, 20, n),
    'score2':   None,  # will be highly correlated with score
    'category': np.random.choice(['A','B','C',None], n, p=[0.4,0.3,0.2,0.1]),
    'churn':    np.random.choice([0,1], n, p=[0.8,0.2])
})
df_test['score2'] = df_test['score'] * 1.05 + np.random.randn(n) * 2  # correlated
df_test.loc[np.random.choice(n, 3), 'income'] = 999_999  # inject outliers

profiler = DataProfiler(df_test)
profiler.full_report()`
    }
  ],
  bonus: 'Export the report to an HTML file with color-coded cells (red = high missing, yellow = high skew, orange = outliers). Add a "ML readiness score" from 0-100 based on data quality metrics.'
}));

addProject('pp-selection', projectCard({
  title: 'Sales Analytics Dashboard — Advanced Filtering & Slicing',
  tagline: 'Answer 10 real business questions on a sales dataset using only Pandas selection and filtering — no groupby yet.',
  tags: ['Pandas', 'loc', 'iloc', 'Boolean Indexing', 'Business Analytics'],
  difficulty: 'Beginner',
  time: '2 hours',
  dataset: 'Simulated retail sales data (generated in code)',
  goal: 'Practice every selection technique on a realistic dataset by answering progressively harder business questions. This is the interview format: "given this DataFrame, extract the top salespeople in Q4 who closed deals over $10K in the west region."',
  why: 'Data filtering is the first thing every analyst does. Being fast and fluent with loc/iloc/query/boolean masks is the difference between taking 10 minutes or 10 seconds to answer a business question. Interviewers test this directly.',
  parts: [
    {
      title: '10 business questions, 10 Pandas solutions',
      desc: 'Generate realistic sales data and answer each question using a different selection technique.',
      code: `import pandas as pd
import numpy as np

np.random.seed(42)
n = 2000

df = pd.DataFrame({
    'sale_id':    range(n),
    'date':       pd.date_range('2023-01-01', periods=n, freq='6H'),
    'rep':        np.random.choice(['Alice','Bob','Charlie','Diana','Eve'], n),
    'region':     np.random.choice(['North','South','East','West'], n),
    'product':    np.random.choice(['Widget','Gadget','Doohickey','Thingamajig'], n),
    'amount':     np.random.lognormal(8, 1, n).round(2),
    'units':      np.random.randint(1, 50, n),
    'discount':   np.random.choice([0, 5, 10, 15, 20], n, p=[0.5,0.2,0.15,0.1,0.05]),
    'closed':     np.random.choice([True, False], n, p=[0.7, 0.3]),
})
df['quarter'] = df['date'].dt.quarter
df['month']   = df['date'].dt.month

print("Dataset shape:", df.shape)
print(df.head(3).to_string())
print()

# Q1: Sales in Q4 that are closed
q1 = df[(df['quarter'] == 4) & (df['closed'] == True)]
print(f"Q1 — Closed Q4 sales: {len(q1):,}")

# Q2: Top 5 highest-value deals
q2 = df.nlargest(5, 'amount')[['rep', 'region', 'amount', 'date']]
print(f"\nQ2 — Top 5 deals:\n{q2.to_string(index=False)}")

# Q3: All Alice's deals over $5,000 in the West
q3 = df.query("rep == 'Alice' and region == 'West' and amount > 5000")
print(f"\nQ3 — Alice / West / >$5k: {len(q3)} deals, total {q3['amount'].sum():,.2f} USD")

# Q4: Rows 100-200, columns rep through amount (iloc)
q4 = df.iloc[100:201, df.columns.get_loc('rep'):df.columns.get_loc('amount')+1]
print(f"\nQ4 — Slice [100:200], rep→amount: shape {q4.shape}")

# Q5: Deals with 20% discount closed in H1 (months 1-6)
q5 = df[(df['discount'] == 20) & (df['closed']) & (df['month'] <= 6)]
print(f"\nQ5 — 20% disc, closed, H1: {len(q5)} deals")

# Q6: Bottom decile of deal sizes (potential upsell targets)
threshold = df['amount'].quantile(0.10)
q6 = df[df['amount'] < threshold]
print(f"\nQ6 — Bottom 10% deals (< {threshold:,.0f}): {len(q6):,}")

# Q7: Deals NOT by Bob or Charlie, NOT in the South
q7 = df[~df['rep'].isin(['Bob','Charlie']) & (df['region'] != 'South')]
print(f"\nQ7 — Excl Bob/Charlie, not South: {len(q7):,}")

# Q8: Most recent 30 deals for each region (iloc trick)
q8 = (df.sort_values('date', ascending=False)
       .groupby('region')
       .head(30))
print(f"\nQ8 — Last 30 per region: {len(q8)} rows")

# Q9: Deals between $1,000 and $10,000 with no discount
q9 = df[df['amount'].between(1000, 10000) & (df['discount'] == 0)]
print(f"\nQ9 — $1k-$10k, no discount: {len(q9):,}")

# Q10: Select every 5th row (systematic sampling)
q10 = df.iloc[::5]
print(f"\nQ10 — Every 5th row (systematic sample): {len(q10):,}")`
    }
  ],
  bonus: 'Add a "query builder" function that takes a dict of filters and returns the filtered DataFrame. Example: filter_sales(df, region="West", min_amount=5000, quarter=4, closed=True) — make it work for any combination of optional filters.'
}));

addProject('pp-cleaning', projectCard({
  title: 'Healthcare Data Cleaning Pipeline — Real Messy Data',
  tagline: 'Clean a deliberately dirty healthcare dataset with 12 different types of data quality issues.',
  tags: ['Pandas', 'Data Cleaning', 'Missing Data', 'Regex', 'Pipeline'],
  difficulty: 'Intermediate',
  time: '3–4 hours',
  dataset: 'Simulated patient records with injected errors',
  goal: 'Build a production-quality data cleaning pipeline for patient records: handle 12 types of issues (wrong types, inconsistent formats, impossible values, duplicates, outliers, mixed formats, trailing whitespace, inconsistent categories, date formats, free text extraction, unit conversions, cross-column validation). Output a clean DataFrame and a cleaning audit log.',
  why: 'Healthcare data is the dirtiest data in existence — if you can clean it, you can clean anything. This project shows systematic thinking about data quality, which is what ML engineers do 70% of the time in production.',
  parts: [
    {
      title: 'Generate and clean 12 types of data quality issues',
      desc: 'Each issue type maps to a real pattern you see in production data.',
      code: `import pandas as pd
import numpy as np
import re

np.random.seed(42)
n = 1000

# Generate dirty patient records
df_dirty = pd.DataFrame({
    # Issue 1: mixed date formats
    'admission_date': (
        pd.date_range('2022-01-01', periods=n, freq='8H').astype(str).tolist()[:n//3] +
        ['01/' + d[5:7] + '/' + d[:4] for d in pd.date_range('2022-01-01',periods=n//3,freq='8H').astype(str)] +
        [d[8:10] + '-' + d[5:7] + '-' + d[:4] for d in pd.date_range('2022-01-01',periods=n-2*(n//3),freq='8H').astype(str)]
    ),
    # Issue 2: numeric stored as string with units
    'weight_raw':  [f"{w} kg" if np.random.rand()>0.3 else f"{w*2.205:.1f} lbs" 
                    if np.random.rand()>0.5 else str(w) 
                    for w in np.random.normal(75, 15, n).clip(40, 150).round(1)],
    # Issue 3: missing values coded multiple ways
    'blood_pressure': np.where(np.random.rand(n) < 0.1, 
                                np.random.choice(['N/A', 'unknown', 'not recorded', '?', ''], n),
                                [f"{s}/{d}" for s,d in zip(np.random.randint(100,180,n),
                                                            np.random.randint(60,110,n))]),
    # Issue 4: impossible values
    'age':         np.where(np.random.rand(n)<0.03, np.random.choice([-5, 150, 999],n), 
                            np.random.randint(0, 100, n)),
    # Issue 5: inconsistent categories
    'gender':      np.random.choice(['Male','male','M','Female','female','F','MALE','FEMALE','Other'], n),
    # Issue 6: trailing whitespace and mixed case
    'diagnosis':   [f"  {d}  " for d in np.random.choice(['Type 2 Diabetes','hypertension',
                                                            'COPD','Heart Failure','diabetes type 2'], n)],
    # Issue 7: duplicates
    'patient_id':  list(range(n-50)) + list(range(50)),  # last 50 are duplicates
    # Issue 8: outliers
    'cholesterol': np.where(np.random.rand(n)<0.02, np.random.choice([1, 9999], n),
                            np.random.normal(200, 40, n).clip(100, 400).round()),
})

print(f"Dirty dataset shape: {df_dirty.shape}")
print(f"Issues to fix: 8 types")
print()

cleaning_log = []

def log(step, before, after, desc):
    cleaning_log.append({'step': step, 'rows_before': before, 'rows_after': after, 'description': desc})

df = df_dirty.copy()

# Fix 1: Standardize dates
def parse_date(d):
    for fmt in ['%Y-%m-%d %H:%M:%S', '%Y-%m-%d', '%m/%d/%Y', '%d-%m-%Y']:
        try:
            return pd.to_datetime(d, format=fmt)
        except:
            pass
    return pd.NaT

df['admission_date'] = df['admission_date'].apply(parse_date)
log('1_dates', n, n, f"Standardized dates — {df['admission_date'].isna().sum()} unparseable")

# Fix 2: Convert weight to kg
def parse_weight(w):
    w = str(w).strip()
    if 'lbs' in w.lower():
        return float(re.findall(r'[\d.]+', w)[0]) / 2.205
    elif 'kg' in w.lower():
        return float(re.findall(r'[\d.]+', w)[0])
    else:
        try: return float(w)
        except: return np.nan

df['weight_kg'] = df['weight_raw'].apply(parse_weight).round(1)
log('2_weight', n, n, f"Converted weight to kg — {df['weight_kg'].isna().sum()} failed")

# Fix 3: Standardize missing values
null_vals = ['N/A', 'unknown', 'not recorded', '?', '', 'None', 'nan']
df['blood_pressure'] = df['blood_pressure'].replace(null_vals, np.nan)
log('3_nulls', n, n, f"Standardized {df['blood_pressure'].isna().sum()} missing BP values")

# Fix 4: Remove impossible ages
valid_age = df['age'].between(0, 120)
df.loc[~valid_age, 'age'] = np.nan
log('4_age', n, n, f"Nulled {(~valid_age).sum()} impossible ages")

# Fix 5: Standardize gender
gender_map = {'male':'Male','m':'Male','female':'Female','f':'Female',
               'MALE':'Male','FEMALE':'Female','M':'Male','F':'Female'}
df['gender'] = df['gender'].replace(gender_map)
log('5_gender', n, n, f"Standardized gender — {df['gender'].value_counts().to_dict()}")

# Fix 6: Strip whitespace and standardize diagnosis
df['diagnosis'] = df['diagnosis'].str.strip().str.lower()
diag_map = {'diabetes type 2': 'type 2 diabetes'}
df['diagnosis'] = df['diagnosis'].replace(diag_map).str.title()
log('6_diagnosis', n, n, f"Cleaned diagnosis — {df['diagnosis'].nunique()} unique values")

# Fix 7: Remove duplicates (keep first)
before = len(df)
df = df.drop_duplicates(subset=['patient_id'], keep='first')
log('7_duplicates', before, len(df), f"Removed {before-len(df)} duplicate patient IDs")

# Fix 8: Cap cholesterol outliers
Q1, Q3 = df['cholesterol'].quantile([0.01, 0.99])
outliers = ((df['cholesterol'] < Q1) | (df['cholesterol'] > Q3)).sum()
df['cholesterol'] = df['cholesterol'].clip(Q1, Q3)
log('8_outliers', len(df), len(df), f"Winsorized {outliers} cholesterol outliers")

# Final report
print(f"Clean dataset shape: {df.shape}")
print("\nCleaning Audit Log:")
print(pd.DataFrame(cleaning_log).to_string(index=False))
print(f"\nRemaining nulls:\n{df.isnull().sum()[df.isnull().sum()>0]}")`
    }
  ],
  bonus: 'Add cross-column validation: flag records where weight_kg + age combination is physiologically impossible (e.g., weight > 300 kg for adult), or where systolic BP < diastolic BP. Write a validation report that lists every flagged record with the reason.'
}));

addProject('pp-apply', projectCard({
  title: 'NLP Feature Engineering — Text to ML-Ready Features',
  tagline: 'Extract 20+ features from raw customer review text using Pandas string operations and apply — no sklearn needed.',
  tags: ['Pandas', 'NLP', 'Feature Engineering', 'Regex', 'Text Analysis'],
  difficulty: 'Intermediate',
  time: '3–4 hours',
  dataset: 'Simulated customer reviews (generated in code)',
  goal: 'Turn raw text reviews into a rich feature matrix using only Pandas .str methods, .apply(), and regex. Then train a simple classifier to show that hand-crafted text features can reach 85%+ accuracy on sentiment classification without any embeddings.',
  why: 'Before transformers took over, this is how production NLP worked — and it still works well for structured text with limited data. Being able to extract features from text without a GPU or a 10GB model is a practical skill that separates people who ship from people who wait for resources.',
  parts: [
    {
      title: 'Extract 20 text features with Pandas',
      desc: 'Each feature captures a different signal from raw text.',
      code: `import pandas as pd
import numpy as np
import re

np.random.seed(42)

# Simulate customer reviews
positive_phrases = [
    "absolutely love this product", "great quality and fast shipping",
    "exceeded my expectations", "highly recommend to everyone",
    "best purchase I've made", "works perfectly as described",
    "customer service was excellent", "very happy with my order"
]
negative_phrases = [
    "complete waste of money", "broke after two days",
    "terrible quality product", "do not buy this",
    "worst purchase ever", "very disappointed",
    "stopped working immediately", "total garbage"
]

def make_review(sentiment):
    base = np.random.choice(positive_phrases if sentiment == 1 else negative_phrases)
    # Add noise: capitalization, punctuation, length variation
    extras = np.random.choice([
        "!", "!!", "...", "?",
        " So frustrating.", " Would buy again.",
        " UPDATE: still using it.", " 5 stars." if sentiment==1 else " 1 star."
    ])
    prefix = np.random.choice(["", "EDIT: ", "UPDATE: ", "Review: "])
    return prefix + base.capitalize() + extras

n = 2000
df = pd.DataFrame({
    'review_id': range(n),
    'text': [make_review(s) for s in np.random.choice([0,1], n, p=[0.45,0.55])],
    'rating': np.random.choice([1,2,3,4,5], n, p=[0.1,0.1,0.1,0.35,0.35]),
    'sentiment': np.random.choice([0,1], n, p=[0.45,0.55]),
})

# ---- EXTRACT 20 TEXT FEATURES ----
def extract_features(df):
    f = pd.DataFrame()
    
    # Length features
    f['char_count']     = df['text'].str.len()
    f['word_count']     = df['text'].str.split().str.len()
    f['avg_word_len']   = df['text'].str.split().apply(lambda ws: np.mean([len(w) for w in ws]) if ws else 0)
    f['sentence_count'] = df['text'].str.count(r'[.!?]+') + 1
    
    # Punctuation features
    f['exclamation_count'] = df['text'].str.count('!')
    f['question_count']    = df['text'].str.count(r'\?')
    f['ellipsis_count']    = df['text'].str.count(r'\.\.\.')
    f['caps_ratio']        = df['text'].apply(lambda t: sum(1 for c in t if c.isupper()) / max(len(t),1))
    
    # Sentiment word counts (simple lexicon)
    positive_words = ['love','great','excellent','perfect','recommend','happy','best','amazing','fantastic','wonderful']
    negative_words = ['terrible','worst','broke','waste','disappointed','garbage','horrible','awful','bad','poor']
    
    f['positive_word_count'] = df['text'].str.lower().apply(
        lambda t: sum(1 for w in positive_words if w in t))
    f['negative_word_count'] = df['text'].str.lower().apply(
        lambda t: sum(1 for w in negative_words if w in t))
    f['sentiment_ratio'] = (f['positive_word_count'] - f['negative_word_count']) / (f['word_count'] + 1)
    
    # Pattern features
    f['has_update']     = df['text'].str.contains(r'UPDATE|EDIT', case=False, na=False).astype(int)
    f['has_recommend']  = df['text'].str.contains(r'recommend', case=False, na=False).astype(int)
    f['has_not']        = df['text'].str.contains(r'\bnot\b|\bnever\b|\bdont\b|\bdoesnt\b', 
                                                    case=False, na=False, regex=True).astype(int)
    f['has_star']       = df['text'].str.contains(r'\d\s*star', case=False, na=False).astype(int)
    f['starts_caps']    = df['text'].str[0].str.isupper().fillna(False).astype(int)
    
    # Rating-text consistency
    f['rating'] = df['rating']
    f['rating_is_high'] = (df['rating'] >= 4).astype(int)
    f['rating_is_low']  = (df['rating'] <= 2).astype(int)
    
    return f

features = extract_features(df)
print(f"Feature matrix shape: {features.shape}")
print("\nSample features:")
print(features.head(3).T)

# Train classifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split, cross_val_score

X = features.values
y = df['sentiment'].values

X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.2, random_state=42)
rf = RandomForestClassifier(n_estimators=100, random_state=42)
rf.fit(X_tr, y_tr)
print(f"\nTest accuracy with hand-crafted features: {rf.score(X_te, y_te):.4f}")

# Feature importance
imp = pd.DataFrame({'feature': features.columns, 'importance': rf.feature_importances_})
print("\nTop 5 most important features:")
print(imp.nlargest(5, 'importance').to_string(index=False))`
    }
  ],
  bonus: 'Add TF-IDF features using CountVectorizer (top 50 unigrams and bigrams) and combine with your hand-crafted features using pd.concat. Show whether the hybrid feature set beats either approach alone.'
}));

// ============================================================
// VISUALIZATION SECTION PROJECTS  
// ============================================================

addProject('pv-matplotlib', projectCard({
  title: 'Loss Landscape Explorer — Training Dynamics Visualizer',
  tagline: 'Build an animated visualization of how gradient descent navigates a real neural network loss surface.',
  tags: ['Matplotlib', 'Gradient Descent', 'Visualization', 'Neural Nets', 'Animation'],
  difficulty: 'Intermediate',
  time: '3–4 hours',
  dataset: 'Synthetic (generated in code)',
  goal: 'Visualize the loss landscape of a 2-parameter model in 3D and 2D. Plot the optimizer path from multiple starting points. Show how learning rate affects the path — too small: slow, too large: diverges, just right: converges efficiently.',
  why: 'The ability to visualize ML training dynamics is a rare and valuable skill. When a model is not converging, being able to plot loss curves, gradient norms, and parameter trajectories is what lets you diagnose the problem. This project builds all those skills.',
  parts: [
    {
      title: 'Loss landscape in 3D and 2D',
      desc: 'Build a complete multi-panel figure showing the loss surface, optimizer path, and loss curve.',
      code: `import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D

# 2-parameter regression: y = w1*x1 + w2*x2
# We can visualize the loss surface over (w1, w2) space
np.random.seed(42)

# Generate data
n = 100
X = np.random.randn(n, 2)
y = 3*X[:,0] - 2*X[:,1] + np.random.randn(n) * 0.5
# True solution: w1=3, w2=-2

def mse_loss(w1, w2):
    """Vectorized loss over a grid of (w1, w2) values."""
    y_pred = w1 * X[:,0] + w2 * X[:,1]  # broadcasting
    return ((y - y_pred)**2).mean()

def gradient(w):
    y_pred = w[0]*X[:,0] + w[1]*X[:,1]
    error  = y_pred - y
    return np.array([2/n * (error * X[:,0]).sum(),
                     2/n * (error * X[:,1]).sum()])

# Loss surface grid
w1_range = np.linspace(-1, 6, 100)
w2_range = np.linspace(-5, 2, 100)
W1, W2   = np.meshgrid(w1_range, w2_range)
Z        = np.vectorize(mse_loss)(W1, W2)

# Run gradient descent from bad starting point
def run_gd(w0, lr, n_steps=100):
    w = w0.copy(); path = [w.copy()]
    for _ in range(n_steps):
        w -= lr * gradient(w)
        path.append(w.copy())
    return np.array(path)

paths = {
    'lr=0.001 (too slow)':  (run_gd(np.array([-0.5, 1.5]), 0.001, 200), 'steelblue'),
    'lr=0.05  (good)':      (run_gd(np.array([-0.5, 1.5]), 0.05,  100), 'seagreen'),
    'lr=0.5   (too large)': (run_gd(np.array([-0.5, 1.5]), 0.5,    50), 'coral'),
}

# Build 4-panel figure
fig = plt.figure(figsize=(18, 12))
fig.suptitle('Gradient Descent on a 2-Parameter Loss Surface', fontsize=15, fontweight='bold')

# Panel 1: 3D surface
ax1 = fig.add_subplot(2, 2, 1, projection='3d')
ax1.plot_surface(W1, W2, Z, cmap='viridis', alpha=0.7, linewidth=0)
ax1.set_xlabel('w1'); ax1.set_ylabel('w2'); ax1.set_zlabel('MSE Loss')
ax1.set_title('Loss Surface (3D)')
ax1.scatter([3], [-2], [mse_loss(3,-2)], color='red', s=100, zorder=5, label='True min')
ax1.legend()

# Panel 2: Contour with optimizer paths
ax2 = fig.add_subplot(2, 2, 2)
cs = ax2.contourf(W1, W2, np.log(Z+0.01), levels=30, cmap='RdYlBu_r', alpha=0.8)
ax2.contour(W1, W2, np.log(Z+0.01), levels=15, colors='black', alpha=0.2, linewidths=0.5)
plt.colorbar(cs, ax=ax2, label='log(MSE+0.01)')

for label, (path, color) in paths.items():
    ax2.plot(path[:,0], path[:,1], '-o', color=color, markersize=3, lw=2, label=label, alpha=0.8)
    ax2.plot(path[-1,0], path[-1,1], '*', color=color, markersize=15, zorder=5)

ax2.plot(3, -2, 'w*', markersize=18, label='True optimum (3,-2)')
ax2.set_xlabel('w1'); ax2.set_ylabel('w2')
ax2.set_title('Optimizer Paths (contour view)')
ax2.legend(fontsize=8, loc='upper right')

# Panel 3: Loss curves
ax3 = fig.add_subplot(2, 2, 3)
for label, (path, color) in paths.items():
    losses = [mse_loss(w[0], w[1]) for w in path]
    ax3.plot(losses, color=color, lw=2, label=label)
ax3.set_xlabel('Iteration'); ax3.set_ylabel('MSE Loss')
ax3.set_title('Loss Curves')
ax3.set_yscale('log'); ax3.legend(fontsize=9)
ax3.axhline(mse_loss(3,-2), color='red', linestyle='--', label='Optimal loss', alpha=0.7)

# Panel 4: Parameter convergence
ax4 = fig.add_subplot(2, 2, 4)
label, (path, color) = list(paths.items())[1]  # good lr
ax4.plot(path[:,0], label='w1 (true=3)', color='steelblue', lw=2)
ax4.plot(path[:,1], label='w2 (true=-2)', color='coral', lw=2)
ax4.axhline(3,  color='steelblue', linestyle='--', alpha=0.5)
ax4.axhline(-2, color='coral',     linestyle='--', alpha=0.5)
ax4.set_xlabel('Iteration'); ax4.set_ylabel('Parameter value')
ax4.set_title('Parameter Convergence (lr=0.05)')
ax4.legend()

plt.tight_layout()
plt.savefig('/tmp/loss_landscape.png', dpi=150, bbox_inches='tight')
print("Saved to /tmp/loss_landscape.png")`
    }
  ],
  bonus: 'Add a learning rate finder plot (the technique used by fastai): run gradient descent with exponentially increasing learning rate and plot loss vs lr. The point where loss starts rising is the best learning rate — show it on the plot.'
}));

addProject('pv-seaborn', projectCard({
  title: 'Exploratory Analysis Report — Titanic Survival Factors',
  tagline: 'Produce a publication-quality 12-plot analysis that tells the story of what factors predicted Titanic survival.',
  tags: ['Seaborn', 'Matplotlib', 'EDA', 'Statistical Visualization', 'Storytelling'],
  difficulty: 'Beginner–Intermediate',
  time: '2–3 hours',
  dataset: 'Titanic (sklearn or simulated)',
  goal: 'Build a complete visual story: distribution of survivors, survival by class/sex/age/fare, interaction effects, and correlation analysis. Each plot should have a clear title that states the finding, not just describes the axes. This is how data scientists communicate to non-technical stakeholders.',
  why: 'Data visualization for communication is one of the highest-value skills a data scientist can have. Executives and PMs make decisions based on charts, not model outputs. If you can tell a data story visually, your impact multiplies.',
  parts: [
    {
      title: '12-panel narrative visualization',
      desc: 'Each panel answers a specific question with a clear visual and a finding-title.',
      code: `import numpy as np
import pandas as pd
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import seaborn as sns

sns.set_theme(style='darkgrid', palette='husl')
np.random.seed(42)

# Simulate Titanic data (realistic distributions)
n = 891
df = pd.DataFrame({
    'Pclass':   np.random.choice([1,2,3], n, p=[0.24,0.21,0.55]),
    'Sex':      np.random.choice(['male','female'], n, p=[0.65,0.35]),
    'Age':      np.where(np.random.rand(n)<0.2, np.nan, np.random.normal(30,14,n).clip(0,80)),
    'SibSp':    np.random.choice([0,1,2,3,4], n, p=[0.68,0.23,0.07,0.015,0.005]),
    'Parch':    np.random.choice([0,1,2,3], n, p=[0.76,0.13,0.09,0.02]),
    'Fare':     np.random.lognormal(3.0, 1.2, n).clip(0, 500),
    'Embarked': np.random.choice(['S','C','Q'], n, p=[0.72,0.19,0.09]),
})
# Survival probability based on real factors
surv_prob = (
    0.20
    + 0.35 * (df['Sex']=='female').astype(float)
    - 0.15 * (df['Pclass']==3).astype(float)
    + 0.10 * (df['Pclass']==1).astype(float)
    + 0.003 * np.log(df['Fare']+1)
    - 0.001 * df['Age'].fillna(30)
)
df['Survived'] = (np.random.rand(n) < surv_prob.clip(0,1)).astype(int)
df['Age'] = df['Age'].fillna(df['Age'].median())
df['FareBin'] = pd.cut(df['Fare'], bins=[0,15,50,150,600], labels=['Low','Mid','High','VHigh'])
df['AgeGroup'] = pd.cut(df['Age'], bins=[0,12,18,35,60,80], labels=['Child','Teen','Adult','Middle','Senior'])

fig, axes = plt.subplots(3, 4, figsize=(20, 15))
fig.suptitle('What Predicted Titanic Survival? — A Visual Analysis', fontsize=16, fontweight='bold', y=1.01)

# 1: Overall survival rate
ax = axes[0,0]
counts = df['Survived'].value_counts()
colors = ['coral', 'steelblue']
ax.pie(counts, labels=['Died','Survived'], colors=colors, autopct='%1.1f%%', startangle=90)
ax.set_title('Only 38.4% Survived Overall')

# 2: Women survived at 3x the rate of men
ax = axes[0,1]
sns.barplot(data=df, x='Sex', y='Survived', ax=ax, palette={'male':'steelblue','female':'coral'})
ax.set_title('Women Survived at 3x the Rate of Men')
ax.set_ylabel('Survival Rate'); ax.set_ylim(0,1)
for p in ax.patches:
    ax.annotate(f'{p.get_height():.1%}', (p.get_x()+p.get_width()/2, p.get_height()+0.02), ha='center')

# 3: 1st class had 2x survival of 3rd class
ax = axes[0,2]
sns.barplot(data=df, x='Pclass', y='Survived', ax=ax, palette='Blues_d')
ax.set_title('1st Class Survived at 2x Rate of 3rd Class')
ax.set_ylabel('Survival Rate'); ax.set_ylim(0,1)

# 4: Sex + Class interaction
ax = axes[0,3]
pivot = df.groupby(['Pclass','Sex'])['Survived'].mean().unstack()
pivot.plot(kind='bar', ax=ax, color=['steelblue','coral'], edgecolor='white')
ax.set_title('Class × Gender: Biggest Factor is Being Female in 1st')
ax.set_ylabel('Survival Rate'); ax.set_xlabel('Class')
ax.legend(title='Sex'); ax.set_xticklabels([1,2,3], rotation=0)

# 5: Age distribution of survivors vs non-survivors
ax = axes[1,0]
sns.histplot(data=df, x='Age', hue='Survived', kde=True, ax=ax,
             palette={0:'coral',1:'steelblue'}, alpha=0.6)
ax.set_title('Children Under 12 Had Higher Survival')
ax.legend(labels=['Died','Survived'])

# 6: Survival by age group
ax = axes[1,1]
sns.barplot(data=df, x='AgeGroup', y='Survived', ax=ax, palette='viridis')
ax.set_title('Children Survived Most, Middle-Aged Least')
ax.set_ylabel('Survival Rate')

# 7: Fare distribution
ax = axes[1,2]
sns.boxplot(data=df, x='Survived', y='Fare', ax=ax, palette={0:'coral',1:'steelblue'})
ax.set_yscale('log')
ax.set_title('Survivors Paid 2x Higher Fares on Median')
ax.set_xticklabels(['Died','Survived'])

# 8: Survival by fare bucket
ax = axes[1,3]
sns.barplot(data=df, x='FareBin', y='Survived', ax=ax, palette='RdYlGn')
ax.set_title('Higher Fare = Higher Survival (Proxy for Class)')
ax.set_ylabel('Survival Rate')

# 9: Family size effect
df['FamilySize'] = df['SibSp'] + df['Parch'] + 1
ax = axes[2,0]
family_surv = df.groupby('FamilySize')['Survived'].mean()
ax.bar(family_surv.index, family_surv.values, color='steelblue', edgecolor='white')
ax.set_title('Small Families (2-4) Had Best Survival')
ax.set_xlabel('Family Size'); ax.set_ylabel('Survival Rate')

# 10: Embarkation port
ax = axes[2,1]
sns.barplot(data=df, x='Embarked', y='Survived', ax=ax, palette='Set2')
ax.set_title('Cherbourg (C) Passengers Survived Most\n(More 1st Class boarded there)')
ax.set_ylabel('Survival Rate')

# 11: Correlation heatmap
ax = axes[2,2]
num_cols = ['Survived','Pclass','Age','SibSp','Parch','Fare','FamilySize']
corr = df[num_cols].corr()
mask = np.triu(np.ones_like(corr, dtype=bool))
sns.heatmap(corr, mask=mask, annot=True, fmt='.2f', cmap='RdBu_r', center=0,
            ax=ax, linewidths=0.5, square=True)
ax.set_title('Correlation: Fare Most Positively\\nCorrelated with Survival')

# 12: Survival probability by age and class (bubble/scatter)
ax = axes[2,3]
for pclass, color, label in [(1,'gold','1st Class'),(2,'steelblue','2nd Class'),(3,'coral','3rd Class')]:
    subset = df[df['Pclass']==pclass]
    ax.scatter(subset['Age'], subset['Fare'], c=color, alpha=0.4, s=30, label=label)
ax.set_yscale('log')
ax.set_xlabel('Age'); ax.set_ylabel('Fare (log)')
ax.set_title('Age vs Fare by Class — Clusters Clear')
ax.legend()

plt.tight_layout()
plt.savefig('/tmp/titanic_analysis.png', dpi=120, bbox_inches='tight')
print("Saved 12-panel report to /tmp/titanic_analysis.png")`
    }
  ],
  bonus: 'Add a 13th panel: a logistic regression decision boundary plotted in age vs fare space, with a color gradient showing predicted survival probability. Overlay the actual data points colored by true survival outcome.'
}));

// ============================================================
// REGRESSION SECTION PROJECTS
// ============================================================

addProject('p3-linear-scratch', projectCard({
  title: 'House Price Predictor — Linear Regression End to End',
  tagline: 'Build, evaluate, and interpret a linear regression model on real housing data — from EDA to deployment-ready predictions.',
  tags: ['Linear Regression', 'Normal Equation', 'Gradient Descent', 'sklearn', 'Feature Engineering'],
  difficulty: 'Beginner–Intermediate',
  time: '3–4 hours',
  dataset: 'sklearn California Housing (20,640 samples, 8 features)',
  goal: 'Full pipeline: EDA → feature engineering → scratch implementation (GD + Normal Equation) → sklearn → residual analysis → interpretation. Output a coefficient table that explains the model to a non-technical audience.',
  why: 'Linear regression is the most commonly deployed ML model in business — it\'s interpretable, fast, and works well when relationships are approximately linear. Every ML interview asks about it. Being able to go from scratch to interpretation to communication is the complete skill.',
  parts: [
    {
      title: 'From EDA to residual analysis',
      desc: 'Show the complete workflow including the diagnostic plots that validate your model assumptions.',
      code: `import numpy as np
import pandas as pd
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from sklearn.datasets import fetch_california_housing
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_error

# Load data
housing = fetch_california_housing()
X = pd.DataFrame(housing.data, columns=housing.feature_names)
y = pd.Series(housing.target, name='MedHouseVal')

print("Dataset:", X.shape, "Target range:", y.min(), "-", y.max())
print("\nFeature descriptions:")
desc = {
    'MedInc':'Median income in block', 'HouseAge':'Median house age',
    'AveRooms':'Avg rooms/household', 'AveBedrms':'Avg bedrooms/household',
    'Population':'Block population', 'AveOccup':'Avg household occupancy',
    'Latitude':'Block latitude', 'Longitude':'Block longitude'
}
for f, d in desc.items(): print(f"  {f}: {d}")

# Feature engineering
X['rooms_per_occupant'] = X['AveRooms'] / X['AveOccup']
X['bedroom_ratio']      = X['AveBedrms'] / X['AveRooms']
X['income_x_rooms']     = X['MedInc'] * X['AveRooms']

# Train/test split
X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.2, random_state=42)

# Scale features (required for regularized models, good practice always)
scaler = StandardScaler()
X_tr_s = scaler.fit_transform(X_tr)
X_te_s  = scaler.transform(X_te)

# Fit
model = LinearRegression()
model.fit(X_tr_s, y_tr)
y_pred = model.predict(X_te_s)
residuals = y_te - y_pred

# Metrics
print(f"\nModel Performance:")
print(f"  R² Score:  {r2_score(y_te, y_pred):.4f}")
print(f"  RMSE:      {np.sqrt(mean_squared_error(y_te, y_pred))*100_000:,.0f} USD")
print(f"  MAE:       {mean_absolute_error(y_te, y_pred)*100_000:,.0f} USD")

cv_r2 = cross_val_score(LinearRegression(), X_tr_s, y_tr, cv=10)
print(f"  10-Fold CV R²: {cv_r2.mean():.4f} ± {cv_r2.std():.4f}")

# Coefficient interpretation
coef_df = pd.DataFrame({
    'feature': X.columns,
    'coefficient': model.coef_,
    'abs_importance': np.abs(model.coef_)
}).sort_values('abs_importance', ascending=False)
print("\nCoefficients (standardized — comparable across features):")
print(coef_df[['feature','coefficient']].to_string(index=False))

# Residual diagnostic plots
fig, axes = plt.subplots(2, 2, figsize=(12, 10))

# 1. Predicted vs Actual
axes[0,0].scatter(y_pred, y_te, alpha=0.3, s=10, color='steelblue')
axes[0,0].plot([y_te.min(), y_te.max()], [y_te.min(), y_te.max()], 'r--', lw=2)
axes[0,0].set_xlabel('Predicted'); axes[0,0].set_ylabel('Actual')
axes[0,0].set_title(f'Predicted vs Actual (R²={r2_score(y_te,y_pred):.3f})')

# 2. Residuals vs Predicted (should be random)
axes[0,1].scatter(y_pred, residuals, alpha=0.3, s=10, color='steelblue')
axes[0,1].axhline(0, color='red', lw=2)
axes[0,1].set_xlabel('Predicted'); axes[0,1].set_ylabel('Residual')
axes[0,1].set_title('Residuals vs Predicted (check for patterns)')

# 3. Residual distribution (should be normal)
axes[1,0].hist(residuals, bins=50, color='steelblue', edgecolor='white', alpha=0.8)
axes[1,0].axvline(0, color='red', lw=2)
axes[1,0].set_xlabel('Residual'); axes[1,0].set_ylabel('Count')
axes[1,0].set_title('Residual Distribution (should be normal)')

# 4. Feature importances
coef_df_plot = coef_df.head(8)
colors = ['steelblue' if c > 0 else 'coral' for c in coef_df_plot['coefficient']]
axes[1,1].barh(coef_df_plot['feature'], coef_df_plot['coefficient'], color=colors)
axes[1,1].axvline(0, color='black', lw=1)
axes[1,1].set_title('Standardized Coefficients\n(blue=positive, red=negative)')

plt.tight_layout()
plt.savefig('/tmp/linear_regression_report.png', dpi=150, bbox_inches='tight')
print("\nReport saved to /tmp/linear_regression_report.png")`
    }
  ],
  bonus: 'Test the 4 assumptions of linear regression: linearity (residuals vs fitted), independence (Durbin-Watson test), homoscedasticity (Breusch-Pagan test), normality (Shapiro-Wilk on residuals). Report which assumptions hold and which are violated, and what to do about each violation.'
}));

addProject('p3-multiple-reg', projectCard({
  title: 'Regularization Showdown — Ridge vs Lasso on High-Dimensional Data',
  tagline: 'Systematically compare OLS, Ridge, Lasso, and ElasticNet on datasets with multicollinearity, sparse signals, and noise features.',
  tags: ['Ridge', 'Lasso', 'ElasticNet', 'Regularization', 'Feature Selection', 'Cross-Validation'],
  difficulty: 'Intermediate',
  time: '3–4 hours',
  dataset: 'Three synthetic datasets (multicollinear, sparse, and noisy)',
  goal: 'Run a controlled experiment: create three scenarios where each regularizer wins, and prove it with cross-validation. Build a visual showing the regularization path (how coefficients shrink as alpha increases). Explain when to choose each.',
  why: 'Regularization is one of the most tested ML interview topics. Being able to say "I ran an experiment comparing all three on multicollinear vs sparse data and here\'s what I found" is far more convincing than reciting the textbook definition.',
  parts: [
    {
      title: 'Three experiments, three winners',
      desc: 'Design datasets where each regularizer has the advantage, then prove it.',
      code: `import numpy as np
import pandas as pd
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from sklearn.linear_model import Ridge, Lasso, ElasticNet, LinearRegression, RidgeCV, LassoCV
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import r2_score

np.random.seed(42)

def make_multicollinear(n=300, p=20):
    """OLS fails, Ridge wins — correlated features."""
    X = np.random.randn(n, 5)
    # Add 15 columns that are near-duplicates of the first 5
    noise = np.random.randn(n, 15) * 0.05
    X_corr = np.column_stack([X, X[:, :5].repeat(3, axis=1) + noise])
    y = X[:, :3] @ np.array([2, -1.5, 0.8]) + np.random.randn(n) * 0.5
    return X_corr, y

def make_sparse(n=300, p=50):
    """OLS and Ridge fail, Lasso wins — only 3 of 50 features matter."""
    X = np.random.randn(n, p)
    true_coef = np.zeros(p)
    true_coef[[0, 5, 12]] = [3, -2, 1.5]
    y = X @ true_coef + np.random.randn(n) * 0.5
    return X, y, true_coef

def make_noisy(n=200, p=100):
    """All fail without regularization — high-dimensional noise."""
    X = np.random.randn(n, p)
    true_coef = np.zeros(p)
    true_coef[:10] = np.random.randn(10)
    y = X @ true_coef + np.random.randn(n)
    return X, y

scaler = StandardScaler()

print("=" * 55)
print("EXPERIMENT 1: Multicollinear Data (Ridge should win)")
print("=" * 55)
X, y = make_multicollinear()
X_s = scaler.fit_transform(X)
X_tr, X_te, y_tr, y_te = train_test_split(X_s, y, test_size=0.25, random_state=42)

for name, model in [
    ('OLS', LinearRegression()),
    ('Ridge(a=1)', Ridge(alpha=1)),
    ('Ridge(a=10)', Ridge(alpha=10)),
    ('Lasso(a=0.1)', Lasso(alpha=0.1)),
]:
    model.fit(X_tr, y_tr)
    cv = cross_val_score(model, X_s, y, cv=10).mean()
    print(f"  {name:<20}: CV R² = {cv:.4f}")

print("\n" + "=" * 55)
print("EXPERIMENT 2: Sparse Signal (Lasso should win)")
print("=" * 55)
X, y, true_coef = make_sparse()
X_s = scaler.fit_transform(X)
X_tr, X_te, y_tr, y_te = train_test_split(X_s, y, test_size=0.25, random_state=42)

for name, model in [
    ('OLS', LinearRegression()),
    ('Ridge(a=1)', Ridge(alpha=1)),
    ('Lasso(a=0.1)', Lasso(alpha=0.1, max_iter=10000)),
    ('ElasticNet', ElasticNet(alpha=0.1, l1_ratio=0.5)),
]:
    model.fit(X_tr, y_tr)
    cv = cross_val_score(model, X_s, y, cv=10).mean()
    # Check feature selection for Lasso
    nonzero = '' if not hasattr(model, 'coef_') else f" | nonzero: {(model.coef_!=0).sum()}/{len(model.coef_)}"
    print(f"  {name:<20}: CV R² = {cv:.4f}{nonzero}")

print("\n" + "=" * 55)
print("EXPERIMENT 3: Regularization Path (how alpha affects coefficients)")
print("=" * 55)
X, y, true_coef = make_sparse(n=200, p=20)
X_s = scaler.fit_transform(X)

alphas = np.logspace(-3, 2, 100)
ridge_coefs = []
lasso_coefs = []

for a in alphas:
    r = Ridge(alpha=a).fit(X_s, y)
    l = Lasso(alpha=a, max_iter=10000).fit(X_s, y)
    ridge_coefs.append(r.coef_)
    lasso_coefs.append(l.coef_)

fig, axes = plt.subplots(1, 2, figsize=(14, 6))
fig.suptitle('Regularization Path: How Coefficients Shrink with Alpha', fontsize=13, fontweight='bold')

for ax, coefs, title in [
    (axes[0], ridge_coefs, 'Ridge (L2): All Shrink Gradually'),
    (axes[1], lasso_coefs, 'Lasso (L1): Coefficients Hit Zero (Sparse)')
]:
    coefs_arr = np.array(coefs)
    for i in range(coefs_arr.shape[1]):
        color = 'steelblue' if true_coef[i] != 0 else 'gray'
        alpha_val = 0.9 if true_coef[i] != 0 else 0.2
        lw = 2 if true_coef[i] != 0 else 0.8
        ax.plot(np.log10(alphas), coefs_arr[:, i], color=color, alpha=alpha_val, lw=lw)
    ax.axhline(0, color='black', lw=1)
    ax.set_xlabel('log10(alpha)'); ax.set_ylabel('Coefficient value')
    ax.set_title(title)
    ax.text(0.05, 0.95, 'Blue = true signal features', transform=ax.transAxes,
            fontsize=9, color='steelblue', va='top')

plt.tight_layout()
plt.savefig('/tmp/regularization_path.png', dpi=150, bbox_inches='tight')
print("Regularization path saved to /tmp/regularization_path.png")`
    }
  ],
  bonus: 'Implement a custom stability selection algorithm: run Lasso 100 times on bootstrap samples and plot the selection frequency for each feature. Features selected >70% of the time are the reliable signal — compare this to a single Lasso run.'
}));

// ============================================================
// Tracking report
// ============================================================
let added = 0;
const projectSections = [
  'p0-linalg','p0-calculus','p0-prob',
  'pn-arrays','pn-indexing','pn-operations',
  'pp-loading','pp-selection','pp-cleaning','pp-apply',
  'pv-matplotlib','pv-seaborn',
  'p3-linear-scratch','p3-multiple-reg'
];

projectSections.forEach(id => {
  if (CONTENT.sections[id]) added++;
  else console.warn('[projects] Could not add project to:', id);
});

console.log('[content-projects] Added capstone projects to', added, 'sections');

})();

// ============================================================
// BATCH 2 — ALL REMAINING SECTIONS
// ============================================================
(function() {

function addProject(sectionId, projectHTML) {
  const s = CONTENT.sections[sectionId];
  if (!s) { console.warn('[projects-b2] section not found:', sectionId); return; }
  s.html += projectHTML;
}

function pc(title, tagline, tags, difficulty, time, dataset, goal, why, steps, bonus) {
  const tagHtml = tags.map(t =>
    `<span style="display:inline-block;padding:2px 10px;border-radius:20px;background:var(--accent-soft);color:var(--accent);font-size:11px;font-weight:600;margin-right:6px;margin-bottom:4px">${t}</span>`
  ).join('');
  const stepsHtml = steps.map((s,i) =>
    `<div style="display:flex;gap:14px;margin-bottom:18px;align-items:flex-start">
      <div style="min-width:30px;height:30px;border-radius:50%;background:var(--accent);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:13px;flex-shrink:0">${i+1}</div>
      <div style="font-size:13.5px;line-height:1.7;color:var(--text)">${s}</div>
    </div>`
  ).join('');
  return `
  <div style="margin-top:48px;padding:26px 28px;border:2px solid var(--accent);border-radius:14px;background:var(--surface)">
    <div style="font-size:11px;font-weight:700;letter-spacing:1.5px;color:var(--accent);text-transform:uppercase;margin-bottom:8px">★ Section Capstone Project</div>
    <h2 style="margin:0 0 6px;font-size:21px">${title}</h2>
    <p style="margin:0 0 14px;color:var(--text-muted);font-size:14px">${tagline}</p>
    <div style="margin-bottom:14px">${tagHtml}</div>
    <div style="display:flex;gap:20px;margin-bottom:16px;font-size:12px;color:var(--text-muted);flex-wrap:wrap">
      <span>⏱ ${time}</span><span>📊 ${dataset}</span><span>🎯 ${difficulty}</span>
    </div>
    <div style="padding:12px 16px;background:var(--accent-soft);border-radius:8px;margin-bottom:14px;font-size:13.5px;line-height:1.7"><strong>Goal:</strong> ${goal}</div>
    <div style="padding:11px 15px;background:rgba(255,200,50,0.07);border-left:3px solid var(--accent-2);border-radius:0 8px 8px 0;margin-bottom:20px;font-size:13px;line-height:1.6"><strong>Why recruiters care:</strong> ${why}</div>
    ${stepsHtml}
    ${bonus ? `<div style="margin-top:16px;padding:11px 15px;border-radius:8px;background:var(--surface-2);font-size:13px"><strong>🚀 Stretch:</strong> ${bonus}</div>` : ''}
  </div>`;
}

// ---- PART 1: Data Preprocessing ----

addProject('p1-loading', pc(
  'Automated EDA Report Generator',
  'Drop any CSV in, get a structured HTML quality report out.',
  ['Pandas','EDA','Data Quality','Profiling'],
  'Beginner','2–3 hrs','Any CSV you have',
  'Write a DataProfiler class that inspects any DataFrame and prints: shape, dtypes, missing %, unique counts, numeric distributions, and high-correlation alerts — all in one call.',
  'Every ML project starts with "understand your data." Automating this is a real skill that saves hours and shows systematic thinking.',
  [
    'Read the dataset and call <code>df.info()</code>, <code>df.describe(include="all")</code>, <code>df.isnull().mean()</code>',
    'Flag columns with >20% missing, >95% same value (near-zero variance), and |correlation| > 0.9 pairs',
    'Output a formatted report with color-coded warnings (use ANSI codes or just print clearly)',
    'Test on 3 different datasets: structured (Titanic), wide (California Housing), messy (synthetic with injected nulls)'
  ],
  'Export as a self-contained HTML file with a table per section, clickable column names, and a "ML readiness score" from 0–100.'
));

addProject('p1-missing', pc(
  'Missing Data Imputation Benchmark',
  'Compare 6 imputation strategies on the same dataset and show which minimizes downstream model error.',
  ['Pandas','sklearn','KNNImputer','IterativeImputer','Missing Data'],
  'Intermediate','3 hrs','sklearn California Housing (with injected missingness)',
  'Inject 15% MCAR, 15% MAR, and 10% MNAR missingness into California Housing. Apply 6 strategies: drop rows, mean/median imputation, KNN imputation, iterative imputation, and indicator + impute. Train a Random Forest after each and compare test RMSE.',
  'Interviewers ask "how do you handle missing data?" A thoughtful answer lists strategies. A great answer says "I benchmarked them and here is when each wins."',
  [
    'Create a function that injects missing values under MCAR (completely random), MAR (missing if another column is high), and MNAR (missing if the value itself is extreme) patterns',
    'Apply each imputation strategy using sklearn pipelines so there is zero data leakage between train and test',
    'Train a RandomForestRegressor after each strategy, record 5-fold CV RMSE',
    'Build a results table: strategy × missingness_type → RMSE. Identify which strategy wins for each pattern'
  ],
  'Add a visual: heatmap of missingness pattern before and after each strategy, plus a bar chart of RMSE by strategy.'
));

addProject('p1-encoding', pc(
  'Encoding Strategy Benchmark — Categorical Features',
  'Prove empirically which encoding wins on high-cardinality vs low-cardinality vs ordinal features.',
  ['Pandas','sklearn','One-Hot','Target Encoding','Label Encoding','Ordinal'],
  'Intermediate','3 hrs','Synthetic + Ames Housing',
  'Test 5 encoding strategies (OHE, label, ordinal, target, frequency) on columns with different cardinality. Compare downstream Random Forest accuracy. Show that target encoding beats OHE on high-cardinality columns but risks leakage without CV.',
  'Encoding is a common interview topic. Most people say "use one-hot for categoricals" — which is wrong for high-cardinality features. Showing the benchmark makes you memorable.',
  [
    'Create three feature types: low-cardinality (5 categories), high-cardinality (200 categories), ordinal (education level)',
    'Apply each encoder inside a Pipeline to prevent leakage. For target encoding, use cross_val_predict to get out-of-fold target means',
    'Train RandomForest after each, record 5-fold CV accuracy',
    'Discuss: when does each encoding win? What is the cardinality threshold where OHE becomes painful?'
  ],
  'Add embedding encoding using a simple neural net (nn.Embedding in PyTorch) and compare it on the high-cardinality column.'
));

addProject('p1-scaling', pc(
  'Feature Scaling Impact Study',
  'Show exactly which algorithms break without scaling and which are immune — with numbers.',
  ['Pandas','sklearn','StandardScaler','MinMaxScaler','RobustScaler'],
  'Beginner','2 hrs','sklearn Breast Cancer + California Housing',
  'Train KNN, SVM, Logistic Regression, Random Forest, and Gradient Boosting with and without StandardScaler. Record accuracy/RMSE for each. Prove: tree-based models are immune; distance/gradient-based models are not.',
  'Everyone knows "scale your features" but few can explain which algorithms need it and why. Showing the before/after numbers is a memorable answer.',
  [
    'Create a loop that trains each model with: no scaling, StandardScaler, MinMaxScaler, RobustScaler',
    'Record CV score for each combination in a DataFrame',
    'Plot a heatmap: model × scaler → score, with color showing improvement over no-scaling baseline',
    'Add a column of synthetic outliers and show that RobustScaler wins when outliers are present'
  ],
  'Add QuantileTransformer and PowerTransformer (Box-Cox) and show they help when features are heavily skewed.'
));

addProject('p1-outliers', pc(
  'Outlier Detection Shootout — 4 Methods Compared',
  'Find outliers in a financial dataset using IQR, Z-score, Isolation Forest, and Local Outlier Factor.',
  ['Pandas','sklearn','IsolationForest','LOF','Outlier Detection'],
  'Intermediate','3 hrs','Simulated financial transaction data',
  'Generate a realistic transaction dataset with 3 types of anomalies (point outliers, contextual outliers, collective outliers). Apply 4 detection methods. Measure precision/recall against true anomaly labels. Show that different methods catch different anomaly types.',
  'Anomaly detection is used in fraud detection, predictive maintenance, and network security. Understanding when IQR fails (contextual anomalies) vs when Isolation Forest succeeds is a concrete, demonstrable skill.',
  [
    'Generate 1000 normal transactions + 50 injected anomalies of 3 types: extreme values (IQR catches), unusual time-pattern (contextual), coordinated small frauds (collective)',
    'Apply IQR, Z-score, IsolationForest, and LOF. Tune each to target 5% anomaly rate',
    'Build a confusion matrix for each method against the true labels',
    'Show precision/recall tradeoff: which method has fewer false positives? Which catches more true anomalies?'
  ],
  'Add DBSCAN as a 5th method and show it excels at collective anomalies because it finds clusters — then flag all small clusters as suspicious.'
));

addProject('p1-engineering', pc(
  'Feature Engineering for Tabular Data — 15 Techniques on One Dataset',
  'Transform raw features into a 3x richer feature set and prove it improves model performance.',
  ['Pandas','Feature Engineering','sklearn','Domain Knowledge'],
  'Intermediate','4 hrs','Titanic or Ames Housing',
  'Apply 15 feature engineering techniques to a tabular dataset: binning, interactions, ratios, polynomial, datetime extraction, target encoding, aggregations, lag features, rank transforms, log transforms, indicators, text length, regex extraction, groupby stats, and rolling windows.',
  'Feature engineering is often more valuable than model selection. A well-engineered dataset with logistic regression can beat a poorly-prepared dataset with XGBoost. This is the skill that separates senior MLEs from beginners.',
  [
    'Start with baseline model on raw features, record CV score as the benchmark to beat',
    'Apply each of the 15 techniques and record incremental CV improvement',
    'Use permutation importance to find which engineered features matter most',
    'Final model: raw features vs all engineered features. Show % improvement'
  ],
  'Build an AutoFE class that automatically generates interaction terms, ratio features, and log transforms for any numerical DataFrame and uses cross-validation to keep only the ones that improve the model.'
));

addProject('p1-pipeline', pc(
  'Production ML Pipeline — Sklearn Pipeline End to End',
  'Build a leak-proof preprocessing + model pipeline, serialize it, and show it handles unseen categories and new data.',
  ['sklearn','Pipeline','ColumnTransformer','joblib','Production ML'],
  'Intermediate','3 hrs','Adult Income Census dataset',
  'Build a complete sklearn Pipeline covering: numeric imputation + scaling, categorical imputation + encoding, feature selection, and model. Serialize with joblib. Test that it handles: new categories at inference, missing values at inference, and different column order.',
  'A pipeline that works in a notebook but breaks in production is worthless. This project shows you know how to build production-safe preprocessing — one of the most common ML engineering interview topics.',
  [
    'Build ColumnTransformer: numeric branch (median impute → StandardScaler), categorical branch (constant impute → OHE with handle_unknown=infrequent_if_exist)',
    'Add SelectKBest feature selection after the transformer, then LogisticRegression',
    'Serialize with joblib.dump and reload in a fresh Python session — verify predictions match',
    'Test edge cases: send a row with a brand new category, a row with all nulls, a DataFrame with columns in wrong order'
  ],
  'Wrap the pipeline in a FastAPI endpoint with Pydantic validation so it can receive JSON and return a prediction with a confidence score.'
));

addProject('p1-imbalanced', pc(
  'Imbalanced Classification — Fraud Detection with 99:1 Class Ratio',
  'Handle extreme class imbalance on a fraud dataset using 6 strategies and compare with proper metrics.',
  ['sklearn','imbalanced-learn','SMOTE','class_weight','Precision-Recall','Fraud Detection'],
  'Intermediate','3–4 hrs','Simulated credit card fraud (1% positive rate)',
  'Generate a realistic fraud dataset with 1% positive rate. Compare: no handling, class_weight, undersampling, SMOTE oversampling, SMOTEENN combined, and threshold tuning. Evaluate with AUC-PR (not AUC-ROC, which lies on imbalanced data). Pick the best strategy for a real business scenario.',
  'Fraud detection is one of the most common ML interview case studies. Most candidates say "use SMOTE" — a great answer explains when SMOTE hurts (it can create noise in high-dimensional data) and shows the business tradeoff between precision and recall.',
  [
    'Generate 50,000 transactions with 500 frauds. Add realistic features: amount, time, merchant category, device',
    'Train baseline LogisticRegression with no imbalance handling. Show that 99% accuracy is misleading',
    'Apply each strategy inside a Pipeline. Evaluate each using: AUC-PR, F1, precision@k (precision in top 1% of predictions)',
    'Plot the precision-recall curve for each strategy. Show the business interpretation: at 80% recall (catch 80% of fraud), what is the false positive rate for each strategy?'
  ],
  'Build a cost-sensitive evaluation: if a missed fraud costs $200 and a false alarm costs $5 (manual review), find the optimal decision threshold for each strategy that minimizes total cost.'
));

// ---- PART 2: Math Sections ----

addProject('p2-bias-variance', pc(
  'Bias-Variance Decomposition — Visual Proof on Real Data',
  'Empirically demonstrate the bias-variance tradeoff by training 100 models and decomposing the error.',
  ['NumPy','sklearn','Bias-Variance','Model Complexity','Ensemble'],
  'Intermediate','3 hrs','Synthetic + sklearn datasets',
  'Generate 100 bootstrap training sets. On each, train models of increasing complexity (polynomial degree 1 to 15). For each complexity level compute: average bias², average variance, and total error. Plot the classic U-curve. Show that ensembling reduces variance without touching bias.',
  'The bias-variance tradeoff is asked in every ML interview. Most people define it. You can demonstrate it with a plot you generated yourself.',
  [
    'Write bias_variance_decompose(model, X, y, n_bootstrap=100) that returns (bias_sq, variance, noise)',
    'Run for polynomial regression degrees 1–15. Plot bias², variance, and total MSE vs degree',
    'Show the same plot for a Random Forest (high trees = low bias, high variance) vs a single tree',
    'Show ensembling: average predictions from 50 high-variance models → variance drops, bias unchanged'
  ],
  'Implement bagging from scratch on polynomial models: train 100 high-complexity models on bootstrap samples, average predictions, and show the variance drop numerically.'
));

addProject('p2-metrics', pc(
  'Evaluation Metrics Deep Dive — When Each Metric Lies',
  'Show on real data when accuracy is misleading, when AUC-ROC is misleading, and when to use each metric.',
  ['sklearn','Metrics','Confusion Matrix','ROC','Precision-Recall','F1'],
  'Intermediate','3 hrs','Imbalanced cancer screening dataset',
  'Build 5 classifiers that all achieve 97% accuracy on a 97:3 imbalanced dataset — but have wildly different clinical usefulness. Show why accuracy fails. Then rank them by precision, recall, F1, AUC-ROC, AUC-PR, and MCC. Explain which metric a doctor would care about vs what a bank would care about.',
  'Every ML interview asks "what metric do you use?" The answer depends on the business problem. Being able to show concrete numbers where different metrics disagree — and explain why — is a senior-level skill.',
  [
    'Build the "always predict negative" baseline that gets 97% accuracy by never predicting cancer',
    'Build 5 models with different precision/recall tradeoffs by adjusting decision thresholds',
    'Compute accuracy, precision, recall, F1, AUC-ROC, AUC-PR, MCC for all 5',
    'Explain in plain English: "A hospital cares about recall (never miss cancer). A spam filter cares about precision (never block important email). A fraud model needs both."'
  ],
  'Add a calibration comparison: show that a model can have perfect AUC but terrible calibration (predicted probabilities are systematically wrong), and explain why calibration matters for decision thresholds.'
));

// ---- PART 3: Regression remaining ----

addProject('p3-linear', pc(
  'Salary Prediction Model — Linear Regression on Real Job Data',
  'Build an interpretable salary predictor with full EDA, feature engineering, and coefficient explanation.',
  ['Linear Regression','Pandas','Seaborn','Feature Engineering','Interpretation'],
  'Beginner','3 hrs','Simulated tech salary survey data',
  'Simulate a tech salary dataset with features: years experience, education, role, company size, location. Engineer features (experience², log(salary), role indicators). Build a linear model. Output a coefficient table that explains to a non-technical HR manager what drives salary.',
  'Interpretability is one of the most valuable skills in applied ML. When you can explain exactly why your model predicts what it predicts — in plain English, not just SHAP plots — you build trust with stakeholders.',
  [
    'Generate 2000 rows of salary data with realistic distributions (lognormal salaries, correlated experience/education)',
    'EDA: distribution of salaries, salary by role/education/experience scatter, correlation heatmap',
    'Feature engineer: experience bins, interaction terms (senior*bigtech), log(salary) as target for better normality',
    'Fit LinearRegression, report adjusted R², and build a plain-English coefficient table: "Each year of experience adds $X to predicted salary, controlling for other factors"'
  ],
  'Add a "what-if" analysis: given a specific person\'s current profile, how much would their predicted salary increase if they: (a) got an MS degree, (b) moved to San Francisco, (c) switched to a senior role?'
));

addProject('p3-poly', pc(
  'Polynomial Regression — Degree Selection with Cross-Validation',
  'Find the optimal polynomial degree that generalizes — not just the one that memorizes the training data.',
  ['Polynomial Regression','sklearn','Pipeline','Cross-Validation','Regularization'],
  'Beginner–Intermediate','2–3 hrs','Energy consumption vs temperature (synthetic)',
  'Model the nonlinear relationship between temperature and energy consumption. Compare degrees 1–12. Use 5-fold CV to select degree. Show training vs validation error curves. Add Ridge regularization to the winning degree and show it handles noise better.',
  'Polynomial regression demonstrates the overfitting problem more clearly than almost any other algorithm — you can literally see the curve wiggle between data points. This makes it a great teaching and interview example.',
  [
    'Generate realistic energy-temperature data with a cubic relationship + noise',
    'Train polynomial models of degree 1–12. Plot all fitted curves on the same graph',
    'Plot training RMSE vs validation RMSE vs degree — identify the elbow (bias-variance tradeoff visually)',
    'Add Ridge regularization to degree-10 model. Show it recovers a smooth curve even with high degree'
  ],
  'Implement leave-one-out cross-validation manually and compare the selected degree to 5-fold and 10-fold CV. Show they agree or disagree and explain why.'
));

addProject('p3-dt-reg', pc(
  'Decision Tree Depth Study — Growing and Pruning',
  'Visualize exactly what happens as a regression tree grows: from underfitting to memorizing individual points.',
  ['Decision Tree','sklearn','Tree Visualization','Pruning','Feature Importance'],
  'Beginner','2 hrs','Boston Housing (sklearn)',
  'Train regression trees from max_depth=1 to max_depth=20 on housing data. For each, record train RMSE, test RMSE, number of leaves, and the top split feature. Visualize the tree at depth 3 and depth 8. Show how cost-complexity pruning finds the optimal depth.',
  'Decision trees are the most interpretable model in ML and the foundation of Random Forest and XGBoost. Understanding exactly how depth controls bias-variance — visually — is a foundational skill.',
  [
    'Train trees at depths 1–20 inside a loop. Record train/test RMSE and n_leaves',
    'Plot train vs test RMSE vs depth — identify the optimal depth from the validation curve',
    'Visualize the tree at depth=3 using sklearn.tree.plot_tree — trace a prediction by hand',
    'Apply cost-complexity pruning (ccp_alpha search) and show it finds the same depth as cross-validation'
  ],
  'Add a partial dependence plot for the top 2 features in the pruned tree. Show how the tree\'s step-function predictions compare to a smooth polynomial fit.'
));

addProject('p3-rf-reg', pc(
  'Random Forest Hyperparameter Tuning — Systematic Grid Search',
  'Find the optimal Random Forest config for a regression task using RandomizedSearchCV and manual analysis.',
  ['Random Forest','GridSearchCV','RandomizedSearchCV','Feature Importance','SHAP'],
  'Intermediate','3–4 hrs','Ames Housing dataset',
  'Build a complete Random Forest tuning pipeline: start with defaults, tune n_estimators with OOB error, tune max_features/max_depth/min_samples_leaf with RandomizedSearchCV, then analyze feature importance and partial dependence for the top 5 features.',
  'Random Forest is the most commonly deployed ML model in industry (alongside XGBoost). Being able to systematically tune it and explain what each hyperparameter does is a core practical skill.',
  [
    'Baseline: RandomForest with n_estimators=100, all defaults. Record CV RMSE',
    'OOB error curve: plot OOB error vs n_estimators from 10 to 500. Find where it plateaus',
    'RandomizedSearchCV over: max_features (sqrt, log2, 0.3, 0.5), max_depth (None, 10, 20, 30), min_samples_leaf (1, 2, 5)',
    'Feature importance: bar chart of top 20 features. Permutation importance (compare to impurity importance). SHAP summary plot'
  ],
  'Implement early stopping for the random search: stop adding trees when the OOB improvement is less than 0.001 for 20 consecutive trees. This is the technique used in production to control training time.'
));

addProject('p3-xgb-reg', pc(
  'XGBoost vs LightGBM vs CatBoost — Gradient Boosting Showdown',
  'Benchmark the three major gradient boosting libraries on the same dataset with proper tuning.',
  ['XGBoost','LightGBM','CatBoost','Hyperparameter Tuning','Benchmarking'],
  'Advanced','4–5 hrs','Rossmann Store Sales (kaggle-style)',
  'On a retail sales forecasting dataset, tune and compare XGBoost, LightGBM, and CatBoost. Record: CV RMSE, training time, inference time, memory usage, and feature importance agreement. Identify which wins and when.',
  'Gradient boosting is the dominant ML algorithm for tabular data in industry and Kaggle competitions. Knowing the tradeoffs between the three major implementations — speed, accuracy, categorical handling — is a genuine senior skill.',
  [
    'Generate a realistic retail sales dataset: 100k rows, date features, store features, product features, promotions',
    'Tune each library with Optuna (or RandomizedSearchCV) using the same budget (50 trials, same CV setup)',
    'Record training time, best CV RMSE, and inference time (predictions per second) for each',
    'Build a feature importance agreement matrix: do all three agree on the top 10 features? Plot the correlation of their importance rankings'
  ],
  'Add an ensemble: weighted average of the three models where weights are set by Optuna to minimize CV error. Show the ensemble beats any single model.'
));

addProject('p3-svr', pc(
  'Support Vector Regression — Kernel Comparison and Margin Analysis',
  'Visualize SVR margins, compare kernels, and show why SVR wins on small clean datasets.',
  ['SVR','sklearn','Kernel Methods','RBF','Hyperparameter Tuning'],
  'Intermediate','3 hrs','Energy efficiency dataset (UCI)',
  'Apply SVR with linear, RBF, and polynomial kernels to a regression task. Tune C and epsilon with GridSearchCV. Visualize the epsilon-insensitive tube (the margin) on a 1D example. Show when SVR beats Linear Regression (nonlinear data) and when it loses (large n).',
  'SVR is rarely the first choice but it matters for understanding kernel methods, which appear in kernel PCA, Gaussian Processes, and SVM classifiers. The epsilon-insensitive tube concept is a clean, memorable visual.',
  [
    'On a 1D synthetic dataset, visualize the SVR fit with the epsilon tube: points inside the tube do not affect the model',
    'Compare RBF, linear, and poly(3) kernels on energy efficiency dataset. Record CV RMSE for each',
    'Grid search over C (0.1 to 100) and epsilon (0.01 to 1.0) for RBF kernel. Plot a heatmap of CV RMSE over the grid',
    'Scaling comparison: SVR with StandardScaler vs without. Show the massive performance difference (SVR is very sensitive to scale)'
  ],
  'Plot the support vectors for the 1D example — the training points that define the boundary of the tube. Show that removing non-support vectors from the training set gives identical predictions.'
));

addProject('p3-knn-reg', pc(
  'KNN Regression — The k-Selection Problem',
  'Show how to pick k using cross-validation and why distance weighting helps on noisy data.',
  ['KNN','sklearn','Cross-Validation','Curse of Dimensionality','Distance Weighting'],
  'Beginner','2 hrs','California Housing',
  'Train KNN regressors for k=1 to 100 on California Housing. Plot CV RMSE vs k. Compare uniform vs distance weighting. Then demonstrate the curse of dimensionality: add 50 random noise features and show KNN performance collapses while Random Forest is barely affected.',
  'KNN is the simplest "real" ML algorithm. It is conceptually important because it makes the geometry of feature space explicit. The curse of dimensionality demo is one of the clearest explanations of why high-dimensional data is hard.',
  [
    'Train KNNRegressor for k=1,2,3,...,50 with both uniform and distance weighting. Plot CV RMSE curves',
    'Find optimal k using 5-fold CV. Show the bias-variance tradeoff: k=1 memorizes, k=50 is too smooth',
    'Curse of dimensionality: add 10, 20, 50 random noise features. Plot KNN RMSE vs n_noise_features. Contrast with Random Forest on the same data',
    'Distance weighting analysis: show which training points most influence each test prediction by plotting their contributions'
  ],
  'Implement a from-scratch KNN regressor using the fast pairwise distance method from the NumPy section and compare its speed to sklearn\'s ball-tree implementation on 10k vs 100k samples.'
));

// ---- PART 4: Classification ----

addProject('p4-logistic', pc(
  'Logistic Regression from Scratch — Binary and Multiclass',
  'Implement logistic regression with gradient descent, cross-entropy loss, and regularization.',
  ['Logistic Regression','Gradient Descent','Cross-Entropy','OVR','Softmax'],
  'Intermediate','3–4 hrs','sklearn Breast Cancer + Iris',
  'Build binary logistic regression from scratch with NumPy. Extend to multiclass with both OVR and Softmax. Then use sklearn\'s version and verify the coefficients match. Visualize the decision boundary on 2D feature pairs.',
  'Logistic regression is the foundation of neural network output layers. Understanding it deeply — the log-odds, the gradient of cross-entropy, why L2 regularization is natural — makes every other model more interpretable.',
  [
    'Build LogisticRegressionScratch with .fit() using gradient descent and .predict_proba(). Loss: binary cross-entropy',
    'Visualize the sigmoid function and show how the decision threshold shifts with class imbalance',
    'Extend to multiclass: implement OVR (train N binary classifiers) and Softmax (single model with softmax output)',
    'Verify against sklearn: after both converge, compare coefficients and predictions on the test set. They should match within 1%'
  ],
  'Add L1 regularization using proximal gradient descent (the standard way to handle L1 in logistic regression) and compare the sparsity of coefficients to L2 at the same regularization strength.'
));

addProject('p4-dt-cls', pc(
  'Decision Tree Classifier — Build a CART Algorithm from Scratch',
  'Implement the CART algorithm: recursive binary splitting using Gini impurity, then visualize every split.',
  ['Decision Tree','CART Algorithm','Gini Impurity','Information Gain','Scratch'],
  'Advanced','4–5 hrs','Iris + Breast Cancer',
  'Implement the full CART algorithm from scratch: compute Gini impurity, find the best split for each feature, recursively build the tree, implement predict(). Visualize every node\'s split condition and the samples it contains.',
  'CART is the algorithm that powers Random Forest, XGBoost, and LightGBM. Building it from scratch proves you understand why trees split the way they do — which is essential for debugging ensemble models.',
  [
    'Implement gini_impurity(y) and weighted_gini(y_left, y_right). Test on toy examples where you know the answer',
    'Implement best_split(X, y) that tries every feature and threshold. Return the feature/threshold with lowest weighted Gini',
    'Implement grow_tree(X, y, depth, max_depth) recursively. Store splits as a nested dict',
    'Compare to sklearn DecisionTreeClassifier: same data, same max_depth. Verify accuracy and split conditions match'
  ],
  'Add entropy and information gain as an alternative splitting criterion. Compare Gini vs entropy on 5 different datasets and show they almost always agree on which split to make, but Gini is faster to compute.'
));

addProject('p4-rf-cls', pc(
  'Random Forest Explained — OOB Score, Feature Importance, and Partial Dependence',
  'Go beyond training a Random Forest to understanding exactly what it learned and why.',
  ['Random Forest','OOB Score','Feature Importance','SHAP','Partial Dependence'],
  'Intermediate','3–4 hrs','Heart Disease / Diabetes Classification',
  'Train a Random Forest classifier. Compute OOB score manually (understand why it is an unbiased estimate). Compute permutation importance vs Gini importance and explain when they disagree. Generate SHAP summary and waterfall plots. Build partial dependence plots for the top 3 features.',
  'Everyone can train a Random Forest. Being able to interpret it — explain what it learned, which features it relies on, and how sensitive it is to individual features — is a senior MLE skill that directly impacts trust and deployment decisions.',
  [
    'Train RF with oob_score=True. Manually verify the OOB score by iterating each tree and using only trees that did not see a particular sample',
    'Compare Gini importance vs permutation importance on a dataset with a correlated feature pair. Show they disagree and explain why (Gini inflates correlated features)',
    'Use shap.TreeExplainer to generate summary plot and a waterfall plot for 3 individual predictions. Explain what each shows',
    'Build partial dependence plots for top 3 features. For each, write a plain-English sentence explaining the relationship'
  ],
  'Implement a from-scratch partial dependence plot: for a range of values of feature j, set all rows to that value and average the predictions. Verify it matches sklearn\'s PartialDependenceDisplay.'
));

addProject('p4-xgb-cls', pc(
  'XGBoost Deep Dive — From Boosting Math to Production Model',
  'Train, tune, and interpret an XGBoost classifier with early stopping, SHAP explanations, and threshold optimization.',
  ['XGBoost','Boosting','SHAP','Early Stopping','Class Imbalance','Optuna'],
  'Advanced','4–5 hrs','Credit Default Prediction',
  'Build a complete XGBoost credit default predictor: handle class imbalance with scale_pos_weight, use early stopping on a validation set to prevent overfitting, tune hyperparameters with Optuna, generate SHAP explanations, and optimize the decision threshold for a custom business cost function.',
  'XGBoost wins more Kaggle competitions than any other single model. Being able to tune it systematically, handle class imbalance correctly, and explain its predictions with SHAP is a complete production ML skill set.',
  [
    'Baseline XGBoost on credit default data. Discuss: why accuracy is the wrong metric here, set up AUC-PR as the objective',
    'Early stopping: set 20% as validation, use eval_metric=\'aucpr\', early_stopping_rounds=50. Plot train vs validation AUC-PR curve',
    'Optuna study: 100 trials over learning_rate, max_depth, min_child_weight, subsample, colsample_bytree. Plot the hyperparameter importance',
    'SHAP: global summary plot + 3 individual loan applications. For each, write the explanation a loan officer would give the customer'
  ],
  'Build a cost-optimized threshold finder: given FP cost = $100 (unnecessary manual review) and FN cost = $2000 (approved default), find the decision threshold that minimizes expected total cost on the validation set.'
));

addProject('p4-svm', pc(
  'SVM — Visualize the Margin, Support Vectors, and Kernel Trick',
  'Build an intuitive understanding of SVM by visualizing the maximum-margin hyperplane in 2D and 3D.',
  ['SVM','Kernel Trick','Support Vectors','Margin','sklearn'],
  'Intermediate','3 hrs','Linearly separable + non-separable synthetic datasets',
  'Train a hard-margin and soft-margin SVM on 2D data. Visualize the decision boundary, margin bands, and support vectors. Then show why a linear SVM fails on XOR data — and how the RBF kernel solves it by implicitly mapping to a higher dimension.',
  'The SVM margin and kernel trick are conceptually beautiful and frequently tested in interviews. Visualizing support vectors — the training points that literally define the model — is a compelling demo.',
  [
    'Generate 2D linearly separable data. Train LinearSVC. Plot: decision boundary, two margin lines, support vectors highlighted in red. Label the margin width',
    'Add outliers that make the data non-separable. Show how C controls the soft-margin tradeoff. Plot for C=0.01, 1.0, 100',
    'Generate XOR data (not linearly separable). Show linear SVM failing. Apply RBF kernel SVM — it solves it. Explain why: the kernel implicitly maps to infinite-dimensional space',
    'Plot the 3D visualization: show the XOR data lifted to 3D by the kernel mapping, where it becomes linearly separable'
  ],
  'Implement the kernel trick manually: compute the kernel matrix K[i,j] = k(x_i, x_j) for RBF, polynomial, and linear kernels. Show that they produce identical predictions to sklearn\'s SVC.'
));

addProject('p4-knn-cls', pc(
  'KNN Classifier — Real-Time Image Digit Recognizer',
  'Build a KNN-based digit recognizer that classifies handwritten digits and explains its decision by showing the nearest neighbors.',
  ['KNN','sklearn','Image Classification','Explainability','digits dataset'],
  'Beginner','2 hrs','sklearn digits (1797 samples, 8×8 images)',
  'Train a KNN classifier on handwritten digit images. For any test digit, show the k nearest training examples that determined the prediction. This is explainability-by-example — arguably the most intuitive form of model explanation.',
  'KNN is the only ML model where you can literally show a user WHY it made a prediction by showing the similar examples it relied on. This is called case-based reasoning and is used in medical AI systems.',
  [
    'Train KNNClassifier on digits. Use cross-validation to pick optimal k. Report accuracy per digit class (which digits are most confused?)',
    'For 5 test examples, display: the test digit image, the k=5 nearest training examples, their labels, and the final vote',
    'Confusion matrix: which pairs of digits get confused most? (4 vs 9, 3 vs 8, 1 vs 7)',
    'Add dimensionality reduction: reduce to 2D with PCA first, then apply KNN. Does accuracy improve or drop? Why?'
  ],
  'Add the k-d tree vs brute force speed comparison: at n_train=1000, 5000, 10000, measure query time for both methods and show the crossover point where k-d tree wins.'
));

addProject('p4-nb', pc(
  'Naive Bayes — Text Spam Filter from Scratch',
  'Build a Gaussian NB and Multinomial NB from scratch, then apply to spam detection.',
  ['Naive Bayes','Text Classification','TF-IDF','Laplace Smoothing','Scratch'],
  'Intermediate','3 hrs','Simulated SMS spam messages',
  'Implement Multinomial Naive Bayes from scratch with Laplace smoothing. Train a spam classifier. Visualize the most discriminative words for spam vs ham. Then benchmark against sklearn GaussianNB and BernoulliNB on a numeric dataset.',
  'Naive Bayes is the simplest probabilistic classifier and the first model ever deployed at internet scale (spam filters in the 1990s). Understanding it deeply — why the "naive" independence assumption works in practice despite being wrong — is a beautiful ML insight.',
  [
    'Build MultinomialNBScratch with fit(X_counts, y) and predict_proba(X_counts). Implement log-probability to avoid underflow. Add Laplace smoothing parameter alpha',
    'Generate 2000 SMS messages (spam/ham). Apply CountVectorizer for feature extraction. Train your scratch model',
    'Plot top 20 words with highest log P(word|spam) / P(word|ham) ratio. These are the most discriminative spam signals',
    'Compare to sklearn MultinomialNB: verify log probabilities match within floating-point tolerance'
  ],
  'Add a streaming update: implement partial_fit() that updates the word counts for new messages without retraining from scratch. This is how production spam filters update as new spam patterns emerge.'
));

addProject('p4-stacking', pc(
  'Stacking Ensemble — Beating Individual Models with Meta-Learning',
  'Build a stacking ensemble from scratch and show why it outperforms any single model.',
  ['Ensemble','Stacking','Meta-Learner','Cross-Val Predictions','sklearn'],
  'Advanced','4 hrs','Breast Cancer + Heart Disease',
  'Implement stacking from scratch using cross-val predictions to generate meta-features (avoiding leakage). Use 5 base learners and a Logistic Regression meta-learner. Show the meta-learner learns to weight the base models optimally. Verify it beats the best single model.',
  'Stacking is the algorithm that wins most ML competitions. Understanding why it works — diverse base learners + a meta-learner that exploits their disagreements — shows deep ensemble knowledge.',
  [
    'Base learners: LogisticRegression, RandomForest, XGBoost, SVM, KNN',
    'Generate out-of-fold predictions for each base learner using 5-fold CV — these become the meta-features',
    'Train LogisticRegression meta-learner on the 5 meta-features. Its coefficients tell you how much it trusts each base model',
    'Final evaluation: base models vs stacking ensemble on hold-out test set. Show the ensemble wins and explain why (it learns to trust the right model for each type of input)'
  ],
  'Add model diversity analysis: compute pairwise correlation of base model errors. Show that stacking improves most when base models are least correlated — which is why you include both tree-based and linear models.'
));

// ---- PART 5: Unsupervised ----

addProject('p5-kmeans', pc(
  'K-Means Customer Segmentation — From Clustering to Business Action',
  'Segment customers, profile each cluster, and translate the segments into actionable marketing strategies.',
  ['K-Means','Elbow Method','Silhouette','Business Analytics','Pandas'],
  'Intermediate','3–4 hrs','Simulated e-commerce customer data',
  'Apply K-Means to customer RFM (Recency, Frequency, Monetary) features. Use the elbow method and silhouette score to pick k. Profile each cluster. Assign business labels (Champions, At-Risk, Lost Causes, New Customers). Build an action plan for each segment.',
  'Customer segmentation is one of the most common real-world ML applications. The technical skills (picking k, profiling clusters) are straightforward — the business skill (translating clusters to actions) is what makes you valuable.',
  [
    'Compute RFM features: Recency (days since last purchase), Frequency (number of purchases), Monetary (total spend) for 2000 simulated customers',
    'Scale features with StandardScaler. Compute inertia for k=2..10 (elbow plot) and silhouette score for k=2..10',
    'Fit K-Means with optimal k. Profile each cluster: mean RFM values, size, and top product categories',
    'Assign business names to clusters and write a 1-sentence action item for each segment (e.g., "Cluster 2 = Champions: upsell premium plan")'
  ],
  'Add a cluster stability analysis: run K-Means 10 times with different random seeds and compute the Adjusted Rand Index between runs. Show that stable clusters (ARI > 0.9) are more trustworthy than unstable ones.'
));

addProject('p5-hier', pc(
  'Hierarchical Clustering — Dendrogram to Decision',
  'Build a dendrogram, choose the right cut point, and compare Ward, complete, and average linkage.',
  ['Hierarchical Clustering','Dendrogram','Linkage','scipy','sklearn'],
  'Intermediate','2–3 hrs','Gene expression toy data + Iris',
  'Apply hierarchical clustering with all four linkage methods. Visualize the dendrogram. Choose the cut height using the largest gap heuristic. Compare to K-Means on the same data. Show when hierarchical clustering reveals structure that K-Means cannot (elongated clusters, unequal sizes).',
  'Hierarchical clustering is used in genomics, document clustering, and any domain where the hierarchy itself is the insight. The dendrogram is one of the most informative visualizations in data science.',
  [
    'Apply Ward, complete, average, and single linkage to Iris data. Plot 4 dendrograms side by side. Show how linkage changes the tree shape',
    'Implement the "largest gap" heuristic to automatically choose the number of clusters: find the height where consecutive merges have the biggest jump',
    'Compare the cluster assignments to K-Means. Compute Adjusted Rand Index between hierarchical clusters and K-Means clusters',
    'Show where hierarchical wins: generate two elongated crescent-shaped clusters (which K-Means splits wrong). Show hierarchical with average linkage finds them correctly'
  ],
  'Build an interactive dendrogram by outputting an HTML file with collapsible nodes. Each leaf shows the data point\'s features, and hovering shows which cluster it belongs to at each cut height.'
));

addProject('p5-dbscan', pc(
  'DBSCAN — Finding Clusters of Arbitrary Shape',
  'Use DBSCAN to find clusters that K-Means cannot and identify true noise/outliers.',
  ['DBSCAN','epsilon','min_samples','Outlier Detection','sklearn'],
  'Intermediate','2–3 hrs','Synthetic crescent/ring shapes + real GPS data',
  'Apply DBSCAN to four synthetic datasets: blobs (where K-Means wins), crescents, concentric rings, and anisotropic clusters. Show DBSCAN finding the correct clusters in each case. Then use DBSCAN on a GPS location dataset to find actual geographic clusters and outlier trips.',
  'DBSCAN is the go-to algorithm when you have irregular cluster shapes (e.g., geographic regions, customer movement patterns) and don\'t know k in advance. Showing it on both synthetic and real data is a concrete demonstration.',
  [
    'Generate the 4 datasets using sklearn.datasets (make_blobs, make_moons, make_circles, anisotropic blobs)',
    'Apply K-Means and DBSCAN to each. Plot side by side. Show where K-Means fails (non-spherical shapes)',
    'Tune epsilon using the k-distance graph: sort distances to k-th nearest neighbor, find the elbow. This is the canonical epsilon-selection method',
    'Label the -1 (noise) points in each DBSCAN result. Show they correspond to actual outliers/boundary points'
  ],
  'Apply DBSCAN to a realistic GPS trajectory dataset (simulated taxi trips). Show it correctly identifies the main pickup hubs as clusters and flags unusual isolated trips as noise.'
));

addProject('p5-pca', pc(
  'PCA — Dimensionality Reduction on Real Image Data',
  'Apply PCA to image data, visualize eigenfaces, and show how many components are needed to preserve 95% of variance.',
  ['PCA','sklearn','Eigenfaces','Dimensionality Reduction','Visualization'],
  'Intermediate','3 hrs','sklearn Olivetti Faces dataset (400 images, 64×64)',
  'Apply PCA to face images. Visualize the mean face and top 20 eigenfaces. Reconstruct faces from k components (show the quality tradeoff). Build a face recognition classifier on the PCA-reduced features. Compare to classifying on raw pixels.',
  'Eigenfaces are one of the most visually compelling ML demonstrations. They show that faces live in a much lower-dimensional space than their pixel count suggests — which is the core insight behind deep feature extraction.',
  [
    'Load Olivetti faces. Compute the mean face and subtract it. Visualize the top 20 eigenfaces (PCA components reshaped to 64×64)',
    'Reconstruction: show face images reconstructed from k=1, 5, 20, 50, 100, 200, 400 components. At what k does it become recognizable?',
    'Variance explained: plot cumulative variance vs number of components. Find k for 95% explained variance',
    'Classification: train a KNN classifier on raw pixels (4096 features) vs PCA features (50 components). Compare accuracy and training time'
  ],
  'Build a face search engine: given a new face image, find the 5 most similar faces in the dataset by comparing their PCA coordinates. This is the approach used in early facial recognition systems.'
));

// ---- PART 7: Evaluation ----

addProject('p7-cv', pc(
  'Cross-Validation Shootout — Which CV Strategy to Use When',
  'Compare 6 CV strategies and prove that the wrong one gives systematically optimistic estimates.',
  ['Cross-Validation','Stratified K-Fold','Time Series Split','Leave-One-Out','sklearn'],
  'Intermediate','3 hrs','Imbalanced classification + time series',
  'Compare KFold, StratifiedKFold, RepeatedStratifiedKFold, LeaveOneOut, GroupKFold, and TimeSeriesSplit on appropriate datasets. Show that: KFold underestimates error on imbalanced data, KFold leaks on time series, GroupKFold is needed for correlated samples. Prove it with numbers.',
  'Choosing the wrong CV strategy is one of the most common ML mistakes in production. It leads to models that look great in evaluation but fail in deployment. This project shows exactly how each mistake manifests.',
  [
    'Dataset 1 (imbalanced): 95:5 ratio. Compare KFold vs StratifiedKFold. Show fold-to-fold variance explodes with KFold',
    'Dataset 2 (time series): 3 years of daily data. Compare KFold (leaks future info) vs TimeSeriesSplit (correct). Show 15%+ performance gap',
    'Dataset 3 (grouped): patients with multiple measurements. Compare KFold (leaks between same patient\'s records) vs GroupKFold (correct)',
    'Bias-variance of estimators: run 100 simulations. Compare LOO (low bias, high variance), 5-fold (medium), and holdout (high bias, low variance)'
  ],
  'Implement nested CV from scratch: outer CV for model selection, inner CV for hyperparameter tuning. Show that single CV for both selection and tuning gives optimistically biased estimates.'
));

addProject('p7-tuning', pc(
  'Hyperparameter Tuning — Grid vs Random vs Bayesian',
  'Compare three tuning strategies on the same model and show that Bayesian optimization finds better results in fewer trials.',
  ['GridSearchCV','RandomizedSearchCV','Optuna','Bayesian Optimization','sklearn'],
  'Advanced','4 hrs','XGBoost on any classification dataset',
  'Tune an XGBoost classifier using: manual grid search, RandomizedSearchCV, and Optuna (Bayesian). For each strategy, record the best CV score found after every trial. Show convergence curves: Optuna finds better solutions with fewer evaluations.',
  'Hyperparameter tuning is a practical skill that directly affects model quality. Understanding why Bayesian optimization outperforms random search — it uses past results to guide where to look next — is a key ML engineering insight.',
  [
    'Define a search space: 6 hyperparameters (learning_rate, max_depth, n_estimators, subsample, colsample_bytree, min_child_weight)',
    'Manual grid: 3^6 = 729 combinations (too many — show why this is impractical, then use a subset)',
    'RandomizedSearch: 50 trials. Plot best score found vs trial number',
    'Optuna: 50 trials with TPE sampler. Plot best score vs trial number. Overlay on same plot as random search — Optuna converges faster'
  ],
  'Add Hyperband (early stopping for hyperparameter search): run each config for a few iterations, kill the worst half, double iterations for survivors. Show it finds good configs with 3x fewer total training epochs than random search.'
));

addProject('p7-interpret', pc(
  'Model Interpretability — SHAP, LIME, and Partial Dependence',
  'Explain a black-box model three different ways and show when each explanation method is appropriate.',
  ['SHAP','LIME','Partial Dependence','Interpretability','XGBoost'],
  'Advanced','4 hrs','Credit scoring / loan default prediction',
  'Train an XGBoost credit model. Apply SHAP (global + local), LIME (local), and partial dependence plots (global). Show a case where SHAP and LIME disagree. Explain a rejected loan application in plain English to a hypothetical customer using each method.',
  'Model explainability is increasingly required by law (GDPR, EU AI Act) and by business stakeholders. Being able to produce legally defensible explanations for individual predictions is a senior ML engineer skill.',
  [
    'Train XGBoost on credit features: income, debt_ratio, employment_years, credit_history, loan_amount, purpose',
    'SHAP: global summary plot (feature importance across all predictions), waterfall plot for 3 specific predictions',
    'LIME: local explanation for the same 3 predictions. Compare to SHAP — do they agree on the top factors?',
    'For one rejected loan, write the explanation a bank officer would read to the customer: "Your application was rejected primarily because X. If you Y, your approval probability would increase by Z%"'
  ],
  'Add a counterfactual explanation using DiCE: for a rejected applicant, find the minimum change to their profile that would flip the decision to approved. Show the counterfactual and explain why it is actionable advice.'
));

// ---- PART 9-13: NLP, CV, Time Series, Recommender, MLOps ----

addProject('p9-basics', pc(
  'Text Preprocessing Pipeline — From Raw Text to ML-Ready Features',
  'Build a complete NLP preprocessing pipeline covering 10 techniques with before/after comparison.',
  ['NLP','NLTK','spaCy','TF-IDF','Text Preprocessing'],
  'Intermediate','3 hrs','Amazon product reviews (simulated)',
  'Build a TextPreprocessor class that applies: lowercasing, HTML removal, punctuation removal, tokenization, stopword removal, stemming/lemmatization, n-gram extraction, TF-IDF vectorization, and vocabulary filtering. Show the impact of each step on downstream classification accuracy.',
  'Text preprocessing is the first step of every NLP pipeline. Each technique makes a tradeoff (removing punctuation loses "!" sentiment signal; stemming loses grammar). Being able to explain and measure these tradeoffs shows real NLP engineering experience.',
  [
    'Build pipeline with toggle switches for each step (so you can turn each on/off)',
    'Run ablation study: train Naive Bayes on raw text vs adding each preprocessing step. Record accuracy at each step',
    'Compare stemming (PorterStemmer) vs lemmatization (WordNetLemmatizer) on 20 example words. Show where they differ',
    'Vocabulary analysis: plot word frequency distribution. Show it follows Zipf\'s law. Discuss the long tail problem'
  ],
  'Add a text cleaning benchmark: 5 datasets (tweets, reviews, news, scientific abstracts, code comments). Show that the optimal preprocessing pipeline differs for each domain — what works for tweets breaks on scientific text.'
));

addProject('p9-tfidf', pc(
  'TF-IDF Document Search Engine — Build Google (Simplified)',
  'Build a document retrieval system using TF-IDF and cosine similarity that returns relevant results for any query.',
  ['TF-IDF','Cosine Similarity','Information Retrieval','Pandas','sklearn'],
  'Intermediate','3 hrs','Wikipedia article summaries (simulated)',
  'Build a search engine over a corpus of 500 documents using TF-IDF vectors and cosine similarity. Return top-k results for any query. Add query expansion (synonym lookup) and relevance feedback (user marks good results, system updates the query vector).',
  'TF-IDF is the foundation of search engines, document clustering, and the early stages of RAG systems. Building a working search engine demonstrates you understand information retrieval — a field that directly informs how modern AI retrieval systems work.',
  [
    'Build TfidfSearch class with .index(docs) and .search(query, k=5). Use sklearn TfidfVectorizer + cosine_similarity',
    'Build a small test corpus of 500 short articles on 10 topics. Verify that searches for topic keywords return topic-relevant documents',
    'Add query expansion: for each query term, add its top-2 WordNet synonyms. Show it improves recall for rare queries',
    'Relevance feedback: user marks 2 results as relevant, 1 as irrelevant. Update query vector using Rocchio algorithm. Show updated results are more relevant'
  ],
  'Add BM25 ranking (the algorithm Google used before neural search) and compare precision@5 and recall@5 between TF-IDF cosine similarity and BM25 on 20 test queries.'
));

addProject('p9-embeddings', pc(
  'Word Embeddings — Semantic Search and Analogy Solver',
  'Train Word2Vec from scratch and use embeddings to answer word analogies and find semantically similar documents.',
  ['Word2Vec','GloVe','Embeddings','Cosine Similarity','Semantic Search'],
  'Advanced','4 hrs','Wikipedia text corpus (small subset)',
  'Train a Word2Vec model (skip-gram) on a text corpus. Visualize the embedding space with t-SNE. Solve word analogies (king - man + woman = queen). Build a semantic document search using averaged word vectors. Compare to TF-IDF search quality.',
  'Word embeddings are the foundation of modern NLP. Every transformer model uses them. Understanding how geometry in embedding space encodes semantic relationships — and being able to visualize and query it — shows real NLP depth.',
  [
    'Train Word2Vec (skip-gram) using gensim on a ~100k sentence corpus. Extract the embedding matrix',
    'Visualize 100 words in 2D using t-SNE. Show that semantic clusters emerge: countries near countries, foods near foods',
    'Analogy solver: king - man + woman. Implement using vector arithmetic + cosine similarity. Test 20 analogies',
    'Semantic document search: represent each document as the mean of its word vectors. Search by query. Compare to TF-IDF — which finds better semantic matches for paraphrased queries?'
  ],
  'Implement a from-scratch skip-gram Word2Vec training loop using NumPy: build the vocabulary, generate (center, context) pairs, implement the softmax output layer, and train with SGD. Compare the learned embeddings to gensim\'s.'
));

addProject('p9-transformers-nlp', pc(
  'Fine-Tune BERT for Sentiment Analysis — Full NLP Pipeline',
  'Fine-tune a pre-trained BERT model on a sentiment task and compare to classical approaches.',
  ['BERT','HuggingFace','Transformers','Fine-tuning','Sentiment Analysis'],
  'Advanced','4–5 hrs','IMDb movie reviews / Twitter sentiment',
  'Build a complete fine-tuning pipeline: tokenize with BertTokenizer, load bert-base-uncased, add a classification head, fine-tune for 3 epochs with a learning rate scheduler, and evaluate with precision/recall/F1. Compare accuracy vs TF-IDF + LogReg and vs LSTM baseline.',
  'Fine-tuning transformers is the dominant approach in production NLP. Being able to build the end-to-end pipeline — not just call a wrapper — shows genuine deep learning engineering skill. This is what NLP engineers do day-to-day.',
  [
    'Tokenize with BertTokenizer(truncation=True, max_length=128). Build a PyTorch Dataset and DataLoader',
    'Load BertForSequenceClassification. Freeze all layers except the last 2 encoder layers + classifier head (parameter-efficient fine-tuning)',
    'Train for 3 epochs with AdamW and linear LR warmup scheduler. Track train loss and validation F1 per epoch',
    'Comparison table: TF-IDF + LR vs LSTM vs fine-tuned BERT. Report F1, training time, inference time per sample'
  ],
  'Add LoRA (Low-Rank Adaptation) fine-tuning using the PEFT library and compare to full fine-tuning: same accuracy, 10x fewer trainable parameters, 3x faster training.'
));

addProject('p9-rag', pc(
  'Build a RAG System — Question Answering Over Your Own Documents',
  'Implement a complete Retrieval-Augmented Generation pipeline from chunking to final answer.',
  ['RAG','Embeddings','Vector Search','LLM','FAISS'],
  'Advanced','4–5 hrs','PDF or text documents you choose',
  'Build a working RAG pipeline: chunk documents, generate embeddings, store in FAISS vector index, retrieve top-k chunks for a query, pass to an LLM (Claude API or local model) for answer generation. Evaluate with retrieval accuracy and answer quality metrics.',
  'RAG is the most deployed LLM application pattern in production. Every company building AI features is building some form of RAG. Being able to implement the full pipeline — chunking strategy, embedding choice, retrieval, generation — is a highly marketable skill.',
  [
    'Document ingestion: chunk 10 text files into 200-token chunks with 50-token overlap. Show why overlap prevents cutting off mid-sentence',
    'Embedding + indexing: embed all chunks using sentence-transformers, store in FAISS index. Show query time for 10k chunks',
    'Retrieval: given a question, embed the query, retrieve top-5 chunks by cosine similarity',
    'Generation: pass retrieved chunks + question to Claude API (or llama.cpp). Format the prompt as: context chunks + question + instruction to cite sources'
  ],
  'Add a re-ranker: after retrieving top-20 chunks with fast cosine similarity, re-rank them with a cross-encoder model that jointly scores (query, chunk) pairs. Show it improves answer quality by surfacing more relevant context.'
));

addProject('p10-transfer', pc(
  'Transfer Learning — Fine-Tune ResNet on a Custom Image Dataset',
  'Fine-tune a pre-trained ResNet-18 on a 5-class custom image dataset and beat a model trained from scratch.',
  ['Transfer Learning','ResNet','PyTorch','Fine-tuning','Computer Vision'],
  'Advanced','4–5 hrs','CIFAR-10 (5 selected classes) or your own images',
  'Implement 3 transfer learning strategies: feature extraction (freeze all, train only head), fine-tuning last 2 layers, and full fine-tuning. Compare to training ResNet-18 from scratch. Show that transfer learning reaches 90%+ accuracy in 5 epochs where from-scratch needs 50+.',
  'Transfer learning is the most important practical technique in deep learning. Understanding when to freeze layers, when to unfreeze, and how to set different learning rates per layer group is what makes production CV engineers effective.',
  [
    'Load ResNet-18 pretrained on ImageNet. Freeze all layers. Replace final FC layer with a 5-class head. Train for 10 epochs (feature extraction)',
    'Unfreeze last ResNet block (layer4). Use a 10x lower learning rate for pretrained weights vs new head. Train 10 more epochs (partial fine-tuning)',
    'Unfreeze all layers with layer-wise learning rate decay. Train 10 more epochs (full fine-tuning)',
    'Comparison: from-scratch training with same architecture. Plot accuracy curves for all 4 strategies on the same chart. Show transfer learning\'s massive advantage in early epochs'
  ],
  'Add Grad-CAM visualization: for correct and incorrect predictions, show which regions of the image the model was looking at. Show that pre-trained features focus on semantically meaningful regions from epoch 1, while from-scratch models take 20+ epochs to learn spatial attention.'
));

addProject('p11-predictive', pc(
  'Predictive Maintenance — Turbofan Engine Remaining Useful Life',
  'Predict when a turbofan engine will fail using LSTM and compare to traditional feature engineering + XGBoost.',
  ['LSTM','Time Series','Predictive Maintenance','Feature Engineering','XGBoost'],
  'Advanced','5 hrs','NASA C-MAPSS Turbofan Engine Degradation dataset',
  'The complete predictive maintenance pipeline: load sensor data, compute RUL labels, extract time-domain features (mean, std, trend, slope), build LSTM sequence model and XGBoost feature model, compare RMSE on RUL prediction, and build a maintenance alert system.',
  'Predictive maintenance is one of the highest-ROI ML applications in manufacturing and aerospace. It is directly relevant to your Lockheed work. This is a project that belongs on your resume with a clear business impact statement: "Reduced unplanned downtime by X%."',
  [
    'Load C-MAPSS FD001 dataset. Compute RUL = max_cycle - current_cycle for each engine. Plot degradation curves',
    'Extract 20 time-domain features per window: mean, std, range, trend slope, entropy, FFT peaks for each sensor',
    'Build LSTM model: input = 30-cycle windows, output = scalar RUL. Train with MSE loss + gradient clipping',
    'XGBoost on hand-crafted features. Compare RMSE with LSTM. Build alert system: flag engines with RUL < 30 cycles'
  ],
  'Add anomaly detection as an early warning system: train an autoencoder on healthy engine data (cycles 1-50). Plot reconstruction error over time — it increases as the engine degrades, giving an unsupervised degradation signal before the supervised LSTM sees the pattern.'
));

addProject('p12-matrix', pc(
  'Matrix Factorization — Build Netflix\'s Recommendation Algorithm',
  'Implement Alternating Least Squares matrix factorization from scratch and compare to SVD and neural collaborative filtering.',
  ['Matrix Factorization','ALS','Collaborative Filtering','PyTorch','Recommender Systems'],
  'Advanced','4–5 hrs','MovieLens 100k dataset',
  'Implement ALS (Alternating Least Squares) from scratch — the algorithm behind Apache Spark MLlib and the original Netflix Prize approach. Compare to SVD++ and a simple neural CF model. Evaluate with RMSE and top-10 recommendation quality (precision@10, recall@10).',
  'Recommender systems power Netflix, Spotify, Amazon, and TikTok. Matrix factorization is the core algorithm. Being able to implement it from scratch and explain the latent factor interpretation demonstrates real ML depth.',
  [
    'Implement ALS from scratch: alternate between solving for user factors (fixing item factors) and item factors (fixing user factors). Each step is a closed-form least squares solution',
    'Regularization: add L2 penalty on factor norms. Tune lambda with cross-validation',
    'SVD baseline: compare ALS to truncated SVD on the dense rating matrix',
    'Evaluation: RMSE on held-out ratings, precision@10 and recall@10 on top-10 recommendations per user'
  ],
  'Add the implicit feedback version of ALS (for data like play counts, clicks, views where there are no explicit ratings). Show that implicit ALS using confidence weighting outperforms explicit ALS on implicit data.'
));

addProject('p13-versioning', pc(
  'MLflow Experiment Tracking — Never Lose a Model Again',
  'Set up MLflow tracking for a full model development workflow with model registry and artifact storage.',
  ['MLflow','Experiment Tracking','Model Registry','MLOps','DVC'],
  'Intermediate','3 hrs','Any classification dataset',
  'Instrument a training pipeline with MLflow: log parameters, metrics (per epoch), artifacts (model, feature importance plot, confusion matrix). Use the model registry to promote a model from Staging to Production. Show how to reproduce any past experiment from its run ID.',
  'MLflow experiment tracking is used at Google, Microsoft, Uber, and most ML-heavy companies. Being able to demo a tracked experiment — "here is the exact code, data, and hyperparameters that produced this model" — is a production ML skill that juniors don\'t have.',
  [
    'Set up MLflow tracking server (local). Instrument training loop: mlflow.log_param(), mlflow.log_metric() per epoch, mlflow.log_artifact() for plots',
    'Run 5 experiments with different hyperparameters. Compare runs in the MLflow UI. Show the parallel coordinates plot',
    'Register the best model in the Model Registry. Tag it as "Staging". Write a validation script that promotes it to "Production" if test RMSE < threshold',
    'Reproduce experiment: given a run_id, show how to load the exact model, parameters, and metrics — proving perfect reproducibility'
  ],
  'Add DVC for data versioning alongside MLflow for model versioning. Show a complete git + DVC + MLflow workflow: code is in git, data is in DVC, model artifacts and metrics are in MLflow. Every experiment is fully reproducible.'
));

addProject('p13-monitor', pc(
  'ML Model Monitoring — Detect Drift Before Your Model Breaks',
  'Build a monitoring system that detects data drift, concept drift, and prediction drift in production.',
  ['Model Monitoring','Data Drift','PSI','KS Test','MLOps','FastAPI'],
  'Advanced','4–5 hrs','Simulated production data with injected drift',
  'Build a production monitoring system: compute PSI (Population Stability Index) for feature drift, KS test for distribution shift, prediction drift monitoring, and concept drift detection using a sliding window of labeled feedback. Send alerts when drift exceeds thresholds.',
  'Model monitoring is the difference between a model that works at launch and a model that keeps working 6 months later. Production ML systems degrade silently without monitoring — this is one of the most important MLOps skills.',
  [
    'Simulate production scenario: deploy model trained on January data. Inject gradual drift in February (income feature shifts up 20%)',
    'PSI monitor: compute PSI weekly for each feature. Flag features with PSI > 0.2 as significant drift',
    'KS test monitor: Kolmogorov-Smirnov test between reference distribution and current week. Alert on p-value < 0.01',
    'Concept drift: use a sliding window of 500 predictions + true labels. Monitor accuracy over time. Show it drops from 91% to 74% as drift accumulates'
  ],
  'Add an automatic retraining trigger: when concept drift is detected, automatically retrain on the most recent 3 months of data, run A/B test comparing old vs new model on 10% traffic, and promote if new model is statistically significantly better.'
));

addProject('p13-cicd', pc(
  'ML CI/CD Pipeline — GitHub Actions for Model Training and Deployment',
  'Build a complete CI/CD pipeline that tests, trains, evaluates, and deploys an ML model automatically on every commit.',
  ['CI/CD','GitHub Actions','Docker','pytest','MLOps'],
  'Advanced','4–5 hrs','Any sklearn model',
  'Build a GitHub Actions workflow that: runs unit tests on data preprocessing functions, trains the model on a schedule, evaluates against a performance threshold, builds a Docker image, and deploys to a staging environment. Show how a single git push triggers the full pipeline.',
  'CI/CD for ML is one of the highest-demand MLOps skills in 2024–2025. Being able to build a pipeline that makes model deployment safe, reproducible, and automatic is what separates MLEs from data scientists.',
  [
    'Write pytest unit tests for: preprocessing functions (null handling, encoding), model loading, prediction format validation',
    'GitHub Actions workflow (.github/workflows/train.yml): trigger on push to main, run tests, train model, evaluate RMSE < threshold, fail pipeline if threshold not met',
    'Docker build step: package model + FastAPI app into a Docker image, push to container registry',
    'Deployment step: pull new image to staging server, run smoke test (send 5 prediction requests, verify 200 responses), swap to production if smoke test passes'
  ],
  'Add model cards automation: on every successful deployment, auto-generate a model card (performance metrics, feature importance, training data stats, known limitations) as a markdown file committed back to the repo.'
));

let added2 = 0;
const sections2 = [
  'p1-loading','p1-missing','p1-encoding','p1-scaling','p1-outliers',
  'p1-engineering','p1-pipeline','p1-imbalanced',
  'p2-bias-variance','p2-metrics',
  'p3-linear','p3-poly','p3-dt-reg','p3-rf-reg','p3-xgb-reg','p3-svr','p3-knn-reg',
  'p4-logistic','p4-dt-cls','p4-rf-cls','p4-xgb-cls','p4-svm','p4-knn-cls','p4-nb','p4-stacking',
  'p5-kmeans','p5-hier','p5-dbscan','p5-pca',
  'p7-cv','p7-tuning','p7-interpret',
  'p9-basics','p9-tfidf','p9-embeddings','p9-transformers-nlp','p9-rag',
  'p10-transfer','p11-predictive','p12-matrix',
  'p13-versioning','p13-monitor','p13-cicd'
];
sections2.forEach(id => {
  if (CONTENT.sections[id]) added2++;
  else console.warn('[projects-b2] not found:', id);
});
console.log('[content-projects-b2] Added projects to', added2, 'more sections');

})();

// ============================================================
// BATCH 3 — Deep Learning, CV, Time Series, remaining
// ============================================================
(function() {

function addProject(id, html) {
  const s = CONTENT.sections[id];
  if (s) s.html += html; else console.warn('[projects-b3] not found:', id);
}

function pc(title, tagline, tags, difficulty, time, dataset, goal, why, steps, bonus) {
  const tagHtml = tags.map(t =>
    `<span style="display:inline-block;padding:2px 10px;border-radius:20px;background:var(--accent-soft);color:var(--accent);font-size:11px;font-weight:600;margin-right:6px;margin-bottom:4px">${t}</span>`
  ).join('');
  const stepsHtml = steps.map((s,i) =>
    `<div style="display:flex;gap:14px;margin-bottom:18px;align-items:flex-start">
      <div style="min-width:30px;height:30px;border-radius:50%;background:var(--accent);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:13px;flex-shrink:0">${i+1}</div>
      <div style="font-size:13.5px;line-height:1.7;color:var(--text)">${s}</div>
    </div>`
  ).join('');
  return `
  <div style="margin-top:48px;padding:26px 28px;border:2px solid var(--accent);border-radius:14px;background:var(--surface)">
    <div style="font-size:11px;font-weight:700;letter-spacing:1.5px;color:var(--accent);text-transform:uppercase;margin-bottom:8px">★ Section Capstone Project</div>
    <h2 style="margin:0 0 6px;font-size:21px">${title}</h2>
    <p style="margin:0 0 14px;color:var(--text-muted);font-size:14px">${tagline}</p>
    <div style="margin-bottom:14px">${tagHtml}</div>
    <div style="display:flex;gap:20px;margin-bottom:16px;font-size:12px;color:var(--text-muted);flex-wrap:wrap">
      <span>⏱ ${time}</span><span>📊 ${dataset}</span><span>🎯 ${difficulty}</span>
    </div>
    <div style="padding:12px 16px;background:var(--accent-soft);border-radius:8px;margin-bottom:14px;font-size:13.5px;line-height:1.7"><strong>Goal:</strong> ${goal}</div>
    <div style="padding:11px 15px;background:rgba(255,200,50,0.07);border-left:3px solid var(--accent-2);border-radius:0 8px 8px 0;margin-bottom:20px;font-size:13px;line-height:1.6"><strong>Why recruiters care:</strong> ${why}</div>
    ${stepsHtml}
    ${bonus ? `<div style="margin-top:16px;padding:11px 15px;border-radius:8px;background:var(--surface-2);font-size:13px"><strong>🚀 Stretch:</strong> ${bonus}</div>` : ''}
  </div>`;
}

// Data Preprocessing - missing
addProject('p1-duplicates', pc(
  'Deduplication Pipeline — Near-Duplicate Detection at Scale',
  'Find exact and near-duplicate records in a customer database using hashing, Levenshtein distance, and fuzzy matching.',
  ['Pandas','fuzzywuzzy','Record Linkage','Data Quality'],
  'Intermediate','3 hrs','Simulated CRM customer records with duplicate entries',
  'Build a deduplication system for a customer database with 10,000 records. Detect: exact duplicates (same email), near-exact duplicates (typos in name/address), and fuzzy matches (John Smith vs Jon Smyth at same address). Merge duplicates and produce a clean master record.',
  'Duplicate customer records cost companies millions in wasted marketing spend and create compliance risks. This is a real data engineering problem that every analytics team faces.',
  [
    'Exact duplicates: group by (email, phone). Flag and merge with keep=first',
    'Blocking: group records by first 3 chars of last name + zip code to reduce comparison pairs from N² to manageable',
    'Fuzzy matching: apply fuzz.ratio() within each block. Flag pairs with similarity > 85%',
    'Merge strategy: for flagged pairs, keep most complete record (fewest nulls). Output a deduplicated DataFrame with a merge_log showing what was combined'
  ],
  'Add phonetic matching (Soundex/Metaphone) so "Smith" and "Smyth" are considered phonetically identical. Show it catches 30% more near-duplicates than string similarity alone.'
));

addProject('p1-split', pc(
  'Sampling Strategy Benchmark — Which Split Method Preserves Your Distribution?',
  'Compare random split, stratified split, temporal split, and group split — show which one to use when.',
  ['train_test_split','Stratified','GroupShuffleSplit','TimeSeriesSplit','Sampling'],
  'Intermediate','2 hrs','Imbalanced + time-series + grouped datasets',
  'Run the same model with 4 different split strategies. Show that random split on imbalanced data gives optimistic estimates, temporal split on time series prevents leakage, and group split prevents patient/customer leakage in grouped data.',
  'The wrong split strategy is one of the most common and consequential ML mistakes. It makes models look better in evaluation than they perform in production — leading to failed deployments.',
  [
    'Imbalanced dataset: compare random vs stratified. Show that random split produces 30% variance in minority class representation across runs',
    'Time series: compare random split (leaks future data into training) vs TimeSeriesSplit. Show 15-20% performance gap',
    'Grouped data (multiple rows per patient): compare random split vs GroupShuffleSplit. Show that random split inflates accuracy by memorizing patient-specific patterns',
    'Summary table: dataset type → recommended split strategy → reason. This is the cheat sheet you keep at your desk'
  ],
  null
));

addProject('p1-selection', pc(
  'Feature Selection — 5 Methods, One Dataset, Compare Them All',
  'Run filter, wrapper, embedded, and permutation-based feature selection. Show which features each method keeps.',
  ['Feature Selection','RFE','SelectKBest','Lasso','Permutation Importance','SHAP'],
  'Intermediate','3 hrs','Breast Cancer Wisconsin (30 features)',
  'Apply 5 feature selection methods to the same 30-feature dataset. Compare: which features does each select? Where do they agree? Which gives the best downstream model performance? Which is fastest?',
  'Feature selection reduces training time, prevents overfitting, and improves interpretability. Knowing the tradeoffs between filter (fast, ignores interactions), wrapper (slow, model-aware), and embedded (efficient, regularization-based) methods is a practical skill.',
  [
    'Filter: SelectKBest with f_classif and mutual_info_classif. Top 10 features. Compare lists',
    'Wrapper: RFE with LogisticRegression. Backward elimination from 30 to 10 features. Plot validation score vs n_features',
    'Embedded: LassoCV. Features with non-zero coefficients. Count how many survive',
    'Permutation importance: RandomForest trained on all features. Zero out each feature\'s values, measure accuracy drop',
    'Agreement matrix: 4×30 grid — which features were selected by which method? Highlight features selected by 3+ methods (most reliable)'
  ],
  'Add an automated feature selection pipeline using Boruta (the gold standard): it uses shadow features (random permutations) to find the true importance cutoff. Compare Boruta\'s selection to your 5 methods.'
));

// Math - missing sections
addProject('p2-linalg', pc(
  'Principal Component Analysis — Build PCA from Eigendecomposition',
  'Implement PCA from scratch using the covariance matrix + eigendecomposition. Verify it matches sklearn.',
  ['PCA','Linear Algebra','Eigendecomposition','Dimensionality Reduction','NumPy'],
  'Intermediate','3 hrs','MNIST digit images (subset)',
  'Build PCA from scratch: center data, compute covariance matrix, eigendecompose, sort by eigenvalue, project data. Verify coefficients match sklearn.decomposition.PCA. Apply to MNIST: show the top 50 "eigendigits" and reconstruct digits from k components.',
  'PCA is the most important linear algebra application in ML. Building it from scratch cements the connection between the math (eigenvectors = directions of maximum variance) and the code.',
  [
    'Implement PCA.fit_transform(X) from scratch: X_centered → covariance matrix → eig() → sort → project',
    'Verify against sklearn: assert that abs(my_pca_result) ≈ abs(sklearn_pca_result) (up to sign flip)',
    'Visualize the top 20 eigenvectors as 28×28 images (eigendigits)',
    'Reconstruction RMSE vs k components: plot the curve. Find k for 95% variance explained'
  ],
  'Implement online/incremental PCA using the Gram-Schmidt process: update the principal components one sample at a time without storing the full dataset in memory. Compare to batch PCA on the final result.'
));

addProject('p2-calculus', pc(
  'Automatic Differentiation — Build Micrograd from Scratch',
  'Build a tiny autograd engine that can differentiate any computation graph — the core of PyTorch.',
  ['Autograd','Backpropagation','Computational Graph','Calculus','Neural Nets'],
  'Advanced','4–5 hrs','Synthetic regression/classification',
  'Implement a Value class that wraps a scalar and tracks its gradient through any computation. Build forward and backward passes for +, *, **, relu, tanh. Build a 2-layer neural net using only your Value class. Train it on a classification task.',
  'Andrej Karpathy\'s micrograd is one of the most educational ML projects ever created. Building it yourself (not just studying his) forces you to deeply understand what backpropagation actually computes — which makes debugging real neural nets dramatically easier.',
  [
    'Implement Value class: __add__, __mul__, __pow__, relu, tanh — each storing a _backward function for chain rule',
    'Implement Value.backward() using topological sort to call _backward in reverse order',
    'Build Neuron, Layer, MLP classes using only Value. No NumPy — just your scalar autograd',
    'Train a 2-layer MLP on the moons dataset (2D binary classification). Show loss decreasing over 100 epochs'
  ],
  'Extend to vector-valued operations: implement a mini-tensor class that handles 1D arrays using your scalar Value under the hood. This shows how PyTorch scales your scalar autograd to matrices.'
));

addProject('p2-stats', pc(
  'Statistical Analysis Toolkit — From Descriptive Stats to Inference',
  'Build reusable statistical analysis functions and apply them to answer 10 real business questions.',
  ['Statistics','SciPy','Hypothesis Testing','Confidence Intervals','Correlation'],
  'Intermediate','3 hrs','Retail sales survey data (simulated)',
  'Build a StatKit class with methods for: descriptive stats, normality tests, t-tests, ANOVA, chi-square, correlation analysis, and bootstrap confidence intervals. Apply it to answer 10 real business questions on a sales dataset.',
  'Statistical thinking is what separates data scientists from dashboard creators. Being able to answer "is this difference real or noise?" with the right test is a fundamental skill that ML engineers need beyond just model training.',
  [
    'Normality tests: Shapiro-Wilk and Q-Q plot. Show that sales data is NOT normally distributed (it is log-normal)',
    'T-test: "Do customers who received a discount spend more?" Apply two-sample t-test (non-parametric alternative: Mann-Whitney U)',
    'ANOVA: "Does average sales differ across 4 regions?" F-test + post-hoc Tukey HSD',
    'Chi-square: "Is product category independent of payment method?" Compute expected vs observed, report p-value and effect size (Cramer\'s V)',
    'Bootstrap CI: "What is the 95% CI for median revenue?" Resample 10,000 times, compute percentile interval'
  ],
  'Add a statistical power calculator: given a desired effect size, alpha, and power (0.8), compute the required sample size for each test type. Show how the required N changes as effect size decreases from 0.8 (large) to 0.2 (small).'
));

addProject('p2-regularization', pc(
  'Regularization Deep Dive — Visualize L1 vs L2 Geometry',
  'Prove geometrically and empirically why L1 produces sparsity and L2 does not.',
  ['Regularization','Ridge','Lasso','Geometry','Optimization'],
  'Intermediate','3 hrs','Synthetic sparse signal dataset',
  'Build the canonical visualization: draw the L1 ball (diamond) and L2 ball (circle) with the elliptical loss contours. Show geometrically why the L1 ball\'s corners cause sparsity. Then verify empirically: increase alpha from 0 to 10 and count non-zero coefficients for both.',
  'The geometric explanation of why Lasso produces sparse solutions is one of the most elegant ideas in ML. Being able to explain it with a plot — "the corner of the L1 diamond touches the loss contour first, setting the coefficient to zero" — is a memorable interview answer.',
  [
    'Generate 2-parameter dataset. Compute the MSE loss over a grid of (w1, w2) values. Plot elliptical contours',
    'Draw the L1 constraint region (diamond, |w1|+|w2| <= C) and L2 constraint region (circle, w1²+w2² <= C²)',
    'Show geometrically: where does the loss contour first touch each constraint region? L1 at a corner (sparse), L2 on the curve (not sparse)',
    'Regularization path: plot both coefficients as alpha increases from 0 to 100 for Ridge and Lasso. Show Lasso coefficient hitting zero vs Ridge approaching but never reaching zero'
  ],
  'Add Elastic Net geometry: show it as a "rounded diamond" (between circle and diamond). Show that it groups correlated variables together (unlike Lasso which arbitrarily picks one from a correlated group).'
));

// Part 7 - remaining
addProject('p7-curves', pc(
  'Diagnostic Curves — Diagnose Overfit/Underfit Before It Hurts',
  'Build validation curves, learning curves, and loss curves. Diagnose 4 training failure modes.',
  ['Learning Curves','Validation Curves','Overfitting','Underfitting','sklearn'],
  'Intermediate','3 hrs','Any dataset (California Housing or Titanic)',
  'Train models intentionally in 4 broken configurations: underfitting (too simple), overfitting (too complex), too small dataset, unstable optimizer. Build diagnostic plots that reveal each problem. Write a plain-English diagnosis for each.',
  'Being able to look at a learning curve and say "this model is overfitting — the train-val gap is growing and both curves have plateaued" is a core ML debugging skill. Every model you deploy needs this analysis.',
  [
    'Learning curve: plot train/val score vs training set size. Show underfitting (both curves are low and close) vs good fit (val approaches train as n increases)',
    'Validation curve: plot train/val score vs a single hyperparameter (max_depth). Show overfitting (train >> val at high complexity) vs underfitting (both low at low complexity)',
    'Loss curve: simulate unstable training (high LR) showing spiky loss vs stable training. Show that gradient clipping fixes the instability',
    'Summary diagnosis: for each curve type, write the 3-sentence interpretation: "What you see", "What it means", "What to do"'
  ],
  'Add a complexity vs generalization 3D surface: vary two hyperparameters simultaneously (depth and n_estimators for RF) and plot the validation score surface. Find the ridge of optimal generalization.'
));

addProject('p7-calibration', pc(
  'Probability Calibration — Make Your Model\'s Probabilities Mean Something',
  'Show that a model with 92% AUC can have terribly calibrated probabilities. Fix it with Platt scaling and isotonic regression.',
  ['Calibration','Platt Scaling','Isotonic Regression','Brier Score','Reliability Diagram'],
  'Intermediate','3 hrs','Medical diagnosis classification',
  'Train a RandomForest and GradientBoosting. Show their reliability diagrams (are predicted 70% probabilities actually right 70% of the time?). Apply calibration (Platt scaling and isotonic regression). Show improvement in Brier score and reliability diagram.',
  'In medical, financial, and safety applications, the predicted probability IS the output — not just the class label. A model that says "70% chance of cancer" needs to actually be right 70% of the time. Calibration is safety-critical.',
  [
    'Train RF and GBM on a medical dataset. Compute predicted probabilities on test set',
    'Reliability diagram (calibration plot): bin predictions into 10 buckets, plot mean predicted prob vs actual positive rate. Perfect = diagonal line',
    'Apply CalibratedClassifierCV with method="sigmoid" (Platt) and method="isotonic". Plot all 5 calibration curves on one chart',
    'Brier score comparison: before and after calibration for both models. Lower = better calibrated'
  ],
  'Show the Expected Calibration Error (ECE) calculation from scratch and explain why it is used in autonomous vehicle and medical AI certification requirements.'
));

// Deep Learning sections
addProject('p8-intro', pc(
  'PyTorch Fundamentals — Build Every Basic Operation from Scratch',
  'Implement tensor operations, autograd, and a training loop manually before relying on torch.nn.',
  ['PyTorch','Tensors','Autograd','Training Loop','GPU'],
  'Intermediate','3 hrs','Synthetic regression + MNIST',
  'Build 5 exercises: (1) tensor arithmetic matching NumPy, (2) manual gradient computation vs autograd, (3) custom loss function with backward pass, (4) training loop from scratch (no torch.nn), (5) move everything to GPU and measure speedup.',
  'Understanding the raw PyTorch API — before nn.Module, before DataLoader — makes you able to debug any deep learning code. When something breaks in a complex model, you trace it back to these primitives.',
  [
    'Tensor operations: create, reshape, index, broadcast, reduce — all matching equivalent NumPy operations. Verify outputs match',
    'Manual gradient: compute d(sum(x²))/dx by hand. Verify with x.grad after backward()',
    'Custom loss function: implement Huber loss as a PyTorch function with proper backward(). Compare gradient to torch.nn.HuberLoss',
    'Full training loop from scratch: manual weight tensors, manual gradient zero, manual backward, manual parameter update — no optimizer, no nn.Module'
  ],
  'Implement a custom PyTorch layer (nn.Module subclass) that computes a radial basis function: output = exp(-||x - center||² / sigma²). Use it in a simple network and verify gradients flow through it correctly.'
));

addProject('p8-mlp', pc(
  'MLP from Scratch — Classify MNIST with Pure PyTorch',
  'Build a multi-layer perceptron to classify handwritten digits with 97%+ accuracy from scratch.',
  ['MLP','PyTorch','MNIST','Backpropagation','BatchNorm','Dropout'],
  'Intermediate','3–4 hrs','MNIST (60k training images)',
  'Build a 3-layer MLP for MNIST digit classification. Start with no regularization (show overfitting). Add Dropout and BatchNorm. Add learning rate scheduling. Reach 97%+ test accuracy. Visualize the learned weights and the confusion matrix.',
  'MNIST is the "Hello World" of deep learning. Building a clean, well-optimized MLP on it — with proper regularization, scheduling, and evaluation — shows you know how to structure a DL project from start to finish.',
  [
    'Build MLP: 784 → 512 (ReLU) → 256 (ReLU) → 10 (Softmax). Train 10 epochs. Show overfitting (train acc >> val acc)',
    'Add Dropout(0.3) after each hidden layer and BatchNorm1d before each activation. Train again. Show reduced gap',
    'Add CosineAnnealingLR scheduler. Plot learning rate curve alongside loss curve',
    'Confusion matrix: which digits get confused most? Visualize 10 misclassified images with predicted vs true label'
  ],
  'Implement a Mixup training strategy: blend two training images and their labels. Show it improves generalization by 0.5-1% on the test set and reduces confident wrong predictions (improves calibration).'
));

addProject('p8-cnn', pc(
  'CNN from Scratch — Image Classifier on CIFAR-10',
  'Build a convolutional neural network from nn.Conv2d up. Understand receptive field, feature maps, and pooling.',
  ['CNN','PyTorch','CIFAR-10','Conv2d','Feature Maps','Data Augmentation'],
  'Intermediate','4–5 hrs','CIFAR-10 (60k color images, 10 classes)',
  'Build a CNN for CIFAR-10 classification. Start simple (2 conv layers), add depth, add BatchNorm, add data augmentation. Visualize the feature maps at each layer. Reach 85%+ test accuracy. Compare to an MLP on the same data (show CNNs are much better for images).',
  'CNNs are the foundation of all computer vision models. Understanding how conv layers extract local features, how pooling reduces spatial dimensions, and how depth builds up complex representations is essential for any CV work.',
  [
    'Build CNN: Conv(3,32,3) → BN → ReLU → MaxPool → Conv(32,64,3) → BN → ReLU → MaxPool → FC(64*6*6, 256) → FC(256,10)',
    'Data augmentation: RandomHorizontalFlip, RandomCrop(32, padding=4), ColorJitter. Show augmented examples',
    'Visualize feature maps after layer 1 and layer 2 for a test image: show what each filter responds to',
    'Comparison: MLP (same parameter count) vs CNN on CIFAR-10. CNN should be 15-20% better'
  ],
  'Add Grad-CAM to show which regions of an image triggered each prediction. For a correctly classified cat, highlight the cat-shaped region. For a misclassified image, show what confused the network.'
));

addProject('p8-rnn', pc(
  'RNN from Scratch — Character-Level Language Model',
  'Build a vanilla RNN that generates text character by character — and understand why it fails on long sequences.',
  ['RNN','LSTM','Character Model','Vanishing Gradients','PyTorch'],
  'Intermediate','4 hrs','Shakespeare text (or any long text file)',
  'Train a character-level RNN on Shakespeare. Sample text from the trained model. Then demonstrate the vanishing gradient problem: show gradient norms collapsing over 100+ time steps. Replace with LSTM and show the gradient norms staying healthy.',
  'Understanding why vanilla RNNs fail and LSTMs fix it is one of the most commonly tested DL concepts. Building both and comparing gradient norms makes the abstract concept concrete.',
  [
    'Build RNN from scratch using nn.RNN. Train on Shakespeare character sequences. After 5 epochs, sample 500 characters of generated text',
    'Visualize gradient norms by time step: plot ||dL/dh_t|| for t = 1 to 100. Show exponential decay (vanishing gradient)',
    'Build LSTM version using nn.LSTM. Train same setup. Plot gradient norms. Show they stay near 1.0 across all 100 steps',
    'Qualitative comparison: sample text from both. LSTM-generated text should be more coherent at long range (proper word endings, some phrase structure)'
  ],
  'Implement the LSTM cell equations from scratch (forget gate, input gate, output gate, cell state update) as a custom nn.Module. Verify it produces identical outputs to nn.LSTM on the same input.'
));

addProject('p8-transformer', pc(
  'Transformer from Scratch — Build Attention and Train on Sorting',
  'Implement multi-head self-attention and a full Transformer encoder from scratch in PyTorch.',
  ['Transformer','Self-Attention','Multi-Head Attention','Positional Encoding','PyTorch'],
  'Advanced','5 hrs','Synthetic sequence sorting task',
  'Build the Transformer architecture from first principles: scaled dot-product attention, multi-head attention, positional encoding, encoder block (attention + FFN + residual + LayerNorm), and a full encoder. Train it to sort sequences of numbers — a task that requires attending to all positions.',
  'Transformers power GPT, BERT, and every modern LLM. Building one from scratch forces you to understand what "attention" actually computes — which makes you able to debug and modify transformer-based models confidently.',
  [
    'Implement scaled_dot_product_attention(Q, K, V, mask=None). Verify attention weights sum to 1 and that masking works',
    'Implement MultiHeadAttention: split into h heads, apply attention, concatenate, project. Verify output shape matches input',
    'Add positional encoding: sinusoidal PE using sin/cos of different frequencies. Plot the PE matrix as a heatmap',
    'Train full encoder on a sorting task: input = random sequence of 10 numbers, output = argsort. Show it achieves >99% accuracy after 1000 steps'
  ],
  'Extend to a full Transformer seq2seq model (encoder + decoder) and train it to reverse sequences. Add beam search decoding and show it produces more accurate reversal than greedy decoding.'
));

addProject('p8-attention', pc(
  'Attention Visualization — What Does a Transformer Actually Look At?',
  'Load a pre-trained BERT model and visualize its attention patterns across all 12 layers and 12 heads.',
  ['Attention','BERT','Visualization','Interpretability','HuggingFace'],
  'Advanced','3 hrs','Sample sentences from your own domain',
  'Load BERT and extract attention weights for sample sentences. Visualize attention maps for every head in every layer. Identify: which heads do syntactic attention (subject→verb), which do semantic attention (pronoun→antecedent), and which are just noise.',
  'Understanding what different attention heads learn is an active research area and a practical skill for debugging transformer-based models. Being able to say "I visualized BERT\'s attention and here is what the different heads do" is a strong ML engineer signal.',
  [
    'Load bert-base-uncased with output_attentions=True. Run a sentence through. Extract attention tensor: (layers, heads, seq_len, seq_len)',
    'Visualize attention heatmap for each of the 12 heads in layer 1. Show the token pairs each head attends to strongly',
    'Cross-layer comparison: show how attention patterns change from layer 1 (surface patterns) to layer 12 (semantic patterns)',
    'Find the "coreference head": a head that consistently attends from pronouns to their antecedents. Test on 5 sentences'
  ],
  'Implement attention rollout: propagate attention through all layers multiplicatively to get the effective attention from the output to the input tokens. Compare to raw attention at the last layer.'
));

addProject('p8-optimization', pc(
  'Training Deep Networks — Learning Rate, Batch Size, and Optimizer Tricks',
  'Run a systematic ablation study on training hyperparameters for a real image classifier.',
  ['Adam','SGD','LR Schedule','Warmup','Batch Size','PyTorch'],
  'Advanced','4 hrs','CIFAR-10 ResNet-18',
  'Train the same ResNet-18 on CIFAR-10 with 8 different optimizer configurations. Record final accuracy and training stability. Show: why warmup is needed for Adam, why cosine annealing beats step decay, and the batch size vs learning rate scaling rule.',
  'Optimizer configuration is one of the most impactful and least taught parts of deep learning. Knowing the learning rate warmup trick, the linear scaling rule for batch size, and why cosine annealing outperforms step decay makes you a more effective DL practitioner.',
  [
    'Baseline: Adam with lr=1e-3, no warmup, no schedule. Record test accuracy at epoch 50',
    'Add linear warmup (5 epochs) + cosine annealing. Show 1-2% accuracy gain and more stable early training',
    'Batch size scaling: train with batch=32 (lr=1e-3), 128 (lr=4e-3), 512 (lr=1.6e-2). Show linear scaling rule holds',
    'SGD + Nesterov momentum + cosine annealing: this is the recipe that achieves SOTA on CIFAR-10. Compare to Adam'
  ],
  'Implement the "warm restarts" (SGDR) schedule: after each cosine cycle, reset the LR but halve the cycle length. Show that multiple restarts find better local minima than a single long cosine run.'
));

// Computer Vision
addProject('p10-basics', pc(
  'Computer Vision Fundamentals — Classical Techniques Before Deep Learning',
  'Build an object detection pipeline using classical CV (SIFT, HOG, template matching) and compare to CNN.',
  ['OpenCV','HOG','SIFT','Template Matching','Classical CV','sklearn'],
  'Intermediate','3–4 hrs','CIFAR-10 or custom images',
  'Apply 4 classical CV feature extractors (raw pixels, HOG, SIFT, LBP) to an image classification task. Train an SVM on each. Compare to a CNN. Show that HOG + SVM was state-of-the-art before 2012 and understand why CNNs replaced it.',
  'Understanding classical computer vision makes you a better deep learning engineer — you know what CNNs replaced and why. HOG features still appear in production systems where interpretability matters.',
  [
    'Extract HOG features from CIFAR-10 images using skimage.feature.hog. Train LinearSVC on HOG features. Record accuracy',
    'Extract LBP (Local Binary Patterns) for texture description. Train SVC. Compare to HOG',
    'Raw pixels baseline: flatten image, train SVM. Compare to HOG to show feature engineering matters',
    'CNN comparison: train a small CNN. Compare accuracy to HOG+SVM. Show 30-40% improvement from learned features'
  ],
  'Implement HOG from scratch: compute image gradients, bin into 9 orientation bins per cell, concatenate cells into blocks, L2-normalize. Verify your HOG descriptor matches skimage\'s output.'
));

addProject('p10-cnns', pc(
  'CNN Architecture Evolution — AlexNet to EfficientNet',
  'Implement and compare 5 major CNN architectures. Understand what each innovation added.',
  ['AlexNet','VGG','ResNet','MobileNet','EfficientNet','Transfer Learning'],
  'Advanced','4–5 hrs','CIFAR-10 or Stanford Dogs subset',
  'Load pre-trained versions of AlexNet, VGG-16, ResNet-50, MobileNetV2, and EfficientNet-B0. Compare on a shared dataset: accuracy, parameters, FLOPs, and inference time. Understand what each architectural innovation achieved.',
  'CNN architecture knowledge is tested directly in interviews: "what did ResNet introduce?" (skip connections), "what is depthwise separable convolution?" (MobileNet). Being able to benchmark these architectures shows you understand the evolution of the field.',
  [
    'Load each architecture from torchvision.models with pretrained weights. Replace final classifier for your number of classes',
    'Benchmark: test accuracy after 5 epochs fine-tuning, total parameters, FLOPs (use thop library), inference time for 1000 images',
    'Plot a bar chart: accuracy vs model size (parameters). Show the Pareto frontier — best accuracy/parameter tradeoff',
    'Explain each key innovation: AlexNet (GPU + ReLU + dropout), VGG (depth + 3x3 filters), ResNet (skip connections), MobileNet (depthwise separable conv), EfficientNet (compound scaling)'
  ],
  'Add ViT (Vision Transformer) to the comparison using timm library. Show that ViT beats ResNet on large datasets but loses on small datasets — explaining the sample efficiency advantage of CNNs.'
));

addProject('p10-detection', pc(
  'Object Detection — YOLO vs Faster R-CNN Benchmark',
  'Compare two-stage (Faster R-CNN) and one-stage (YOLOv8) detectors on speed and accuracy.',
  ['YOLO','Faster R-CNN','mAP','Object Detection','torchvision'],
  'Advanced','5 hrs','COCO subset or Pascal VOC',
  'Run pre-trained Faster R-CNN and YOLOv8 on the same 100 test images. Compare: mAP@50, mAP@50:95, inference time (ms/image), and failure modes (small objects, occluded objects, crowded scenes).',
  'Object detection is the core CV task in autonomous vehicles, robotics, and medical imaging. Understanding the speed-accuracy tradeoff between one-stage and two-stage detectors — and when each is appropriate — is a key computer vision engineering skill.',
  [
    'Load fasterrcnn_resnet50_fpn(pretrained=True). Run on 100 COCO validation images. Record predictions',
    'Load YOLOv8n (smallest YOLO). Run on same 100 images. Record predictions',
    'Compute mAP@50 for both using pycocotools. Record inference time on CPU and GPU (if available)',
    'Failure analysis: show 3 images where Faster R-CNN succeeds and YOLO fails (small objects), and 3 where YOLO wins (real-time, cluttered scenes)'
  ],
  'Fine-tune YOLOv8 on a custom dataset of 5 object classes using transfer learning. Document the training time, final mAP, and show inference results. This is the real production workflow for custom object detection.'
));

addProject('p10-segmentation', pc(
  'Semantic Segmentation — Build a U-Net for Medical Image Segmentation',
  'Implement U-Net from scratch and train it to segment cells or organs in medical images.',
  ['U-Net','Semantic Segmentation','PyTorch','Skip Connections','Medical Imaging'],
  'Advanced','5 hrs','Oxford-IIIT Pet Dataset or synthetic cell images',
  'Build the U-Net architecture from scratch: encoder (downsampling path), bottleneck, decoder (upsampling path with skip connections). Train on a segmentation task. Compare to a simple FCN without skip connections and show the skip connections are essential for fine-grained boundaries.',
  'U-Net is the dominant architecture for medical image segmentation and is used in FDA-cleared medical devices. Building it from scratch is a strong differentiator for CV or ML engineering roles in healthcare and life sciences.',
  [
    'Build encoder: 4 blocks of Conv-BN-ReLU-Conv-BN-ReLU-MaxPool, doubling channels (3→64→128→256→512)',
    'Build decoder: 4 upsampling blocks using transposed conv + concatenation with encoder skip connections',
    'Implement Dice loss (better than CrossEntropy for imbalanced segmentation): Dice = 2*intersection / (pred+target)',
    'Compare U-Net vs FCN (same encoder, no skip connections): show Dice score and boundary accuracy. Skip connections should give 5-10% improvement on boundary pixels'
  ],
  'Add test-time augmentation (TTA): run inference on the original image + 7 augmented versions (flips, rotations), average the probability maps. Show it improves Dice score by 1-2% with zero retraining.'
));

// Time Series remaining
addProject('p11-intro', pc(
  'Time Series EDA — Decompose and Diagnose Any Time Series',
  'Apply decomposition, stationarity tests, and autocorrelation analysis to a real time series before modeling.',
  ['Time Series','STL Decomposition','ADF Test','ACF','PACF','statsmodels'],
  'Intermediate','3 hrs','Airline passengers / retail sales / your own data',
  'Build a complete time series EDA pipeline: plot the raw series, decompose into trend/seasonal/residual, test for stationarity (ADF test), plot ACF/PACF to identify AR/MA orders, detect anomalies, and decide whether differencing is needed.',
  'Time series EDA is step zero for any forecasting project. Getting the stationarity and autocorrelation analysis right determines whether you should use ARIMA, SARIMA, or a different model entirely — and whether you need to difference the series first.',
  [
    'Plot raw series with 7-day and 30-day rolling mean/std overlaid. Does variance change over time? (heteroscedasticity)',
    'STL decomposition: separate trend, seasonal (weekly), and residual components. Plot all four',
    'Stationarity: ADF test on raw series and on first-differenced series. Report p-value and conclusion',
    'ACF/PACF plots: identify the AR(p) and MA(q) orders for ARIMA. Explain what the significant lags mean'
  ],
  'Add a seasonality strength test: compute the ratio of seasonal variance to total variance. Show that for retail data seasonal variance dominates, which means SARIMA or Prophet will outperform plain ARIMA.'
));

addProject('p11-arima', pc(
  'ARIMA Family — From Manual Order Selection to Auto-ARIMA',
  'Fit ARIMA, SARIMA, and ARIMAX models. Compare manual order selection vs auto_arima.',
  ['ARIMA','SARIMA','pmdarima','AIC','BIC','Forecasting'],
  'Intermediate','3–4 hrs','Monthly airline passengers or retail sales',
  'Fit ARIMA with manually selected (p,d,q) based on ACF/PACF analysis. Compare to auto_arima which searches over orders using AIC. Add seasonal SARIMA for monthly data. Evaluate with rolling forecast CV (walk-forward validation).',
  'ARIMA is the classical forecasting workhorse and is still used in production at banks, airlines, and retail companies. Understanding when ARIMA beats deep learning (small datasets, strong seasonality, need for interpretable intervals) is a practical skill.',
  [
    'Manual ARIMA: use ACF/PACF to select p, d, q. Fit statsmodels ARIMA. Report AIC, residual diagnostics (Ljung-Box test)',
    'Auto-ARIMA: pmdarima.auto_arima(). Compare its selected order to your manual selection. Do they agree?',
    'SARIMA: add seasonal order (P,D,Q,m). Compare AIC to plain ARIMA. Show seasonal components in model summary',
    'Walk-forward validation: train on t=1..80, forecast t=81. Slide window forward. Plot all forecasts vs actuals. Compute MAPE'
  ],
  'Add prediction intervals: ARIMA provides 80% and 95% prediction intervals. Show the interval coverage — are 95% of actuals inside the 95% interval? Show that uncalibrated intervals miss this target.'
));

addProject('p11-prophet', pc(
  'Prophet — Forecasting with Business-Calendar Awareness',
  'Use Prophet to forecast sales with holiday effects, changepoints, and uncertainty intervals.',
  ['Prophet','Facebook Prophet','Changepoints','Holidays','Uncertainty Intervals'],
  'Beginner–Intermediate','3 hrs','Daily retail sales with holidays',
  'Fit Prophet on daily sales data with US holidays. Inspect the trend changepoints. Add custom events (Black Friday, product launch). Plot the component decomposition. Compare forecast accuracy to ARIMA and a naive seasonal baseline.',
  'Prophet is used in production at hundreds of companies for business forecasting because it handles business calendars, multiple seasonalities, and non-linear trends without manual tuning. It is the first model many data scientists reach for on daily data.',
  [
    'Fit basic Prophet on 2 years of daily sales. Plot the forecast with confidence intervals',
    'Add US holiday effect. Inspect the learned holiday deltas — does Black Friday show a large positive spike?',
    'Trend changepoints: plot the detected changepoints on the time series. Show the prior scale hyperparameter controls how flexible the trend is',
    'Component plot: trend, weekly seasonality, yearly seasonality, holiday effects. Write a plain-English interpretation of each component'
  ],
  'Add a cross_validation() run with 30-day horizon, 7-day step, and 180-day initial training. Plot the MAPE as a function of forecast horizon. Show that accuracy degrades gracefully (not cliff-drops) as the horizon grows.'
));

addProject('p11-lstm-ts', pc(
  'LSTM Forecasting — Multivariate Time Series with Attention',
  'Build an LSTM that uses multiple input features to forecast the next 7 days of demand.',
  ['LSTM','Multivariate','Sequence Forecasting','Attention','PyTorch'],
  'Advanced','4–5 hrs','Energy consumption + weather features',
  'Build a multivariate LSTM forecaster: input features = past 30 days of energy consumption + temperature + day-of-week. Forecast next 7 days. Add a simple attention mechanism to let the model focus on the most relevant past time steps.',
  'Multivariate LSTM forecasting is the standard approach for complex time series in energy, supply chain, and demand planning. Being able to add attention on top of LSTM shows you understand both architectures.',
  [
    'Prepare dataset: sliding windows of 30 days input → 7 days target. Split respecting temporal order (no shuffle)',
    'Build LSTM: input_size=n_features, hidden_size=64, num_layers=2, dropout=0.2. Output layer: FC(64,7)',
    'Add temporal attention: after LSTM, compute attention weights over the 30 hidden states. Weighted sum → final FC. Visualize which past days the model attends to for different forecasts',
    'Comparison: univariate LSTM vs multivariate LSTM vs Prophet. Show multivariate wins on peak demand days (when temperature is the key driver)'
  ],
  'Add N-BEATS (Neural Basis Expansion Analysis for Time Series) as a comparison. Show that its interpretable trend/seasonality decomposition produces comparable accuracy to LSTM while being easier to debug.'
));

// Recommender + MLOps remaining
addProject('p12-intro', pc(
  'Content-Based vs Collaborative Filtering — When Each Wins',
  'Build both approaches and compare them on a dataset where cold start is a real problem.',
  ['Recommender Systems','Content-Based','Collaborative Filtering','Cold Start','Hybrid'],
  'Intermediate','3–4 hrs','MovieLens 100k with movie metadata',
  'Build a content-based recommender (using movie genres/keywords) and a collaborative filtering recommender (user-item matrix). Compare recommendation quality for: new users with few ratings (cold start), popular movies vs niche movies, and overall RMSE. Build a hybrid that combines both.',
  'Content-based vs collaborative filtering is a fundamental recommender systems design decision. Each has specific failure modes — content-based ignores social proof, CF fails for new users. The hybrid approach is what Netflix, Spotify, and Amazon deploy.',
  [
    'Content-based: represent each movie as a TF-IDF vector of genres+keywords. Recommend similar movies by cosine similarity to user\'s liked movies',
    'Collaborative filtering: user-item matrix. Item-based CF (movies similar to what user liked) vs user-based CF (users similar to target user)',
    'Cold start comparison: for users with 1, 5, 10, 50 ratings, compare RMSE of both methods. Show CF improves with more ratings, content-based is consistent',
    'Hybrid: weighted combination of content score + CF score. Tune weights on validation set. Show hybrid beats both individual approaches'
  ],
  'Add a diversity metric: intra-list diversity (average pairwise distance of recommended items). Show that pure CF tends to recommend similar popular items, content-based is more diverse, and the hybrid can balance both with a diversity-relevance tradeoff parameter.'
));

addProject('p13-intro', pc(
  'MLOps Lifecycle — Ship a Model from Notebook to Production',
  'Walk through the complete ML lifecycle: train → package → serve → monitor → retrain.',
  ['MLOps','FastAPI','Docker','MLflow','Model Serving','Monitoring'],
  'Advanced','5 hrs','Any classification model you have built',
  'Take a model from a Jupyter notebook and make it production-ready: add unit tests, create a training script, track with MLflow, wrap in FastAPI, containerize with Docker, add basic monitoring, and document a retraining trigger. This is the MLOps maturity level 1 checklist.',
  'The gap between a notebook model and a deployed model is where most ML projects fail. Being able to ship a model end-to-end — not just train one — is the skill that makes you an ML Engineer rather than a data scientist.',
  [
    'Refactor notebook into: train.py (training script), predict.py (prediction function), test_model.py (pytest tests)',
    'MLflow tracking: log params, metrics, and the serialized model. Register best run in Model Registry',
    'FastAPI service: /predict endpoint with Pydantic validation, /health endpoint, /metrics endpoint (prediction count, latency)',
    'Docker: Dockerfile that builds the API. docker-compose.yml that starts API + MLflow tracking server together'
  ],
  'Add a feature store (Feast or a simple Pandas-based mock): define features once, reuse them in both training and serving. Show how this eliminates training-serving skew — one of the top causes of production model failure.'
));

addProject('p13-deploy', pc(
  'Deployment Patterns — Blue-Green, Canary, and Shadow Mode',
  'Implement and simulate 3 deployment strategies for ML models. Show when each is appropriate.',
  ['Deployment','Blue-Green','Canary','Shadow Mode','FastAPI','MLOps'],
  'Advanced','4 hrs','Two model versions (v1 and v2)',
  'Build a model serving layer that supports blue-green deployment (instant swap), canary release (% traffic routing), and shadow mode (log v2 predictions without serving them). Show the monitoring data that lets you decide when to fully promote.',
  'Model deployment strategy directly affects user experience and business risk. Blue-green is for low-risk swaps, canary for uncertain changes, shadow mode for validating a new model without affecting users. These are production engineering skills.',
  [
    'Build a ModelRouter FastAPI middleware that routes requests to model_v1 or model_v2 based on a config file',
    'Blue-green: config switch between 100% v1 and 100% v2. Show zero-downtime swap with health check',
    'Canary: route X% to v2. Start at 5%, increase to 25% if metrics are good. Log which version served each request',
    'Shadow mode: send every request to both models, serve v1 to user, log v2 predictions silently. Compare offline. Show how to compute v2 accuracy without user exposure'
  ],
  'Add a model-level circuit breaker: if model v2 returns errors on more than 2% of requests in a 5-minute window, automatically fall back to v1 and alert the team. This is the safety net that makes canary deployments safe to run overnight.'
));

let added3 = 0;
const sections3 = [
  'p1-duplicates','p1-split','p1-selection',
  'p2-linalg','p2-calculus','p2-stats','p2-regularization',
  'p7-curves','p7-calibration',
  'p8-intro','p8-mlp','p8-cnn','p8-rnn','p8-transformer','p8-attention','p8-optimization',
  'p10-basics','p10-cnns','p10-detection','p10-segmentation',
  'p11-intro','p11-arima','p11-prophet','p11-lstm-ts',
  'p12-intro','p13-intro','p13-deploy'
];
sections3.forEach(id => {
  if (CONTENT.sections[id]) added3++;
  else console.warn('[projects-b3] not found:', id);
});
console.log('[content-projects-b3] Added projects to', added3, 'sections');

})();

// Final 3 missing sections
(function() {
function addProject(id, html) {
  const s = CONTENT.sections[id];
  if (s) s.html += html; else console.warn('[projects-final] not found:', id);
}
function pc(title, tagline, tags, difficulty, time, dataset, goal, why, steps, bonus) {
  const tagHtml = tags.map(t => `<span style="display:inline-block;padding:2px 10px;border-radius:20px;background:var(--accent-soft);color:var(--accent);font-size:11px;font-weight:600;margin-right:6px">${t}</span>`).join('');
  const stepsHtml = steps.map((s,i) => `<div style="display:flex;gap:14px;margin-bottom:16px"><div style="min-width:28px;height:28px;border-radius:50%;background:var(--accent);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:12px;flex-shrink:0">${i+1}</div><div style="font-size:13.5px;line-height:1.7">${s}</div></div>`).join('');
  return `<div style="margin-top:48px;padding:26px 28px;border:2px solid var(--accent);border-radius:14px;background:var(--surface)"><div style="font-size:11px;font-weight:700;letter-spacing:1.5px;color:var(--accent);text-transform:uppercase;margin-bottom:8px">★ Section Capstone Project</div><h2 style="margin:0 0 6px;font-size:21px">${title}</h2><p style="margin:0 0 14px;color:var(--text-muted);font-size:14px">${tagline}</p><div style="margin-bottom:14px">${tagHtml}</div><div style="display:flex;gap:20px;margin-bottom:16px;font-size:12px;color:var(--text-muted)"><span>⏱ ${time}</span><span>📊 ${dataset}</span><span>🎯 ${difficulty}</span></div><div style="padding:12px 16px;background:var(--accent-soft);border-radius:8px;margin-bottom:14px;font-size:13.5px;line-height:1.7"><strong>Goal:</strong> ${goal}</div><div style="padding:11px 15px;background:rgba(255,200,50,0.07);border-left:3px solid var(--accent-2);border-radius:0 8px 8px 0;margin-bottom:20px;font-size:13px;line-height:1.6"><strong>Why recruiters care:</strong> ${why}</div>${stepsHtml}${bonus ? `<div style="margin-top:14px;padding:11px 15px;border-radius:8px;background:var(--surface-2);font-size:13px"><strong>Stretch:</strong> ${bonus}</div>` : ''}</div>`;
}

addProject('pn-linalg-ops', pc(
  'Gaussian Elimination Solver — Linear Systems from Scratch',
  'Implement Gaussian elimination with partial pivoting. Solve systems that power neural net training.',
  ['NumPy','Linear Algebra','Gaussian Elimination','LU Decomposition','Matrix Solvers'],
  'Intermediate','3 hrs','Synthetic linear systems + normal equations',
  'Implement Gaussian elimination with partial pivoting from scratch. Use it to solve the normal equations for linear regression. Compare numerical stability to naive elimination. Then benchmark vs numpy.linalg.solve to show why optimized BLAS is 100x faster.',
  'Linear system solvers are the workhorse of scientific computing. The normal equation for linear regression, ridge regression, and PCA all reduce to solving Ax=b. Understanding numerical stability at this level shows mathematical depth.',
  [
    'Implement naive_gaussian_elimination(A, b): row reduce [A|b] to row echelon form, then back-substitute to solve for x',
    'Add partial pivoting: at each step, swap the row with the largest pivot element to the top. Show this prevents division by near-zero',
    'LU decomposition: factor A = LU where L is lower triangular and U is upper triangular. Solve Ax=b as Ly=b then Ux=y',
    'Application: use your solver to compute the normal equation solution for linear regression. Verify it matches sklearn LinearRegression coefficients'
  ],
  'Implement the conjugate gradient method (iterative solver) and show it converges to the exact solution. Time it against direct elimination on a 1000×1000 sparse system.'
));

addProject('pp-groupby', pc(
  'Sales Performance Analytics — 15 GroupBy Queries on One Dataset',
  'Answer 15 progressively harder business questions using only pandas groupby, transform, pivot_table, and crosstab.',
  ['Pandas','GroupBy','transform','pivot_table','crosstab','Business Analytics'],
  'Intermediate','3 hrs','Simulated B2B sales pipeline data',
  'Generate a realistic B2B sales dataset (deals, reps, regions, quarters, stages). Answer 15 business questions using different groupby patterns: single aggregation, multi-level, custom agg functions, transform, filter, and pivot table. Each question must use a different technique.',
  'GroupBy is the single most tested Pandas skill in data analyst and data scientist interviews. Being able to answer any aggregation question quickly and correctly — without googling the syntax — is what separates experienced analysts.',
  [
    'Basic: total revenue by region, count by rep, average deal size by quarter, win rate by stage',
    'Multi-level: revenue by (region, quarter), win rate by (rep, product), deal count by (stage, priority)',
    'transform: add column "rep_rank" (rank of each rep within their region), "pct_of_region_total" (each deal as % of its region total)',
    'Custom agg: 90th percentile deal size by region, coefficient of variation (std/mean) by rep, weighted average deal size by stage (weight = probability of close)',
    'Pivot table: rows=region, columns=quarter, values=revenue with margins=True. Crosstab: deal count by (rep, result) normalized by row'
  ],
  'Add a rolling 3-quarter revenue trend per rep using groupby + rolling. Show reps whose revenue is accelerating vs decelerating. Flag reps with declining trend in last 2 quarters.'
));

addProject('pp-merge', pc(
  'Customer 360 — Join 5 Tables into a Single ML-Ready Dataset',
  'Merge 5 relational tables into one flat feature table for ML — correctly handling all edge cases.',
  ['Pandas','merge','join','Relational Data','Feature Engineering','SQL-style joins'],
  'Intermediate','3–4 hrs','Simulated CRM + transactions + support + product + geography tables',
  'Build a Customer 360 feature table: join customers to transactions (one-to-many), to support tickets (one-to-many), to product subscriptions (many-to-many), and to geography (many-to-one). Handle duplicate key issues, validate join cardinality, and compute aggregated features from each table.',
  'Most real ML projects pull data from 3-10 database tables. Knowing how to join them correctly — avoiding row explosion, handling nulls from outer joins, and computing the right aggregations — is a core data engineering skill.',
  [
    'Table 1: customers (1 row each). Table 2: transactions (many per customer). Left join. Aggregate: total spend, transaction count, days since last purchase',
    'Table 3: support tickets (many per customer). Left join. Aggregate: ticket count, avg resolution time, any_unresolved flag',
    'Table 4: subscriptions (many-to-many via a bridge table). Join with bridge, aggregate to customer level: active products, total seats, primary plan',
    'Table 5: geography (one per zip code). Many-to-one join. Add: state, region, median income, population density',
    'Validation: check row count at each join step. Verify it never exceeds the customer count (guard against join explosion). Final shape should equal n_customers'
  ],
  'Add data lineage tracking: after each join, log which table was joined, how many rows matched (inner) vs were null (outer), and the final row count. This is the kind of data quality documentation that production ML systems require.'
));

console.log('[content-projects-final] Last 3 projects added');
})();
