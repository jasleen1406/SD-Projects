# Breast Cancer Prediction — End-to-End ML Pipeline

> Binary classification of tumours (Malignant / Benign) using the Wisconsin Breast Cancer Diagnostic dataset. Built to demonstrate production-oriented ML thinking: clean code, clinical metric justification, and honest limitations.

---

## Results at a Glance

| Model | Test Accuracy | ROC-AUC | Recall (Malignant) |
|---|---|---|---|
| Logistic Regression | 97.4% | 0.997 | 96.5% |
| SVM (RBF, default) | 97.4% | 0.998 | 95.3% |
| Random Forest | 96.5% | 0.994 | 94.2% |
| **SVM (Tuned — GridSearchCV)** | **98.2%** | **0.999** | **97.1%** |

**Why recall on malignant class?** A false negative — predicting a malignant tumour as benign — is far costlier than a false alarm. All tuning decisions are made with this clinical priority in mind.

---

## Project Structure

```
breast-cancer-prediction/
├── notebooks/
│   └── breast_cancer_prediction.ipynb   # Full walkthrough with visuals
├── src/
│   └── pipeline.py                      # Modular, importable ML pipeline
├── reports/
│   └── figures/                         # All generated plots (auto-saved)
├── requirements.txt
└── README.md
```

---

## Pipeline

```
Raw Data (569 samples, 30 features)
        ↓
  EDA + Correlation Analysis
        ↓
  Stratified Train/Test Split (80/20)
        ↓
  StandardScaler (fit on train only — no leakage)
        ↓
  5-Fold Cross-Validation (LR · SVM · RF · KNN)
        ↓
  GridSearchCV Hyperparameter Tuning (SVM)
        ↓
  Hold-out Test Evaluation + Feature Importance
```

---

## Key Technical Decisions

**Stratified split** — preserves 63/37 malignant/benign ratio across train and test sets.

**Scale before model, not before split** — scaler is fit only on training data. Fitting on the full dataset before splitting is a common but incorrect practice that leaks test distribution into training.

**Recall-optimised grid search** — `scoring='recall'` in `GridSearchCV` directly optimises for minimising false negatives on the malignant class, rather than defaulting to accuracy.

**Permutation importance over Gini** — Gini importance can overstate the importance of high-cardinality features. Both are reported; permutation importance is used for final interpretation.

---

## Setup & Run

```bash
# Clone
git clone https://github.com/gayamkowshik-afk/breast-cancer-prediction.git
cd breast-cancer-prediction

# Install dependencies
pip install -r requirements.txt

# Run pipeline script
python src/pipeline.py

# Or open the full notebook
jupyter notebook notebooks/breast_cancer_prediction.ipynb
```

No external data download needed — dataset loads via `sklearn.datasets`.

---

## What the Notebook Covers

1. **Data loading & quality check** — shape, nulls, class balance  
2. **EDA** — distributions, class-wise histograms, correlation heatmap  
3. **Preprocessing** — stratified split, StandardScaler with leakage analysis  
4. **Cross-validation** — 5-fold CV across 4 models with mean ± std  
5. **Hyperparameter tuning** — GridSearchCV on SVM, optimised for recall  
6. **Evaluation** — confusion matrix, ROC curves, classification report  
7. **Feature importance** — Random Forest Gini + clinical interpretation  
8. **Summary** — final metrics, clinical context, honest limitations  

---

## Honest Limitations

- Dataset has 569 samples — results may not generalise to clinical populations
- No external validation cohort; train/test split is internal only
- Feature engineering is minimal; domain-expert input could improve recall further
- **This is not a clinical tool.** Built for learning and demonstrating ML methodology.

---

## Stack

`Python 3.10` · `scikit-learn` · `pandas` · `numpy` · `matplotlib` · `seaborn`

---

## Author

**Jasleen Jassal**  
B.Tech EE · IIT Ropar · 2nd Year  
[jassj2004@gmail.com](mailto:jassj2004@gmail.com) · [LinkedIn](https://www.linkedin.com/in/jasleen-jassal-4986b1345/) · [GitHub](https://github.com/jasleen1406)

